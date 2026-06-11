/**
 * POLARIS WebGIS — StatsPanel Component
 * 
 * Panel statistik di sisi kanan dashboard yang menampilkan:
 * 1. Ringkasan dampak bencana (populasi terisolasi, zona kritis)
 * 2. Status fasilitas kesehatan (terisolasi/aman)
 * 3. Detail ruas jalan terdampak
 * 4. Statistik berubah real-time berdasarkan state simulasi
 * 
 * MENGAPA panel terpisah dari peta?
 * Pemisahan "visualization" (peta) dari "information" (statistik) mengikuti
 * pola desain "Overview + Detail" yang umum di dashboard GIS enterprise.
 * User bisa melihat gambaran spasial di peta sambil membaca detail numerik
 * di panel ini tanpa harus klik feature satu-persatu.
 * 
 * @param {Object} stats - Statistik yang dihitung di App.js
 * @param {boolean} isSimulating - Status simulasi longsor
 * @param {boolean} isLoading - Status loading data
 * @param {Object} geodata - Raw GeoJSON data untuk kalkulasi tambahan
 */

import React, { useMemo } from 'react';

function StatsPanel({ stats, isSimulating, isLoading, geodata, selectedRegion }) {
  // =====================================================================
  // COMPUTED STATISTICS
  // Menghitung statistik tambahan yang berubah berdasarkan simulasi.
  // =====================================================================

  /**
   * Menghitung total populasi yang berpotensi terisolasi saat simulasi.
   * MENGAPA computed? Nilai ini hanya relevan saat simulasi aktif.
   * Menggabungkan data populasi dari zona longsor + ruas jalan terdampak.
   */
  const simulationStats = useMemo(() => {
    if (!geodata || !geodata.features) {
      return {
        totalPopulasiTerisolasi: 0,
        faskesDetail: [],
        jalanTerdampak: [],
        zonaBahayaDetail: [],
      };
    }

    const matchesRegion = (f) => {
      if (!selectedRegion || selectedRegion === 'all') return true;
      const props = f.properties || {};
      const regionStr = (props.kabupaten || props.nama_zona || props.nama_ruas || '').toLowerCase();
      return regionStr.includes(selectedRegion.toLowerCase());
    };

    const faskesFeatures = geodata.features.filter(
      (f) => f.properties.layerType === 'faskes' && matchesRegion(f)
    );
    const longsorFeatures = geodata.features.filter(
      (f) => f.properties.layerType === 'longsor' && matchesRegion(f)
    );
    const jalanFeatures = geodata.features.filter(
      (f) => f.properties.layerType === 'jalan' && matchesRegion(f)
    );

    // Total populasi dari zona longsor
    const populasiLongsor = longsorFeatures.reduce(
      (sum, f) => sum + (f.properties.estimasi_populasi || 0), 0
    );

    // Detail faskes dengan status isolasi
    const faskesDetail = faskesFeatures.map((f) => ({
      nama: f.properties.nama_faskes,
      tipe: f.properties.tipe,
      kapasitas: f.properties.kapasitas_bed,
      status: f.properties.status_operasional,
      // RS dengan kapasitas < 200 dianggap terisolasi saat simulasi
      terisolasi: f.properties.kapasitas_bed < 200,
    }));

    // Detail jalan terdampak
    const jalanTerdampak = jalanFeatures.map((f) => ({
      nama: f.properties.nama_ruas,
      panjang: f.properties.panjang_km,
      kelas: f.properties.kelas_jalan,
      populasi: f.properties.populasi_terdampak,
    }));

    // Detail zona bahaya
    const zonaBahayaDetail = longsorFeatures.map((f) => ({
      nama: f.properties.nama_zona,
      bahaya: f.properties.tingkat_bahaya,
      luas: f.properties.luas_ha,
      populasi: f.properties.estimasi_populasi,
    }));

    return {
      totalPopulasiTerisolasi: populasiLongsor,
      faskesDetail,
      jalanTerdampak,
      zonaBahayaDetail,
    };
  }, [geodata, selectedRegion]);

  /**
   * Menghitung jumlah faskes terisolasi dan aman.
   */
  const faskesIsolated = simulationStats.faskesDetail.filter((f) => f.terisolasi).length;
  const faskesSafe = simulationStats.faskesDetail.length - faskesIsolated;

  /**
   * Total bed capacity yang hilang akibat isolasi.
   */
  const bedCapacityLost = simulationStats.faskesDetail
    .filter((f) => f.terisolasi)
    .reduce((sum, f) => sum + f.kapasitas, 0);

  // =====================================================================
  // LOADING SKELETON
  // =====================================================================

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 h-full">
        <div className="pb-3 border-b border-slate-200">
          <div className="skeleton h-5 w-40 mb-2"></div>
          <div className="skeleton h-3 w-56"></div>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card">
            <div className="skeleton h-4 w-24 mb-3"></div>
            <div className="skeleton h-10 w-full mb-2"></div>
            <div className="skeleton h-3 w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  // =====================================================================
  // RENDER
  // =====================================================================

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* =================================================================
       * SECTION: Panel Title
       * ================================================================= */}
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-sm font-bold text-slate-200 tracking-wider uppercase flex items-center gap-2">
          <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Panel Statistik
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {isSimulating
            ? '⚠️ Menampilkan dampak simulasi bencana'
            : 'Ringkasan data monitoring terkini'}
        </p>
      </div>

      {/* =================================================================
       * SECTION: Populasi Terdampak / Terisolasi
       * Kartu utama yang menampilkan estimasi populasi yang terdampak.
       * Saat simulasi aktif, angka ini lebih besar dan berwarna merah.
       * ================================================================= */}
      <div className="glass-card">
        <div className="divider-label">Populasi Terdampak</div>
        <div className="flex items-end gap-2 mt-1">
          <span className={`stat-value ${isSimulating ? 'stat-value--danger' : ''}`}>
            {isSimulating
              ? Number(simulationStats.totalPopulasiTerisolasi).toLocaleString('id-ID')
              : '0'}
          </span>
          <span className="text-xs text-slate-500 mb-1">jiwa</span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {isSimulating
            ? 'Estimasi populasi di zona rawan longsor yang berpotensi terisolasi akibat kerusakan infrastruktur jalan'
            : 'Aktifkan simulasi untuk melihat estimasi populasi terdampak'}
        </p>
      </div>

      {/* =================================================================
       * SECTION: Fasilitas Kesehatan Status
       * Status setiap RS/Puskesmas — terisolasi atau operasional.
       * ================================================================= */}
      <div className="glass-card">
        <div className="divider-label">Status Fasilitas Kesehatan</div>

        {/* Summary badges */}
        <div className="flex gap-2 mb-3">
          {isSimulating ? (
            <>
              <span className="status-badge status-badge--danger">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {faskesIsolated} Terisolasi
              </span>
              <span className="status-badge status-badge--success">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                {faskesSafe} Aman
              </span>
            </>
          ) : (
            <span className="status-badge status-badge--success">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              {simulationStats.faskesDetail.length} Operasional
            </span>
          )}
        </div>

        {/* Individual facility status */}
        <div className="space-y-2">
          {simulationStats.faskesDetail.map((faskes, idx) => {
            const isIsolated = isSimulating && faskes.terisolasi;
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-lg transition-all duration-300 ${
                  isIsolated
                    ? 'bg-red-500/10 border border-red-500/30'
                    : 'bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${
                    isIsolated ? 'text-red-300' : 'text-slate-600'
                  }`}>
                    {faskes.nama}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {faskes.tipe} • {faskes.kapasitas} bed
                  </p>
                </div>
                <div className="ml-2 flex-shrink-0">
                  {isIsolated ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-[10px] font-bold text-red-400 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      Isolasi
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Aman
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bed capacity impact */}
        {isSimulating && bedCapacityLost > 0 && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-500/5 border border-red-500/20">
            <p className="text-[11px] text-red-400 font-semibold">
              ⚠️ Kapasitas bed terisolasi: {bedCapacityLost} tempat tidur
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Faskes dengan akses jalan terputus tidak bisa menerima pasien rujukan
            </p>
          </div>
        )}
      </div>

      {/* =================================================================
       * SECTION: Zona Bahaya Detail
       * Daftar zona longsor dengan tingkat bahaya dan luas area.
       * ================================================================= */}
      <div className="glass-card">
        <div className="divider-label">Zona Rawan Longsor</div>
        <div className="space-y-2">
          {simulationStats.zonaBahayaDetail.map((zona, idx) => {
            const bahayaConfig = {
              'Kritis': { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/20 text-red-400 border-red-500/40' },
              'Tinggi': { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/40' },
              'Sedang': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
            };
            const config = bahayaConfig[zona.bahaya] || bahayaConfig['Sedang'];

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-lg transition-all duration-300 ${
                  isSimulating ? `${config.bg} border ${config.border}` : 'bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-xs font-semibold ${isSimulating ? config.text : 'text-slate-600'}`}>
                    {zona.nama}
                  </p>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${config.badge}`}>
                    {zona.bahaya}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-slate-500">
                    📐 {Number(zona.luas).toLocaleString('id-ID')} ha
                  </span>
                  <span className="text-[10px] text-slate-500">
                    👥 {Number(zona.populasi).toLocaleString('id-ID')} jiwa
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================================
       * SECTION: Riwayat Kejadian Longsor (Historical Events)
       * Menampilkan statistik kejadian longsor historis per tahun.
       * ================================================================= */}
      <div className="glass-card">
        <div className="divider-label">Riwayat Kejadian Longsor</div>
        
        {/* Summary row */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-center p-2 rounded-lg bg-slate-50/50">
            <span className="stat-value text-base">{stats.totalKejadian || 0}</span>
            <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wider">Total Kejadian</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-50/50">
            <span className="stat-value text-base stat-value--danger">{stats.totalKorbanJiwa || 0}</span>
            <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wider">Korban Jiwa</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-50/50">
            <span className="stat-value text-base" style={{color: '#f97316'}}>{stats.totalKorbanLuka || 0}</span>
            <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wider">Korban Luka</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-50/50">
            <span className="stat-value text-base" style={{color: '#06b6d4'}}>{Number(stats.totalPengungsi || 0).toLocaleString('id-ID')}</span>
            <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wider">Pengungsi</p>
          </div>
        </div>

        {/* Per-year breakdown */}
        {stats.kejadianPerTahun && Object.keys(stats.kejadianPerTahun).length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Kejadian Per Tahun</p>
            {Object.entries(stats.kejadianPerTahun)
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([tahun, data]) => {
                const maxCount = Math.max(...Object.values(stats.kejadianPerTahun).map(d => d.count));
                const barWidth = (data.count / maxCount) * 100;
                return (
                  <div key={tahun} className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 w-8 flex-shrink-0">{tahun}</span>
                    <div className="flex-1 bg-slate-50 rounded-full h-3.5 overflow-hidden relative">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${barWidth}%`,
                          background: data.korbanJiwa > 0
                            ? 'linear-gradient(90deg, #dc2626, #ef4444)'
                            : 'linear-gradient(90deg, #ea580c, #f97316)',
                        }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-slate-800">
                        {data.count}x
                      </span>
                    </div>
                    {data.korbanJiwa > 0 && (
                      <span className="text-[9px] text-red-400 font-bold flex-shrink-0 w-6 text-right">
                        †{data.korbanJiwa}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {/* Recent events list */}
        {stats.kejadianData && stats.kejadianData.length > 0 && (
          <div className="mt-3 pt-2 border-t border-slate-200/50">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">5 Kejadian Terbaru</p>
            <div className="space-y-1.5">
              {stats.kejadianData.slice(0, 5).map((kej, idx) => {
                const tgl = kej.tanggal_kejadian
                  ? new Date(kej.tanggal_kejadian).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '-';
                const sevColor = kej.korban_jiwa > 0 ? 'text-red-400' : kej.korban_luka > 0 ? 'text-orange-400' : 'text-yellow-400';
                return (
                  <div key={idx} className="flex items-start gap-2 p-1.5 rounded bg-slate-50/30">
                    <span className={`text-[10px] font-bold ${sevColor} flex-shrink-0 mt-0.5`}>⚠</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-600 truncate font-medium">{kej.lokasi_nama}</p>
                      <p className="text-[9px] text-slate-500">{tgl} • {kej.kabupaten} • {kej.tipe_longsor}</p>
                    </div>
                    {kej.korban_jiwa > 0 && (
                      <span className="text-[9px] text-red-400 font-bold flex-shrink-0">†{kej.korban_jiwa}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* =================================================================
       * SECTION: Ruas Jalan Terdampak
       * Tampilkan hanya saat simulasi aktif — daftar jalan yang terputus.
       * ================================================================= */}
      {isSimulating && (
        <div className="glass-card">
          <div className="divider-label">Ruas Jalan Terdampak</div>
          <div className="space-y-2">
            {simulationStats.jalanTerdampak.map((jalan, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-red-300 truncate flex-1">
                    🛣️ {jalan.nama}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-slate-500">
                    📏 {jalan.panjang} km
                  </span>
                  <span className="text-[10px] text-slate-500">
                    🏷️ {jalan.kelas}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    👥 {Number(jalan.populasi).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}

            {/* Total jalan terdampak summary */}
            <div className="mt-1 pt-2 border-t border-red-500/10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Total panjang terdampak</span>
                <span className="text-xs font-mono font-bold text-red-400">
                  {simulationStats.jalanTerdampak
                    .reduce((sum, j) => sum + Number(j.panjang), 0)
                    .toFixed(1)} km
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] text-slate-500">Total populasi sekitar jalan</span>
                <span className="text-xs font-mono font-bold text-red-400">
                  {Number(
                    simulationStats.jalanTerdampak.reduce(
                      (sum, j) => sum + (j.populasi || 0), 0
                    )
                  ).toLocaleString('id-ID')} jiwa
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
       * SECTION: Ringkasan Kapasitas
       * Statistik total kapasitas kesehatan dan infrastruktur.
       * ================================================================= */}
      <div className="glass-card mt-auto">
        <div className="divider-label">Kapasitas Sistem</div>
        <div className="grid grid-cols-2 gap-3">
          {/* Total Bed */}
          <div className="text-center p-3 rounded-lg bg-slate-50/50">
            <span className={`stat-value text-lg ${isSimulating ? 'stat-value--danger' : 'stat-value--success'}`}>
              {isSimulating
                ? (stats.totalKapasitasBed - bedCapacityLost)
                : stats.totalKapasitasBed}
            </span>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
              Bed Tersedia
            </p>
          </div>

          {/* Total Faskes */}
          <div className="text-center p-3 rounded-lg bg-slate-50/50">
            <span className={`stat-value text-lg ${isSimulating && faskesIsolated > 0 ? 'stat-value--danger' : 'stat-value--success'}`}>
              {isSimulating ? faskesSafe : stats.totalFaskes}
            </span>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
              Faskes Aktif
            </p>
          </div>

          {/* Zona Kritis */}
          <div className="text-center p-3 rounded-lg bg-slate-50/50">
            <span className={`stat-value text-lg ${stats.zonaKritis > 0 ? 'stat-value--danger' : ''}`}>
              {stats.zonaKritis}
            </span>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
              Zona Kritis
            </p>
          </div>

          {/* Total Kejadian Historis */}
          <div className="text-center p-3 rounded-lg bg-slate-50/50">
            <span className="stat-value text-lg" style={{color: '#f97316'}}>
              {stats.totalKejadian || 0}
            </span>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
              Kejadian Tercatat
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;
