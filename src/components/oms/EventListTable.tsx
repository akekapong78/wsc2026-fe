'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronsLeft, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsRight, 
  MoreVertical,
  AlertTriangle,
  Clock,
  Zap
} from 'lucide-react';
import { OutageEvent, EventLevel } from '@/types/oms';

interface EventListTableProps {
  events: OutageEvent[];
  selectedEventId: string | null;
  onSelectEvent: (event: OutageEvent) => void;
  activeTopTab: string;
  setActiveTopTab: (tab: string) => void;
}

export const EventListTable: React.FC<EventListTableProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
  activeTopTab,
  setActiveTopTab
}) => {
  const [pageSize, setPageSize] = useState<number>(300);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const topTabs = [
    { id: 'general', label: 'รายละเอียดทั่วไป' },
    { id: 'address', label: 'รายละเอียดที่อยู่' },
    { id: 'outage_info', label: 'ข้อมูลไฟฟ้าขัดข้อง' },
    { id: 'outage_plan', label: 'แผนดับไฟ' },
    { id: 'work_orders', label: 'การบริหารใบสั่งงาน' },
    { id: 'tree_diagram', label: 'แผนภูมิต้นไม้' },
  ];

  const getLevelBadge = (level: EventLevel, isSelected?: boolean) => {
    if (isSelected) return <span className="font-medium">{level}</span>;
    switch (level) {
      case 'FEEDER':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <Zap className="w-2.5 h-2.5" /> ฟีดเดอร์ (FEEDER)
          </span>
        );
      case 'TRANSFORMER':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-2.5 h-2.5" /> หม้อแปลง (TR)
          </span>
        );
      case 'METER':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-2.5 h-2.5" /> มิเตอร์ (METER)
          </span>
        );
    }
  };

  const getStatusBadge = (status: string, label: string, isSelected?: boolean) => {
    if (isSelected) return <span className="font-semibold text-amber-200">{label}</span>;
    switch (status) {
      case 'IN_PROGRESS':
        return (
          <span className="inline-block px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-red-100 text-red-700 border border-red-200">
            {label || 'กำลังดำเนินการ'}
          </span>
        );
      case 'ACKNOWLEDGED':
        return (
          <span className="inline-block px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
            {label || 'รับทราบแล้ว'}
          </span>
        );
      case 'RESTORED':
        return (
          <span className="inline-block px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
            {label || 'ปิดงาน / จ่ายไฟแล้ว'}
          </span>
        );
      case 'RECEIVED':
      default:
        return (
          <span className="inline-block px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-blue-100 text-blue-800 border border-blue-200">
            {label || 'รับแจ้งแล้ว'}
          </span>
        );
    }
  };

  // Columns for "รายละเอียดทั่วไป" — one entry per field actually available on OutageEvent
  const columns: { label: string; render: (ev: OutageEvent, isSelected: boolean) => React.ReactNode; className?: string }[] = [
    { label: 'หมายเลข', render: (ev) => ev.eventId, className: 'font-semibold text-blue-900' },
    { label: 'CA', render: (ev) => ev.caNumber, className: 'font-mono text-[11px]' },
    { label: 'สถานะ', render: (ev, sel) => getStatusBadge(ev.status, ev.statusLabel, sel) },
    { label: 'ระดับ', render: (ev, sel) => getLevelBadge(ev.level, sel) },
    { label: 'ความรุนแรง', render: (ev) => ev.severity },
    { label: 'ประเภท', render: (ev) => ev.type, className: 'truncate max-w-[120px]' },
    { label: 'สาเหตุ', render: (ev) => ev.cause, className: 'truncate max-w-[140px]' },
    { label: 'กฟฟ.', render: (ev) => ev.peaBranch },
    { label: 'เบอร์ติดต่อกลับ', render: (ev) => ev.contactPhone || '-', className: 'font-mono text-[11px]' },
    { label: 'อุปกรณ์', render: (ev) => ev.device, className: 'font-mono text-[11px]' },
    { label: 'ผู้ใช้ไฟกระทบ', render: (ev) => ev.impact.currentAffected.toLocaleString() },
    { label: 'เวลาเริ่ม', render: (ev) => ev.startedAt, className: 'whitespace-nowrap' },
    { label: 'คาดจ่ายไฟคืน', render: (ev) => ev.estimatedRestoreAt || '-', className: 'whitespace-nowrap' },
  ];

  const totalRecords = events.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  // Keep currentPage in range when events list or pageSize changes (e.g. filters, refresh)
  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const startIdx = totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIdx = Math.min(currentPage * pageSize, totalRecords);
  const pagedEvents = events.slice(startIdx - 1, endIdx);

  return (
    <div className="flex flex-col h-full bg-[#fdfdfd] border-b border-[#ababab] select-none text-[11.5px] font-sans">
      {/* Title Header Bar with subtle yellow-gold gradient */}
      <div className="bg-gradient-to-r from-[#fae896] via-[#f7e07a] to-[#fae896] border-b border-[#cca842] px-2 py-1 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-1.5 font-bold text-gray-900 text-[12px]">
          <button 
            title="ย้อนกลับ"
            className="p-0.5 hover:bg-black/10 rounded text-gray-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <span>รายการเหตุการณ์</span>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex bg-[#e8e8e8] border-b border-[#b0b0b0] px-1 pt-1 space-x-0.5 overflow-x-auto no-scrollbar">
        {topTabs.map((tab) => {
          const isActive = activeTopTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTopTab(tab.id)}
              className={`px-2.5 py-1 text-[11px] whitespace-nowrap rounded-t border transition-all ${
                isActive
                  ? 'bg-[#ffffff] border-[#999] border-b-[#ffffff] font-bold text-blue-900 shadow-xs'
                  : 'bg-[#d8d8d8] border-transparent text-gray-700 hover:bg-[#e4e4e4]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Pagination & Summary Bar */}
      <div className="bg-gradient-to-b from-[#f6f6f6] to-[#e8e8e8] border-b border-[#c4c4c4] px-2 py-1 flex items-center justify-between text-gray-700 text-[11px]">
        {/* Pager controls */}
        <div className="flex items-center space-x-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className="p-0.5 hover:bg-white rounded border border-gray-300 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronsLeft className="w-3.5 h-3.5 text-blue-700" />
          </button>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-0.5 hover:bg-white rounded border border-gray-300 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-blue-700" />
          </button>

          <span className="px-2 text-gray-800 font-medium">
            กำลังแสดงข้อมูล <strong className="text-blue-900">{startIdx}</strong> ถึง <strong className="text-blue-900">{endIdx}</strong> จาก <strong className="text-blue-900">{totalRecords}</strong> ข้อมูลที่สัมพันธ์กับเกณฑ์การค้นหา
          </span>

          <button 
            disabled={endIdx >= totalRecords}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-0.5 hover:bg-white rounded border border-gray-300 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-3.5 h-3.5 text-blue-700" />
          </button>
          <button
            disabled={endIdx >= totalRecords}
            onClick={() => setCurrentPage(totalPages)}
            className="p-0.5 hover:bg-white rounded border border-gray-300 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronsRight className="w-3.5 h-3.5 text-blue-700" />
          </button>
        </div>

        {/* Page size dropdown */}
        <div className="flex items-center space-x-1.5">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-[20px] px-1 text-[11px] bg-white border border-gray-400 rounded-xs shadow-inner focus:outline-none"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={300}>300</option>
            <option value={500}>500</option>
          </select>
          <span>แสดงผลต่อหน้า</span>
        </div>
      </div>

      {/* Grid / Table Container */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full border-collapse text-left min-w-[760px]">
          <thead className="sticky top-0 z-10 bg-gradient-to-b from-[#f2f2f2] to-[#e1e1e1] text-gray-800 text-[11px] font-semibold border-b border-[#a8a8a8] shadow-xs">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col.label}
                  className={`px-2 py-1.5 whitespace-nowrap ${i < columns.length - 1 ? 'border-r border-[#c0c0c0]' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{col.label}</span>
                    <MoreVertical className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-700" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5] text-[11.5px]">
            {events.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500 font-medium bg-[#fafafa]">
                  ไม่พบรายการ
                </td>
              </tr>
            ) : (
              pagedEvents.map((ev, idx) => {
                const isSelected = ev.eventId === selectedEventId;
                return (
                  <tr
                    key={ev.eventId}
                    onClick={() => onSelectEvent(ev)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#337ab7] text-white hover:bg-[#286090]'
                        : idx % 2 === 0
                        ? 'bg-white hover:bg-[#f0f6ff]'
                        : 'bg-[#fcfcfc] hover:bg-[#f0f6ff]'
                    }`}
                  >
                    {columns.map((col, i) => (
                      <td
                        key={col.label}
                        className={`px-2 py-1.5 whitespace-nowrap ${i < columns.length - 1 ? `border-r ${isSelected ? 'border-blue-400' : 'border-[#e0e0e0]'}` : ''} ${col.className || ''} ${isSelected && col.className?.includes('text-blue-900') ? 'text-white' : ''}`}
                      >
                        {col.render(ev, isSelected)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
