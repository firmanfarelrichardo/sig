import React from 'react';

const IconMap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const IconAlert = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const IconRoute = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const IconHospital = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const LandingPage = ({ onExplore, stats }) => {
  
  // Smooth scroll handler
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans h-screen overflow-y-auto scroll-smooth">
      
      {/* ================= HEADER / NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 lg:px-12 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => scrollToSection('beranda')}>
          <span className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            POLARIS
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          <button onClick={() => scrollToSection('beranda')} className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors uppercase tracking-wider">Beranda</button>
          <button onClick={() => scrollToSection('sistem')} className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors uppercase tracking-wider">Sistem</button>
          <button onClick={() => scrollToSection('data-spasial')} className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors uppercase tracking-wider">Data Spasial</button>
          <button onClick={() => scrollToSection('mitigasi')} className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors uppercase tracking-wider">Mitigasi</button>
        </div>

        <button 
          onClick={onExplore}
          className="group relative px-6 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)]"
        >
          <span className="relative flex items-center gap-2">
            Akses Peta
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </span>
        </button>
      </nav>

      {/* ================= SECTION 1: HERO (Beranda) ================= */}
      <section id="beranda" className="relative min-h-screen flex items-center pt-20">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity" style={{ backgroundImage: "url('/images/hero_bg.png')" }} />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/50 backdrop-blur-md mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase">Sistem Intelijen Spasial Aktif</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.1] tracking-tighter mb-6">
            Pemetaan Operasional<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              Longsor & Akses Rawan
            </span><br/>
            Isolasi Sumatera
          </h1>
          
          <p className="text-lg lg:text-xl text-slate-400 mb-12 leading-relaxed max-w-3xl font-light">
            Platform <strong>POLARIS</strong> mengintegrasikan data kebencanaan historis, analisis topografi tingkat tinggi, serta pemetaan infrastruktur darurat untuk memastikan wilayah Sumatera memiliki kapabilitas tanggap darurat yang antisipatif dan terukur.
          </p>
          
          <button 
            onClick={onExplore}
            className="px-10 py-5 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 text-lg font-black uppercase tracking-widest transition-transform hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.6)] flex items-center gap-3"
          >
            Buka WebGIS Dashboard
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>
      </section>

      {/* ================= SECTION 2: SISTEM & FITUR ================= */}
      <section id="sistem" className="relative py-24 bg-slate-950 border-t border-slate-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-16 md:w-1/2">
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">Mekanisme <span className="text-cyan-400">Sistem</span></h2>
            <p className="text-slate-400 text-lg">POLARIS bukan sekadar peta statis, melainkan engine analisis dinamis yang mensimulasikan dampak jika rute vital terputus.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-cyan-500/50 transition-colors">
              <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-400 mb-6"><IconAlert /></div>
              <h3 className="text-xl font-bold text-white mb-4">Pemetaan Blank Spot</h3>
              <p className="text-slate-400">Identifikasi zona terisolasi berdasarkan parameter cuaca, kelerengan, dan riwayat longsor sebelumnya yang memutus akses.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-cyan-500/50 transition-colors">
              <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-cyan-400 mb-6"><IconRoute /></div>
              <h3 className="text-xl font-bold text-white mb-4">Simulasi Akses Jalur</h3>
              <p className="text-slate-400">Mensimulasikan skenario terburuk apabila jalur lintas terputus, dan mencari rute logistik alternatif secepat mungkin.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-cyan-500/50 transition-colors">
              <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-rose-400 mb-6"><IconHospital /></div>
              <h3 className="text-xl font-bold text-white mb-4">Radius Faskes Rujukan</h3>
              <p className="text-slate-400">Memastikan rumah sakit rujukan terdekat masuk ke dalam buffer area untuk penanganan medis darurat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: DATA SPASIAL ================= */}
      <section id="data-spasial" className="relative py-24 bg-slate-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">Database <span className="text-cyan-400">Spasial Aktif</span></h2>
            <p className="text-slate-400 text-lg mb-8">Informasi di bawah adalah representasi *live* dari database geospasial (PostGIS) wilayah Provinsi Lampung yang siap untuk dianalisis di Dashboard WebGIS.</p>
            <button onClick={onExplore} className="text-cyan-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2 hover:text-cyan-300">
              Lihat di Peta <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
             <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
               <div className="text-4xl font-light text-white mb-2">{stats ? stats.zonaKritis : '-'}</div>
               <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">Zona Rawan Kritis</div>
             </div>
             <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
               <div className="text-4xl font-light text-white mb-2">{stats ? stats.totalKejadian : '-'}</div>
               <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">Riwayat Longsor</div>
             </div>
             <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
               <div className="text-4xl font-light text-white mb-2">{stats ? stats.totalJalan : '-'}</div>
               <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">Ruas Lintas Utama</div>
             </div>
             <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
               <div className="text-4xl font-light text-white mb-2">{stats ? stats.totalFaskes : '-'}</div>
               <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">Titik Faskes Terdata</div>
             </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: MITIGASI / FOOTER ================= */}
      <section id="mitigasi" className="relative py-24 bg-slate-950">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-6">Siap Melakukan Perencanaan Mitigasi?</h2>
          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">Akses peta POLARIS sekarang untuk mensimulasikan pemutusan jalur dan memulai rekayasa rute evakuasi medis.</p>
          <button 
            onClick={onExplore}
            className="px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-lg font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-3 rounded"
          >
            Buka WebGIS Sekarang
          </button>
        </div>
      </section>

      <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center">
        <p className="text-slate-500 text-sm font-medium tracking-wider uppercase">© 2026 POLARIS ANALYTICS • Version 2.1.0</p>
      </footer>
    </div>
  );
};

export default LandingPage;
