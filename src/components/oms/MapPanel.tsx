'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Search, ChevronLeft, ChevronRight, MapPin, Layers } from 'lucide-react';
import { OutageEvent } from '@/types/oms';

// Dynamically import LeafletMap with SSR turned off
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#e5e5e5] text-gray-600 gap-2">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-[12px] font-medium">กำลังโหลดแผนที่ GIS eRespond...</span>
    </div>
  ),
});

interface MapPanelProps {
  events: OutageEvent[];
  selectedEvent: OutageEvent | null;
  onSelectEvent: (event: OutageEvent) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const MapPanel: React.FC<MapPanelProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  isCollapsed,
  onToggleCollapse
}) => {
  const [mapSearchText, setMapSearchText] = useState('');
  const [showLegend, setShowLegend] = useState(false);

  if (isCollapsed) {
    return (
      <div className="w-[28px] bg-[#ebebeb] border-l border-[#b0b0b0] flex flex-col items-center py-2 flex-shrink-0 select-none">
        <button
          onClick={onToggleCollapse}
          title="เปิดแผนที่ GIS"
          className="p-1 hover:bg-[#d0d0d0] rounded text-gray-700 transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div 
          className="writing-vertical mt-6 text-[12px] text-gray-700 tracking-widest font-semibold flex items-center gap-1.5" 
          style={{ writingMode: 'vertical-rl' }}
        >
          <MapPin className="w-3 h-3 transform rotate-90" />
          <span>แผนที่ระบบไฟฟ้า GIS</span>
        </div>
      </div>
    );
  }

  const handleSearchLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapSearchText.trim()) return;

    // Search by event ID or device or location text
    const matched = events.find(
      (ev) =>
        ev.eventId.toLowerCase().includes(mapSearchText.toLowerCase()) ||
        ev.device.toLowerCase().includes(mapSearchText.toLowerCase()) ||
        ev.caNumber.includes(mapSearchText) ||
        ev.location.address.toLowerCase().includes(mapSearchText.toLowerCase())
    );

    if (matched) {
      onSelectEvent(matched);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col h-full bg-[#e8e8e8] border-l border-[#b0b0b0] overflow-hidden select-none">
      {/* Left Splitter Collapse Button */}
      <button
        onClick={onToggleCollapse}
        title="ย่อแผนที่"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white border border-[#999] border-l-0 shadow-md py-4 px-0.5 rounded-r text-gray-700 transition cursor-pointer"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* Floating Top-Right Legend & Preset Locations */}
      <div className="absolute top-2 right-2 z-20 flex flex-col items-end gap-1">
        <div className="flex items-center gap-1 bg-white/95 border border-[#999] px-2 py-1 rounded shadow-md text-[11px] text-gray-800">
          <span className="font-semibold text-blue-950">พิกัดเหตุการณ์:</span>
          <span className="bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
            {events.filter((e) => e.status !== 'RESTORED').length} จุดไฟฟ้าดับ
          </span>
          <button
            onClick={() => setShowLegend(!showLegend)}
            title="สัญลักษณ์แผนที่"
            className="ml-1 p-0.5 hover:bg-gray-200 rounded text-gray-600"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Legend Box */}
        {showLegend && (
          <div className="bg-white/95 border border-gray-400 p-2 rounded shadow-lg text-[10.5px] space-y-1 w-[180px] animate-in fade-in">
            <div className="font-bold text-gray-800 border-b pb-1">สัญลักษณ์โครงข่าย</div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-600 inline-block border border-white"></span>
              <span>สายส่งฟีดเดอร์ (FEEDER)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-600 inline-block border border-white"></span>
              <span>หม้อแปลงไฟฟ้า (TRANSFORMER)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block border border-white"></span>
              <span>มิเตอร์ผู้ใช้ไฟ (METER)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block border border-white"></span>
              <span>จ่ายไฟคืนแล้ว (RESTORED)</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Map View */}
      <div className="flex-1 w-full h-full relative">
        <LeafletMap
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={onSelectEvent}
          mapCenter={[13.8505, 100.5590]} // Exact location around PEA Head Office & Chatuchak matching screenshot
          zoomLevel={14}
        />
      </div>

      {/* Floating Bottom Location Search Bar matching screenshot */}
      <div className="absolute bottom-6 left-4 z-20 w-[300px] sm:w-[340px] shadow-lg">
        <form onSubmit={handleSearchLocation} className="relative flex items-center">
          <input
            type="text"
            value={mapSearchText}
            onChange={(e) => setMapSearchText(e.target.value)}
            placeholder="ค้นหาที่อยู่หรือสถานที่ หรือ หมายเลขเหตุการณ์..."
            className="w-full h-[32px] pl-3 pr-8 text-[11.5px] bg-white/95 border border-[#888] rounded-xs shadow-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <button
            type="submit"
            title="ค้นหาบนแผนที่"
            className="absolute right-1 p-1 text-gray-600 hover:text-blue-700"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
