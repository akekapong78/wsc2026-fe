import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const API_KEY = process.env.API_KEY || '88888888';

// GET /oms/admin/outages merges oms_outage_events and oms_anonymous_reports
// into one list (AdminOutageEntry.source), but they live behind different
// admin endpoints — route each id to the right one.
//
// Prefer the explicit ?source= the FE sends, but always fall back to the id
// prefix (oms_anon_report_seq always mints "OMS-ANON-%04d" — see
// wsc2026-be/internal/oms/pg.go) so a stale/cached FE bundle without the
// query param still resolves correctly instead of 404ing.
function backendPath(eventId: string, source: string | null) {
  const isAnonymous = source === 'ANONYMOUS_REPORT' || (source === null && eventId.startsWith('OMS-ANON-'));
  return isAnonymous
    ? `/api/v1/oms/admin/anonymous-reports/${eventId}`
    : `/api/v1/oms/admin/outages/${eventId}`;
}

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const source = new URL(request.url).searchParams.get('source');
    const res = await fetch(`${BACKEND_URL}${backendPath(params.eventId, source)}`, {
      headers: {
        'X-API-Key': API_KEY,
      },
      cache: 'no-store',
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const source = new URL(request.url).searchParams.get('source');
    const body = await request.json();
    const path = backendPath(params.eventId, source);
    // UpdateAnonymousReportRequest only has `status` — the outage-event
    // fields (message, severity, etc.) don't exist on that table.
    const payload = path.includes('/anonymous-reports/') ? { status: body.status } : body;

    const res = await fetch(`${BACKEND_URL}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const source = new URL(request.url).searchParams.get('source');
    const res = await fetch(`${BACKEND_URL}${backendPath(params.eventId, source)}`, {
      method: 'DELETE',
      headers: {
        'X-API-Key': API_KEY,
      },
    });

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
