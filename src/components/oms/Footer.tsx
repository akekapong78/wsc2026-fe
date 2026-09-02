'use client';

import React from 'react';

interface FooterProps {
  userRole?: string;
  ipAddress?: string;
}

export const Footer: React.FC<FooterProps> = ({
  userRole = 'กฟอ.ระโนด',
  ipAddress = '172.30.152.205'
}) => {
  return (
    <footer className="w-full bg-[#bf1818] border-t border-[#8e1010] text-white text-[11px] font-sans px-3 py-0.5 flex items-center justify-between select-none shadow-md z-30 flex-shrink-0">
      {/* Left: User / Branch login info */}
      <div className="font-normal tracking-tight">
        <span>Logged in as: </span>
        <strong className="font-semibold">{userRole}</strong>
      </div>

      {/* Center: PDPA Compliance notice with link */}
      <div className="text-center truncate px-2 hidden sm:block">
        <span>หน้าจอนี้อาจมีข้อมูลส่วนบุคคล ที่ผู้ใช้ระบบต้องปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล </span>
        <a
          href="#pdpa"
          onClick={(e) => {
            e.preventDefault();
            alert('ข้อกำหนดตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA): ผู้ใช้งานต้องรักษาความลับของข้อมูลส่วนบุคคลของผู้ใช้ไฟฟ้า');
          }}
          className="underline hover:text-yellow-200 transition-colors font-medium ml-1"
        >
          นโยบายข้อมูลส่วนบุคคล
        </a>
      </div>

      {/* Right: IP Address */}
      <div className="font-mono text-[10.5px] text-right">
        <span>IP Address: </span>
        <strong className="font-semibold">{ipAddress}</strong>
      </div>
    </footer>
  );
};
