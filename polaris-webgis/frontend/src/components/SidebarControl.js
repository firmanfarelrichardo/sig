/**
 * POLARIS WebGIS — Sidebar Control Component
 * 
 * Panel kontrol di sisi kiri dashboard yang menyediakan:
 * 1. Filter wilayah via Select Dropdown
 * 2. Tombol "SIMULASI LONGSOR" yang mengubah state aplikasi
 * 3. Ringkasan cepat jumlah layer data
 * 4. Legenda layer peta
 * 
 * MENGAPA dipisahkan dari App.js?
 * Separation of Concerns — SidebarControl hanya bertanggung jawab 
 * atas UI kontrol dan input pengguna. Logic bisnis (state, fetch) 
 * tetap di parent (App.js).
 * 
 * @param {boolean} isSimulating - Status simulasi longsor aktif/nonaktif
 * @param {Function} onToggleSimulation - Callback toggle simulasi
 * @param {string} selectedRegion - Region yang dipilih saat ini
 * @param {Function} onRegionChange - Callback perubahan filter region
 * @param {Object} stats - Statistik ringkasan dari geodata
 * @param {boolean} isLoading - Status loading data
 */

import React from 'react';

function SidebarControl({
  isSimulating,
  onToggleSimulation,
  selectedRegion,
  onRegionChange,
  selectedYear,
  onYearChange,
  stats,
  isLoading,
}) {
  /**
   * Daftar wilayah untuk dropdown filter.
   * Value dicocokkan dengan nama dalam data geodata.
   * MENGAPA hardcoded? Untuk demo, wilayah ini konsisten dengan data 
   * yang ada di PostGIS. Dalam produksi, ini bisa di-fetch dari API.
   */
  const regions = [
    { value: 'all', label: 'Semua Wilayah' },
    { value: 'Bandar Lampung', label: 'Bandar Lampung' },
    { value: 'Tanggamus', label: 'Kab. Tanggamus' },
    { value: 'Lampung Barat', label: 'Kab. Lampung Barat' },
    { value: 'Pesisir Barat', label: 'Pesisir Barat' },
    { value: 'Way Kanan', label: 'Kab. Way Kanan' },
    { value: 'Pesawaran', label: 'Kab. Pesawaran' },
    { value: 'Lampung Selatan', label: 'Kab. Lampung Selatan' },
  ];

  const years = [
    { value: 'all', label: 'Semua Tahun' },
    { value: '2026', label: '2026' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2018', label: '2018' },
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Panel Title */}
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-sm font-bold text-slate-700 tracking-wider uppercase flex items-center gap-2">
          <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Kontrol Panel
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Atur parameter visualisasi peta
        </p>
      </div>

      {/* =================================================================
       * SECTION: Region Filter Dropdown
       * Mengizinkan pengguna memfilter data berdasarkan wilayah.
       * ================================================================= */}
      <div className="glass-card">
        <label 
          htmlFor="region-select" 
          className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2"
        >
          Filter Wilayah
        </label>
        <select
          id="region-select"
          className="select-dark"
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value)}
          disabled={isLoading}
        >
          {regions.map((region) => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>
        <p className="text-[11px] text-slate-500 mt-2">
          Pilih wilayah untuk memfokuskan analisis spasial
        </p>
      </div>

      {/* Year Filter */}
      <div className="glass-card">
        <label 
          htmlFor="year-select" 
          className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2"
        >
          Filter Tahun Kejadian
        </label>
        <select
          id="year-select"
          className="select-dark"
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          disabled={isLoading}
        >
          {years.map((yr) => (
            <option key={yr.value} value={yr.value}>
              {yr.label}
            </option>
          ))}
        </select>
        <p className="text-[11px] text-slate-500 mt-2">
          Tampilkan kejadian longsor berdasarkan tahun
        </p>
      </div>

      {/* =================================================================
       * SECTION: Simulation Button
       * Tombol utama yang mengaktifkan/menonaktifkan simulasi longsor.
       * MENGAPA button besar dan mencolok? Ini adalah aksi utama user — 
       * harus mudah ditemukan dan dikenali fungsinya.
       * ================================================================= */}
      <div className="glass-card">
        <div className="divider-label">Aksi Simulasi</div>
        
        <button
          id="simulate-button"
          className={`btn-simulate ${
            isSimulating ? 'btn-simulate--active' : 'btn-simulate--inactive'
          }`}
          onClick={onToggleSimulation}
          disabled={isLoading}
          aria-label={isSimulating ? 'Hentikan simulasi longsor' : 'Mulai simulasi longsor'}
        >
          {/* Icon animasi berdasarkan status */}
          {isSimulating ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {isSimulating ? 'HENTIKAN SIMULASI' : 'SIMULASI LONGSOR'}
        </button>

        {/* Status text di bawah tombol */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            isSimulating ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
          }`}></span>
          <span className={`text-xs font-medium ${
            isSimulating ? 'text-red-400' : 'text-amber-500'
          }`}>
            {isSimulating 
              ? 'Simulasi bencana longsor sedang berjalan' 
              : 'Sistem dalam kondisi monitoring normal'}
          </span>
        </div>
      </div>

      {/* =================================================================
       * SECTION: Data Summary
       * Ringkasan cepat jumlah entitas per layer.
       * ================================================================= */}
      <div className="glass-card">
        <div className="divider-label">Ringkasan Data</div>
        
        {isLoading ? (
          <div className="space-y-3">
            <div className="skeleton h-8 w-full"></div>
            <div className="skeleton h-8 w-full"></div>
            <div className="skeleton h-8 w-full"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Ruas Jalan */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-emerald-400 rounded-full"></div>
                <span className="text-xs text-slate-600">Ruas Jalan</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-500">
                {stats.totalJalan}
              </span>
            </div>

            {/* Zona Longsor */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500/30 border border-red-500 rounded-sm"></div>
                <span className="text-xs text-slate-600">Zona Longsor</span>
              </div>
              <span className="text-xs font-mono font-bold text-red-400">
                {stats.totalZonaLongsor}
              </span>
            </div>

            {/* Fasilitas Kesehatan */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 flex items-center justify-center text-[8px]">🏥</div>
                <span className="text-xs text-slate-600">Fasilitas Kesehatan</span>
              </div>
              <span className="text-xs font-mono font-bold text-orange-500">
                {stats.totalFaskes}
              </span>
            </div>

            {/* Kejadian Longsor */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 flex items-center justify-center text-[8px]">⚠️</div>
                <span className="text-xs text-slate-600">Kejadian Longsor</span>
              </div>
              <span className="text-xs font-mono font-bold text-orange-400">
                {stats.totalKejadian || 0}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================
       * SECTION: Map Legend
       * Legenda warna yang menjelaskan setiap layer pada peta.
       * ================================================================= */}
      <div className="glass-card mt-auto">
        <div className="divider-label">Legenda Peta</div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-0.5 bg-emerald-400 rounded-full"></div>
            <span className="text-[11px] text-slate-500">Jalan Aktif (Normal)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-0.5 bg-red-500 rounded-full" style={{ 
              backgroundImage: 'repeating-linear-gradient(90deg, #ef4444 0, #ef4444 4px, transparent 4px, transparent 8px)' 
            }}></div>
            <span className="text-[11px] text-slate-500">Jalan Terdampak (Simulasi)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-3 bg-red-500/20 border border-red-500/60 rounded-sm"></div>
            <span className="text-[11px] text-slate-500">Zona Rawan Longsor</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-sm leading-none">🏥</span>
            <span className="text-[11px] text-slate-500">Fasilitas Kesehatan</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 bg-orange-500 rounded transform rotate-45 flex items-center justify-center" style={{fontSize: '8px'}}>
              <span style={{transform: 'rotate(-45deg)'}}>⚠</span>
            </div>
            <span className="text-[11px] text-slate-500">Kejadian Longsor Historis</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarControl;
