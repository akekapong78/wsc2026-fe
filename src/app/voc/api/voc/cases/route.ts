import { NextResponse } from 'next/server';
import { fetchVocCases } from '@/lib/vocAdmin';

// Proxies wsc2026-be (127.0.0.1:8080) so the X-API-Key never reaches the browser.
export async function GET() {
  try {
    const cases = await fetchVocCases();
    return NextResponse.json(cases);
  } catch (err) {
    console.error('GET /api/voc/cases failed:', err);
    return NextResponse.json({ error: 'failed to load VOC cases' }, { status: 502 });
  }
}
