/**
 * POLARIS WebGIS — MapCanvas Component
 * 
 * Komponen peta interaktif menggunakan react-leaflet yang merender:
 * 1. Basemap OpenStreetMap sebagai layer dasar
 * 2. GeoJSON layer untuk ruas_jalan (LineString) — hijau/merah putus-putus
 * 3. GeoJSON layer untuk zona_longsor (Polygon) — merah semi-transparan
 * 4. GeoJSON layer untuk fasilitas_kesehatan (Point) — marker custom
 * 
 * MENGAPA react-leaflet (bukan Mapbox/Google Maps)?
 * - Open source, tidak memerlukan API key
 * - Dukungan GeoJSON native yang sangat baik
 * - Integrasi React via deklaratif JSX (<MapContainer>, <GeoJSON>)
 * - Ringan dan cocok untuk visualisasi data PostGIS
 * 
 * MENGAPA key={} pada <GeoJSON>?
 * React-leaflet <GeoJSON> tidak reactive terhadap perubahan props style.
 * Dengan mengubah key saat isSimulating berubah, React akan unmount dan
 * remount komponen GeoJSON, memaksa re-render dengan style baru.
 * 
 * @param {Object} geodata - GeoJSON FeatureCollection dari backend
 * @param {boolean} isSimulating - Status simulasi longsor
 * @param {boolean} isLoading - Status loading data
 */

import React, { useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * Koordinat pusat peta — Universitas Lampung / Sumatera Selatan.
 * SRID 4326 (WGS84): [latitude, longitude]
 */
const MAP_CENTER = [-5.3637, 105.2429];
const MAP_ZOOM = 9;

/**
 * Custom icon untuk fasilitas kesehatan menggunakan DivIcon.
 * MENGAPA DivIcon bukan L.icon()?
 * DivIcon menggunakan HTML/CSS sehingga kita bisa menggunakan emoji
 * tanpa perlu file gambar eksternal. Ini menghindari masalah path
 * icon yang sering terjadi di Docker/Nginx deployment.
 */
const hospitalIcon = L.divIcon({
  html: `<div style="
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    border: 3px solid #ffffff;
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.2);
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.2s ease;
  ">🏥</div>`,
  className: 'hospital-marker',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
});

/**
 * Custom icon untuk fasilitas kesehatan saat simulasi aktif.
 * Warna berubah menjadi merah untuk menandakan potensi isolasi.
 */
const hospitalIconDanger = L.divIcon({
  html: `<div style="
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border: 3px solid #fecaca;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3);
    font-size: 16px;
    cursor: pointer;
    animation: pulse 2s infinite;
  ">🏥</div>`,
  className: 'hospital-marker-danger',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
});

/**
 * Komponen untuk auto-fit bounds peta ke data GeoJSON.
 * MENGAPA useMap()? react-leaflet menyediakan hook useMap() untuk
 * mengakses instance Leaflet Map secara imperatif. Kita gunakan ini
 * untuk fitBounds setelah data dimuat, memastikan semua features terlihat.
 */
function FitBounds({ geodata }) {
  const map = useMap();

  React.useEffect(() => {
    if (!geodata || !geodata.features || geodata.features.length === 0) return;

    try {
      const geoJsonLayer = L.geoJSON(geodata);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
      }
    } catch (err) {
      // Fallback ke center default jika bounds invalid
      map.setView(MAP_CENTER, MAP_ZOOM);
    }
  }, [geodata, map]);

  return null;
}

function MapCanvas({ geodata, isSimulating, isLoading }) {
  // =====================================================================
  // STYLE FUNCTIONS
  // Setiap tipe layer memiliki style function yang menentukan tampilan
  // visual pada peta berdasarkan properties dan status simulasi.
  // =====================================================================

  /**
   * Style untuk layer Jalan (LineString).
   * MENGAPA dynamic style? Saat simulasi aktif, jalan berubah dari
   * hijau solid menjadi merah putus-putus untuk menggambarkan ruas
   * jalan yang terdampak longsor dan berpotensi terputus.
   */
  const getJalanStyle = useCallback((feature) => {
    if (isSimulating) {
      return {
        color: '#ef4444',
        weight: 4,
        opacity: 0.9,
        dashArray: '12, 8',
        dashOffset: '0',
        lineCap: 'round',
        lineJoin: 'round',
      };
    }
    return {
      color: '#22c55e',
      weight: 3,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round',
    };
  }, [isSimulating]);

  /**
   * Style untuk layer Zona Longsor (Polygon).
   * MENGAPA semi-transparan? Area longsor ditampilkan dengan fill
   * semi-transparan agar basemap dan feature lain di bawahnya tetap
   * terlihat. Border lebih tebal saat simulasi untuk emphasis.
   */
  const getLongsorStyle = useCallback((feature) => {
    const bahaya = feature.properties.tingkat_bahaya;
    
    // Warna berubah berdasarkan tingkat bahaya
    const colorMap = {
      'Kritis': { fill: '#dc2626', border: '#ef4444' },
      'Tinggi': { fill: '#ea580c', border: '#f97316' },
      'Sedang': { fill: '#eab308', border: '#facc15' },
    };

    const colors = colorMap[bahaya] || colorMap['Sedang'];
    
    return {
      color: colors.border,
      weight: isSimulating ? 3 : 2,
      opacity: isSimulating ? 0.95 : 0.7,
      fillColor: colors.fill,
      fillOpacity: isSimulating ? 0.35 : 0.15,
      dashArray: isSimulating ? '' : '5, 5',
    };
  }, [isSimulating]);

  // =====================================================================
  // DATA SEPARATION
  // Memisahkan features berdasarkan layerType untuk rendering terpisah.
  // MENGAPA terpisah? Setiap tipe layer membutuhkan style function,
  // popup template, dan behavior yang berbeda.
  // =====================================================================

  const { jalanData, longsorData, faskesData } = useMemo(() => {
    if (!geodata || !geodata.features) {
      return { jalanData: null, longsorData: null, faskesData: null };
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
      jalanData: jalanFeatures.length > 0
        ? { type: 'FeatureCollection', features: jalanFeatures }
        : null,
      longsorData: longsorFeatures.length > 0
        ? { type: 'FeatureCollection', features: longsorFeatures }
        : null,
      faskesData: faskesFeatures,
    };
  }, [geodata]);

  // =====================================================================
  // POPUP GENERATORS
  // Setiap feature type memiliki popup template yang menampilkan 
  // informasi detail saat diklik.
  // =====================================================================

  /**
   * Popup untuk ruas jalan — menampilkan nama, panjang, kelas, dan
   * status dampak saat simulasi aktif.
   * 
   * MENGAPA onEachFeature? react-leaflet <GeoJSON> menggunakan callback
   * onEachFeature untuk menambahkan interaktivitas (popup, tooltip, dll.)
   * pada setiap feature individual.
   */
  const onEachJalan = useCallback((feature, layer) => {
    const props = feature.properties;
    const statusLabel = isSimulating
      ? '<span style="color: #ef4444; font-weight: 700;">⚠️ TERDAMPAK LONGSOR</span>'
      : '<span style="color: #22c55e; font-weight: 700;">✅ Operasional Normal</span>';

    layer.bindPopup(`
      <div style="min-width: 220px; font-family: 'Inter', sans-serif;">
        <div style="font-size: 14px; font-weight: 700; color: #e2e8f0; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #334155;">
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
      maxWidth: 300,
      className: 'polaris-popup',
    });
  }, [isSimulating]);

  /**
   * Popup untuk zona longsor — menampilkan tingkat bahaya, luas,
   * estimasi populasi terdampak, dan deskripsi detail.
   */
  const onEachLongsor = useCallback((feature, layer) => {
    const props = feature.properties;
    
    const bahayaColor = {
      'Kritis': '#dc2626',
      'Tinggi': '#ea580c',
      'Sedang': '#eab308',
    };
    const color = bahayaColor[props.tingkat_bahaya] || '#eab308';

    layer.bindPopup(`
      <div style="min-width: 240px; font-family: 'Inter', sans-serif;">
        <div style="font-size: 14px; font-weight: 700; color: #e2e8f0; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #334155;">
          ⚠️ ${props.nama_zona}
        </div>
        <div style="display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; background: ${color}22; color: ${color}; border: 1px solid ${color}55; margin-bottom: 10px;">
          ${props.tingkat_bahaya}
        </div>
        <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Luas Area</td>
            <td style="color: #e2e8f0; font-weight: 600; text-align: right;">${Number(props.luas_ha).toLocaleString('id-ID')} ha</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 4px 0;">Est. Populasi</td>
            <td style="color: #e2e8f0; font-weight: 600; text-align: right;">${Number(props.estimasi_populasi).toLocaleString('id-ID')} jiwa</td>
          </tr>
        </table>
        ${props.deskripsi ? `<p style="margin-top: 10px; font-size: 11px; color: #94a3b8; line-height: 1.5; border-top: 1px solid #334155; padding-top: 8px;">${props.deskripsi}</p>` : ''}
      </div>
    `, {
      maxWidth: 350,
      className: 'polaris-popup',
    });
  }, []);

  // =====================================================================
  // LOADING STATE
  // Tampilkan overlay skeleton saat data sedang dimuat.
  // =====================================================================

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-slate-900">
        <div className="relative">
          {/* Animated radar scan effect */}
          <div className="w-20 h-20 rounded-full border-2 border-cyan-500/30 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-cyan-500/50 flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
            </div>
          </div>
          {/* Scanning line animation */}
          <div 
            className="absolute inset-0 rounded-full border-t-2 border-cyan-400"
            style={{ animation: 'spin 2s linear infinite' }}
          ></div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-cyan-400 tracking-wider uppercase">
            Memuat Data Geospasial
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Mengambil data dari PostGIS database...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================================
  // MAP RENDER
  // =====================================================================

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      scrollWheelZoom={true}
      zoomControl={true}
      attributionControl={true}
      style={{ width: '100%', height: '100%' }}
      id="map-container"
    >
      {/* ================================================================
       * BASEMAP LAYER — OpenStreetMap Tile Layer
       * MENGAPA OpenStreetMap? Gratis, open-source, dan memiliki 
       * cakupan detail yang sangat baik untuk wilayah Indonesia.
       * ================================================================ */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {/* ================================================================
       * AUTO-FIT BOUNDS
       * Menyesuaikan viewport peta agar seluruh data terlihat.
       * ================================================================ */}
      {geodata && <FitBounds geodata={geodata} />}

      {/* ================================================================
       * LAYER 1: Zona Longsor (Polygon) — dirender PERTAMA (paling bawah)
       * MENGAPA pertama? Polygon besar harus di-render di bawah agar
       * tidak menutupi LineString jalan dan Point faskes di atasnya.
       * 
       * key berubah saat isSimulating toggle → forces re-render
       * ================================================================ */}
      {longsorData && (
        <GeoJSON
          key={`longsor-${isSimulating ? 'sim' : 'normal'}`}
          data={longsorData}
          style={getLongsorStyle}
          onEachFeature={onEachLongsor}
        />
      )}

      {/* ================================================================
       * LAYER 2: Ruas Jalan (LineString)
       * Hijau solid saat normal, merah putus-putus saat simulasi.
       * ================================================================ */}
      {jalanData && (
        <GeoJSON
          key={`jalan-${isSimulating ? 'sim' : 'normal'}`}
          data={jalanData}
          style={getJalanStyle}
          onEachFeature={onEachJalan}
        />
      )}

      {/* ================================================================
       * LAYER 3: Fasilitas Kesehatan (Point) — dirender TERAKHIR (paling atas)
       * Menggunakan <Marker> individual (bukan <GeoJSON>) untuk kontrol
       * penuh atas custom icon yang berubah saat simulasi.
       * 
       * MENGAPA Marker terpisah? <GeoJSON> dengan Point tidak mendukung
       * custom DivIcon secara declaratif di react-leaflet. Dengan
       * Marker individual, kita bisa switch icon berdasarkan state.
       * ================================================================ */}
      {faskesData && faskesData.map((feature) => {
        const coords = feature.geometry.coordinates;
        const props = feature.properties;

        /**
         * Tentukan status isolasi saat simulasi.
         * RS/Puskesmas di area pedalaman (kapasitas kecil) dianggap 
         * terisolasi saat simulasi longsor aktif.
         */
        const isIsolated = isSimulating && props.kapasitas_bed < 200;
        const statusText = isIsolated 
          ? '🔴 TERISOLASI — Akses jalan terputus'
          : '🟢 Akses operasional normal';

        return (
          <Marker
            key={`faskes-${props.id}-${isSimulating ? 'sim' : 'normal'}`}
            position={[coords[1], coords[0]]}
            icon={isIsolated ? hospitalIconDanger : hospitalIcon}
          >
            <Popup maxWidth={300} className="polaris-popup">
              <div style={{ minWidth: '220px', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: 700, 
                  color: '#e2e8f0', 
                  marginBottom: '10px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #334155',
                }}>
                  🏥 {props.nama_faskes}
                </div>
                <div style={{
                  display: 'inline-block',
                  padding: '2px 10px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: isIsolated ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
                  color: isIsolated ? '#ef4444' : '#22c55e',
                  border: `1px solid ${isIsolated ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
                  marginBottom: '10px',
                }}>
                  {isIsolated ? 'TERISOLASI' : 'OPERASIONAL'}
                </div>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ color: '#94a3b8', padding: '4px 0' }}>Tipe</td>
                      <td style={{ color: '#e2e8f0', fontWeight: 600, textAlign: 'right' }}>{props.tipe}</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#94a3b8', padding: '4px 0' }}>Kapasitas</td>
                      <td style={{ color: '#e2e8f0', fontWeight: 600, textAlign: 'right' }}>{props.kapasitas_bed} bed</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#94a3b8', padding: '4px 0' }}>Status</td>
                      <td style={{ color: '#e2e8f0', fontWeight: 600, textAlign: 'right' }}>{props.status_operasional}</td>
                    </tr>
                  </tbody>
                </table>
                {props.alamat && (
                  <p style={{ 
                    marginTop: '10px', 
                    fontSize: '11px', 
                    color: '#94a3b8', 
                    lineHeight: 1.5,
                    borderTop: '1px solid #334155',
                    paddingTop: '8px',
                  }}>
                    📍 {props.alamat}
                  </p>
                )}
                <p style={{ 
                  marginTop: '8px', 
                  fontSize: '11px', 
                  fontWeight: 600,
                  color: isIsolated ? '#ef4444' : '#22c55e',
                }}>
                  {statusText}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* ================================================================
       * SIMULATION OVERLAY INDICATOR
       * Badge overlay di pojok atas peta yang menunjukkan status simulasi.
       * ================================================================ */}
      {isSimulating && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '9999px',
            background: 'rgba(127, 29, 29, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ef4444',
              animation: 'live-pulse 1.5s ease-in-out infinite',
            }}
          ></span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#fecaca',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            ⚠️ Simulasi Longsor Aktif
          </span>
        </div>
      )}
    </MapContainer>
  );
}

export default MapCanvas;
