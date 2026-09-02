import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const API_KEY = process.env.API_KEY || '88888888';

// Realistic GIS location mapping by CA & Device in Bangkok (PEA HQ / Ngamwongwan matching screenshot)
const CA_GIS_MAP: Record<string, { lat: number; lng: number; address: string; subDistrict: string; district: string; province: string; affected: number; vip: string }> = {
  '100000000001': {
    lat: 13.8505,
    lng: 100.5590,
    address: 'สำนักงานใหญ่ กฟภ. / คลองเปรม ถนนงามวงศ์วาน แขวงลาดยาว เขตจตุจักร กทม.',
    subDistrict: 'ลาดยาว',
    district: 'จตุจักร',
    province: 'กรุงเทพมหานคร',
    affected: 120,
    vip: 'ศูนย์บริการสาธารณสุข',
  },
  '100000000002': {
    lat: 13.8440,
    lng: 100.5650,
    address: 'ถนนงามวงศ์วาน ใกล้เรือนจำกลางคลองเปรม แขวงลาดยาว เขตจตุจักร กทม.',
    subDistrict: 'ลาดยาว',
    district: 'จตุจักร',
    province: 'กรุงเทพมหานคร',
    affected: 850,
    vip: 'สถานีสูบน้ำคลองเปรม',
  },
  '100000000003': {
    lat: 13.8560,
    lng: 100.5730,
    address: 'ซอยงามวงศ์วาน 57 แขวงลาดยาว เขตจตุจักร กทม.',
    subDistrict: 'ลาดยาว',
    district: 'จตุจักร',
    province: 'กรุงเทพมหานคร',
    affected: 1,
    vip: 'บ้านพักอาศัย',
  },
};

interface OutageRow {
  eventId: string;
  caNumber: string;
  level: string;
  status: string;
  statusLabel?: string;
  message: string;
  startedAt?: string;
  estimatedRestoreAt?: string | null;
  location?: { lat: number; lon: number; gisType?: string };
}

export async function GET() {
  try {
    // 1. Fetch live outages from backend admin endpoint
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
      outages.map(async (item, idx) => {
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

        // Location & Impact — prefer real coordinates from backend, only fall back when missing
        const fallbackGis = CA_GIS_MAP[item.caNumber] || {
          lat: 13.8505 + (idx * 0.005) - 0.002,
          lng: 100.5590 + (idx * 0.006) - 0.003,
          address: `พื้นที่บริการ กฟภ. (หมายเลขผู้ใช้ไฟ CA: ${item.caNumber})`,
          subDistrict: 'ลาดยาว',
          district: 'จตุจักร',
          province: 'กรุงเทพมหานคร',
          affected: item.level === 'FEEDER' ? 500 : item.level === 'TRANSFORMER' ? 80 : 1,
          vip: 'ผู้ใช้ไฟทั่วไป',
        };
        const gisInfo = item.location
          ? {
              ...fallbackGis,
              lat: item.location.lat,
              lng: item.location.lon,
            }
          : fallbackGis;

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
          eventId: item.eventId,
          caNumber: item.caNumber,
          level: item.level,
          status: item.status,
          statusLabel: item.statusLabel || (isRestored ? 'ปิดงาน / จ่ายไฟคืนแล้ว' : item.status === 'IN_PROGRESS' ? 'กำลังดำเนินการ' : item.status === 'ACKNOWLEDGED' ? 'รับทราบแล้ว' : 'รับแจ้งแล้ว'),
          message: item.message,
          startedAt: formatThaiTime(item.startedAt),
          estimatedRestoreAt: item.estimatedRestoreAt ? formatThaiTime(item.estimatedRestoreAt) : null,
          type: item.level === 'FEEDER' ? 'แจ้งปัญหาสาเหตุระบบไฟฟ้า' : 'ไฟฟ้าขัดข้อง',
          cause: item.level === 'FEEDER' ? 'สายส่งแรงสูงขัดข้อง (Recloser Trip)' : item.level === 'TRANSFORMER' ? 'ฟิวส์แรงสูงหม้อแปลงชำรุด' : 'มิเตอร์ขัดข้อง/กระแสไฟฟ้าตัดวงจร',
          peaBranch: 'กฟอ.ระโนด',
          reasonDetail: item.message,
          device: deviceName,
          location: {
            lat: gisInfo.lat,
            lng: gisInfo.lng,
            address: gisInfo.address,
            subDistrict: gisInfo.subDistrict,
            district: gisInfo.district,
            province: gisInfo.province,
          },
          impact: {
            currentAffected: isRestored ? 0 : gisInfo.affected,
            initialAffected: gisInfo.affected,
            priorityCustomers: item.level === 'FEEDER' ? 6 : item.level === 'TRANSFORMER' ? 2 : 0,
            vipCustomers: item.level === 'FEEDER' ? 2 : item.level === 'TRANSFORMER' ? 1 : 0,
            vipDetails: gisInfo.vip,
          },
          severity: item.level === 'FEEDER' ? 'วิกฤต' : item.level === 'TRANSFORMER' ? 'สูง' : 'ต่ำ',
          repeatedOutage: false,
          tasks: [
            {
              activity: 'รับแจ้งเหตุและตรวจสอบโครงข่ายระบบไฟฟ้า OMS',
              estimatedDate: formatThaiTime(item.startedAt),
              actualDate: formatThaiTime(item.startedAt),
              status: 'COMPLETED',
            },
            {
              activity: `ส่งทีมชุดปฏิบัติการตรวจสอบอุปกรณ์ ${deviceName}`,
              estimatedDate: '01/09/2569 10:00',
              actualDate: isRestored ? '01/09/2569 10:15' : '-',
              status: isRestored ? 'COMPLETED' : 'IN_PROGRESS',
            },
            {
              activity: 'ทดสอบแรงดันและจ่ายกระแสไฟฟ้าคืนระบบ',
              estimatedDate: '01/09/2569 12:00',
              actualDate: isRestored ? '01/09/2569 11:45' : '-',
              status: isRestored ? 'COMPLETED' : 'PENDING',
            },
          ],
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
