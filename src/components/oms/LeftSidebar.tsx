'use client';

import React, { useState } from 'react';
import { Search, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { FilterState } from '@/types/oms';

interface LeftSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  onSearch: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  onSearch,
  isCollapsed,
  onToggleCollapse
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'location' | 'advanced'>('basic');

  const removeStatus = (statusToRemove: string) => {
    onFilterChange({
      ...filters,
      statuses: filters.statuses.filter((s) => s !== statusToRemove)
    });
  };

  const addStatus = (statusToAdd: string) => {
    if (!filters.statuses.includes(statusToAdd)) {
      onFilterChange({
        ...filters,
        statuses: [...filters.statuses, statusToAdd]
      });
    }
  };

  const removeType = (typeToRemove: string) => {
    onFilterChange({
      ...filters,
      types: filters.types.filter((t) => t !== typeToRemove)
    });
  };

  if (isCollapsed) {
    return (
      <aside className="w-[28px] bg-[#ebebeb] border-r border-[#b0b0b0] flex flex-col items-center py-2 flex-shrink-0 select-none">
        <button
          onClick={onToggleCollapse}
          title="เปิดแถบค้นหา"
          className="p-1 hover:bg-[#d0d0d0] rounded text-gray-700 transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <div className="writing-vertical mt-6 text-[12px] text-gray-700 tracking-widest font-semibold flex items-center gap-1.5" style={{ writingMode: 'vertical-rl' }}>
          <Search className="w-3 h-3 transform rotate-90" />
          <span>ค้นหาเหตุการณ์</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[260px] 2xl:w-[280px] bg-[#f7f7f7] border-r border-[#b8b8b8] flex flex-col flex-shrink-0 text-[#222] text-[11.5px] font-sans shadow-sm select-none">
      {/* Search Header Bar with yellow tint */}
      <div className="bg-gradient-to-r from-[#fae896] via-[#f7e07a] to-[#fae896] border-b border-[#cca842] px-2 py-1.5 flex items-center justify-between font-bold text-gray-900 shadow-xs">
        <div className="flex items-center gap-1">
          <Search className="w-3.5 h-3.5 text-gray-800" />
          <span className="text-[12.5px]">ค้นหา</span>
        </div>
        <button
          onClick={onToggleCollapse}
          title="ย่อแถบค้นหา"
          className="p-0.5 hover:bg-black/10 rounded text-gray-800"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs Header */}
      <div className="flex bg-[#e4e4e4] border-b border-[#b0b0b0] px-1 pt-1 space-x-1">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-2 py-1 text-[11px] rounded-t border transition-all ${
            activeTab === 'basic'
              ? 'bg-white border-[#999] border-b-white font-bold text-blue-900 shadow-xs'
              : 'bg-[#dddddd] border-transparent text-gray-700 hover:bg-[#eaeaea]'
          }`}
        >
          ข้อมูลเบื้องต้น
        </button>
        <button
          onClick={() => setActiveTab('location')}
          className={`px-2 py-1 text-[11px] rounded-t border transition-all ${
            activeTab === 'location'
              ? 'bg-white border-[#999] border-b-white font-bold text-blue-900 shadow-xs'
              : 'bg-[#dddddd] border-transparent text-gray-700 hover:bg-[#eaeaea]'
          }`}
        >
          สถานที่
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`px-2 py-1 text-[11px] rounded-t border transition-all ${
            activeTab === 'advanced'
              ? 'bg-white border-[#999] border-b-white font-bold text-blue-900 shadow-xs'
              : 'bg-[#dddddd] border-transparent text-gray-700 hover:bg-[#eaeaea]'
          }`}
        >
          การค้นหาขั้นสูง
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2.5 bg-white/70">
        {activeTab === 'basic' && (
          <>
            {/* Field: หมายเลข */}
            <div>
              <label className="block text-gray-700 font-semibold mb-0.5">หมายเลข</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={filters.keyword}
                  onChange={(e) => onFilterChange({ ...filters, keyword: e.target.value })}
                  placeholder="เช่น OMS-TR-0001, 100000000001"
                  className="w-full h-[24px] px-2 pr-7 text-[11.5px] border border-[#a0a0a0] rounded-xs bg-white focus:outline-none focus:border-blue-600 shadow-inner"
                />
                <button
                  type="button"
                  onClick={onSearch}
                  className="absolute right-1 text-gray-500 hover:text-blue-700"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Checkbox: ค้นหาหมายเลขเหตุการณ์หลัก */}
            <div className="flex items-start gap-1.5 pt-0.5">
              <input
                type="checkbox"
                id="parentMerged"
                checked={filters.includeParentMerged}
                onChange={(e) => onFilterChange({ ...filters, includeParentMerged: e.target.checked })}
                className="mt-0.5 rounded-xs border-gray-400 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="parentMerged" className="text-[10.5px] text-gray-700 leading-tight cursor-pointer">
                ค้นหาหมายเลขเหตุการณ์หลักของเหตุการณ์ที่ถูกรวมเข้าด้วยกัน
              </label>
            </div>

            {/* Groupbox: เหตุการณ์เกิดขึ้นระหว่าง */}
            <fieldset className="border border-[#b8b8b8] rounded-xs p-1.5 bg-[#fafafa]">
              <legend className="text-[11px] font-semibold text-blue-900 px-1">
                เหตุการณ์เกิดขึ้นระหว่าง
              </legend>
              <div className="space-y-1 mt-0.5">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={filters.startDate}
                    onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
                    placeholder="01/09/2569 00:00"
                    className="w-full h-[22px] px-2 pr-6 text-[11px] border border-[#a0a0a0] rounded-xs bg-white focus:outline-none focus:border-blue-600"
                  />
                  <Calendar className="w-3.5 h-3.5 absolute right-1.5 text-gray-500 pointer-events-none" />
                </div>
                <div className="text-center text-[10.5px] text-gray-600 font-medium py-0.5">และ</div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={filters.endDate}
                    onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
                    placeholder="01/09/2569 23:59"
                    className="w-full h-[22px] px-2 pr-6 text-[11px] border border-[#a0a0a0] rounded-xs bg-white focus:outline-none focus:border-blue-600"
                  />
                  <Calendar className="w-3.5 h-3.5 absolute right-1.5 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </fieldset>

            {/* Field: อุปกรณ์ต้นทาง */}
            <div>
              <label className="block text-gray-700 font-semibold mb-0.5">อุปกรณ์ต้นทาง</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={filters.sourceDevice}
                  onChange={(e) => onFilterChange({ ...filters, sourceDevice: e.target.value })}
                  placeholder="เช่น TR-001, FDR-02"
                  className="w-full h-[24px] px-2 pr-7 text-[11.5px] border border-[#a0a0a0] rounded-xs bg-white focus:outline-none focus:border-blue-600 shadow-inner"
                />
                <button
                  type="button"
                  onClick={onSearch}
                  className="absolute right-1 text-gray-500 hover:text-blue-700"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Field: สภาพเหตุการณ์ */}
            <div>
              <label className="block text-gray-700 font-semibold mb-0.5">สภาพเหตุการณ์</label>
              <div className="min-h-[26px] p-1 border border-[#a0a0a0] rounded-xs bg-white flex flex-wrap gap-1 items-center">
                {filters.eventConditions.map((cond, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-[#e8edf5] border border-[#b4c4dd] text-gray-800 text-[10.5px] px-1.5 py-0.5 rounded-xs"
                  >
                    {cond}
                    <button
                      type="button"
                      onClick={() =>
                        onFilterChange({
                          ...filters,
                          eventConditions: filters.eventConditions.filter((c) => c !== cond)
                        })
                      }
                      className="hover:text-red-600"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Field: ระดับความสำคัญ */}
            <div>
              <label className="block text-gray-700 font-semibold mb-0.5">ระดับความสำคัญ</label>
              <div className="min-h-[26px] p-1 border border-[#a0a0a0] rounded-xs bg-white flex flex-wrap gap-1 items-center">
                {filters.priorityLevels.map((lvl, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-[#e8edf5] border border-[#b4c4dd] text-gray-800 text-[10.5px] px-1.5 py-0.5 rounded-xs"
                  >
                    {lvl}
                    <button
                      type="button"
                      onClick={() =>
                        onFilterChange({
                          ...filters,
                          priorityLevels: filters.priorityLevels.filter((p) => p !== lvl)
                        })
                      }
                      className="hover:text-red-600"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Field: สถานะ (Multi-tag select) */}
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-gray-700 font-semibold">สถานะ</label>
                <div className="flex gap-1 text-[10px]">
                  <button 
                    type="button" 
                    onClick={() => onFilterChange({ ...filters, statuses: ['RECEIVED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESTORED'] })}
                    className="text-blue-700 hover:underline"
                  >
                    เลือกทั้งหมด
                  </button>
                </div>
              </div>
              <div className="min-h-[30px] p-1 border border-[#a0a0a0] rounded-xs bg-white flex flex-wrap gap-1 items-center">
                {filters.statuses.map((st) => {
                  const labelMap: Record<string, string> = {
                    RECEIVED: 'เปิด (รับแจ้ง)',
                    ACKNOWLEDGED: 'รับทราบแล้ว',
                    IN_PROGRESS: 'อยู่ระหว่างดำเนินการ',
                    RESTORED: 'รอปิด / ปิดงาน'
                  };
                  return (
                    <span
                      key={st}
                      className="inline-flex items-center gap-1 bg-[#e6effc] border border-[#a9c3ee] text-blue-950 text-[10.5px] px-1.5 py-0.5 rounded-xs font-medium"
                    >
                      {labelMap[st] || st}
                      <button
                        type="button"
                        onClick={() => removeStatus(st)}
                        className="hover:text-red-600 ml-0.5"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {!filters.statuses.includes('IN_PROGRESS') && (
                  <button
                    type="button"
                    onClick={() => addStatus('IN_PROGRESS')}
                    className="text-[10px] bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded px-1 text-gray-700"
                  >
                    + อยู่ระหว่างดำเนินการ
                  </button>
                )}
                {!filters.statuses.includes('RECEIVED') && (
                  <button
                    type="button"
                    onClick={() => addStatus('RECEIVED')}
                    className="text-[10px] bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded px-1 text-gray-700"
                  >
                    + เปิด
                  </button>
                )}
                {!filters.statuses.includes('RESTORED') && (
                  <button
                    type="button"
                    onClick={() => addStatus('RESTORED')}
                    className="text-[10px] bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded px-1 text-gray-700"
                  >
                    + ปิดงาน
                  </button>
                )}
              </div>
            </div>

            {/* Field: ประเภท */}
            <div>
              <label className="block text-gray-700 font-semibold mb-0.5">ประเภท</label>
              <div className="min-h-[30px] p-1 border border-[#a0a0a0] rounded-xs bg-white flex flex-wrap gap-1 items-center">
                {filters.types.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1 bg-[#eef1f6] border border-[#bdc8d7] text-gray-900 text-[10.5px] px-1.5 py-0.5 rounded-xs"
                  >
                    {type}
                    <button
                      type="button"
                      onClick={() => removeType(type)}
                      className="hover:text-red-600 ml-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Field: สถานะความแน่นอนของเหตุการณ์ */}
            <div>
              <label className="block text-gray-700 font-semibold mb-0.5">สถานะความแน่นอนของเหตุการณ์</label>
              <div className="min-h-[26px] p-1 border border-[#a0a0a0] rounded-xs bg-white flex flex-wrap gap-1 items-center">
                {filters.certaintyStatuses.map((cs, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-[#e8edf5] border border-[#b4c4dd] text-gray-800 text-[10.5px] px-1.5 py-0.5 rounded-xs"
                  >
                    {cs}
                    <button
                      type="button"
                      onClick={() =>
                        onFilterChange({
                          ...filters,
                          certaintyStatuses: filters.certaintyStatuses.filter((c) => c !== cs)
                        })
                      }
                      className="hover:text-red-600"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'location' && (
          <div className="space-y-2 text-[11px] text-gray-700">
            <div>
              <label className="block font-semibold mb-0.5">จังหวัด / เขตพื้นที่</label>
              <select className="w-full h-[24px] border border-gray-400 rounded-xs px-1 text-[11px] bg-white">
                <option>เขตพื้นที่ภาคใต้ จ.นราธิวาส</option>
                <option>สำนักงานใหญ่ กฟภ. (จตุจักร)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-0.5">การไฟฟ้าสาขา / กฟอ.</label>
              <select className="w-full h-[24px] border border-gray-400 rounded-xs px-1 text-[11px] bg-white">
                <option>กฟจ.นราธิวาส</option>
                <option>กฟอ.สุไหงโก-ลก</option>
                <option>กฟอ.ตากใบ</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-0.5">ตำบล / แขวง</label>
              <input
                type="text"
                placeholder="เช่น ต.บางนาค, ต.กะลุวอ"
                className="w-full h-[22px] px-2 text-[11px] border border-gray-400 rounded-xs bg-white"
              />
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-2 text-[11px] text-gray-700">
            <div>
              <label className="block font-semibold mb-0.5">ระดับโครงข่าย (Level)</label>
              <select className="w-full h-[24px] border border-gray-400 rounded-xs px-1 text-[11px] bg-white">
                <option value="">ทั้งหมด (FEEDER / TRANSFORMER / METER)</option>
                <option value="FEEDER">ระดับสายส่งหลัก (FEEDER)</option>
                <option value="TRANSFORMER">ระดับหม้อแปลง (TRANSFORMER)</option>
                <option value="METER">ระดับมิเตอร์ผู้ใช้ไฟ (METER)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-0.5">มีผลกระทบต่อ ผชฟ. สำคัญ (VIP)</label>
              <div className="flex gap-2">
                <label className="flex items-center gap-1">
                  <input type="radio" name="vip" defaultChecked /> ทั้งหมด
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="vip" /> มี ผชฟ. สำคัญ
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons at Bottom */}
      <div className="p-2 bg-[#e8e8e8] border-t border-[#b8b8b8] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onReset}
          className="flex-1 h-[26px] bg-gradient-to-b from-[#ffffff] to-[#e4e4e4] hover:from-[#f5f5f5] hover:to-[#dadada] border border-[#8f8f8f] active:border-[#555] rounded-xs font-semibold text-gray-800 shadow-xs active:shadow-inner text-[11.5px]"
        >
          ล้าง
        </button>
        <button
          type="button"
          onClick={onSearch}
          className="flex-1 h-[26px] bg-gradient-to-b from-[#ffffff] to-[#e4e4e4] hover:from-[#f5f5f5] hover:to-[#dadada] border border-[#8f8f8f] active:border-[#555] rounded-xs font-semibold text-gray-800 shadow-xs active:shadow-inner text-[11.5px]"
        >
          ค้นหา
        </button>
      </div>
    </aside>
  );
};
