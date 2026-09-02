'use client';

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIdx = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 select-none text-[12.5px] text-gray-600 pt-2 pb-6">
      {/* Left: Previous button & item counter */}
      <div className="flex items-center gap-3">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-[34px] px-3.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white text-gray-700 font-medium flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>ก่อนหน้า</span>
        </button>

        <span className="text-gray-500 font-medium">
          แสดง <strong className="text-gray-800">{startIdx}-{endIdx}</strong> จาก <strong className="text-gray-800">{totalItems}</strong> รายการ
        </span>
      </div>

      {/* Center: Page numbers */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-[32px] h-[32px] rounded-lg text-[13px] font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#7e22ce] text-white shadow-xs'
                  : 'bg-white hover:bg-purple-50 text-gray-700 border border-gray-200'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Right: Page input & Next button */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-gray-600 font-medium">
          <span>ไปที่หน้า</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val >= 1 && val <= totalPages) {
                onPageChange(val);
              }
            }}
            className="w-12 h-[32px] border border-gray-300 rounded-md text-center text-[12.5px] font-bold bg-white focus:outline-none focus:border-purple-600 shadow-2xs"
          />
          <span>/ {totalPages}</span>
        </div>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-[34px] px-3.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white text-gray-700 font-medium flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
        >
          <span>ถัดไป</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
