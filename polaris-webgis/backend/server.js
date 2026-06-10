/**
 * POLARIS WebGIS — Express.js API Server
 * 
 * Server REST API yang menghubungkan frontend React/Leaflet dengan database 
 * PostGIS. Menyediakan endpoint GeoJSON untuk visualisasi peta.
 * 
 * MENGAPA Express.js?
 * Framework minimalis yang memberikan kontrol penuh atas routing dan 
 * middleware, ideal untuk API geospasial yang membutuhkan response 
 * cepat tanpa overhead framework berat.
 * 
 * Arsitektur:
 * [React Frontend] → HTTP GET → [Express API] → SQL Query → [PostGIS DB]
 *                  ← GeoJSON  ←               ← Geometry  ←
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { pool, testConnection } = require('./config/db');

const app = express();
const PORT = parseInt(process.env.API_PORT, 10) || 5000;

// ==========================================================================
// MIDDLEWARE STACK
// ==========================================================================

/**
 * Helmet: Mengatur security headers secara otomatis.
 * 
 * MENGAPA Helmet?
 * Helmet mengkonfigurasi 11+ HTTP security headers sekaligus, termasuk:
 * - X-Content-Type-Options: nosniff (mencegah MIME sniffing)
 * - X-Frame-Options: DENY (mencegah clickjacking)
 * - Strict-Transport-Security (enforce HTTPS)
 * - Content-Security-Policy (membatasi sumber resource)
 * 
 * CSP dikonfigurasi untuk mengizinkan tile OSM dan resources yang 
 * diperlukan oleh Leaflet.
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: [
        "'self'",
        "data:",
        "https://*.tile.openstreetmap.org",
        "https://*.openstreetmap.org"
      ],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  // X-Frame-Options mencegah embedding dalam iframe (clickjacking prevention)
  frameguard: { action: 'deny' },
  // Mencegah browser menebak MIME type (MIME sniffing attack)
  noSniff: true,
  // TODO(security): Aktifkan HSTS di production dengan HTTPS
}));

/**
 * CORS Configuration — Whitelist Origin
 * 
 * MENGAPA bukan wildcard (*)?
 * Wildcard CORS mengizinkan SEMUA origin mengakses API, membuka 
 * potensi CSRF dan data exfiltration. Whitelist memastikan hanya 
 * frontend POLARIS yang bisa mengakses endpoint ini.
 */
const corsOriginStr = process.env.CORS_ORIGIN || 'http://localhost:3000';
const allowedOrigins = corsOriginStr.split(',').map(o => o.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Izinkan request tanpa origin (e.g., curl, server-to-server)
    // dalam development mode
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Jika production, require origin
    if (!origin && process.env.NODE_ENV === 'production') {
      return callback(new Error('Origin required in production'));
    }
    
    // Check apakah origin ada di whitelist
    if (allowedOrigins.some(allowed => {
      if (allowed === '*') return true;
      if (allowed === origin) return true;
      // Support wildcard pattern (e.g., http://*.localhost:3000)
      const pattern = allowed.replace(/\*/g, '.*');
      return new RegExp(`^${pattern}$`).test(origin);
    })) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true,
  maxAge: 86400, // Preflight cache 24 jam
}));

/**
 * JSON body parser dengan limit 1MB.
 * MENGAPA limit? Mencegah DoS via payload besar yang memakan memory.
 */
app.use(express.json({ limit: '1mb' }));

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Mengkonversi hasil query PostGIS menjadi GeoJSON Feature.
 * 
 * MENGAPA manual conversion?
 * PostGIS menyimpan data dalam format internal (WKB). Kita menggunakan
 * ST_AsGeoJSON() di SQL query untuk konversi, lalu menyusun response
 * sesuai standar GeoJSON RFC 7946.
 * 
 * @param {Object} row - Baris hasil query dari PostgreSQL
 * @param {string} layerType - Tipe layer ('jalan', 'longsor', 'faskes')
 * @returns {Object} GeoJSON Feature
 */
function rowToGeoJSONFeature(row, layerType) {
  // Destructure geojson dari row, sisanya jadi properties
  const { geojson, ...properties } = row;

  return {
    type: 'Feature',
    properties: {
      ...properties,
      layerType: layerType,
    },
    geometry: JSON.parse(geojson),
  };
}

// ==========================================================================
// API ROUTES
// ==========================================================================

/**
 * GET /api/geodata
 * 
 * Endpoint utama yang mengembalikan seluruh data geospasial dalam format 
 * GeoJSON FeatureCollection. Data diambil dari 3 tabel PostGIS:
 * - ruas_jalan (LineString)
 * - zona_longsor (Polygon)
 * - fasilitas_kesehatan (Point)
 * 
 * MENGAPA satu endpoint gabungan (bukan 3 endpoint terpisah)?
 * Untuk dashboard real-time, single fetch mengurangi latency dan 
 * menyederhanakan state management di frontend. Semua layer dirender 
 * bersamaan saat peta dimuat.
 * 
 * Response format: GeoJSON FeatureCollection (RFC 7946)
 * {
 *   "type": "FeatureCollection",
 *   "features": [...],
 *   "metadata": { ... }
 * }
 */
app.get('/api/geodata', async (req, res) => {
  let client;
  try {
    client = await pool.connect();

    // ====================================================================
    // Query 1: Ruas Jalan (LineString)
    // ST_AsGeoJSON(geom) mengkonversi geometry PostGIS ke string GeoJSON.
    // MENGAPA parameterized query form? Meskipun query ini tidak menerima
    // user input, konsistensi penggunaan pool.query() dengan text/values 
    // memastikan pattern yang aman digunakan di seluruh codebase.
    // ====================================================================
    const jalanQuery = await client.query({
      text: `SELECT 
               id, 
               nama_ruas, 
               panjang_km, 
               status_jalan, 
               kelas_jalan, 
               populasi_terdampak,
               ST_AsGeoJSON(geom) as geojson
             FROM ruas_jalan 
             ORDER BY id`,
    });

    // ====================================================================
    // Query 2: Zona Longsor (Polygon)
    // ====================================================================
    const longsorQuery = await client.query({
      text: `SELECT 
               id, 
               nama_zona, 
               tingkat_bahaya, 
               luas_ha, 
               deskripsi, 
               estimasi_populasi,
               ST_AsGeoJSON(geom) as geojson
             FROM zona_longsor 
             ORDER BY id`,
    });

    // ====================================================================
    // Query 3: Fasilitas Kesehatan (Point) — Layer 4 (Akses)
    // ====================================================================
    const faskesQuery = await client.query({
      text: `SELECT 
               id, 
               nama_faskes, 
               tipe, 
               kapasitas_bed, 
               status_operasional, 
               alamat,
               ST_AsGeoJSON(geom) as geojson
             FROM fasilitas_kesehatan 
             ORDER BY id`,
    });

    // ====================================================================
    // Query 4: Zona Terisolasi (Polygon) — Layer 2 (Dampak/Impact)
    // Blank Spots yang menunjukkan area keterisolasian pasca-bencana.
    // ====================================================================
    const terisolasiQuery = await client.query({
      text: `SELECT 
               id, 
               nama_zona, 
               estimasi_populasi, 
               durasi_isolasi_hari, 
               ruas_jalan_terputus, 
               fasilitas_kesehatan_terdekat,
               jarak_ke_faskes_km,
               tipe_dampak,
               deskripsi,
               ST_AsGeoJSON(geom) as geojson
             FROM zona_terisolasi 
             ORDER BY estimasi_populasi DESC`,
    });

    // ====================================================================
    // Query 5: Zona Kerawanan Longsor (Polygon) — Layer 1 (Bencana/Hazard)
    // Indeks kerawanan numerik 0-100 untuk choropleth visualization.
    // ====================================================================
    const kerawananQuery = await client.query({
      text: `SELECT 
               id, 
               nama_zona, 
               indeks_kerawanan, 
               faktor_curah_hujan, 
               faktor_kemiringan, 
               faktor_tanah_labil, 
               faktor_deforestasi,
               validasi_data,
               tahun_kalibrasi,
               deskripsi,
               ST_AsGeoJSON(geom) as geojson
             FROM zona_kerawanan_longsor 
             ORDER BY indeks_kerawanan DESC`,
    });

    // ====================================================================
    // Query 6: Kejadian Longsor Historis (Point) — Layer 5 (Events)
    // Data kasus/insiden longsor nyata yang tercatat per tanggal.
    // MENGAPA query terpisah? Memungkinkan analisis temporal (tren per
    // tahun/bulan) dan visualisasi titik kejadian aktual vs zona rawan.
    // ====================================================================
    const kejadianQuery = await client.query({
      text: `SELECT 
               id, 
               tanggal_kejadian,
               waktu_kejadian,
               lokasi_nama, 
               kecamatan,
               kabupaten,
               tipe_longsor,
               volume_material_m3,
               korban_jiwa, 
               korban_luka,
               pengungsi,
               rumah_rusak_berat,
               rumah_rusak_ringan,
               ruas_jalan_terdampak,
               panjang_jalan_putus_m,
               faktor_pemicu,
               curah_hujan_mm,
               durasi_hujan_jam,
               status_penanganan,
               sumber_data,
               deskripsi,
               ST_AsGeoJSON(geom) as geojson
             FROM kejadian_longsor 
             ORDER BY tanggal_kejadian DESC`,
    });

    // ====================================================================
    // Gabungkan semua features menjadi satu FeatureCollection
    // Urutan layers mengikuti spesifikasi stack:
    // Layer 0: Base (CartoDB Dark Matter — handled di frontend)
    // Layer 1: Bencana (zona_kerawanan — Polygon 45% opacity)
    // Layer 2: Dampak (zona_terisolasi — Polygon 60% opacity)
    // Layer 3: Akses (ruas_jalan — LineString 100% opacity)
    // Layer 4: Faskes (fasilitas_kesehatan — Point 100% opacity)
    // ====================================================================
    const features = [
      ...kerawananQuery.rows.map((row) => rowToGeoJSONFeature(row, 'kerawanan')),
      ...terisolasiQuery.rows.map((row) => rowToGeoJSONFeature(row, 'terisolasi')),
      ...jalanQuery.rows.map((row) => rowToGeoJSONFeature(row, 'jalan')),
      ...longsorQuery.rows.map((row) => rowToGeoJSONFeature(row, 'longsor')),
      ...faskesQuery.rows.map((row) => rowToGeoJSONFeature(row, 'faskes')),
      ...kejadianQuery.rows.map((row) => rowToGeoJSONFeature(row, 'kejadian')),
    ];

    const geojsonResponse = {
      type: 'FeatureCollection',
      features: features,
      metadata: {
        totalFeatures: features.length,
        layers: {
          kerawanan: kerawananQuery.rows.length,
          terisolasi: terisolasiQuery.rows.length,
          jalan: jalanQuery.rows.length,
          longsor: longsorQuery.rows.length,
          faskes: faskesQuery.rows.length,
          kejadian: kejadianQuery.rows.length,
        },
        generatedAt: new Date().toISOString(),
        crs: 'EPSG:4326',
      },
    };

    res.json(geojsonResponse);
  } catch (err) {
    // Log detail error untuk debugging internal (TIDAK dikirim ke client)
    console.error('[API] Error fetching geodata:', err.message);

    // Response generik ke client — tidak mengekspose detail SQL/internal
    res.status(500).json({
      error: 'Gagal mengambil data geospasial',
      message: 'Terjadi kesalahan server internal. Silakan coba lagi.',
    });
  } finally {
    if (client) {
      client.release();
    }
  }
});

/**
 * GET /api/health
 * Health check endpoint untuk monitoring dan Docker health checks.
 */
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query({ text: 'SELECT 1 as healthy' });
    res.json({
      status: 'healthy',
      database: result.rows.length > 0 ? 'connected' : 'disconnected',
      uptime: process.uptime(),
    });
  } catch (err) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
    });
  }
});

// ==========================================================================
// ERROR HANDLING
// ==========================================================================

/**
 * 404 handler — Route yang tidak ditemukan
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint tidak ditemukan',
    path: req.path,
  });
});

/**
 * Global error handler — Menangkap semua unhandled errors.
 * MENGAPA generik? Mengekspose stack trace atau detail error ke client 
 * adalah vulnerability (information disclosure). Error detail hanya 
 * di-log server-side.
 */
app.use((err, req, res, _next) => {
  console.error('[Server] Unhandled error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Terjadi kesalahan yang tidak terduga.',
  });
});

// ==========================================================================
// SERVER STARTUP
// ==========================================================================

/**
 * Inisialisasi server: test koneksi DB terlebih dahulu, baru listen.
 * MENGAPA async startup? Memastikan PostGIS benar-benar tersedia 
 * sebelum Express mulai menerima request. Jika DB belum siap,
 * server akan retry dengan delay.
 */
async function startServer() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║        POLARIS WebGIS — API Server v1.0.0           ║');
  console.log('║  Pemetaan Operasional Longsor & Akses Rawan Isolasi ║');
  console.log('╚══════════════════════════════════════════════════════╝');

  // Retry koneksi DB hingga 5 kali dengan delay 3 detik
  let dbConnected = false;
  for (let attempt = 1; attempt <= 5; attempt++) {
    console.log(`[Server] Attempting database connection (${attempt}/5)...`);
    dbConnected = await testConnection();
    if (dbConnected) break;
    // Tunggu 3 detik sebelum retry
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  if (!dbConnected) {
    console.error('[Server] FATAL: Cannot connect to PostGIS database. Exiting.');
    process.exit(1);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] API running on http://0.0.0.0:${PORT}`);
    console.log(`[Server] Endpoints available:`);
    console.log(`  GET /api/geodata  — GeoJSON FeatureCollection (6 layers)`);
    console.log(`  GET /api/health   — Health check`);
  });
}

startServer();
