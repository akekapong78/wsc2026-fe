export type VocStatusType = 
  | 'รอดำเนินการ'
  | 'กำลังดำเนินการ'
  | 'ส่งต่อรอดำเนินการ'
  | 'วางแผนแก้ไขแล้ว ผ่านอนุมัติแผนแก้ไข'
  | 'อนุมัติแผนแก้ไขแล้ว อยู่ระหว่างดำเนินการแก้ไข'
  | 'ดำเนินการแก้ไขแล้วเสร็จ รอการประเมินการแก้ไขจากผู้ยื่นคำร้อง'
  | 'ปิดงานแล้ว';

export interface VocCase {
  id: number;
  vocNo: string;
  status: VocStatusType | string;
  statusSubBadge?: string; // e.g. 'ครบกำหนด พร้อมปิดงาน'
  isMerged: boolean;
  complainantName: string;
  customerGroup: string;
  voiceType: string;
  topic: string;
  issue: string;
  subIssue: string;
  peaBranch: string;
  wbs: string;
  durationDays: number;
  slaDays?: number;
  phone?: string;
  caNumber?: string;
  detail?: string;
  createdAt: string;
  isOverdue?: boolean;
  isNearDue?: boolean;
  isForwarded?: boolean;
  isReadyToClose?: boolean;
}

export interface VocFilterState {
  vocNo: string;
  complainantName: string;
  customerGroup: string;
  voiceType: string;
  topic: string;
  issue: string;
  subIssue: string;
  statuses: string[];
  onlyMerged: boolean;
  onlyMyBranch: boolean;
  activeKpiFilter: 'all' | 'overdue' | 'near_due' | 'forwarded' | 'ready_to_close';
}
