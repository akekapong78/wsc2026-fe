'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f8fafc] border-t border-gray-200/80 py-5 text-center text-[12px] text-gray-500 font-sans select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <p className="leading-relaxed">
          &copy; 2025 Provincial Electricity Authority. All rights reserved. PEA Contact Center 1129
        </p>
      </div>
    </footer>
  );
};
