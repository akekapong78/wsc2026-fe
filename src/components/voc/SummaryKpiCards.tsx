'use client';

import React from 'react';
import { Clock, Hourglass, Send, CheckCircle2, Inbox } from 'lucide-react';
import { VocCase } from '@/types/voc';

interface SummaryKpiCardsProps {
  cases: VocCase[];
  activeFilter: 'all' | 'overdue' | 'near_due' | 'forwarded' | 'ready_to_close';
  onSelectFilter: (filter: 'all' | 'overdue' | 'near_due' | 'forwarded' | 'ready_to_close') => void;
}

export const SummaryKpiCards: React.FC<SummaryKpiCardsProps> = ({
  cases,
  activeFilter,
  onSelectFilter,
}) => {
  const overdueCount = cases.filter((c) => c.isOverdue).length;
  const nearDueCount = cases.filter((c) => c.isNearDue).length;
  const forwardedCount = cases.filter((c) => c.isForwarded).length;
  const readyToCloseCount = cases.filter((c) => c.isReadyToClose).length;
  const totalCount = cases.length;

  const cards = [
    {
      id: 'overdue' as const,
      icon: Clock,
      iconBg: 'bg-red-50 text-red-500',
      value: overdueCount,
      valColor: 'text-red-600',
      label: 'คำร้องเกินกำหนด',
      subtext: 'คำร้องเกินกำหนดเวลาดำเนินการ',
    },
    {
      id: 'near_due' as const,
      icon: Hourglass,
      iconBg: 'bg-amber-50 text-amber-500',
      value: nearDueCount,
      valColor: 'text-amber-500',
      label: 'คำร้องใกล้ถึงกำหนด',
      subtext: 'คำร้องใกล้ถึงกำหนดเวลาดำเนินการ',
    },
    {
      id: 'forwarded' as const,
      icon: Send,
      iconBg: 'bg-purple-50 text-purple-600',
      value: forwardedCount,
      valColor: 'text-purple-600',
      label: 'คำร้องที่ถูกส่งต่อใหม่',
      subtext: 'คำร้องที่ถูกส่งต่อจากหน่วยงานอื่น',
    },
    {
      id: 'ready_to_close' as const,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
      value: readyToCloseCount,
      valColor: 'text-emerald-600',
      label: 'ครบกำหนด พร้อมปิดงาน',
      subtext: 'คำร้องที่ไม่อยู่ในช่วงเวลาเกินกำหนดแต่พร้อมปิดงานแล้ว',
    },
    {
      id: 'all' as const,
      icon: Inbox,
      iconBg: 'bg-gray-100 text-gray-700',
      value: totalCount,
      valColor: 'text-slate-800',
      label: 'รวมคำร้องทั้งหมด',
      subtext: activeFilter === 'all' ? 'กำลังคัดกรองอยู่ • กดอีกครั้งเพื่อยกเลิก' : 'คำร้องทั้งหมดในระบบ',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 select-none">
      {cards.map((card) => {
        const isSelected = activeFilter === card.id;
        const IconComponent = card.icon;

        return (
          <div
            key={card.id}
            onClick={() => onSelectFilter(isSelected && card.id !== 'all' ? 'all' : card.id)}
            className={`bg-white rounded-xl p-4 transition-all duration-200 cursor-pointer border ${
              isSelected
                ? 'border-gray-800 shadow-sm ring-1 ring-gray-800'
                : 'border-gray-200/80 hover:border-purple-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <span className={`text-[26px] font-bold leading-none ${card.valColor}`}>
                {card.value}
              </span>
            </div>

            <div className="mt-3">
              <h4 className="text-[13px] font-bold text-gray-800 tracking-tight">
                {card.label}
              </h4>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
