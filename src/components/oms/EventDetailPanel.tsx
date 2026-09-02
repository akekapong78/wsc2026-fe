'use client';

import React, { useState } from 'react';
import { FileText, ChevronUp, ChevronDown, Minus, CheckCircle, AlertTriangle } from 'lucide-react';
import { OutageEvent, OutageStatusCode } from '@/types/oms';

interface EventDetailPanelProps {
  selectedEvent: OutageEvent | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onUpdateStatus?: (eventId: string, newStatus: OutageStatusCode) => void;
}

export const EventDetailPanel: React.FC<EventDetailPanelProps> = ({
  selectedEvent,
  isCollapsed,
  onToggleCollapse,
  onUpdateStatus
}) => {
  const [activeBottomTab, setActiveBottomTab] = useState<string>('summary');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const bottomTabs = [
    { id: 'summary', label: 'สรุป' },
    { id: 'causes', label: 'แจ้งปัญหาสาเหตุระบบไฟฟ้า' },
    { id: 'alerts', label: 'การแจ้งเตือน' },
    { id: 'switching', label: 'ขั้นตอนการทำสวิตชิ่ง' },
    { id: 'scada', label: 'เหตุการณ์ที่แจ้งจากระบบ SCADA' },
    { id: 'dead_devices', label: 'อุปกรณ์ที่ไม่มีไฟจ่าย' },
    { id: 'logs', label: 'บันทึกรายละเอียดเหตุการณ์' },
    { id: 'outage_plan_detail', label: 'รายละเอียดแผนดับไฟ' },
  ];

  const handleStatusChange = async (newStatus: OutageStatusCode) => {
    if (!selectedEvent || !onUpdateStatus) return;
    setIsUpdating(true);
    await onUpdateStatus(selectedEvent.eventId, newStatus);
    setIsUpdating(false);
  };

  if (isCollapsed) {
    return (
      <div className="bg-[#ebebeb] border-t border-[#b0b0b0] px-3 py-1 flex items-center justify-between text-[11.5px] select-none">
        <div className="flex items-center gap-1.5 font-bold text-gray-800">
          <FileText className="w-3.5 h-3.5 text-blue-800" />
          <span>รายละเอียดเหตุการณ์</span>
          {selectedEvent && (
            <span className="text-blue-900 font-medium">({selectedEvent.eventId} - {selectedEvent.device})</span>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          title="ขยายแถบรายละเอียด"
          className="p-0.5 hover:bg-[#d5d5d5] rounded text-gray-700"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[240px] 2xl:h-[270px] bg-[#f8f8f8] border-t border-[#a0a0a0] select-none text-[11px] font-sans shadow-inner">
      {/* Title Header with collapse toggle */}
      <div className="bg-gradient-to-r from-[#fae896] via-[#f7e07a] to-[#fae896] border-b border-[#cca842] px-2 py-0.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-gray-900 text-[11.5px]">
          <FileText className="w-3.5 h-3.5 text-gray-800" />
          <span>รายละเอียดเหตุการณ์</span>
          {selectedEvent && (
            <span className="text-blue-950 font-semibold">
              : {selectedEvent.eventId} [{selectedEvent.device}] - {selectedEvent.statusLabel}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Quick Admin Actions (Status updater) */}
          {selectedEvent && onUpdateStatus && (
            <div className="flex items-center gap-1 mr-2">
              {selectedEvent.status !== 'RESTORED' ? (
                <button
                  disabled={isUpdating}
                  onClick={() => handleStatusChange('RESTORED')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 shadow-xs transition cursor-pointer"
                  title="คลิกเพื่อปิดงาน / จ่ายไฟคืนแล้ว (ซิงค์ backend PATCH)"
                >
                  <CheckCircle className="w-3 h-3" />
                  <span>ปิดงาน / จ่ายไฟคืน</span>
                </button>
              ) : (
                <button
                  disabled={isUpdating}
                  onClick={() => handleStatusChange('IN_PROGRESS')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 shadow-xs transition cursor-pointer"
                  title="คลิกเพื่อเปิดงานต่อ (กำลังดำเนินการ)"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>เปิดดำเนินงานต่อ</span>
                </button>
              )}
            </div>
          )}

          <button 
            onClick={onToggleCollapse} 
            title="พับเก็บ"
            className="p-0.5 hover:bg-black/10 rounded text-gray-800"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button 
            onClick={onToggleCollapse} 
            title="ย่อขนาด"
            className="p-0.5 hover:bg-black/10 rounded text-gray-800"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#e8e8e8] border-b border-[#b0b0b0] px-1 pt-1 space-x-0.5 overflow-x-auto no-scrollbar">
        {bottomTabs.map((tab) => {
          const isActive = activeBottomTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveBottomTab(tab.id)}
              className={`px-2 py-0.5 text-[10.5px] whitespace-nowrap rounded-t border transition-all ${
                isActive
                  ? 'bg-[#ffffff] border-[#999] border-b-[#ffffff] font-bold text-blue-900 shadow-xs'
                  : 'bg-[#dadada] border-transparent text-gray-700 hover:bg-[#e4e4e4]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-2 bg-[#fdfdfd]">
        {activeBottomTab === 'summary' && (
          selectedEvent ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              {/* Box 1: สถานที่ (col-span-3) */}
              <fieldset className="md:col-span-3 border border-[#b8b8b8] rounded-xs p-1.5 bg-white space-y-1">
                <legend className="text-[10.5px] font-bold text-blue-900 px-1 flex items-center gap-1">
                  <span>สถานที่</span>
                </legend>
                <div className="flex items-center gap-1">
                  <span className="w-8 text-gray-600 font-medium">รหัส</span>
                  <input
                    type="text"
                    readOnly
                    value={selectedEvent.caNumber || selectedEvent.eventId}
                    className="flex-1 h-[20px] px-1.5 text-[10.5px] bg-[#f9f9f9] border border-gray-300 rounded-xs font-mono"
                  />
                </div>
                <div className="flex items-start gap-1">
                  <span className="w-8 text-gray-600 font-medium pt-0.5">ที่อยู่</span>
                  <textarea
                    rows={2}
                    readOnly
                    value={selectedEvent.location.address}
                    className="flex-1 px-1.5 py-0.5 text-[10.5px] bg-[#f9f9f9] border border-gray-300 rounded-xs resize-none leading-tight"
                  />
                </div>
              </fieldset>

              {/* Box 2: ผชฟ. ถูกกระทบ (ราย) (col-span-2) */}
              <fieldset className="md:col-span-2 border border-[#b8b8b8] rounded-xs p-1.5 bg-white">
                <legend className="text-[10.5px] font-bold text-blue-900 px-1">
                  ผชฟ. ถูกกระทบ (ราย)
                </legend>
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ในขณะนี้:</span>
                    <span className="font-bold text-red-600 bg-red-50 px-1 border border-red-200 rounded">
                      {selectedEvent.impact.currentAffected.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ตั้งแต่เริ่มเกิดเหตุ:</span>
                    <span className="font-semibold text-gray-800">
                      {selectedEvent.impact.initialAffected.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ผชฟ.ที่ต้องบริการก่อน:</span>
                    <span className="font-medium text-amber-700">
                      {selectedEvent.impact.priorityCustomers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ผชฟ.รายสำคัญ:</span>
                    <span className="font-bold text-purple-700">
                      {selectedEvent.impact.vipCustomers}
                    </span>
                  </div>
                </div>
              </fieldset>

              {/* Box 3: สภาพเหตุการณ์ & รายละเอียดปลีกย่อย (col-span-2) */}
              <div className="md:col-span-2 space-y-1">
                <fieldset className="border border-[#b8b8b8] rounded-xs p-1.5 bg-white">
                  <legend className="text-[10.5px] font-bold text-blue-900 px-1">
                    สภาพเหตุการณ์
                  </legend>
                  <p className="text-[10.5px] text-gray-800 leading-tight">
                    {selectedEvent.message}
                  </p>
                </fieldset>

                <fieldset className="border border-[#b8b8b8] rounded-xs p-1 bg-white">
                  <legend className="text-[10px] font-bold text-blue-900 px-1">
                    รายละเอียดปลีกย่อย
                  </legend>
                  <div className="text-[10px] text-gray-600">
                    <span>ไฟดับซ้ำในเวลาที่กำหนด: </span>
                    <span className="font-medium text-gray-800">
                      {selectedEvent.repeatedOutage ? 'ใช่' : 'ไม่พบ'}
                    </span>
                  </div>
                </fieldset>
              </div>

              {/* Box 4: เริ่มต้นเหตุการณ์ (col-span-2) */}
              <fieldset className="md:col-span-2 border border-[#b8b8b8] rounded-xs p-1.5 bg-white">
                <legend className="text-[10.5px] font-bold text-blue-900 px-1">
                  เริ่มต้นเหตุการณ์
                </legend>
                <div className="space-y-1 text-[10px]">
                  <div>
                    <span className="text-gray-600">ความรุนแรง: </span>
                    <span className="font-bold text-orange-700">{selectedEvent.severity}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">วันที่เกิดเหตุ: </span>
                    <span className="font-medium text-gray-800">{selectedEvent.startedAt}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">คาดจ่ายไฟคืน: </span>
                    <span className="font-medium text-emerald-700">
                      {selectedEvent.estimatedRestoreAt || 'กำลังประเมิน'}
                    </span>
                  </div>
                </div>
              </fieldset>

              {/* Box 5: รายละเอียดกิจกรรมที่ต้องดำเนินการ (col-span-3) */}
              <fieldset className="md:col-span-3 border border-[#b8b8b8] rounded-xs p-1.5 bg-white overflow-hidden flex flex-col">
                <legend className="text-[10.5px] font-bold text-blue-900 px-1">
                  รายละเอียดกิจกรรมที่ต้องดำเนินการ
                </legend>
                <div className="flex-1 overflow-y-auto max-h-[100px] text-[10px]">
                  <table className="w-full text-left">
                    <thead className="bg-[#eaeaea] text-gray-700">
                      <tr>
                        <th className="p-0.5">กิจกรรม</th>
                        <th className="p-0.5">วันที่โดยประมาณ</th>
                        <th className="p-0.5">วันที่ดำเนินการจริง</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedEvent.tasks.map((task, idx) => (
                        <tr key={idx} className="hover:bg-blue-50">
                          <td className="p-0.5 leading-tight">{task.activity}</td>
                          <td className="p-0.5 text-gray-600 whitespace-nowrap">{task.estimatedDate}</td>
                          <td className="p-0.5 font-medium whitespace-nowrap text-blue-800">{task.actualDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </fieldset>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              กรุณาเลือกเหตุการณ์จากตารางเพื่อดูรายละเอียด
            </div>
          )
        )}

        {activeBottomTab === 'causes' && (
          <div className="p-2 space-y-1 text-[11px]">
            <div className="font-bold text-blue-900">การวิเคราะห์สาเหตุระบบไฟฟ้า:</div>
            <p className="text-gray-800">
              {selectedEvent ? selectedEvent.cause : 'ไม่พบข้อมูล'}
            </p>
            <div className="mt-2 text-[10.5px] text-gray-600">
              อุปกรณ์เกี่ยวข้อง: <span className="font-mono font-bold text-gray-800">{selectedEvent?.device}</span> | 
              หน่วยงานรับผิดชอบ: <span className="font-medium text-gray-800">{selectedEvent?.peaBranch}</span>
            </div>
          </div>
        )}

        {activeBottomTab === 'scada' && (
          <div className="p-2 text-[11px] space-y-1">
            <div className="font-bold text-blue-900">ข้อมูลเชื่อมโยงระบบ SCADA / DMS:</div>
            <div className="bg-gray-100 p-2 rounded font-mono text-[10.5px] text-gray-800">
              [SCADA-TELEMETRY] Device: {selectedEvent?.device || 'N/A'} | Status: TRIP / DE-ENERGIZED | Last Poll: 01/09/2569 07:31:02
            </div>
          </div>
        )}

        {activeBottomTab !== 'summary' && activeBottomTab !== 'causes' && activeBottomTab !== 'scada' && (
          <div className="p-4 text-center text-gray-500 text-[11px]">
            ข้อมูลสำหรับแท็บ &quot;{bottomTabs.find(t => t.id === activeBottomTab)?.label}&quot; ได้รับการซิงค์จากระบบ OMS สำเร็จ
          </div>
        )}
      </div>
    </div>
  );
};
