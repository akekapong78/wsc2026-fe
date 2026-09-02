'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('voc');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
        {/* Left: Brand Logo & Navigation Menu */}
        <div className="flex items-center gap-8">
          {/* PEA Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6b21a8] to-[#9333ea] border-2 border-[#e9d5ff] flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 7v5l3 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="text-[20px] font-black tracking-tight text-[#6b21a8] leading-none">
                PEA
              </div>
              <div className="text-[9.5px] text-gray-500 font-medium tracking-wide">
                การไฟฟ้าส่วนภูมิภาค
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-[13.5px] font-medium text-gray-600">
            <button
              onClick={() => setActiveMenu('home')}
              className={`px-3 py-2 rounded-md transition-colors ${
                activeMenu === 'home'
                  ? 'text-[#6b21a8] font-bold'
                  : 'hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              หน้าหลัก
            </button>

            {/* Dropdown 1: เสียงของลูกค้า */}
            <div className="relative">
              <button
                onClick={() => {
                  setActiveMenu('voc');
                  setOpenDropdown(openDropdown === 'voc' ? null : 'voc');
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${
                  activeMenu === 'voc'
                    ? 'text-[#6b21a8] font-bold border-b-2 border-[#6b21a8] rounded-b-none'
                    : 'hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>เสียงของลูกค้า</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openDropdown === 'voc' && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-100 py-1.5 z-20 animate-in fade-in zoom-in-95 text-[13px]">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      ระบบจัดการข้อร้องเรียน (VOC)
                    </div>
                    <button className="w-full text-left px-3 py-2 hover:bg-purple-50 hover:text-[#6b21a8] font-medium text-gray-700">
                      รายการคำร้องที่เข้าใหม่
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-purple-50 hover:text-[#6b21a8] text-gray-700">
                      คำร้องทั้งหมด
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-purple-50 hover:text-[#6b21a8] text-gray-700">
                      สร้างคำร้องใหม่
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Dropdown 2: รายงาน */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'reports' ? null : 'reports')}
                className="flex items-center gap-1 px-3 py-2 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <span>รายงาน</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openDropdown === 'reports' && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                  <div className="absolute left-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-100 py-1.5 z-20 animate-in fade-in zoom-in-95 text-[13px]">
                    <button className="w-full text-left px-3 py-2 hover:bg-purple-50 hover:text-[#6b21a8] text-gray-700">
                      รายงานสรุปสถานะคำร้อง
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-purple-50 hover:text-[#6b21a8] text-gray-700">
                      รายงาน SLA และระยะเวลาดำเนินการ
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-purple-50 hover:text-[#6b21a8] text-gray-700">
                      สถิติตามประเภทเสียง
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveMenu('docs')}
              className="px-3 py-2 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              คู่มือและเอกสารที่เกี่ยวข้อง
            </button>
          </nav>
        </div>

        {/* Right: User Profile */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-[13.5px] font-bold text-gray-900 leading-tight">
              สุริยา เทพลักษณ์
            </span>
            <span className="text-[11.5px] text-gray-500 font-normal flex items-center justify-end gap-0.5">
              ผู้ดูแลประจำ กฟฟ... <ChevronDown className="w-3 h-3 opacity-60" />
            </span>
          </div>

          {/* User Avatar Circle with Thai letter 'ศ' / profile initial */}
          <div className="w-9 h-9 rounded-full bg-[#f3e8ff] border border-[#d8b4fe] text-[#7e22ce] flex items-center justify-center font-bold text-[14px] shadow-xs cursor-pointer hover:ring-2 hover:ring-purple-300 transition">
            ศ
          </div>
        </div>
      </div>
    </header>
  );
};
