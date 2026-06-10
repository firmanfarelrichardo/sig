import React from 'react';

const FeatureSection = () => {
  return (
    <div className="flex flex-col">
      {/* ================= HEADER FITUR ================= */}
      <section className="pt-32 pb-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#8b5a2b]/10 text-[#8b5a2b] font-bold text-[10px] tracking-widest uppercase mb-4 border border-[#8b5a2b]/20">
            <span className="w-2 h-2 bg-[#8b5a2b] rounded-sm"></span> Modul Analisis Utama
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight max-w-3xl mx-auto">
            Kapabilitas Spasial untuk <span className="text-[#8b5a2b]">Keputusan Cepat</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Menghadirkan sekumpulan modul kecerdasan lokasi untuk memetakan bahaya, menghitung dampak terburuk, dan mencari jalan keluar di tengah krisis.
          </p>
        </div>
      </section>

      {/* ================= MODUL 1: BLANK SPOT ================= */}
      <section className="py-20 bg-[#fdfbf7] relative border-t border-[#8b5a2b]/10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="bg-white rounded-3xl p-6 aspect-square shadow-xl border border-[#8b5a2b]/10 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(139, 90, 43, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 90, 43, 0.4) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                {/* Abstrak Polygon Peta */}
                <svg viewBox="0 0 200 200" className="w-full h-full text-[#8b5a2b] opacity-80" fill="currentColor">
                  <path d="M45,-76.3C58,-68.8,68.2,-55.5,75.4,-41.2C82.7,-27,87.1,-11.8,85.2,2.8C83.3,17.4,75,31.4,65.2,43.2C55.4,55,44.1,64.6,31.2,71.2C18.3,77.8,3.8,81.4,-10.8,80.1C-25.5,78.8,-40.1,72.6,-53.4,63.6C-66.7,54.6,-78.7,42.8,-83.4,28.7C-88.1,14.6,-85.4,-1.8,-80,-17.1C-74.6,-32.4,-66.4,-46.6,-54.6,-55.2C-42.8,-63.8,-27.4,-66.8,-12.6,-68.9C2.2,-71,17,-72.1,31.6,-74.6C46.2,-77.1,60.8,-81,45,-76.3Z" transform="translate(100 100) scale(1.1)" />
                  <circle cx="100" cy="100" r="10" className="text-white fill-white" />
                  <circle cx="100" cy="100" r="14" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" className="animate-spin-slow" />
                </svg>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg flex items-center gap-4 border border-[#8b5a2b]/20">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Blank Spot Terdeteksi</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Akses Utama Putus</p>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Deteksi <span className="text-[#8b5a2b]">Area Terisolasi</span></h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Algoritma kami secara otomatis mengidentifikasi pemukiman atau kecamatan yang akan terisolasi secara total (blank spot) jika terjadi longsor pada titik simpul jalan lintas krusial.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-white border border-slate-200 p-1.5 rounded-full text-slate-700 shadow-sm"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                  <div>
                    <h4 className="font-bold text-slate-800">Estimasi Populasi Terdampak</h4>
                    <p className="text-slate-500 text-sm mt-1">Kalkulasi langsung jumlah jiwa yang membutuhkan pasokan logistik udara/laut darurat.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-white border border-slate-200 p-1.5 rounded-full text-slate-700 shadow-sm"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                  <div>
                    <h4 className="font-bold text-slate-800">Identifikasi Infrastruktur Kritis</h4>
                    <p className="text-slate-500 text-sm mt-1">Mendeteksi jembatan dan ruas jalan yang tidak bisa dilewati.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MODUL 2: RUTE EVAKUASI ================= */}
      <section className="py-20 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Rute <span className="text-orange-500">Evakuasi Medis</span></h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Dalam skenario longsor yang menelan korban, waktu adalah segalanya. Sistem akan mencari fasilitas kesehatan terdekat menggunakan jaringan jalan yang masih beroperasi (bukan rute yang tertutup longsor).
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-orange-50 border border-orange-200 p-1.5 rounded-full text-orange-600"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                  <div>
                    <h4 className="font-bold text-slate-800">Database 20+ Rumah Sakit</h4>
                    <p className="text-slate-500 text-sm mt-1">Terhubung dengan data RS di seluruh Lampung termasuk kapasitas dan status operasional.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-orange-50 border border-orange-200 p-1.5 rounded-full text-orange-600"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                  <div>
                    <h4 className="font-bold text-slate-800">Analisis Jarak (Routing)</h4>
                    <p className="text-slate-500 text-sm mt-1">Kalkulasi rute memutar terbaik untuk ambulans jika rute primer putus total.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative">
              <div className="bg-[#fdfbf7] rounded-3xl p-6 aspect-video shadow-xl border border-slate-200 relative overflow-hidden flex flex-col justify-center">
                <div className="flex items-center gap-4 px-4 py-3 bg-white rounded-lg shadow-sm mb-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">A</div>
                  <div className="flex-1">
                    <div className="h-3 w-1/3 bg-slate-200 rounded mb-1"></div>
                    <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-center py-2">
                  <div className="h-8 w-1 bg-orange-300 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center gap-4 px-4 py-3 bg-white rounded-lg shadow-sm mt-3 border-l-4 border-l-orange-500">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-800">RSUD Dr. H. Abdul Moeloek</div>
                    <div className="text-xs text-slate-500">Estimasi: 45 Menit (Memutar via Tol)</div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ================= MODUL 3: INTEGRASI PEMANGKU KEPENTINGAN ================= */}
      <section className="py-20 bg-[#fdfbf7] relative border-t border-[#8b5a2b]/10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 lg:order-1 relative">
              <div className="bg-white rounded-3xl p-6 aspect-square shadow-xl border border-slate-200 relative overflow-hidden flex flex-col items-center justify-center gap-6">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#8b5a2b 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                
                <div className="flex gap-4 relative z-10 animate-[bounce_4s_infinite]">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 shadow-sm mt-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-green-500 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                </div>
                
                <div className="relative z-10 bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-lg text-center mt-4">
                  <p className="text-sm font-bold text-slate-800">Sinkronisasi Data Lintas Instansi</p>
                  <p className="text-[10px] text-slate-500 uppercase mt-1 tracking-wider">BPBD • BAPPEDA • KEMENKES</p>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Integrasi <span className="text-[#8b5a2b]">Pemangku Kepentingan</span></h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                POLARIS dirancang sebagai platform kolaborasi. Data kerawanan dari BPBD dipadukan dengan data infrastruktur jalan dari Dinas PUPR dan sebaran fasilitas kesehatan dari Dinas Kesehatan.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-white border border-slate-200 p-1.5 rounded-full text-slate-700 shadow-sm"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                  <div>
                    <h4 className="font-bold text-slate-800">Satu Peta Keselamatan (One Map)</h4>
                    <p className="text-slate-500 text-sm mt-1">Mengeliminasi redundansi data antar instansi saat fase tanggap darurat bencana.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-white border border-slate-200 p-1.5 rounded-full text-slate-700 shadow-sm"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                  <div>
                    <h4 className="font-bold text-slate-800">Laporan Komprehensif</h4>
                    <p className="text-slate-500 text-sm mt-1">Dapat diekspor ke format CSV maupun dokumen cetak untuk keperluan pelaporan resmi kepada Gubernur atau BNPB Pusat.</p>
                  </div>
                </li>
              </ul>
            </div>
            
          </div>
        </div>
      </section>

    </div>
  );
};

export default FeatureSection;
