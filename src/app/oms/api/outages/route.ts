import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const API_KEY = process.env.API_KEY || '88888888';

interface OutageTask {
  activity: string;
  estimatedDate: string;
  actualDate: string | null;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

interface OutageRow {
  id: string; // AdminOutageEntry.ID — GET /oms/admin/outages is the merged list shape, not AdminOutageEvent
  source: 'OUTAGE_EVENT' | 'ANONYMOUS_REPORT';
  caNumber: string;
  level: string;
  status: string;
  statusLabel?: string;
  message: string;
  startedAt?: string;
  estimatedRestoreAt?: string | null;
  location?: { lat: number; lon: number; gisType?: string };
  contactPhone: string | null;
  severity: string;
  cause: string;
  peaBranch: string;
  address: string | null;
  subDistrict: string | null;
  district: string | null;
  province: string | null;
  affectedCount: number;
  priorityCustomers: number;
  vipCustomers: number;
  vipDetails: string | null;
  repeatedOutage: boolean;
  tasks: OutageTask[];
}

export async function GET() {
  try {
    // 1. Fetch live outages from backend admin endpoint (already carries
    // severity/cause/peaBranch/address/impact/tasks — real columns, see
    // wsc2026-be/migrations/20260902110000_add_outage_detail_fields.sql)
    const res = await fetch(`${BACKEND_URL}/api/v1/oms/admin/outages`, {
      headers: {
        'X-API-Key': API_KEY,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Backend error', status: res.status }, { status: res.status });
    }

    const outages: OutageRow[] = await res.json();
    if (!Array.isArray(outages)) {
      return NextResponse.json([]);
    }

    // 2. Fetch network relationship (CA -> Meter -> Transformer -> Feeder) for each outage
    const enrichedOutages = await Promise.all(
      outages.map(async (item) => {
        let network = { meterId: 'MTR-001', transformerId: 'TR-001', feederId: 'FDR-01' };

        try {
          const caRes = await fetch(`${BACKEND_URL}/api/v1/oms/outages/by-ca/${item.caNumber}`, {
            headers: { 'X-API-Key': API_KEY },
            cache: 'no-store',
          });
          if (caRes.ok) {
            const caData = await caRes.json();
            if (caData.network) {
              network = caData.network;
            }
          }
        } catch {
          // ignore by-ca error and use default
        }

        // Build device display name from resolved network
        let deviceName = network.transformerId;
        if (item.level === 'FEEDER') {
          deviceName = `${network.feederId}`;
        } else if (item.level === 'TRANSFORMER') {
          deviceName = `${network.transformerId} (${network.feederId})`;
        } else if (item.level === 'METER') {
          deviceName = `${network.meterId} (${network.transformerId})`;
        }

        const formatThaiTime = (isoString?: string) => {
          if (!isoString) return '01/09/2569 08:00';
          try {
            const d = new Date(isoString);
            return `${d.toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' })} ${d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}`;
          } catch {
            return isoString;
          }
        };

        const isRestored = item.status === 'RESTORED';

        return {
          eventId: item.id,
          source: item.source,
          caNumber: item.caNumber,
          level: item.level,
          status: item.status,
          statusLabel: item.statusLabel || (isRestored ? 'ปิดงาน / จ่ายไฟคืนแล้ว' : item.status === 'IN_PROGRESS' ? 'กำลังดำเนินการ' : item.status === 'ACKNOWLEDGED' ? 'รับทราบแล้ว' : 'รับแจ้งแล้ว'),
          message: item.message,
          contactPhone: item.contactPhone,
          startedAt: formatThaiTime(item.startedAt),
          estimatedRestoreAt: item.estimatedRestoreAt ? formatThaiTime(item.estimatedRestoreAt) : null,
          type: item.level === 'FEEDER' ? 'แจ้งปัญหาสาเหตุระบบไฟฟ้า' : 'ไฟฟ้าขัดข้อง',
          cause: item.cause,
          peaBranch: item.peaBranch,
          reasonDetail: item.message,
          device: deviceName,
          location: {
            lat: item.location?.lat ?? 13.8505,
            lng: item.location?.lon ?? 100.5590,
            address: item.address || `พื้นที่บริการ กฟภ. (หมายเลขผู้ใช้ไฟ CA: ${item.caNumber})`,
            subDistrict: item.subDistrict ?? undefined,
            district: item.district ?? undefined,
            province: item.province ?? undefined,
          },
          impact: {
            currentAffected: isRestored ? 0 : item.affectedCount,
            initialAffected: item.affectedCount,
            priorityCustomers: item.priorityCustomers,
            vipCustomers: item.vipCustomers,
            vipDetails: item.vipDetails ?? undefined,
          },
          severity: item.severity,
          repeatedOutage: item.repeatedOutage,
          tasks: (item.tasks || []).map((t) => ({
            activity: t.activity,
            estimatedDate: formatThaiTime(t.estimatedDate),
            actualDate: t.actualDate ? formatThaiTime(t.actualDate) : '-',
            status: t.status,
          })),
        };
      })
    );

    return NextResponse.json(enrichedOutages);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/api/v1/oms/outages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
