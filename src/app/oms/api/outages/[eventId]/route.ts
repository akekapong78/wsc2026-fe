import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const API_KEY = process.env.API_KEY || '88888888';

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/oms/admin/outages/${params.eventId}`, {
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
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/api/v1/oms/admin/outages/${params.eventId}`, {
      method: 'PATCH',
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

export async function DELETE(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/oms/admin/outages/${params.eventId}`, {
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
