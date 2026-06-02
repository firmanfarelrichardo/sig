/**
 * POLARIS WebGIS — Database Configuration
 * 
 * MENGAPA menggunakan Pool (bukan Client tunggal)?
 * Pool mengelola beberapa koneksi database secara efisien. Ketika ada 
 * request masuk, pool memberikan koneksi yang sudah ada (bukan membuat 
 * koneksi baru setiap kali), mengurangi overhead TCP handshake dan 
 * meningkatkan throughput secara signifikan pada beban tinggi.
 * 
 * Semua konfigurasi menggunakan environment variables yang diinjeksi 
 * oleh Docker Compose — tidak ada credential yang di-hardcode.
 */

const { Pool } = require('pg');

/**
 * Membuat connection pool ke PostgreSQL/PostGIS.
 * 
 * MENGAPA max: 20?
 * Batas 20 koneksi simultan cukup untuk aplikasi dashboard dengan 
 * traffic sedang. PostGIS query yang berat (ST_Intersects, dll.)
 * membutuhkan waktu lebih lama — pool mencegah connection exhaustion.
 * 
 * MENGAPA idleTimeoutMillis: 30000?
 * Koneksi idle lebih dari 30 detik akan ditutup untuk menghemat 
 * resource database. Ini penting karena PostGIS queries cenderung 
 * bursty (banyak request saat load peta, lalu idle).
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'polaris_db',
  user: process.env.DB_USER || 'polaris_user',
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

/**
 * Event listener untuk menangkap error koneksi yang tidak tertangani.
 * MENGAPA? Tanpa handler ini, error koneksi yang unexpected akan 
 * menyebabkan proses Node.js crash tanpa log yang jelas.
 */
pool.on('error', (err) => {
  // Hanya log pesan error generik, jangan log detail kredensial
  console.error('[DB] Unexpected idle client error:', err.message);
});

/**
 * Helper function untuk menguji koneksi database.
 * Dipanggil saat server startup untuk memastikan PostGIS tersedia 
 * sebelum menerima request dari frontend.
 * 
 * @returns {Promise<boolean>} true jika koneksi berhasil
 */
async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT PostGIS_Version() as version');
    console.log('[DB] PostGIS connected. Version:', result.rows[0].version);
    return true;
  } catch (err) {
    console.error('[DB] Connection test failed:', err.message);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
}

module.exports = {
  pool,
  testConnection,
};
