import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PEA - รายการคำร้องที่เข้าใหม่ (เสียงของลูกค้า VOC)",
  description: "ระบบบริหารจัดการเสียงของลูกค้าและข้อร้องเรียน (Voice of Customer - VOC) การไฟฟ้าส่วนภูมิภาค",
};

export default function VocLayout({ children }: { children: React.ReactNode }) {
  return <div className="voc-scope antialiased min-h-screen">{children}</div>;
}
