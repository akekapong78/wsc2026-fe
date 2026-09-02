'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/voc/Navbar';
import { SummaryKpiCards } from '@/components/voc/SummaryKpiCards';
import { FilterCard } from '@/components/voc/FilterCard';
import { VocTable } from '@/components/voc/VocTable';
import { Pagination } from '@/components/voc/Pagination';
import { Footer } from '@/components/voc/Footer';
import { VocCase, VocFilterState } from '@/types/voc';
import { useToast, ToastStack } from '@/components/Toast';

// Default status filter is empty: real wsc2026-be status labels (e.g.
// "รับเรื่องแล้ว", "อยู่ระหว่างดำเนินการ") don't match the old mock-data
// wording, so start unfiltered and let the user pick from real data instead.
const DEFAULT_FILTERS: VocFilterState = {
  vocNo: '',
  complainantName: '',
  customerGroup: '',
  voiceType: '',
  topic: '',
  issue: '',
  subIssue: '',
  statuses: [],
  onlyMerged: false,
  onlyMyBranch: false,
  activeKpiFilter: 'all',
};

export default function VocDashboardPage() {
  const { toasts, notify, dismiss } = useToast();
  const [cases, setCases] = useState<VocCase[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const [filters, setFilters] = useState<VocFilterState>(DEFAULT_FILTERS);

  useEffect(() => {
    // only toast on ok<->error transitions, not every 10s poll
    const wasOkRef = { current: true };
    const load = () =>
      fetch('/voc/api/voc/cases')
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data: VocCase[]) => {
          setCases(data);
          setLoadError(null);
          if (!wasOkRef.current) notify('success', 'เชื่อมต่อ backend VOC สำเร็จอีกครั้ง');
          wasOkRef.current = true;
        })
        .catch((err) => {
          setLoadError(String(err));
          if (wasOkRef.current) notify('error', 'โหลดข้อมูล VOC จาก backend ไม่สำเร็จ');
          wasOkRef.current = false;
        });

    load();
    // ponytail: fixed 10s poll, swap for SSE/WebSocket push if latency matters
    const id = setInterval(load, 10_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  // Filtered cases
  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      // KPI filter
      if (filters.activeKpiFilter === 'overdue' && !item.isOverdue) return false;
      if (filters.activeKpiFilter === 'near_due' && !item.isNearDue) return false;
      if (filters.activeKpiFilter === 'forwarded' && !item.isForwarded) return false;
      if (filters.activeKpiFilter === 'ready_to_close' && !item.isReadyToClose) return false;

      // Text search: VOC No
      if (filters.vocNo.trim()) {
        if (!item.vocNo.toLowerCase().includes(filters.vocNo.toLowerCase().trim())) {
          return false;
        }
      }

      // Text search: Complainant Name
      if (filters.complainantName.trim()) {
        if (!item.complainantName.toLowerCase().includes(filters.complainantName.toLowerCase().trim())) {
          return false;
        }
      }

      // Customer Group
      if (filters.customerGroup && item.customerGroup !== filters.customerGroup) {
        return false;
      }

      // Voice Type
      if (filters.voiceType && item.voiceType !== filters.voiceType) {
        return false;
      }

      // Topic
      if (filters.topic.trim()) {
        if (!item.topic.toLowerCase().includes(filters.topic.toLowerCase().trim())) {
          return false;
        }
      }

      // Issue
      if (filters.issue.trim()) {
        if (!item.issue.toLowerCase().includes(filters.issue.toLowerCase().trim())) {
          return false;
        }
      }

      // Sub-issue
      if (filters.subIssue.trim()) {
        if (!item.subIssue.toLowerCase().includes(filters.subIssue.toLowerCase().trim())) {
          return false;
        }
      }

      // Statuses (if specific filters selected)
      if (filters.statuses.length > 0) {
        // If current case status contains or matches any tag
        const matchStatus = filters.statuses.some((s) => item.status.includes(s));
        // Also allow matching all if default view
        if (!matchStatus && filters.statuses.length < 3) {
          return false;
        }
      }

      // Only merged
      if (filters.onlyMerged && !item.isMerged) {
        return false;
      }

      return true;
    });
  }, [cases, filters]);

  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCases.slice(start, start + pageSize);
  }, [filteredCases, currentPage, pageSize]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfb] font-sans antialiased text-gray-900">
      <ToastStack toasts={toasts} onDismiss={dismiss} />
      {/* 1. Top Header & Navbar */}
      <Navbar />

      {/* 2. Main Body Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Page Title & Subtitle */}
        <div>
          <h1 className="text-[22px] sm:text-[24px] font-extrabold text-gray-900 tracking-tight leading-tight">
            รายการคำร้องที่เข้าใหม่
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            รวมคำร้องใหม่ทั้งหมดที่รอการตรวจสอบและดำเนินการ
          </p>
        </div>

        {loadError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">
            โหลดข้อมูลจาก VOC service ไม่สำเร็จ: {loadError}
          </div>
        )}

        {/* Summary Metric KPI Cards */}
        <SummaryKpiCards
          cases={cases}
          activeFilter={filters.activeKpiFilter}
          onSelectFilter={(kpi) => setFilters({ ...filters, activeKpiFilter: kpi })}
        />

        {/* Filter Card */}
        <FilterCard
          filters={filters}
          onFilterChange={setFilters}
          onReset={resetFilters}
          onSearch={() => setCurrentPage(1)}
        />

        {/* Data Table */}
        <VocTable cases={paginatedCases} />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredCases.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}
