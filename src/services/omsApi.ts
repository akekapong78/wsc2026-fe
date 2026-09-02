import { OutageEvent, OutageStatusCode, OmsStatus } from '@/types/oms';
import { INITIAL_STATUSES } from '@/data/mockOmsData';

export async function fetchAdminStatuses(): Promise<OmsStatus[]> {
  try {
    const res = await fetch('/oms/api/statuses', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map((s: { code: OutageStatusCode; label: string; isClosed: boolean }) => ({
          code: s.code,
          label: s.label,
          isClosed: s.isClosed,
          color: s.code === 'RESTORED' ? '#16a34a' : s.code === 'IN_PROGRESS' ? '#dc2626' : s.code === 'ACKNOWLEDGED' ? '#d97706' : '#2563eb',
          badgeBg: s.code === 'RESTORED' ? '#dcfce7' : s.code === 'IN_PROGRESS' ? '#fee2e2' : s.code === 'ACKNOWLEDGED' ? '#fef3c7' : '#dbeafe',
        }));
      }
    }
  } catch (e) {
    console.error('Failed to load statuses:', e);
  }
  return INITIAL_STATUSES;
}

export async function fetchAdminOutages(): Promise<OutageEvent[]> {
  try {
    const res = await fetch('/oms/api/outages', {
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.error('Error fetching live outages from backend:', err);
  }

  return [];
}

export async function updateOutageStatus(
  eventId: string,
  status: OutageStatusCode,
  message?: string
): Promise<boolean> {
  try {
    const res = await fetch(`/oms/api/outages/${eventId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        ...(message ? { message } : {}),
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('Error updating outage status:', err);
    return false;
  }
}
