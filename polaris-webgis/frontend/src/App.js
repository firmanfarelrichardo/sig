/**
 * POLARIS WebGIS — Main Application Component
 * 
 * Komponen root yang mengatur layout 3 kolom "Executive Dashboard":
 * [SidebarControl | MapCanvas | StatsPanel]
 * 
 * MENGAPA state diangkat ke App.js?
 * State simulasi dan geodata perlu diakses oleh ketiga child components.
 * Dengan mengangkat state ke parent (App), kita menghindari prop drilling 
 * yang dalam dan menjaga single source of truth.
 * 
 * Flow data:
 * 1. App fetch /api/geodata saat mount → simpan di state geodata
 * 2. User klik "SIMULASI LONGSOR" di Sidebar → toggle isSimulating
 * 3. MapCanvas menerima isSimulating → ubah style jalan
 * 4. StatsPanel menerima isSimulating → ubah statistik display
 */

import React, { useState, useEffect, useCallback } from 'react';
import SidebarControl from './components/SidebarControl';
import MapCanvas from './components/MapCanvas';
import StatsPanel from './components/StatsPanel';

/**
 * URL API Backend — diinjeksi saat Docker build via REACT_APP_API_URL.
 * Fallback ke localhost:5000 untuk development lokal.
 */
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  // =======================================================================
  // STATE MANAGEMENT
  // =======================================================================
  
  /**
   * geodata: GeoJSON FeatureCollection dari backend PostGIS
   * MENGAPA null sebagai initial? Membedakan "belum dimuat" (null) dari 
   * "dimuat tapi kosong" ({ features: [] }) untuk rendering skeleton.
   */
  const [geodata, setGeodata] = useState(null);
  
  /**
   * isSimulating: Toggle status simulasi longsor
   * Ketika true:
   * - Jalan berubah dari hijau menjadi merah putus-putus
   * - Panel statistik menampilkan data dampak bencana
   * - Indikator "SIMULASI AKTIF" muncul di header
   */
  const [isSimulating, setIsSimulating] = useState(false);
  
  /**
   * selectedRegion: Filter wilayah yang dipilih dari dropdown
   * 'all' = tampilkan seluruh wilayah
   */
  const [selectedRegion, setSelectedRegion] = useState('all');
  
  /**
   * isLoading: Status loading saat fetching data dari API
   */
  const [isLoading, setIsLoading] = useState(true);
  
  /**
   * error: Pesan error jika fetching gagal
   */
  const [error, setError] = useState(null);

  // =======================================================================
  // DATA FETCHING
  // =======================================================================
  
  /**
   * Fetch data geospasial dari backend API.
   * 
   * MENGAPA useCallback? Mencegah re-creation function di setiap render,
   * yang bisa menyebabkan infinite loop jika digunakan di useEffect deps.
   * 
   * MENGAPA try-catch-finally? Memastikan loading state selalu di-reset 
   * bahkan jika request gagal, menghindari stuck loading indicator.
   */
  const fetchGeodata = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/geodata`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Gagal mengambil data geospasial`);
      }
      
      const data = await response.json();
      
      // Validasi bahwa response adalah GeoJSON FeatureCollection yang valid
      if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
        throw new Error('Format response bukan GeoJSON FeatureCollection yang valid');
      }
      
      setGeodata(data);
    } catch (err) {
      console.error('[App] Fetch error:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch data saat komponen pertama kali dimount.
   * Array kosong [] berarti effect ini hanya berjalan sekali.
   */
  useEffect(() => {
    fetchGeodata();
  }, [fetchGeodata]);

  // =======================================================================
  // EVENT HANDLERS
  // =======================================================================
  
  /**
   * Toggle simulasi longsor ON/OFF.
   * Callback ini diteruskan ke SidebarControl sebagai prop.
   */
  const handleToggleSimulation = useCallback(() => {
    setIsSimulating((prev) => !prev);
  }, []);

  /**
   * Handler perubahan filter wilayah dari dropdown.
   * Menerima value dari select element.
   */
  const handleRegionChange = useCallback((regionValue) => {
    setSelectedRegion(regionValue);
  }, []);

  // =======================================================================
  // COMPUTED VALUES
  // Menghitung statistik dari geodata untuk panel StatsPanel
  // =======================================================================
  
  /**
   * Memfilter features berdasarkan region yang dipilih.
   * MENGAPA computed? Lebih efisien daripada menyimpan filtered data 
   * di state terpisah (menghindari state synchronization bugs).
   */
  const filteredGeodata = React.useMemo(() => {
    if (!geodata || selectedRegion === 'all') return geodata;

    return {
      ...geodata,
      features: geodata.features.filter((feature) => {
        const props = feature.properties;
        const searchField = props.nama_ruas || props.nama_zona || props.nama_faskes || '';
        return searchField.toLowerCase().includes(selectedRegion.toLowerCase());
      }),
    };
  }, [geodata, selectedRegion]);

  /**
   * Menghitung ringkasan statistik dari geodata.
   * Data ini dikirim ke StatsPanel untuk ditampilkan.
   */
  const stats = React.useMemo(() => {
    if (!geodata) {
      return {
        totalJalan: 0,
        totalZonaLongsor: 0,
        totalFaskes: 0,
        totalPopulasiTerdampak: 0,
        totalKapasitasBed: 0,
        zonaKritis: 0,
        jalanData: [],
        longsorData: [],
        faskesData: [],
      };
    }

    const jalanFeatures = geodata.features.filter(
      (f) => f.properties.layerType === 'jalan'
    );
    const longsorFeatures = geodata.features.filter(
      (f) => f.properties.layerType === 'longsor'
    );
    const faskesFeatures = geodata.features.filter(
      (f) => f.properties.layerType === 'faskes'
    );

    return {
      totalJalan: jalanFeatures.length,
      totalZonaLongsor: longsorFeatures.length,
      totalFaskes: faskesFeatures.length,
      totalPopulasiTerdampak: longsorFeatures.reduce(
        (sum, f) => sum + (f.properties.estimasi_populasi || 0), 0
      ),
      totalKapasitasBed: faskesFeatures.reduce(
        (sum, f) => sum + (f.properties.kapasitas_bed || 0), 0
      ),
      zonaKritis: longsorFeatures.filter(
        (f) => f.properties.tingkat_bahaya === 'Kritis' || 
               f.properties.tingkat_bahaya === 'Tinggi'
      ).length,
      jalanData: jalanFeatures.map((f) => f.properties),
      longsorData: longsorFeatures.map((f) => f.properties),
      faskesData: faskesFeatures.map((f) => f.properties),
    };
  }, [geodata]);

  // =======================================================================
  // RENDER
  // =======================================================================
  
  /**
   * Mendapatkan timestamp untuk display di header.
   * Format Indonesia: dd/mm/yyyy HH:MM WIB
   */
  const currentTime = new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="polaris-layout">
      {/* ================================================================
       * HEADER — Full-width navigation bar
       * Menampilkan branding, status simulasi, dan timestamp.
       * ================================================================ */}
      <header className="polaris-header" id="polaris-header">
        <div className="flex items-center gap-3">
          {/* Logo/Icon */}
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <span className="text-white text-lg" role="img" aria-label="Globe icon">🌍</span>
          </div>
          
          {/* Brand name */}
          <div>
            <h1 className="text-base font-bold tracking-wide text-white leading-none">
              POLARIS
            </h1>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase leading-none mt-0.5">
              Pemetaan Operasional Longsor
            </p>
          </div>
        </div>

        {/* Center — Simulation Status Indicator */}
        <div className="flex items-center gap-3">
          {isSimulating ? (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 animate-pulse">
              <span className="live-dot live-dot--danger"></span>
              <span className="text-xs font-semibold text-red-400 tracking-wider uppercase">
                Simulasi Aktif
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="live-dot"></span>
              <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                Monitoring Normal
              </span>
            </div>
          )}
        </div>

        {/* Right — Timestamp */}
        <div className="text-right">
          <p className="text-xs text-slate-400">Terakhir diperbarui</p>
          <p className="text-sm font-mono font-medium text-slate-200">
            {currentTime} WIB
          </p>
        </div>
      </header>

      {/* ================================================================
       * LEFT COLUMN — Sidebar Control Panel
       * Filter wilayah dan tombol simulasi longsor.
       * ================================================================ */}
      <aside className="polaris-sidebar" id="polaris-sidebar">
        <SidebarControl
          isSimulating={isSimulating}
          onToggleSimulation={handleToggleSimulation}
          selectedRegion={selectedRegion}
          onRegionChange={handleRegionChange}
          stats={stats}
          isLoading={isLoading}
        />
      </aside>

      {/* ================================================================
       * CENTER — Interactive Map Canvas
       * Peta Leaflet dengan layer GeoJSON dari PostGIS.
       * ================================================================ */}
      <main className="polaris-map" id="polaris-map">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
            <div className="text-5xl">⚠️</div>
            <h2 className="text-lg font-semibold text-red-400">
              Gagal Memuat Data Geospasial
            </h2>
            <p className="text-sm text-slate-400 text-center max-w-md">
              {error}
            </p>
            <button
              onClick={fetchGeodata}
              className="px-6 py-2 mt-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 transition-colors"
              id="retry-button"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <MapCanvas
            geodata={filteredGeodata}
            isSimulating={isSimulating}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* ================================================================
       * RIGHT COLUMN — Statistics Panel
       * Menampilkan data statistik yang bereaksi terhadap simulasi.
       * ================================================================ */}
      <aside className="polaris-stats" id="polaris-stats">
        <StatsPanel
          stats={stats}
          isSimulating={isSimulating}
          isLoading={isLoading}
          geodata={geodata}
        />
      </aside>
    </div>
  );
}

export default App;
