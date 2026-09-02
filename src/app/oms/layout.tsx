import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "eRespond - ระบบบริหารจัดการเหตุการณ์ไฟฟ้าขัดข้อง (OMS) | การไฟฟ้าส่วนภูมิภาค",
  description: "ระบบบริหารจัดการเหตุการณ์ไฟฟ้าขัดข้อง Outage Management System (OMS) - PEA eRespond",
};

export default function OmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="oms-scope overflow-hidden bg-[#e0e0e0] antialiased select-none min-h-screen">
      {children}
    </div>
  );
}
