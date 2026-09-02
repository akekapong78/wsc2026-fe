import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PEA One Agent - เลือกระบบ",
  description: "เลือกระบบ OMS (บริหารเหตุการณ์ไฟฟ้าขัดข้อง) หรือ VOC (เสียงของลูกค้า) การไฟฟ้าส่วนภูมิภาค",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased font-sans text-gray-900">{children}</body>
    </html>
  );
}
