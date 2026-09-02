'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, FileText, Phone, User, Calendar, AlertCircle } from 'lucide-react';
import { VocCase } from '@/types/voc';

interface VocTableProps {
  cases: VocCase[];
}

export const VocTable: React.FC<VocTableProps> = ({ cases }) => {
  const [selectedCase, setSelectedCase] = useState<VocCase | null>(null);

  const getStatusComponent = (status: string, subBadge?: string) => {
    return (
      <div className="flex flex-col items-start gap-1 max-w-[210px]">
        <span className="inline-block px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 bg-white text-[11.5px] leading-tight text-center shadow-2xs font-medium">
          {status}
        </span>
        {subBadge && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10.5px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>{subBadge}</span>
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden select-none">
      {/* Table responsive container with custom horizontal scrollbar */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[980px]">
          <thead>
            <tr className="border-b border-gray-200 bg-white text-[12.5px] font-bold text-gray-800">
              <th className="py-3.5 px-4 w-14 text-center">ลำดับ</th>
              <th className="py-3.5 px-4 whitespace-nowrap">หมายเลขเสียง</th>
              <th className="py-3.5 px-4 whitespace-nowrap">สถานะ</th>
              <th className="py-3.5 px-4 text-center whitespace-nowrap">รวมคำร้อง</th>
              <th className="py-3.5 px-4 min-w-[280px]">ประเภท/หัวข้อ/ประเด็น/ประเด็นย่อย</th>
              <th className="py-3.5 px-4 whitespace-nowrap">การไฟฟ้า</th>
              <th className="py-3.5 px-4 text-center whitespace-nowrap">WBS</th>
              <th className="py-3.5 px-4 text-center whitespace-nowrap">ระยะเวลา</th>
              <th className="py-3.5 px-4 text-center whitespace-nowrap">เฉลี่ย...</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-[12.5px] text-gray-700">
            {cases.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-gray-400 font-medium">
                  ไม่พบรายการคำร้องตามเงื่อนไขที่ค้นหา
                </td>
              </tr>
            ) : (
              cases.map((c, index) => (
                <tr key={c.vocNo} className="hover:bg-purple-50/30 transition-colors">
                  {/* ลำดับ */}
                  <td className="py-4 px-4 text-center text-gray-500 font-medium">
                    {index + 1}
                  </td>

                  {/* หมายเลขเสียง */}
                  <td className="py-4 px-4 whitespace-nowrap font-semibold">
                    <button
                      onClick={() => setSelectedCase(c)}
                      className="text-[#6b21a8] hover:text-[#581c87] underline decoration-1 underline-offset-2 hover:decoration-2 font-bold cursor-pointer transition"
                    >
                      {c.vocNo}
                    </button>
                  </td>

                  {/* สถานะ */}
                  <td className="py-4 px-4">
                    {getStatusComponent(c.status, c.statusSubBadge)}
                  </td>

                  {/* รวมคำร้อง */}
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-[11px] font-medium">
                      {c.isMerged ? 'มี' : 'ไม่มี'}
                    </span>
                  </td>

                  {/* ประเภท/หัวข้อ/ประเด็น/ประเด็นย่อย */}
                  <td className="py-4 px-4 text-[12px] leading-relaxed text-gray-600">
                    <span className="font-semibold text-gray-800">{c.voiceType}</span>
                    <span className="text-gray-400 mx-1.5">•</span>
                    <span>{c.topic}</span>
                    <span className="text-gray-400 mx-1.5">•</span>
                    <span>{c.issue}</span>
                    <span className="text-gray-400 mx-1.5">•</span>
                    <span className="text-gray-700 font-medium">{c.subIssue}</span>
                  </td>

                  {/* การไฟฟ้า */}
                  <td className="py-4 px-4 whitespace-nowrap text-gray-700 font-medium">
                    {c.peaBranch}
                  </td>

                  {/* WBS */}
                  <td className="py-4 px-4 text-center text-gray-500">
                    {c.wbs}
                  </td>

                  {/* ระยะเวลา */}
                  <td className="py-4 px-4 text-center font-bold text-gray-800">
                    {c.durationDays}
                  </td>

                  {/* เฉลี่ย / SLA */}
                  <td className="py-4 px-4 text-center text-gray-400 text-[11.5px]">
                    -
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Horizontal Scroll Bar Indicator matching the screenshot */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-gray-100 bg-gray-50/60 text-gray-400">
        <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-gray-700" />
        <div className="w-[360px] h-2 bg-gray-300 rounded-full mx-2 overflow-hidden relative">
          <div className="w-[120px] h-full bg-gray-400 rounded-full"></div>
        </div>
        <ChevronRight className="w-4 h-4 cursor-pointer hover:text-gray-700" />
      </div>

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#6b21a8] to-[#8b5cf6] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-purple-200" />
                <div>
                  <h3 className="font-bold text-[16px] leading-tight">
                    รายละเอียดคำร้อง {selectedCase.vocNo}
                  </h3>
                  <span className="text-xs text-purple-200">{selectedCase.peaBranch}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-1 hover:bg-white/20 rounded-full text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-[13px] text-gray-700 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 bg-purple-50/50 p-3.5 rounded-xl border border-purple-100">
                <div>
                  <span className="text-xs text-gray-500 font-medium block">ชื่อผู้ร้องเรียน</span>
                  <span className="font-bold text-gray-900 flex items-center gap-1.5 mt-0.5">
                    <User className="w-4 h-4 text-purple-600" /> {selectedCase.complainantName}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block">เบอร์โทรศัพท์ติดต่อ</span>
                  <span className="font-bold text-gray-900 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-4 h-4 text-purple-600" /> {selectedCase.phone || '081-XXX-XXXX'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block">กลุ่มลูกค้า</span>
                  <span className="font-semibold text-gray-800 mt-0.5 block">{selectedCase.customerGroup}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium block">วันที่รับแจ้ง</span>
                  <span className="font-semibold text-gray-800 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-4 h-4 text-purple-600" /> {selectedCase.createdAt}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  หมวดหมู่และประเด็น
                </span>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed">
                  <span className="font-bold text-purple-800">{selectedCase.voiceType}</span>
                  <span className="mx-1.5 text-gray-400">›</span>
                  <span>{selectedCase.topic}</span>
                  <span className="mx-1.5 text-gray-400">›</span>
                  <span>{selectedCase.issue}</span>
                  <span className="mx-1.5 text-gray-400">›</span>
                  <span className="font-medium text-gray-900">{selectedCase.subIssue}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  รายละเอียดคำร้อง
                </span>
                <p className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 leading-relaxed">
                  {selectedCase.detail}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>สถานะปัจจุบัน: <strong>{selectedCase.status}</strong></span>
                </div>
                <span className="text-xs font-bold bg-white px-2.5 py-1 rounded-md border border-amber-300">
                  ระยะเวลาดำเนินการ {selectedCase.durationDays} วัน
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-[13px] font-semibold cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
