import React, { useState } from 'react';
import SidebarControl from './SidebarControl';
import MapCanvasEnhanced from './MapCanvasEnhanced';
import StatsPanel from './StatsPanel';

const MapDashboard = ({ 
  geodata, 
  isSimulating, 
  onToggleSimulation, 
  selectedRegion, 
  onRegionChange,
  selectedYear,
  onYearChange,
  stats, 
  isLoading, 
  error 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-[110]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#fcecd4] flex items-center justify-center border border-[#e5a060]">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8b5a2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
               </svg>
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">POLARIS <span className="font-normal text-slate-500">| Peta Bencana Full</span></h2>
            </div>
          </div>
          <button 
            onClick={() => setIsFullscreen(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            Tutup Mode Full
          </button>
        </div>
        <div className="flex-1 relative">
          <MapCanvasEnhanced 
            geodata={geodata}
            isSimulating={isSimulating}
            selectedRegion={selectedRegion}
            selectedYear={selectedYear}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full pt-28 pb-4 px-4 gap-4 bg-[#faf8f5]">
      {/* Kolom Kiri: Sidebar Control */}
      <div className="w-[300px] bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#8b5a2b]/10 overflow-y-auto flex flex-col p-5">
        <SidebarControl 
          isSimulating={isSimulating}
          onToggleSimulation={onToggleSimulation}
          selectedRegion={selectedRegion}
          onRegionChange={onRegionChange}
          selectedYear={selectedYear}
          onYearChange={onYearChange}
          stats={stats}
          isLoading={isLoading}
        />
      </div>

      {/* Kolom Tengah: Peta Utama */}
      <div className="flex-1 bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#8b5a2b]/10 overflow-hidden relative flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-[#fdfbf7] z-10">
          <div>
            <h2 className="text-lg font-black text-slate-800">Peta Analisis Keterisolasian</h2>
            <p className="text-xs text-slate-500 mt-0.5">Visualisasi sebaran area rawan dan rute logistik</p>
          </div>
          <div className="flex gap-3 items-center">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[10px] font-bold text-orange-700 uppercase">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span> Faskes
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[10px] font-bold text-red-700 uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Kejadian
            </span>
            <div className="w-px h-6 bg-slate-200"></div>
            <button 
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8b5a2b]/10 border border-[#8b5a2b]/20 text-xs font-bold text-[#8b5a2b] hover:bg-[#8b5a2b] hover:text-white transition-colors"
              title="Lihat Peta Full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              <span>Full Peta</span>
            </button>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <MapCanvasEnhanced 
            geodata={geodata}
            isSimulating={isSimulating}
            selectedRegion={selectedRegion}
            selectedYear={selectedYear}
          />
          
          {isLoading && (
            <div className="absolute inset-0 z-[1000] bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
              <p className="mt-4 text-sm font-bold text-slate-700 animate-pulse uppercase tracking-widest">
                Memuat Data Spasial...
              </p>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 z-[1000] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
              <svg className="w-16 h-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Gagal Memuat Data</h3>
              <p className="text-slate-600 max-w-md">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Kolom Kanan: Stats Panel */}
      <div className="w-[300px] bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#8b5a2b]/10 overflow-y-auto p-5">
        <StatsPanel 
          stats={stats}
          isSimulating={isSimulating}
          isLoading={isLoading}
          geodata={geodata}
          selectedRegion={selectedRegion}
        />
      </div>
    </div>
  );
};

export default MapDashboard;
