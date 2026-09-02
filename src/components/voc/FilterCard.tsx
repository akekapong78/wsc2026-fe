'use client';

import React, { useState } from 'react';
import { Search, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { VocFilterState } from '@/types/voc';

interface FilterCardProps {
  filters: VocFilterState;
  onFilterChange: (filters: VocFilterState) => void;
  onReset: () => void;
  onSearch: () => void;
}

export const FilterCard: React.FC<FilterCardProps> = ({
  filters,
  onFilterChange,
  onReset,
  onSearch,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);

  const removeStatus = (st: string) => {
    onFilterChange({
      ...filters,
      statuses: filters.statuses.filter((s) => s !== st),
    });
  };

  const addStatus = (st: string) => {
    if (!filters.statuses.includes(st)) {
      onFilterChange({
        ...filters,
        statuses: [...filters.statuses, st],
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs select-none">
      <div className="space-y-4">
        {/* Row 1: หมายเลขเสียง, ชื่อผู้ร้องเรียน, กลุ่มลูกค้า */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <label className="block text-[12.5px] font-bold text-gray-800 mb-1.5">
              หมายเลขเสียง (VOC No.)
            </label>
            <input
              type="text"
              value={filters.vocNo}
              onChange={(e) => onFilterChange({ ...filters, vocNo: e.target.value })}
              placeholder="I-12345678"
              className="w-full h-[38px] px-3.5 text-[13px] border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-[12.5px] font-bold text-gray-800 mb-1.5">
              ชื่อผู้ร้องเรียน
            </label>
            <input
              type="text"
              value={filters.complainantName}
              onChange={(e) => onFilterChange({ ...filters, complainantName: e.target.value })}
              placeholder="ระบุชื่อ - นามสกุล"
              className="w-full h-[38px] px-3.5 text-[13px] border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-[12.5px] font-bold text-gray-800 mb-1.5">
              กลุ่มลูกค้า
            </label>
            <div className="relative">
              <select
                value={filters.customerGroup}
                onChange={(e) => onFilterChange({ ...filters, customerGroup: e.target.value })}
                className="w-full h-[38px] px-3.5 pr-8 text-[13px] border border-gray-300 rounded-lg bg-white appearance-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition"
              >
                <option value="">ทั้งหมด</option>
                <option value="บ้านพักอาศัย">บ้านพักอาศัย</option>
                <option value="ธุรกิจขนาดเล็ก">ธุรกิจขนาดเล็ก</option>
                <option value="ธุรกิจ/อุตสาหกรรม">ธุรกิจ/อุตสาหกรรม</option>
                <option value="ราชการและรัฐวิสาหกิจ">ราชการและรัฐวิสาหกิจ</option>
                <option value="องค์กรปกครองส่วนท้องถิ่น">องค์กรปกครองส่วนท้องถิ่น</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2: ประเภทเสียง, หัวข้อ, ประเด็น, ประเด็นย่อย */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[12.5px] font-bold text-gray-800 mb-1.5">
              ประเภทเสียง
            </label>
            <div className="relative">
              <select
                value={filters.voiceType}
                onChange={(e) => onFilterChange({ ...filters, voiceType: e.target.value })}
                className="w-full h-[38px] px-3.5 pr-8 text-[13px] border border-gray-300 rounded-lg bg-white appearance-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition"
              >
                <option value="">ทั้งหมด</option>
                <option value="แจ้งเหตุ">แจ้งเหตุ</option>
                <option value="ร้องเรียน">ร้องเรียน</option>
                <option value="ชื่นชม">ชื่นชม</option>
                <option value="แจ้งเบาะแส">แจ้งเบาะแส</option>
                <option value="ข้อเสนอแนะ">ข้อเสนอแนะ</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-gray-800 mb-1.5">
              หัวข้อ
            </label>
            <input
              type="text"
              value={filters.topic}
              onChange={(e) => onFilterChange({ ...filters, topic: e.target.value })}
              placeholder="ทั้งหมด"
              className="w-full h-[38px] px-3.5 text-[13px] border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-gray-800 mb-1.5">
              ประเด็น
            </label>
            <input
              type="text"
              value={filters.issue}
              onChange={(e) => onFilterChange({ ...filters, issue: e.target.value })}
              placeholder="ทั้งหมด"
              className="w-full h-[38px] px-3.5 text-[13px] border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-gray-800 mb-1.5">
              ประเด็นย่อย
            </label>
            <input
              type="text"
              value={filters.subIssue}
              onChange={(e) => onFilterChange({ ...filters, subIssue: e.target.value })}
              placeholder="ทั้งหมด"
              className="w-full h-[38px] px-3.5 text-[13px] border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition"
            />
          </div>
        </div>

        {/* Row 3: สถานะ (Multi-tag container), Checkboxes, Action Buttons */}
        <div>
          <label className="block text-[12.5px] font-bold text-gray-800 mb-1.5">
            สถานะ:
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Multi-tag Status Container with scroll controls */}
            <div className="flex-1 min-w-[300px] max-w-[460px] h-[38px] border border-gray-300 rounded-lg px-2 flex items-center gap-1.5 bg-white overflow-x-auto no-scrollbar shadow-inner">
              <ChevronLeft className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 cursor-pointer hover:text-gray-600" />
              
              <div className="flex items-center gap-1.5 flex-1 overflow-x-auto no-scrollbar py-0.5">
                {filters.statuses.map((st) => (
                  <span
                    key={st}
                    className="inline-flex items-center gap-1 bg-gray-100 border border-gray-200 text-gray-700 text-[11.5px] px-2 py-0.5 rounded-md whitespace-nowrap"
                  >
                    <span>{st}</span>
                    <button
                      type="button"
                      onClick={() => removeStatus(st)}
                      className="hover:text-red-500 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 cursor-pointer hover:text-gray-600" />
              <ChevronDown 
                className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 cursor-pointer hover:text-gray-600 ml-1"
                onClick={() => addStatus('ปิดงานแล้ว')}
              />
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-5">
              <label className="flex items-center gap-2 text-[12.5px] text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onlyMerged}
                  onChange={(e) => onFilterChange({ ...filters, onlyMerged: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-0 border-gray-300 cursor-pointer"
                />
                <span>เฉพาะรายการที่มีการรวมใบคำร้อง</span>
              </label>

              <label className="flex items-center gap-2 text-[12.5px] text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onlyMyBranch}
                  onChange={(e) => onFilterChange({ ...filters, onlyMyBranch: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-0 border-gray-300 cursor-pointer"
                />
                <span>เฉพาะหน่วยงานของฉัน</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onReset}
                className="h-[36px] px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-[13px] flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-gray-500" />
                <span>ล้างค่า</span>
              </button>

              <button
                type="button"
                onClick={onSearch}
                className="h-[36px] px-5 rounded-lg bg-[#6b21a8] hover:bg-[#581c87] active:bg-[#4a1570] text-white font-semibold text-[13px] flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>ค้นหา</span>
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Search Accordion */}
        <div className="pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="w-full flex items-center justify-between text-[12.5px] font-bold text-gray-700 hover:text-purple-700 py-1 transition"
          >
            <span>การค้นหาขั้นสูง</span>
            {isAdvancedOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {isAdvancedOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 mt-2 border-t border-dashed border-gray-200 animate-in fade-in">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  การไฟฟ้าสังกัด / สาขา
                </label>
                <input
                  type="text"
                  placeholder="เช่น สาขาเทพา, สาขานาทวี"
                  className="w-full h-[36px] px-3 text-[12.5px] border border-gray-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  ช่วงเวลาที่รับแจ้ง
                </label>
                <input
                  type="date"
                  className="w-full h-[36px] px-3 text-[12.5px] border border-gray-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                  รหัสผู้ใช้ไฟฟ้า (CA)
                </label>
                <input
                  type="text"
                  placeholder="ระบุหมายเลข CA 12 หลัก"
                  className="w-full h-[36px] px-3 text-[12.5px] border border-gray-300 rounded-lg bg-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
