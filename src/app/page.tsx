import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fbfbfb] p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">PEA One Agent</h1>
        <p className="text-sm text-gray-500 mb-8">เลือกระบบที่ต้องการเข้าใช้งาน</p>
        <div className="grid grid-cols-1 gap-4">
          <Link
            href="/oms"
            className="block rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-[#5b21b6] hover:shadow-md"
          >
            <div className="text-base font-semibold text-gray-900">OMS</div>
            <div className="text-sm text-gray-500">ระบบบริหารจัดการเหตุการณ์ไฟฟ้าขัดข้อง (eRespond)</div>
          </Link>
          <Link
            href="/voc"
            className="block rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-[#6b21a8] hover:shadow-md"
          >
            <div className="text-base font-semibold text-gray-900">VOC</div>
            <div className="text-sm text-gray-500">ระบบบริหารจัดการเสียงของลูกค้าและข้อร้องเรียน</div>
          </Link>
        </div>
      </div>
    </main>
  );
}
