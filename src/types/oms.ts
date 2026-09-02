export type EventLevel = 'METER' | 'TRANSFORMER' | 'FEEDER';
export type OutageStatusCode = 'RECEIVED' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESTORED';

export interface Customer {
  caNumber: string;
  meterId: string;
  transformerId: string;
  feederId: string;
  customerName?: string;
  address?: string;
  phone?: string;
  isVip?: boolean;
}

export interface OmsStatus {
  code: OutageStatusCode;
  label: string;
  isClosed: boolean;
  color: string;
  badgeBg: string;
}

export interface OutageEvent {
  eventId: string;
  // which backend table this row lives in — GET /oms/admin/outages merges
  // oms_outage_events and oms_anonymous_reports into one list, but they're
  // edited through different PATCH endpoints (see omsApi.updateOutageStatus)
  source: 'OUTAGE_EVENT' | 'ANONYMOUS_REPORT';
  caNumber: string;
  level: EventLevel;
  status: OutageStatusCode;
  statusLabel: string;
  message: string;
  startedAt: string;
  estimatedRestoreAt?: string | null;
  contactPhone?: string | null;

  // Extended UI / OMS attributes matching eRespond screen
  type: string;
  cause: string;
  peaBranch: string;
  reasonDetail: string;
  device: string; // e.g. TR-001, FDR-02, MTR-001
  location: {
    lat: number | null;
    lng: number | null;
    address: string;
    subDistrict?: string;
    district?: string;
    province?: string;
  };
  impact: {
    currentAffected: number;
    initialAffected: number;
    priorityCustomers: number;
    vipCustomers: number;
    vipDetails?: string;
  };
  severity: 'ต่ำ' | 'ปานกลาง' | 'สูง' | 'วิกฤต';
  repeatedOutage: boolean;
  tasks: Array<{
    activity: string;
    estimatedDate: string;
    actualDate: string;
    status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
  }>;
}

export interface AnonymousReport {
  reportId: string;
  description: string;
  location: string;
  contactPhone: string;
  status: OutageStatusCode;
  createdAt: string;
  lat?: number;
  lng?: number;
}

export interface FilterState {
  keyword: string;
  includeParentMerged: boolean;
  startDate: string;
  endDate: string;
  sourceDevice: string;
  eventConditions: string[];
  priorityLevels: string[];
  statuses: string[];
  types: string[];
  certaintyStatuses: string[];
}
