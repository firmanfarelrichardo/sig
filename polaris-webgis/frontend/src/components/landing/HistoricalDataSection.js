import React, { useState, useMemo } from 'react';

const HistoricalDataSection = ({ stats, geodata }) => {
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterYear, setFilterYear] = useState('all');

  // Ekstrak data kejadian dari geodata (atau fallback ke array kosong jika belum ada)
  const events = useMemo(() => {
    if (!geodata || !geodata.features) return [];
    
    return geodata.features
      .filter(f => f.properties.layerType === 'kejadian')
      .map(f => f.properties)
      .sort((a, b) => new Date(b.tanggal_kejadian) - new Date(a.tanggal_kejadian)); // Sort terbaru
  }, [geodata]);

  // Terapkan filter
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      const matchRegion = filterRegion === 'all' || (evt.kabupaten && evt.kabupaten.toLowerCase().includes(filterRegion.toLowerCase()));
      const evtYear = evt.tanggal_kejadian ? evt.tanggal_kejadian.substring(0, 4) : '';
      const matchYear = filterYear === 'all' || evtYear === filterYear;
      return matchRegion && matchYear;
    });
  }, [events, filterRegion, filterYear]);

  // Kalkulasi statistik berdasarkan data tersaring
  const totalKorbanJiwa = filteredEvents.reduce((sum, evt) => sum + (evt.korban_jiwa || 0), 0);
  const totalInfrastrukturRusak = filteredEvents.reduce((sum, evt) => sum + (evt.rumah_rusak_berat || 0) + (evt.rumah_rusak_ringan || 0), 0);

  // Data trend per tahun untuk visualisasi (grafik sederhana)
  const yearlyTrend = useMemo(() => {
    const trend = {};
    events.forEach(evt => {
      const yr = evt.tanggal_kejadian ? evt.tanggal_kejadian.substring(0, 4) : 'Unknown';
      if (yr !== 'Unknown') {
        trend[yr] = (trend[yr] || 0) + 1;
      }
    });
    return Object.entries(trend).sort(([a], [b]) => Number(a) - Number(b));
  }, [events]);

  return (
    <div className="flex flex-col">
      {/* SECTION 1: HERO & SUMMARY */}
      <section className="pt-32 pb-16 bg-[#fdfbf7] relative">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">
            Rekapitulasi <span className="text-[#8b5a2b]">Data Historis</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed mb-16">
            Database spasial yang merekam riwayat kejadian tanah longsor di Provinsi Lampung sebagai basis algoritma machine learning dan prediksi kerawanan.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#8b5a2b]/20 hover:-translate-y-1 transition-transform">
              <p className="text-sm font-bold text-slate-500 mb-1">Total Insiden</p>
              <p className="text-4xl font-black text-slate-800">{filteredEvents.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-200 hover:-translate-y-1 transition-transform">
              <p className="text-sm font-bold text-slate-500 mb-1">Total Korban Jiwa</p>
              <p className="text-4xl font-black text-red-500">{totalKorbanJiwa}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-200 hover:-translate-y-1 transition-transform">
              <p className="text-sm font-bold text-slate-500 mb-1">Bangunan Rusak</p>
              <p className="text-4xl font-black text-orange-500">{totalInfrastrukturRusak}</p>
            </div>
            <div className="bg-[#8b5a2b] p-6 rounded-2xl shadow-sm border border-[#8b5a2b] hover:-translate-y-1 transition-transform">
              <p className="text-sm font-bold text-white/80 mb-1">Status Keamanan</p>
              <p className="text-4xl font-black text-white">WASPADA</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TREN VISUALISASI */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Tren Kejadian Tahunan</h3>
              <p className="text-slate-500 mt-1">Frekuensi insiden longsor dari tahun ke tahun di Provinsi Lampung</p>
            </div>
          </div>
          
          <div className="bg-[#fdfbf7] p-8 rounded-3xl border border-[#8b5a2b]/10 flex items-end h-[300px] gap-4">
            {yearlyTrend.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">Memuat data tren...</div>
            ) : (
              yearlyTrend.map(([year, count]) => {
                const maxCount = Math.max(...yearlyTrend.map(t => t[1]));
                const heightPercentage = Math.max((count / maxCount) * 100, 10);
                return (
                  <div key={year} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <div className="text-slate-600 font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{count} Insiden</div>
                    <div 
                      className="w-full max-w-[60px] bg-[#8b5a2b]/80 rounded-t-lg group-hover:bg-orange-500 transition-colors"
                      style={{ height: `${heightPercentage}%` }}
                    ></div>
                    <div className="mt-4 text-sm font-bold text-slate-500 border-t border-slate-200 pt-2 w-full text-center">{year}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: TABEL FILTER & DATA */}
      <section className="py-24 bg-[#fdfbf7]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-[#8b5a2b]/10 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-white gap-4">
              <h3 className="text-xl font-bold text-slate-800">Database Insiden Longsor</h3>
              
              {/* FILTERS */}
              <div className="flex flex-wrap items-center gap-3">
                <select 
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 outline-none focus:border-[#8b5a2b] transition-colors"
                >
                  <option value="all">Semua Wilayah</option>
                  <option value="Bandar Lampung">Bandar Lampung</option>
                  <option value="Tanggamus">Kab. Tanggamus</option>
                  <option value="Lampung Barat">Kab. Lampung Barat</option>
                  <option value="Pesisir Barat">Pesisir Barat</option>
                  <option value="Way Kanan">Kab. Way Kanan</option>
                  <option value="Pesawaran">Kab. Pesawaran</option>
                  <option value="Lampung Selatan">Kab. Lampung Selatan</option>
                </select>

                <select 
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 outline-none focus:border-[#8b5a2b] transition-colors"
                >
                  <option value="all">Semua Tahun</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                  <option value="2018">2018</option>
                </select>

                <button className="px-4 py-2 bg-[#8b5a2b] text-white rounded-lg text-sm font-bold hover:bg-[#6e4620] transition-colors shadow-md">
                  Unduh CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-600 text-sm">Waktu Kejadian</th>
                    <th className="px-6 py-4 font-bold text-slate-600 text-sm">Lokasi & Tipe</th>
                    <th className="px-6 py-4 font-bold text-slate-600 text-sm">Faktor Pemicu</th>
                    <th className="px-6 py-4 font-bold text-slate-600 text-sm">Korban</th>
                    <th className="px-6 py-4 font-bold text-slate-600 text-sm">Infrastruktur</th>
                    <th className="px-6 py-4 font-bold text-slate-600 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                        Tidak ada data yang cocok dengan filter yang dipilih.
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((evt, idx) => (
                      <tr key={evt.id || idx} className="hover:bg-[#8b5a2b]/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{evt.tanggal_kejadian}</div>
                          <div className="text-xs text-slate-500">{evt.waktu_kejadian}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-700">{evt.lokasi_nama}</div>
                          <div className="text-xs text-slate-500">{evt.tipe_longsor} • {evt.kabupaten}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-sm">{evt.faktor_pemicu}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${evt.korban_jiwa > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                            {evt.korban_jiwa > 0 ? <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> : null}
                            {evt.korban_jiwa || 0} Jiwa
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                          {evt.ruas_jalan_terdampak ? (
                            <div className="truncate" title={evt.ruas_jalan_terdampak}>{evt.ruas_jalan_terdampak}</div>
                          ) : '-'}
                          {evt.rumah_rusak_berat > 0 && <div className="text-xs text-orange-500 mt-1">{evt.rumah_rusak_berat} Rumah Rusak</div>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-1.5 text-xs font-bold w-max ${evt.status_penanganan === 'Selesai' ? 'text-green-600' : 'text-orange-500'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${evt.status_penanganan === 'Selesai' ? 'bg-green-500' : 'bg-orange-500'}`}></span> 
                            {evt.status_penanganan || 'Dalam Penanganan'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="px-8 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <p className="text-xs text-slate-500 font-semibold">Menampilkan {filteredEvents.length} kejadian</p>
              <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-400 hover:bg-slate-100">&lt;</button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-[#8b5a2b] text-white">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-400 hover:bg-slate-100">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HistoricalDataSection;
