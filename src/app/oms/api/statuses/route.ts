import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const API_KEY = process.env.API_KEY || '88888888';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/oms/admin/statuses`, {
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
