import React from 'react';

const AboutSection = () => {
  return (
    <div className="flex flex-col">
      {/* ================= HEADER TENTANG ================= */}
      <section className="pt-32 pb-24 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#8b5a2b]/10 text-[#8b5a2b] font-bold text-[10px] tracking-widest uppercase mb-4 border border-[#8b5a2b]/20">
                <span className="w-2 h-2 bg-[#8b5a2b] rounded-sm"></span> Tentang Sistem
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">
                Misi Kami: <span className="text-[#8b5a2b]">Nihil Fatalitas</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                POLARIS (Pemetaan Operasional Longsor & Akses Rawan Isolasi Sumatera) lahir dari kebutuhan mendesak akan alat pengambil keputusan yang presisi saat bencana melanda Provinsi Lampung.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Kami membangun sistem <i>Decision Support System</i> ini untuk membantu BPBD dan Basarnas mempercepat perhitungan rute evakuasi medis dan memetakan populasi yang terisolasi secara seketika saat akses logistik utama terputus oleh longsor.
              </p>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-[#fdfbf7] p-8 rounded-3xl border border-[#8b5a2b]/20 shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8b5a2b]/10 rounded-full blur-3xl"></div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Tim Pengembang (Owner)</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Dhito Aryo Trengginas</h4>
                      <p className="text-sm text-slate-500">GIS Integration & Spatial Analyst</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Muhammad Rayhan Gumay</h4>
                      <p className="text-sm text-slate-500">GIS Developer & Data Engineer</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Firman Farel Richardo</h4>
                      <p className="text-sm text-slate-500">Frontend UI/UX & System Integration</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Metodologi & Sumber Data */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Metodologi & Sumber Data</h2>
            <div className="w-20 h-1 bg-[#8b5a2b] mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              POLARIS dibangun menggunakan integrasi data spasial resmi yang dikomputasi menggunakan algoritma routing Dijkstra pada PostGIS untuk menghasilkan tingkat isolasi seakurat mungkin.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 rounded-2xl bg-[#8b5a2b]/10 flex items-center justify-center mb-6 group-hover:bg-[#8b5a2b] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#8b5a2b] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Akuisisi Data Resiliensi</h3>
              <p className="text-slate-600">Pemetaan kerawanan tanah longsor dan jaringan rute diekstraksi dari instansi resmi (BPBD, BAPPEDA, dan BIG) yang diperbarui secara periodik.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 rounded-2xl bg-[#8b5a2b]/10 flex items-center justify-center mb-6 group-hover:bg-[#8b5a2b] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#8b5a2b] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Model Topologi Rute</h3>
              <p className="text-slate-600">Simulasi memutus jaringan jalan terdampak secara terprogram (graph severance), dan melakukan komputasi ulang jalur alternatif terpendek.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 rounded-2xl bg-[#8b5a2b]/10 flex items-center justify-center mb-6 group-hover:bg-[#8b5a2b] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#8b5a2b] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Deteksi Blank Spot</h3>
              <p className="text-slate-600">Analisis irisan spasial area permukiman yang berada di dalam poligon keterisolasian saat seluruh rute utama dan alternatif terputus total.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ULASAN & SARAN ================= */}
      <section className="py-24 bg-[#8b5a2b] relative overflow-hidden text-center">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="max-w-[800px] mx-auto px-6 lg:px-12 relative z-10">
          <h2 className="text-3xl font-black text-white mb-4">Ulasan & Saran</h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Sistem POLARIS terus dikembangkan untuk menjadi lebih akurat dan bermanfaat bagi masyarakat Lampung. Kami sangat menghargai setiap masukan, ulasan, maupun saran dari Anda.
          </p>

          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
            <p className="text-white mb-6 font-medium">Klik tombol di bawah ini untuk mengirimkan ulasan atau saran pengembangan melalui email resmi kami.</p>
            <a
              href="mailto:contact@polaris-lampung.go.id?subject=Ulasan%20dan%20Saran%20untuk%20POLARIS"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#8b5a2b] font-bold shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Kirim Ulasan via Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;
