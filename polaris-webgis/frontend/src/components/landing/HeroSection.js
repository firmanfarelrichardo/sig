import React, { useEffect, useState } from 'react';

const HeroSection = ({ onExplore }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col">
      {/* ================= SECTION 1: HERO ================= */}
      <section id="beranda" className="relative min-h-screen flex items-center pt-28 pb-32 overflow-hidden bg-slate-50">
        {/* Background Image Gunung Seminung */}
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] hover:scale-105" style={{ backgroundImage: "url('/images/seminung_bg.png')" }} />
        
        {/* Lighter Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/80 to-white/10" />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#fdfbf7] via-transparent to-transparent opacity-100" />
        
        {/* Konten Hero (Left Aligned) */}
        <div className={`relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-12 flex flex-col items-start text-left mt-12 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8b5a2b]/10 border border-[#8b5a2b]/20 mb-6 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[#8b5a2b] animate-pulse"></div>
            <span className="text-[11px] font-bold tracking-[0.1em] text-[#8b5a2b] uppercase">
              WebGIS Analisis Bencana Longsor Provinsi Lampung
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-6 max-w-3xl">
            Pemetaan Operasional Longsor & Akses Rawan Isolasi <span className="text-[#8b5a2b]">Sumatera</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl font-normal">
            Platform analisis spasial untuk mensimulasikan dampak turunan <i>(cascading disaster)</i> berupa terputusnya jalan logistik utama, memfasilitasi percepatan evakuasi medis serta pemetaan area terisolasi.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={onExplore}
              className="px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-all shadow-[0_8px_20px_rgba(249,115,22,0.3)] flex items-center gap-2 hover:-translate-y-1"
            >
              Akses Peta Bencana &rarr;
            </button>
          </div>

          <div className="mt-16 bg-white/90 backdrop-blur-md border border-[#8b5a2b]/10 rounded-2xl p-6 shadow-xl flex gap-10 max-w-3xl border-l-4 border-l-[#8b5a2b]">
            <div>
              <p className="text-3xl font-black text-slate-800">12+</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Skenario Longsor</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">45</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Zona Rawan</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-800">20</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Rumah Sakit</p>
            </div>
            <div>
              <p className="text-3xl font-black text-orange-500">Real-time</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Data Spasial</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: URGENSI MITIGASI ================= */}
      <section className="py-24 bg-[#fdfbf7] relative">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2">
              <div className="relative p-8 rounded-3xl bg-[#8b5a2b]/5 border border-[#8b5a2b]/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5a2b]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="text-3xl font-black text-slate-900 mb-6 relative z-10">
                  Ancaman <span className="text-[#8b5a2b]">Topografis</span> di Bumi Ruwa Jurai
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed relative z-10">
                  Provinsi Lampung dilewati oleh sesar Sumatera yang menciptakan kontur perbukitan curam, terutama di sepanjang Jalan Lintas Barat. Kondisi geografis ini menjadikan Lampung sebagai salah satu provinsi dengan tingkat kerawanan hidrometeorologi tertinggi di Indonesia.
                </p>
                <div className="flex gap-4 items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    65%
                  </div>
                  <p className="text-sm text-slate-600 font-medium">Jalan Lintas strategis melewati area perbukitan rawan pergerakan tanah.</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-[#8b5a2b]/10 flex items-center justify-center text-[#8b5a2b] mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h4 className="font-bold text-slate-800 mb-2">Terputusnya Akses</h4>
                <p className="text-sm text-slate-500">Longsor seringkali memutus satu-satunya urat nadi ekonomi dan logistik antar kabupaten.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-8">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h4 className="font-bold text-slate-800 mb-2">Keterlambatan Medis</h4>
                <p className="text-sm text-slate-500">Meningkatkan risiko fatalitas karena terhambatnya jalur evakuasi menuju Rumah Sakit rujukan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: ALUR KERJA SISTEM ================= */}
      <section className="py-24 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Alur Kerja <span className="text-[#8b5a2b]">POLARIS</span></h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-16">Bagaimana sistem kami mengubah data geospasial mentah menjadi dukungan keputusan taktis di lapangan.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Garis Konektor */}
            <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-[#8b5a2b]/20 via-orange-500/50 to-[#8b5a2b]/20 -translate-y-1/2 z-0"></div>
            
            <div className="bg-[#fdfbf7] p-8 rounded-3xl border border-[#8b5a2b]/20 relative z-10 shadow-sm">
              <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-md flex items-center justify-center text-[#8b5a2b] font-black text-2xl mb-6">1</div>
              <h4 className="font-bold text-lg text-slate-800 mb-3">Integrasi Data</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Penarikan data elevasi, curah hujan, dan tutupan lahan secara langsung ke dalam PostGIS engine.</p>
            </div>
            
            <div className="bg-[#fdfbf7] p-8 rounded-3xl border border-orange-200 relative z-10 shadow-md transform md:-translate-y-4">
              <div className="w-16 h-16 mx-auto bg-orange-500 rounded-2xl shadow-md flex items-center justify-center text-white font-black text-2xl mb-6">2</div>
              <h4 className="font-bold text-lg text-slate-800 mb-3">Analisis Spasial</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Mesin memetakan area rawan dan mengkalkulasi dampak turunan pada jaringan jalan menggunakan algoritma jarak terdekat.</p>
            </div>
            
            <div className="bg-[#fdfbf7] p-8 rounded-3xl border border-[#8b5a2b]/20 relative z-10 shadow-sm">
              <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-md flex items-center justify-center text-[#8b5a2b] font-black text-2xl mb-6">3</div>
              <h4 className="font-bold text-lg text-slate-800 mb-3">Tindakan Mitigasi</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Visualisasi instan rute evakuasi dan estimasi populasi terisolasi untuk mengerahkan tim SAR secara presisi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: DUKUNGAN INFRASTRUKTUR ================= */}
      <section className="py-24 bg-[#fdfbf7] border-t border-[#8b5a2b]/10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Dukungan <span className="text-[#8b5a2b]">Infrastruktur</span> Nasional</h2>
            <div className="w-20 h-1 bg-[#8b5a2b] mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              POLARIS mensinergikan berbagai fasilitas layanan publik dan infrastruktur strategis nasional yang berada di Provinsi Lampung.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl text-center shadow-sm border border-slate-100 hover:border-[#8b5a2b]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h4 className="font-bold text-slate-800 text-2xl">45+</h4>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Rumah Sakit</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl text-center shadow-sm border border-slate-100 hover:border-[#8b5a2b]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 mx-auto bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              </div>
              <h4 className="font-bold text-slate-800 text-2xl">300km</h4>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Jalan Lintas</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl text-center shadow-sm border border-slate-100 hover:border-[#8b5a2b]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 mx-auto bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="font-bold text-slate-800 text-2xl">15</h4>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Kabupaten/Kota</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl text-center shadow-sm border border-slate-100 hover:border-[#8b5a2b]/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 mx-auto bg-purple-50 rounded-full flex items-center justify-center text-purple-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h4 className="font-bold text-slate-800 text-2xl">24/7</h4>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Monitoring</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HeroSection;
