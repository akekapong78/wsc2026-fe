'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/oms/Navbar';
import { LeftSidebar } from '@/components/oms/LeftSidebar';
import { EventListTable } from '@/components/oms/EventListTable';
import { EventDetailPanel } from '@/components/oms/EventDetailPanel';
import { MapPanel } from '@/components/oms/MapPanel';
import { Footer } from '@/components/oms/Footer';
import { OutageEvent, FilterState, OutageStatusCode } from '@/types/oms';
import { fetchAdminOutages, updateOutageStatus } from '@/services/omsApi';

export default function OmsDashboardPage() {
  const [allEvents, setAllEvents] = useState<OutageEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMapCollapsed, setIsMapCollapsed] = useState<boolean>(false);
  const [isDetailCollapsed, setIsDetailCollapsed] = useState<boolean>(false);
  const [activeTopTab, setActiveTopTab] = useState<string>('general');

  // Load from Backend API
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminOutages();
      setAllEvents(data);
      // functional update: avoids stale closure over selectedEventId in the polling interval
      setSelectedEventId((prev) => prev ?? data[0]?.eventId ?? null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll backend every 10s so new events from the agent show up without manual refresh
    const interval = setInterval(loadData, 10_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    includeParentMerged: false,
    startDate: '',
    endDate: '',
    sourceDevice: '',
    eventConditions: ['ทั้งหมด'],
    priorityLevels: ['ทั้งหมด'],
    statuses: ['RESTORED', 'IN_PROGRESS', 'RECEIVED', 'ACKNOWLEDGED'],
    types: ['แจ้งปัญหาสาเหตุระบบไฟฟ้า', 'ไฟฟ้าขัดข้อง'],
    certaintyStatuses: ['ทั้งหมด'],
  });

  const resetFilters = () => {
    setFilters({
      keyword: '',
      includeParentMerged: false,
      startDate: '',
      endDate: '',
      sourceDevice: '',
      eventConditions: ['ทั้งหมด'],
      priorityLevels: ['ทั้งหมด'],
      statuses: ['RESTORED', 'IN_PROGRESS', 'RECEIVED', 'ACKNOWLEDGED'],
      types: ['แจ้งปัญหาสาเหตุระบบไฟฟ้า', 'ไฟฟ้าขัดข้อง'],
      certaintyStatuses: ['ทั้งหมด'],
    });
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      // Keyword search (eventId or CA or message or address)
      if (filters.keyword.trim()) {
        const q = filters.keyword.toLowerCase();
        const matchKey = 
          ev.eventId.toLowerCase().includes(q) ||
          ev.caNumber.toLowerCase().includes(q) ||
          ev.message.toLowerCase().includes(q) ||
          ev.device.toLowerCase().includes(q) ||
          ev.location.address.toLowerCase().includes(q);
        if (!matchKey) return false;
      }

      // Device search
      if (filters.sourceDevice.trim()) {
        const q = filters.sourceDevice.toLowerCase();
        if (!ev.device.toLowerCase().includes(q)) return false;
      }

      // Status filter
      if (filters.statuses.length > 0) {
        if (!filters.statuses.includes(ev.status)) {
          return false;
        }
      }

      // Type filter
      if (filters.types.length > 0) {
        if (!filters.types.includes(ev.type)) {
          return false;
        }
      }

      return true;
    });
  }, [allEvents, filters]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return filteredEvents[0] || null;
    return allEvents.find((e) => e.eventId === selectedEventId) || filteredEvents[0] || null;
  }, [allEvents, selectedEventId, filteredEvents]);

  const handleSelectEvent = (event: OutageEvent) => {
    setSelectedEventId(event.eventId);
  };

  const handleUpdateStatus = async (eventId: string, newStatus: OutageStatusCode) => {
    // 1. Call Backend PATCH
    await updateOutageStatus(eventId, newStatus);
    // 2. Reload fresh live data from BE
    await loadData();
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#e0e0e0] font-sans antialiased text-[#222]">
      {/* 1. Top Navbar */}
      <Navbar onRefresh={loadData} activeBranch="กฟอ.ระโนด" />

      {/* 2. Main Content Split Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 2.1 Left Filter Sidebar */}
        <LeftSidebar
          filters={filters}
          onFilterChange={setFilters}
          onReset={resetFilters}
          onSearch={() => {}}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* 2.2 Middle + Right Workspace Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Middle: Event Table (Top) + Event Details (Bottom) */}
          <div className="flex-1 flex flex-col min-w-0 h-full border-r border-[#b0b0b0] bg-white overflow-hidden">
            {/* Top: Event Table */}
            <div className="flex-1 min-h-[160px] overflow-hidden relative">
              {isLoading && allEvents.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-white/80 gap-2 z-20">
                  <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[11.5px] text-gray-600 font-medium">กำลังโหลดข้อมูลจาก Backend OMS...</span>
                </div>
              ) : (
                <EventListTable
                  events={filteredEvents}
                  selectedEventId={selectedEvent?.eventId || null}
                  onSelectEvent={handleSelectEvent}
                  activeTopTab={activeTopTab}
                  setActiveTopTab={setActiveTopTab}
                />
              )}
            </div>

            {/* Bottom: Event Details */}
            <EventDetailPanel
              selectedEvent={selectedEvent}
              isCollapsed={isDetailCollapsed}
              onToggleCollapse={() => setIsDetailCollapsed(!isDetailCollapsed)}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>

          {/* Right: GIS Map with Leaflet */}
          <div className={`${isMapCollapsed ? 'w-[28px]' : 'w-[42%] xl:w-[45%]'} h-full transition-all duration-200 flex flex-col overflow-hidden`}>
            <MapPanel
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onSelectEvent={handleSelectEvent}
              isCollapsed={isMapCollapsed}
              onToggleCollapse={() => setIsMapCollapsed(!isMapCollapsed)}
            />
          </div>
        </div>
      </div>

      {/* 3. Bottom Red Status Footer */}
      <Footer userRole="กฟอ.ระโนด" ipAddress="172.30.152.205" />
    </div>
  );
}
