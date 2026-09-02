'use client';

import React, { useState } from 'react';
import { ChevronDown, ShieldAlert, Maximize2, RefreshCw } from 'lucide-react';

interface NavbarProps {
  onRefresh?: () => void;
  activeBranch?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onRefresh, 
  activeBranch = 'กฟอ.ระโนด' 
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menuItems = [
    {
      label: 'การรับแจ้งไฟฟ้าขัดข้อง',
      children: ['รับแจ้งเหตุ 1129', 'รับแจ้งเหตุออนไลน์ / PEA Smart Plus', 'บันทึกเหตุการณ์ฉุกเฉิน', 'ประวัติการรับแจ้ง']
    },
    {
      label: 'สถานที่ใช้ไฟ',
      children: ['ค้นหาหมายเลขผู้ใช้ไฟ (CA)', 'ข้อมูลมิเตอร์และหม้อแปลง', 'ตรวจสอบประวัติการใช้ไฟฟ้า']
    },
    {
      label: 'เครือข่ายระบบไฟฟ้า',
      children: ['แผนผัง Single Line Diagram', 'โครงข่ายฟีดเดอร์ 22kV / 33kV', 'สถานีไฟฟ้าแรงสูง']
    },
    {
      label: 'เหตุการณ์',
      active: true,
      children: ['รายการเหตุการณ์ทั้งหมด', 'เหตุการณ์ระดับฟีดเดอร์', 'เหตุการณ์ระดับหม้อแปลง', 'เหตุการณ์ระดับมิเตอร์', 'สร้างเหตุการณ์ใหม่']
    },
    {
      label: 'ใบสั่งงาน',
      children: ['สร้างใบสั่งงานแก้ไฟ (Trouble Ticket)', 'ติดตามสถานะใบสั่งงาน', 'ปิดงานและสรุปผล']
    },
    {
      label: 'พนักงาน/ชุดแก้ไฟ',
      children: ['ชุดปฏิบัติการฉุกเฉิน (Hotline)', 'รถแก้ไฟประจำหน่วย', 'มอบหมายงานพนักงาน']
    },
    {
      label: 'รายงาน',
      children: ['รายงานดัชนีความเชื่อถือได้ (SAIFI / SAIDI)', 'รายงานไฟฟ้าดับประจำวัน', 'สรุปสถิติเหตุขัดข้อง']
    },
    {
      label: 'ตัวเลือก',
      children: ['การตั้งค่าการแจ้งเตือน', 'กำหนดค่าการแสดงผลแผนที่ GIS', 'ช่วงเวลาการรีเฟรชข้อมูล']
    },
    {
      label: 'บริหารระบบ',
      children: ['จัดการผู้ใช้งานและสิทธิ์', 'สถานะการเชื่อมต่อ SCADA / GIS', 'Audit Log ระบบ']
    },
    {
      label: 'วิธีใช้',
      children: ['คู่มือการใช้งาน OMS / eRespond', 'คำถามที่พบบ่อย (FAQ)', 'ติดต่อศูนย์ช่วยเหลือด้านไอที']
    }
  ];

  return (
    <header className="w-full select-none bg-gradient-to-b from-[#f0f0f0] via-[#e4e4e4] to-[#d6d6d6] border-b border-[#ababab] shadow-sm text-[#222222] text-[12px] font-sans">
      <div className="flex items-center justify-between px-1.5 h-[30px]">
        {/* Left: Main Menu Items */}
        <nav className="flex items-center overflow-x-auto no-scrollbar space-x-0.5">
          {menuItems.map((item) => {
            const isOpen = openMenu === item.label;
            return (
              <div 
                key={item.label} 
                className="relative"
                onMouseEnter={() => openMenu && setOpenMenu(item.label)}
              >
                <button
                  onClick={() => setOpenMenu(isOpen ? null : item.label)}
                  className={`flex items-center px-2 py-1 h-[26px] whitespace-nowrap rounded-t-sm transition-colors border border-transparent ${
                    isOpen 
                      ? 'bg-white text-blue-900 border-[#999] shadow-inner font-semibold' 
                      : item.active 
                        ? 'font-bold text-[#111] hover:bg-[#e0e0e0] hover:border-[#bbb]' 
                        : 'hover:bg-[#e9e9e9] hover:border-[#ccc]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronDown className="w-3 h-3 ml-1 opacity-70 inline-block" />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setOpenMenu(null)} 
                    />
                    <div className="absolute left-0 top-[26px] z-50 min-w-[210px] bg-white border border-[#888] shadow-lg rounded-b-sm py-1 text-[12px] text-gray-800 animate-in fade-in zoom-in-95 duration-100">
                      {item.children.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setOpenMenu(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#337ab7] hover:text-white flex items-center justify-between transition-colors"
                        >
                          <span>{sub}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: Branch Info, Quick Actions & Icons */}
        <div className="flex items-center space-x-1.5 pl-2 flex-shrink-0">
          {/* Refresh button */}
          {onRefresh && (
            <button 
              onClick={onRefresh}
              title="รีเฟรชข้อมูล"
              className="p-1 text-gray-700 hover:text-blue-700 hover:bg-white/60 rounded border border-transparent hover:border-gray-300"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Active branch pill */}
          <div className="bg-[#fcfcfc] border border-[#a0a0a0] px-2.5 py-0.5 rounded-[3px] text-[11.5px] font-medium text-gray-800 shadow-inner flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>{activeBranch}</span>
          </div>

          {/* Red Security / Alert Badge Icon */}
          <div 
            title="การแจ้งเตือนความปลอดภัย / ฉุกเฉิน"
            className="w-[22px] h-[22px] rounded-full bg-gradient-to-b from-[#e52e2e] to-[#b81414] border border-[#8a0a0a] flex items-center justify-center text-white cursor-pointer shadow-sm hover:brightness-110 active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>

          {/* Fullscreen / Detach Button */}
          <button 
            title="ขยายเต็มหน้าจอ"
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              } else {
                document.exitFullscreen().catch(() => {});
              }
            }}
            className="w-[22px] h-[22px] rounded-[3px] bg-[#f5f5f5] hover:bg-white border border-[#999] flex items-center justify-center text-gray-700 cursor-pointer shadow-sm"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
