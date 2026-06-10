/**
 * POLARIS WebGIS — Enhanced MapCanvas Component (5-Layer Analysis)
 * 
 * Komponen peta interaktif FULL ENTERPRISE yang merender 5 layer:
 * 
 * Layer 0 (Base):     CartoDB Dark Matter (OSM)
 * Layer 1 (Hazard):   Zona Kerawanan Longsor (Polygon, 45% opacity, Choropleth)
 * Layer 2 (Impact):   Zona Terisolasi/BlankSpot (Polygon, 60% opacity)
 * Layer 3 (Access):   Jaringan Jalan Lintas (LineString, 100% opacity)
 * Layer 4 (Faskes):   Titik RSUD Rujukan (Point, 100% opacity, Interactive)
 * 
 * FITUR ANALISIS:
 * ✓ Choropleth Hazard Index (warna gradasi 0-100)
 * ✓ Estimasi Populasi Terisolasi (Impact Layer)
 * ✓ Click interaktif untuk detail zona & rute evakuasi
 * ✓ Popup dengan indeks kerawanan & jarak ke faskes terdekat
 * ✓ Real-time style update saat simulasi bencana
 * ✓ Zoom-to-extent untuk semua features
 */

import React, { useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const MAP_CENTER = [-5.3637, 105.2429];
const MAP_ZOOM = 9;

/**
 * Hospital Icon — Normal State (Cyan)
 */
const hospitalIcon = L.divIcon({
  html: `<div style="
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    border: 3px solid #ffffff;
    box-shadow: 0 4px 16px rgba(6, 182, 212, 0.6), 0 0 24px rgba(6, 182, 212, 0.3);
    font-size: 18px;
    cursor: pointer;
  ">🏥</div>`,
  className: 'hospital-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -25],
});

/**
 * Hospital Icon — Danger State (Red, for simulation)
 */
const hospitalIconDanger = L.divIcon({
  html: `<div style="
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border: 3px solid #fecaca;
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.6), 0 0 24px rgba(239, 68, 68, 0.4);
    font-size: 18px;
    cursor: pointer;
    animation: pulse 1.5s ease-in-out infinite;
  ">🏥</div>`,
  className: 'hospital-marker-danger',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -25],
});

/**
 * Kejadian Longsor Icon — Marker segitiga peringatan untuk titik kejadian historis.
 * Warna merah = ada korban jiwa, oranye = ada korban luka, kuning = hanya kerusakan.
 */
function createKejadianIcon(korbanJiwa, korbanLuka) {
  let bgColor, borderColor, shadowColor;
  if (korbanJiwa > 0) {
    bgColor = '#dc2626'; borderColor = '#fecaca'; shadowColor = 'rgba(220,38,38,0.6)';
  } else if (korbanLuka > 0) {
    bgColor = '#ea580c'; borderColor = '#fed7aa'; shadowColor = 'rgba(234,88,12,0.5)';
  } else {
    bgColor = '#eab308'; borderColor = '#fef08a'; shadowColor = 'rgba(234,179,8,0.5)';
  }

  return L.divIcon({
    html: `<div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      transform: rotate(45deg);
      background: ${bgColor};
      border: 2px solid ${borderColor};
      box-shadow: 0 3px 10px ${shadowColor};
      cursor: pointer;
    "><span style="transform: rotate(-45deg); font-size: 13px;">⚠</span></div>`,
    className: 'kejadian-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -18],
  });
}

/**
 * Auto-fit bounds pada peta
 */
function FitBounds({ geodata }) {
  const map = useMap();

  React.useEffect(() => {
    if (!geodata || !geodata.features || geodata.features.length === 0) return;

    try {
      const geoJsonLayer = L.geoJSON(geodata);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
      }
    } catch (err) {
      console.error('FitBounds error:', err);
      map.setView(MAP_CENTER, MAP_ZOOM);
    }
  }, [geodata, map]);

  return null;
}

/**
 * Fungsi untuk menentukan warna Choropleth berdasarkan Hazard Index
 * MENGAPA gradient warna? Visual encoding membuat pattern kerawanan
 * langsung terlihat tanpa perlu membaca angka.
 * 
 * Skala: Hijau (aman) → Kuning (warning) → Merah (kritis)
 */
function getHazardColor(index) {
  if (index >= 85) return { fill: '#dc2626', border: '#991b1b' };      // Kritis
  if (index >= 75) return { fill: '#ea580c', border: '#a16207' };      // Tinggi
  if (index >= 60) return { fill: '#eab308', border: '#854d0e' };      // Sedang
  if (index >= 45) return { fill: '#84cc16', border: '#4f7c1f' };      // Rendah
  return { fill: '#22c55e', border: '#166534' };                        // Sangat Rendah
}

/**
 * Main MapCanvas Component
 */
function MapCanvasEnhanced({ geodata, isSimulating, isLoading, selectedRegion, selectedYear }) {
  // =====================================================================
  // STYLE FUNCTIONS untuk 5 LAYERS
  // =====================================================================

  /**
   * Layer 1: Kerawanan Longsor (Hazard) — Choropleth dinamis
   */
  const getKerawananStyle = useCallback((feature) => {
    const indeks = parseFloat(feature.properties.indeks_kerawanan) || 50;
    const colors = getHazardColor(indeks);

    return {
      color: colors.border,
      weight: 2,
      opacity: 0.8,
      fillColor: colors.fill,
      fillOpacity: 0.45, // 45% opacity sesuai spesifikasi
      dashArray: '3, 3',
      lineCap: 'butt',
    };
  }, []);

  /**
   * Layer 2: Zona Terisolasi (Impact) — BlankSpot population visualization
   */
  const getTerisolasiStyle = useCallback((feature) => {
    // Warna berdasarkan tipe dampak
    const color = feature.properties.tipe_dampak === 'Keterisolasian Total'
      ? '#ef4444'  // Red untuk total isolation
      : '#f97316'; // Orange untuk partial isolation

    return {
      color: color,
      weight: isSimulating ? 3 : 2,
      opacity: 0.85,
      fillColor: color,
      fillOpacity: isSimulating ? 0.60 : 0.45,  // 60% opacity saat simulasi
      dashArray: isSimulating ? '8, 4' : '',
      lineCap: 'round',
      lineJoin: 'round',
    };
  }, [isSimulating]);

  /**
   * Layer 3: Ruas Jalan (Access) — Kritis untuk evakuasi
   */
  const getJalanStyle = useCallback((feature) => {
    if (isSimulating) {
      // Saat simulasi: merah putus-putus (terputus)
      return {
        color: '#ef4444',
        weight: 4,
        opacity: 0.95,
        dashArray: '12, 8',
        dashOffset: '0',
        lineCap: 'round',
        lineJoin: 'round',
      };
    }
    // Normal: hijau solid (operasional)
    return {
      color: '#22c55e',
      weight: 3,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    };
  }, [isSimulating]);

  /**
   * Layer 4: Zona Longsor historis (masih untuk referensi)
   */
  const getLongsorStyle = useCallback((feature) => {
    const bahaya = feature.properties.tingkat_bahaya;

    const colorMap = {
      'Kritis': { fill: '#991b1b', border: '#dc2626' },
      'Tinggi': { fill: '#92400e', border: '#ea580c' },
      'Sedang': { fill: '#713f12', border: '#eab308' },
    };

    const colors = colorMap[bahaya] || colorMap['Sedang'];

    return {
      color: colors.border,
      weight: 2,
      opacity: 0.7,
      fillColor: colors.fill,
      fillOpacity: 0.1,
      dashArray: '5, 5',
    };
  }, []);

  // =====================================================================
  // DATA SEPARATION — Filter features by layerType
  // =====================================================================

  const {
    kerawananData,
    terisolasiData,
    jalanData,
    longsorData,
    faskesFeatures,
    kejadianFeatures,
  } = useMemo(() => {
    if (!geodata || !geodata.features) {
      return {
        kerawananData: null,
        terisolasiData: null,
        jalanData: null,
        longsorData: null,
        faskesFeatures: [],
        kejadianFeatures: [],
      };
    }

    const matchesRegion = (f) => {
      if (!selectedRegion || selectedRegion === 'all') return true;
      const props = f.properties;
      const regionStr = (props.kabupaten || props.nama_zona || props.nama_ruas || '').toLowerCase();
      return regionStr.includes(selectedRegion.toLowerCase());
    };

    const kerawanan = geodata.features.filter((f) => f.properties.layerType === 'kerawanan' && matchesRegion(f));
    const terisolasi = geodata.features.filter((f) => f.properties.layerType === 'terisolasi' && matchesRegion(f));
    const jalan = geodata.features.filter((f) => f.properties.layerType === 'jalan');
    const longsor = geodata.features.filter((f) => f.properties.layerType === 'longsor' && matchesRegion(f));
    const faskes = geodata.features.filter((f) => f.properties.layerType === 'faskes');
    
    let kejadian = geodata.features.filter((f) => f.properties.layerType === 'kejadian');
    if (selectedYear && selectedYear !== 'all') {
      kejadian = kejadian.filter((f) => {
        const tgl = f.properties.tanggal_kejadian;
        if (!tgl) return false;
        return tgl.substring(0, 4) === selectedYear;
      });
    }

    return {
      kerawananData: kerawanan.length > 0 ? { type: 'FeatureCollection', features: kerawanan } : null,
      terisolasiData: terisolasi.length > 0 ? { type: 'FeatureCollection', features: terisolasi } : null,
      jalanData: jalan.length > 0 ? { type: 'FeatureCollection', features: jalan } : null,
      longsorData: longsor.length > 0 ? { type: 'FeatureCollection', features: longsor } : null,
      faskesFeatures: faskes,
      kejadianFeatures: kejadian,
    };
  }, [geodata, selectedRegion, selectedYear]);

  // =====================================================================
  // POPUP GENERATORS
  // =====================================================================

  const onEachKerawanan = useCallback((feature, layer) => {
    const props = feature.properties;
    const indeks = parseFloat(props.indeks_kerawanan) || 0;

    // Kategori berdasarkan indeks
    const kategori =
      indeks >= 85 ? '🔴 KRITIS' :
      indeks >= 75 ? '🟠 TINGGI' :
      indeks >= 60 ? '🟡 SEDANG' :
      indeks >= 45 ? '🟢 RENDAH' :
      '🟢 AMAN';

    layer.bindPopup(`
      <div style="min-width: 280px; font-family: 'Inter', sans-serif; color: #e2e8f0;">
        <div style="font-size: 14px; font-weight: 700; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #334155;">
          📊 ${props.nama_zona}
        </div>
        <div style="display: inline-block; padding: 3px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; background: ${getHazardColor(indeks).fill}33; color: ${getHazardColor(indeks).fill}; border: 1px solid ${getHazardColor(indeks).fill}88; margin-bottom: 10px;">
          ${kategori}
        </div>
        <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Indeks Kerawanan</td>
            <td style="color: #e2e8f0; font-weight: 600; text-align: right;">${indeks.toFixed(1)}/100</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Curah Hujan</td>
            <td style="color: #e2e8f0; font-weight: 600; text-align: right;">${props.faktor_curah_hujan}%</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Kemiringan</td>
            <td style="color: #e2e8f0; font-weight: 600; text-align: right;">${props.faktor_kemiringan}%</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Tanah Labil</td>
            <td style="color: #e2e8f0; font-weight: 600; text-align: right;">${props.faktor_tanah_labil}%</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Deforestasi</td>
            <td style="color: #e2e8f0; font-weight: 600; text-align: right;">${props.faktor_deforestasi}%</td>
          </tr>
        </table>
        ${props.deskripsi ? `<p style="margin-top: 8px; font-size: 11px; color: #94a3b8; line-height: 1.5; border-top: 1px solid #334155; padding-top: 8px;">${props.deskripsi}</p>` : ''}
        <div style="margin-top: 8px; font-size: 10px; color: #64748b; border-top: 1px solid #334155; padding-top: 6px;">
          ✓ Validasi: ${props.validasi_data} (${props.tahun_kalibrasi})
        </div>
      </div>
    `, {
      maxWidth: 380,
      className: 'polaris-popup',
    });
  }, []);

  const onEachTerisolasi = useCallback((feature, layer) => {
    const props = feature.properties;

    layer.bindPopup(`
      <div style="min-width: 300px; font-family: 'Inter', sans-serif; color: #e2e8f0;">
        <div style="font-size: 14px; font-weight: 700; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #334155;">
          ⚠️ ${props.nama_zona}
        </div>
        <div style="display: inline-block; padding: 3px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; background: #ef444433; color: #ef4444; border: 1px solid #ef444488; margin-bottom: 10px;">
          🔴 KETERISOLASIAN
        </div>
        <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Populasi Terisolasi</td>
            <td style="color: #e2e8f0; font-weight: 600; text-align: right;">${Number(props.estimasi_populasi).toLocaleString('id-ID')} jiwa</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Durasi Isolasi</td>
            <td style="color: #e2e8f0; font-weight: 600; text-align: right;">${props.durasi_isolasi_hari} hari</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Ruas Jalan Putus</td>
            <td style="color: #e2e8f0; font-weight: 600; text-align: right;">${props.ruas_jalan_terputus}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Faskes Terdekat</td>
            <td style="color: #e2e8f0; font-weight: 600; text-align: right;">${props.fasilitas_kesehatan_terdekat}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Jarak ke Faskes</td>
            <td style="color: #e2e8f0; font-weight: 600; text-align: right;">${props.jarak_ke_faskes_km} km</td>
          </tr>
        </table>
        ${props.deskripsi ? `<p style="margin-top: 10px; font-size: 11px; color: #fca5a5; line-height: 1.6; background: #7f1d1d33; border-left: 3px solid #dc2626; padding: 8px; border-radius: 4px;">${props.deskripsi}</p>` : ''}
      </div>
    `, {
      maxWidth: 400,
      className: 'polaris-popup',
    });
  }, []);

  const onEachJalan = useCallback((feature, layer) => {
    const props = feature.properties;
    const statusLabel = isSimulating
      ? '<span style="color: #ef4444; font-weight: 700;">⚠️ TERPUTUS</span>'
      : '<span style="color: #22c55e; font-weight: 700;">✅ Operasional</span>';

    layer.bindPopup(`
      <div style="min-width: 240px; font-family: 'Inter', sans-serif; color: #e2e8f0;">
        <div style="font-size: 14px; font-weight: 700; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #334155;">
          🛣️ ${props.nama_ruas}
        </div>
        <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Panjang</td>
            <td style="color: #e2e8f0; font-weight: 600; text-align: right;">${props.panjang_km} km</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Kelas</td>
            <td style="color: #e2e8f0; font-weight: 600; text-align: right;">${props.kelas_jalan}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Populasi</td>
            <td style="color: #e2e8f0; font-weight: 600; text-align: right;">${Number(props.populasi_terdampak).toLocaleString('id-ID')} jiwa</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Status</td>
            <td style="text-align: right;">${statusLabel}</td>
          </tr>
        </table>
      </div>
    `, {
      maxWidth: 320,
      className: 'polaris-popup',
    });
  }, [isSimulating]);

  // =====================================================================
  // LOADING STATE
  // =====================================================================

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-slate-950">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-cyan-500/30 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-cyan-500/50 flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400" style={{ animation: 'spin 2s linear infinite' }}></div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-cyan-400 tracking-wider uppercase">Memuat Analisis Spasial</p>
          <p className="text-xs text-slate-500 mt-1">Querying 5 layers dari PostGIS...</p>
        </div>
      </div>
    );
  }

  // =====================================================================
  // MAP RENDER — 5 LAYER STACK
  // =====================================================================

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      scrollWheelZoom={true}
      style={{ width: '100%', height: '100%' }}
      id="map-container"
    >
      {/* Layer 0: OSM Basemap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {/* Auto-fit bounds based on filtered features */}
      <FitBounds geodata={{
        type: 'FeatureCollection',
        features: [
          ...(kerawananData ? kerawananData.features : []),
          ...(terisolasiData ? terisolasiData.features : []),
          ...(longsorData ? longsorData.features : []),
          ...(kejadianFeatures || [])
        ]
      }} />

      {/* Layer 1: Kerawanan Longsor (Hazard) — Choropleth */}
      {kerawananData && (
        <GeoJSON
          key={`kerawanan-${isSimulating ? 'sim' : 'normal'}`}
          data={kerawananData}
          style={getKerawananStyle}
          onEachFeature={onEachKerawanan}
        />
      )}

      {/* Layer 2: Zona Terisolasi (Impact) — BlankSpot */}
      {terisolasiData && (
        <GeoJSON
          key={`terisolasi-${isSimulating ? 'sim' : 'normal'}`}
          data={terisolasiData}
          style={getTerisolasiStyle}
          onEachFeature={onEachTerisolasi}
        />
      )}

      {/* Layer 3: Jalan Lintas (Access) */}
      {jalanData && (
        <GeoJSON
          key={`jalan-${isSimulating ? 'sim' : 'normal'}`}
          data={jalanData}
          style={getJalanStyle}
          onEachFeature={onEachJalan}
        />
      )}

      {/* Layer 4: Faskes (Healthcare Facilities) */}
      {faskesFeatures.map((feature) => (
        <Marker
          key={`faskes-${feature.properties.id}`}
          position={[
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0],
          ]}
          icon={isSimulating ? hospitalIconDanger : hospitalIcon}
        >
                    <Popup>
            <div style={{ minWidth: "220px", fontFamily: "'Inter', sans-serif", color: "#e2e8f0" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
                🏥 {feature.properties.nama_faskes}
              </div>
              <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ color: "#94a3b8", padding: "3px 0" }}>Tipe</td>
                    <td style={{ color: "#e2e8f0", fontWeight: 600, textAlign: "right" }}>{feature.properties.tipe}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#94a3b8", padding: "3px 0" }}>Kapasitas</td>
                    <td style={{ color: "#e2e8f0", fontWeight: 600, textAlign: "right" }}>{feature.properties.kapasitas_bed} bed</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#94a3b8", padding: "3px 0" }}>Status</td>
                    <td style={{ color: feature.properties.status_operasional === 'Aktif' ? '#22c55e' : '#ef4444', fontWeight: 600, textAlign: "right" }}>
                      {feature.properties.status_operasional === 'Aktif' ? '✅' : '❌'} {feature.properties.status_operasional}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p style={{ marginTop: "8px", fontSize: "10px", color: "#94a3b8", lineHeight: 1.4 }}>
                📍 {feature.properties.alamat}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Layer 5: Kejadian Longsor Historis (Events) */}
      {kejadianFeatures.map((feature) => {
        const p = feature.properties;
        const tanggal = p.tanggal_kejadian ? new Date(p.tanggal_kejadian).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
        const waktu = p.waktu_kejadian ? p.waktu_kejadian.substring(0, 5) + ' WIB' : '';
        const severityColor = p.korban_jiwa > 0 ? '#ef4444' : p.korban_luka > 0 ? '#f97316' : '#eab308';
        const severityLabel = p.korban_jiwa > 0 ? 'FATAL' : p.korban_luka > 0 ? 'CEDERA' : 'KERUSAKAN';

        return (
          <Marker
            key={`kejadian-${p.id}`}
            position={[
              feature.geometry.coordinates[1],
              feature.geometry.coordinates[0],
            ]}
            icon={createKejadianIcon(p.korban_jiwa, p.korban_luka)}
          >
            <Popup>
              <div style={{ minWidth: '300px', fontFamily: "'Inter', sans-serif", color: '#e2e8f0' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px', paddingBottom: '6px', borderBottom: '1px solid #334155' }}>
                  ⚠️ Kejadian Longsor
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                  📅 {tanggal} {waktu && `• 🕐 ${waktu}`}
                </div>
                <div style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '9999px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', background: `${severityColor}33`, color: severityColor, border: `1px solid ${severityColor}88`, marginBottom: '8px' }}>
                  {severityLabel}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: '#e2e8f0' }}>
                  📍 {p.lokasi_nama}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>
                  Kec. {p.kecamatan}, {p.kabupaten} • {p.tipe_longsor}
                </div>
                <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ color: '#94a3b8', padding: '3px 0' }}>Korban Jiwa</td>
                      <td style={{ color: p.korban_jiwa > 0 ? '#ef4444' : '#22c55e', fontWeight: 600, textAlign: 'right' }}>{p.korban_jiwa} orang</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#94a3b8', padding: '3px 0' }}>Korban Luka</td>
                      <td style={{ color: '#e2e8f0', fontWeight: 600, textAlign: 'right' }}>{p.korban_luka} orang</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#94a3b8', padding: '3px 0' }}>Pengungsi</td>
                      <td style={{ color: '#e2e8f0', fontWeight: 600, textAlign: 'right' }}>{Number(p.pengungsi).toLocaleString('id-ID')} jiwa</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#94a3b8', padding: '3px 0' }}>Rumah Rusak</td>
                      <td style={{ color: '#e2e8f0', fontWeight: 600, textAlign: 'right' }}>{p.rumah_rusak_berat} berat, {p.rumah_rusak_ringan} ringan</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#94a3b8', padding: '3px 0' }}>Volume Material</td>
                      <td style={{ color: '#e2e8f0', fontWeight: 600, textAlign: 'right' }}>{Number(p.volume_material_m3).toLocaleString('id-ID')} m³</td>
                    </tr>
                    {p.ruas_jalan_terdampak && <tr>
                      <td style={{ color: '#94a3b8', padding: '3px 0' }}>Jalan Putus</td>
                      <td style={{ color: '#fca5a5', fontWeight: 600, textAlign: 'right' }}>{p.panjang_jalan_putus_m}m</td>
                    </tr>}
                    <tr>
                      <td style={{ color: '#94a3b8', padding: '3px 0' }}>Pemicu</td>
                      <td style={{ color: '#e2e8f0', fontWeight: 600, textAlign: 'right' }}>{p.faktor_pemicu}</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#94a3b8', padding: '3px 0' }}>Curah Hujan</td>
                      <td style={{ color: '#e2e8f0', fontWeight: 600, textAlign: 'right' }}>{p.curah_hujan_mm} mm ({p.durasi_hujan_jam} jam)</td>
                    </tr>
                  </tbody>
                </table>
                {p.deskripsi && <p style={{ marginTop: '8px', fontSize: '10px', color: '#94a3b8', lineHeight: 1.5, borderTop: '1px solid #334155', paddingTop: '6px' }}>{p.deskripsi}</p>}
                <div style={{ marginTop: '6px', fontSize: '9px', color: '#64748b', borderTop: '1px solid #334155', paddingTop: '4px' }}>
                  📋 {p.sumber_data} • Status: {p.status_penanganan}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapCanvasEnhanced;

