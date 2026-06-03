# Panduan Integrasi QGIS & Dataset Excel (.xlsx) pada POLARIS WebGIS

Dokumen ini berisi panduan lengkap, langkah demi langkah, dan spesifik untuk mengintegrasikan **QGIS Desktop** ke database **PostGIS** di dalam kontainer Docker POLARIS, mengoptimalkan kinerja geospasial agar berjalan maksimal, serta panduan memproses data **Excel (.xlsx)** sebagai dataset baru ke dalam sistem.

---

## 🗺️ Bagian 1: Penerapan QGIS Secara Maksimal di POLARIS

QGIS (Quantum GIS) adalah Desktop GIS open-source yang sangat kuat untuk pengolahan, pembersihan, dan analisis data spasial. Dalam arsitektur 3-tier POLARIS, QGIS bertindak sebagai **Spatial ETL (Extract, Transform, Load) & Data Administrator Tool**.

```
  ┌────────────────────────────────────────────────────────┐
  │                 QGIS Desktop (Host OS)                 │
  └───────────┬────────────────────────────────▲───────────┘
              │ (1) Direct Connection          │ (4) Live Updates
              │     via Port 5432              │     & Simplification
  ┌───────────▼────────────────────────────────┴───────────┐
  │                  PostGIS (Docker DB)                   │
  └───────────┬────────────────────────────────────────────┘
              │ (2) Query Spasial & GeoJSON
  ┌───────────▼────────────────────────────────────────────┐
  │                  Express API (Backend)                 │
  └───────────┬────────────────────────────────────────────┘
              │ (3) HTTP Fetch
  ┌───────────▼────────────────────────────────────────────┐
  │                 React Leaflet (Frontend)               │
  └────────────────────────────────────────────────────────┘
```

### 1. Menghubungkan QGIS ke PostGIS di Dalam Docker

Karena Docker Compose POLARIS memetakan port internal `5432` ke port `5432` pada host OS (`ports: - "5432:5432"`), QGIS Desktop yang berjalan di mesin Anda dapat langsung terhubung ke database PostGIS.

#### Langkah Koneksi:
1. Buka **QGIS Desktop** di komputer Anda.
2. Pada panel **Browser** (biasanya di sebelah kiri), cari item **PostgreSQL**, klik kanan, lalu pilih **New Connection...**
3. Isi jendela dialog *Create a New PostGIS Connection* dengan parameter berikut:
   * **Connection Details**:
     * **Name**: `POLARIS PostGIS` (atau nama bebas yang Anda inginkan)
     * **Service**: *Kosongkan*
     * **Host**: `localhost` (Jika Anda menggunakan Windows + Docker Desktop WSL2 dan QGIS berjalan di Windows Host, gunakan `localhost` atau `127.0.0.1`. Jika Docker berjalan di server remote, masukkan IP server tersebut).
     * **Port**: `5432`
     * **Database**: `polaris_db`
     * **SSL Mode**: `disable` (untuk lingkungan lokal)
   * **Authentication**:
     * Pilih tab **Basic**.
     * **User name**: `polaris_user`
     * **Password**: `polaris_secure_2024` (sesuai konfigurasi di `docker-compose.yml`)
     * Centang **Store** pada username dan password jika Anda tidak ingin memasukkannya kembali setiap kali membuka QGIS.
4. Klik tombol **Test Connection** di bagian bawah.
   * *Jika berhasil*, akan muncul notifikasi hijau: *"Connection to POLARIS PostGIS was successful"*.
   * *Jika gagal*, pastikan kontainer database Anda sedang berjalan dengan perintah `docker compose ps` dan port `5432` tidak sedang digunakan oleh layanan PostgreSQL lokal lainnya di komputer Anda.
5. Klik **OK** untuk menyimpan koneksi.
6. Pada panel Browser QGIS, perluas (expand) `PostgreSQL` -> `POLARIS PostGIS` -> `public`. Anda akan melihat tiga tabel spasial:
   * 🛣️ `ruas_jalan`
   * ⛰️ `zona_longsor`
   * 🏥 `fasilitas_kesehatan`
7. Klik ganda (double-click) pada setiap tabel untuk menambahkannya sebagai layer ke kanvas peta QGIS Anda.

---

### 2. Optimasi Spasial Agar Kinerja WebGIS Maksimal

Salah satu masalah utama WebGIS adalah performa loading peta yang lambat akibat ukuran data GeoJSON yang terlalu besar. Berikut langkah-langkah QGIS untuk mengoptimasi data spasial sebelum disajikan ke Leaflet:

#### A. Penyederhanaan Geometri (Geometry Simplification)
Data jalan (`LineString`) atau wilayah (`Polygon`) dari dinas terkait sering kali memiliki detail titik (vertex) yang sangat padat (misal, setiap jarak 10 cm). Leaflet tidak membutuhkan detail sepadat itu untuk visualisasi makro di browser. Mengirim data mentah ini akan membanjiri memori RAM browser.

1. Buka menu **Processing** -> **Toolbox** (atau tekan `Ctrl + Alt + T`).
2. Cari dan klik ganda algoritma **Simplify** (di bawah *Vector geometry*).
3. Konfigurasikan parameter:
   * **Input layer**: Pilih `ruas_jalan` atau `zona_longsor`.
   * **Simplification method**: Pilih **Douglas-Peucker (Distance Threshold)**. Ini adalah metode terbaik untuk mempertahankan bentuk dasar geometri sambil membuang titik-titik yang tidak perlu.
   * **Tolerance**: Set ke `0.0001` (untuk CRS EPSG:4326/WGS84, toleransi ini setara dengan ±11 meter, yang sangat aman untuk peta skala regional Sumatera) atau `0.00001` (setara ±1.1 meter jika butuh sangat presisi).
   * **Simplified**: Klik tombol titik tiga (`...`), pilih **Save to PostgreSQL...**, masukkan koneksi `POLARIS PostGIS`, skema `public`, dan namakan tabel baru misalnya `ruas_jalan_opt`.
4. Jalankan dengan menekan **Run**. Ukuran payload GeoJSON untuk jalan Anda akan berkurang hingga 70-90% tanpa mengurangi visualisasi estetik di browser.

#### B. Validasi dan Perbaikan Geometri (Geometry Healing)
Geometri yang rusak (seperti poligon melingkar/self-intersection) sering terjadi saat menggambar zona longsor secara terburu-buru. Ini menyebabkan query spasial seperti `ST_Intersects` (untuk deteksi jalan putus akibat longsor) menghasilkan *error* atau mengembalikan data salah.

1. Di **Processing Toolbox**, cari **Check Validity**.
2. Pilih input layer `zona_longsor`. Jalankan (**Run**).
3. QGIS akan memisahkan hasil menjadi tiga layer temporer: *Valid outputs*, *Invalid outputs*, dan *Error locations*.
4. Jika terdapat data invalid, cari alat **Fix Geometries** di Processing Toolbox.
5. Masukkan layer yang invalid/tabel asli Anda, lalu jalankan. Algoritma ini akan mendesain ulang struktur poligon agar memenuhi kaidah standar spasial OGC (Open Geospatial Consortium) secara otomatis.
6. Simpan kembali (save/overwrite) layer hasil perbaikan ke dalam PostGIS.

#### C. Pengaturan Spatial Indexing (GIST)
Untuk memastikan query filter wilayah dan analisis dampak simulasi longsor berjalan secepat kilat (<10ms), pastikan setiap tabel memiliki Spatial Index jenis GIST.
Anda dapat memverifikasi indeks ini di QGIS melalui **Database** -> **DB Manager** -> **SQL Window**, lalu jalankan query berikut:

```sql
-- Tambahkan indeks spasial jika belum ada
CREATE INDEX IF NOT EXISTS idx_ruas_jalan_geom ON ruas_jalan USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_zona_longsor_geom ON zona_longsor USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_faskes_geom ON fasilitas_kesehatan USING GIST(geom);

-- Lakukan ANALYZE untuk memperbarui statistik query planner PostgreSQL
ANALYZE ruas_jalan;
ANALYZE zona_longsor;
ANALYZE fasilitas_kesehatan;
```

#### D. Pengeditan Data Langsung (Live Database Editing)
1. Pilih layer (misalnya `fasilitas_kesehatan`) di panel Layers QGIS.
2. Klik ikon **Toggle Editing** (pensil kuning ✏️) di toolbar atas.
3. Gunakan **Add Point Feature** untuk membuat rumah sakit baru, atau pilih **Vertex Tool** untuk mengubah jalur jalan `ruas_jalan`.
4. Isi data atribut pada form pop-up yang muncul (seperti `nama_faskes`, `kapasitas_bed`, dll.).
5. Klik **Save Layer Edits** (ikon disket dengan pensil 💾) lalu matikan kembali toggle editing.
6. Buka atau muat ulang (refresh) halaman dashboard POLARIS WebGIS di browser. Data baru Anda langsung terintegrasi secara *real-time* tanpa perlu merestart server backend!

---

## 📊 Bagian 2: Integrasi Excel (.xlsx) Sebagai Dataset

Data spasial yang dikumpulkan di lapangan sering kali disimpan dalam format tabel Excel. Ada dua jalur implementasi untuk mengimpor data tersebut ke sistem POLARIS.

---

### METODE A: ETL Spasial Menggunakan QGIS (Rekomendasi untuk Administrator GIS)

Metode ini tidak memerlukan perubahan kode aplikasi backend atau frontend. Sempurna untuk *data loading* rutin secara berkala oleh tim GIS/data administrator.

#### 1. Persiapan Template File Excel
Pastikan file Excel (`.xlsx` atau disimpan sebagai `.csv` UTF-8) memiliki baris judul yang jelas dan kolom koordinat numerik yang valid (menggunakan sistem proyeksi WGS84 / EPSG:4326).

**Contoh Format Tabel Excel (`faskes_baru.xlsx`):**

| nama_faskes | tipe | kapasitas_bed | status_operasional | alamat | latitude | longitude |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| RSUD Kalianda | Rumah Sakit Umum | 180 | Aktif | Jl. Letkol P. Penghubung, Lampung Selatan | -5.72314 | 105.58912 |
| RS Airan Raya | RS Swasta | 120 | Aktif | Jl. Airan Raya, Jati Agung | -5.37890 | 105.29540 |
| Puskesmas Krui | Puskesmas | 15 | Aktif | Jl. Merdeka No.12, Pesisir Barat | -5.18950 | 103.94520 |

> [!WARNING]
> Pastikan koordinat menggunakan format **Desimal (Decimal Degrees)**, contoh: `-5.72314` (bukan derajat-menit-detik seperti `5°43'23"S`). Gunakan titik (`.`) sebagai pemisah desimal, bukan koma (`,`), untuk menghindari konflik format regional.

#### 2. Langkah Impor ke QGIS
1. Buka QGIS.
2. Masuk ke menu **Layer** -> **Add Layer** -> **Add Delimited Text Layer...**
3. Konfigurasikan jendela impor:
   * **File Name**: Cari file Excel/CSV Anda.
   * **Layer Name**: Beri nama layer (misal: `Faskes Baru Excel`).
   * **File Format**: Jika berupa CSV, centang `CSV`. Jika berupa file Excel murni, pastikan Anda telah menginstal plugin **Spreadsheet Layers** via *Plugins -> Manage and Install Plugins*, lalu gunakan opsi *Add Spreadsheet Layer*. Namun, cara paling aman dan universal tanpa plugin adalah menyimpan file Excel Anda sebagai **CSV (Comma Delimited) (.csv)** terlebih dahulu.
   * **Geometry Definition**:
     * Centang **Point coordinates**.
     * **X field**: Pilih kolom `longitude` (Bujur).
     * **Y field**: Pilih kolom `latitude` (Lintang).
     * **Z field**: *Kosongkan*.
     * **Geometry CRS**: Pilih **EPSG:4326 - WGS 84** (Sangat penting!).
   * Periksa tabel preview di bagian bawah untuk memastikan kolom terdeteksi dengan benar.
4. Klik **Add**, lalu klik **Close**. Titik-titik lokasi fasilitas kesehatan baru sekarang akan terplot di kanvas QGIS Anda.

#### 3. Mengunggah Data ke PostGIS Database POLARIS
1. Di menu QGIS, buka **Database** -> **DB Manager**.
2. Pada pohon direktori kiri, perluas **PostGIS** -> **POLARIS PostGIS** -> **public**.
3. Klik tombol **Import Layer/File** (ikon tanda panah masuk berwarna biru 📥 di toolbar atas DB Manager).
4. Konfigurasikan jendela impor:
   * **Input**: Pilih layer Excel/CSV yang di-load tadi (`Faskes Baru Excel`).
   * **Schema**: `public`.
   * **Table**: Pilih `fasilitas_kesehatan` (karena kita akan memasukkan data baru ke dalam tabel yang sudah ada).
   * **Primary key**: `id`.
   * **Geometry column**: `geom`.
   * **Source SRID**: `4326`.
   * **Target SRID**: `4326`.
   * Centang opsi **Convert field names to lowercase** (mencegah masalah sensitivitas huruf pada PostgreSQL).
   * Centang opsi **Append to existing table** (PENTING! Jika tidak dicentang, tabel lama akan terhapus/ditimpa).
5. Klik **OK**. Proses transfer data akan berjalan. Setelah selesai, buka dashboard POLARIS WebGIS, refresh halaman, dan fasilitas kesehatan baru Anda dari Excel langsung muncul.

---

### METODE B: Penerapan Programmatis via REST API (Rekomendasi untuk Developer)

Metode ini memungkinkan pengguna akhir (end-user) mengunggah file Excel `.xlsx` langsung melalui halaman admin aplikasi WebGIS. Backend Node.js akan membaca file secara dinamis, melakukan parsing data spasial, dan menyimpannya ke database PostGIS.

#### 1. Instalasi Dependencies Baru pada Backend
Masuk ke direktori `backend/` pada project Anda, lalu instal modul penanganan file upload (`multer`) dan pembaca file Excel (`xlsx` - SheetJS).

```bash
cd backend
npm install multer xlsx
```

> [!NOTE]
> Setelah menginstal library di lokal, Anda wajib membangun ulang kontainer Docker agar library baru terinstal di dalam kontainer:
> ```bash
> docker compose up --build -d
> ```

#### 2. Kode Backend Lengkap (`backend/server.js`)
Lakukan modifikasi pada file `backend/server.js` untuk menambahkan rute upload dan pengolahan Excel. Di bawah ini adalah implementasi kode bersih, aman, menggunakan transaksi database terparameterisasi (untuk mencegah SQL Injection), dan tanpa placeholder.

Ganti isi `backend/server.js` Anda atau tambahkan kode berikut sebelum baris `app.listen` (Server Startup):

```javascript
// Tambahkan import library di bagian paling atas server.js bersama library lainnya:
// const multer = require('multer');
// const xlsx = require('xlsx');

// ==========================================================================
// INTEGRASI IMPORT EXCEL (.XLSX) PROGRAMMATIS
// ==========================================================================

// Konfigurasi Multer untuk menyimpan file sementara di memori buffer (lebih aman dan bersih)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Batasi ukuran file maks 5MB untuk mencegah DoS
  },
  fileFilter: (req, file, cb) => {
    // Validasi tipe file agar hanya menerima ekstensi Excel (.xlsx)
    const allowedMime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (file.mimetype === allowedMime || file.originalname.endsWith('.xlsx')) {
      cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung! Pastikan Anda mengunggah berkas Excel (.xlsx).'));
    }
  }
});

/**
 * POST /api/import/faskes-xlsx
 * 
 * Endpoint untuk mengunggah dan memproses dataset fasilitas kesehatan dari Excel (.xlsx)
 * langsung ke PostGIS. Menjamin integritas data menggunakan transaksi (All-or-Nothing).
 */
app.post('/api/import/faskes-xlsx', upload.single('excelFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Tidak ada file yang diunggah. Mohon pilih file Excel (.xlsx).' });
  }

  let client;
  try {
    // 1. Membaca buffer file Excel menggunakan SheetJS (xlsx)
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    
    // Ambil sheet pertama dari workbook Excel
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Konversi baris sheet menjadi JSON Array
    const rows = xlsx.utils.sheet_to_json(worksheet);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'File Excel kosong atau tidak memiliki baris data.' });
    }

    // 2. Membuka koneksi database dengan pool client
    client = await pool.connect();

    // 3. Memulai transaksi database (Transaction Block)
    // MENGAPA? Jika ada satu baris Excel yang korup atau koordinatnya invalid,
    // kita membatalkan seluruh operasi (rollback) agar database tidak kotor oleh data setengah matang.
    await client.query('BEGIN');

    let importedCount = 0;
    const errors = [];

    // Loop untuk memproses dan memvalidasi setiap baris Excel
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const lineNum = i + 2; // Baris Excel dimulai dari index 2 (karena index 1 adalah Header)

      // Ambil field dari row (konversi key ke lowercase untuk konsistensi)
      const normalizedRow = {};
      Object.keys(row).forEach(key => {
        normalizedRow[key.toLowerCase().trim()] = row[key];
      });

      const nama_faskes = normalizedRow['nama_faskes'];
      const tipe = normalizedRow['tipe'] || 'Puskesmas';
      const kapasitas_bed = parseInt(normalizedRow['kapasitas_bed'], 10) || 0;
      const status_operasional = normalizedRow['status_operasional'] || 'Aktif';
      const alamat = normalizedRow['alamat'] || '';
      const latitude = parseFloat(normalizedRow['latitude']);
      const longitude = parseFloat(normalizedRow['longitude']);

      // VALIDASI: Pastikan field wajib (Nama Faskes, Lat, Long) terisi dan valid secara numerik
      if (!nama_faskes) {
        errors.push(`Baris ${lineNum}: Kolom 'nama_faskes' wajib diisi.`);
        continue;
      }
      if (isNaN(latitude) || latitude < -90 || latitude > 90) {
        errors.push(`Baris ${lineNum}: Latitude tidak valid (${normalizedRow['latitude']}). Harus berupa angka antara -90 s/d 90.`);
        continue;
      }
      if (isNaN(longitude) || longitude < -180 || longitude > 180) {
        errors.push(`Baris ${lineNum}: Longitude tidak valid (${normalizedRow['longitude']}). Harus berupa angka antara -180 s/d 180.`);
        continue;
      }

      // QUERY SQL AMAN (Parameterized Query):
      // ST_SetSRID(ST_MakePoint(Longitude, Latitude), 4326)
      // PENTING: Fungsi ST_MakePoint menerima parameter (X, Y) alias (Longitude, Latitude).
      // Menukar posisi ini adalah kesalahan paling umum yang menyebabkan lokasi peta terlempar ke benua lain!
      const insertQuery = `
        INSERT INTO fasilitas_kesehatan (
          nama_faskes, 
          tipe, 
          kapasitas_bed, 
          status_operasional, 
          alamat, 
          geom
        ) VALUES (
          $1, $2, $3, $4, $5, 
          ST_SetSRID(ST_MakePoint($6, $7), 4326)
        );
      `;

      const values = [
        nama_faskes,
        tipe,
        kapasitas_bed,
        status_operasional,
        alamat,
        longitude, // Parameter 6: X (Longitude)
        latitude   // Parameter 7: Y (Latitude)
      ];

      await client.query(insertQuery, values);
      importedCount++;
    }

    // Evaluasi hasil proses import
    if (errors.length > 0) {
      // Jika ada error validasi baris, batalkan transaksi dan beri tahu user letak kesalahannya
      await client.query('ROLLBACK');
      return res.status(422).json({
        error: 'Gagal mengimpor file Excel karena kesalahan validasi data.',
        details: errors
      });
    }

    // Jika seluruh baris lolos validasi dan berhasil diinsert, commit transaksi
    await client.query('COMMIT');
    console.log(`[API] Excel import sukses: ${importedCount} faskes dimasukkan.`);

    res.status(200).json({
      message: `Sukses mengimpor data faskes baru!`,
      totalImported: importedCount
    });

  } catch (err) {
    // Batalkan transaksi jika terjadi database crash/network error
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error('[API] Fatal Error during Excel import:', err.message);
    res.status(500).json({
      error: 'Terjadi kegagalan server saat memproses file Excel.',
      message: err.message
    });
  } finally {
    if (client) {
      client.release(); // Kembalikan koneksi ke pool
    }
  }
});
```

---

#### 3. Integrasi Komponen Frontend React
Tambahkan UI interaktif pada halaman dashboard Anda (misalnya di kolom kiri atau modal admin) untuk mengunggah file Excel `.xlsx` tersebut secara instan.

Berikut adalah kode komponen React modular (**`ExcelImporter.js`**):

```javascript
import React, { useState, useRef } from 'react';

/**
 * ExcelImporter - Komponen UI React untuk mengunggah berkas Excel (.xlsx)
 * data fasilitas kesehatan ke WebGIS POLARIS.
 * 
 * @param {Function} onImportSuccess - Callback untuk merefresh data peta setelah impor sukses
 */
export default function ExcelImporter({ onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.xlsx')) {
        setStatusMsg({ type: 'error', text: 'Hanya mendukung berkas Excel dengan ekstensi .xlsx!' });
        setFile(null);
      } else {
        setFile(selectedFile);
        setStatusMsg({ type: '', text: '' });
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatusMsg({ type: 'error', text: 'Pilih berkas Excel terlebih dahulu!' });
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', file);

    setLoading(true);
    setStatusMsg({ type: 'info', text: 'Sedang memproses dan menvalidasi spasial...' });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/import/faskes-xlsx`, {
        method: 'POST',
        body: formData, // Jangan atur headers Content-Type secara manual, browser otomatis mengaturnya untuk FormData + boundary
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMsg({
          type: 'success',
          text: `🎉 Impor Sukses! Berhasil menambahkan ${result.totalImported} fasilitas kesehatan.`
        });
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        // Pemicu refresh data peta pada komponen utama WebGIS
        if (typeof onImportSuccess === 'function') {
          onImportSuccess();
        }
      } else {
        // Tampilkan rincian baris jika terjadi error validasi
        const errorText = result.details 
          ? `${result.error} Detail:\n${result.details.join('\n')}`
          : result.error || 'Gagal mengunggah data.';
        setStatusMsg({ type: 'error', text: errorText });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Koneksi ke API Server gagal. Pastikan backend aktif.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 my-4 text-white shadow-xl">
      <h3 className="text-lg font-bold text-teal-400 mb-2 flex items-center">
        📥 Import Fasilitas Kesehatan (.xlsx)
      </h3>
      <p className="text-xs text-slate-400 mb-4">
        Unggah file Excel koordinat WGS84 (kolom wajib: nama_faskes, latitude, longitude).
      </p>

      <form onSubmit={handleUpload} className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx"
            className="block w-full text-sm text-slate-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-teal-950 file:text-teal-400
              hover:file:bg-teal-900 cursor-pointer"
          />
        </div>

        {file && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold py-2 px-4 rounded transition-all duration-150 disabled:opacity-50"
          >
            {loading ? 'Mengimpor...' : 'Mulai Impor Spasial'}
          </button>
        )}
      </form>

      {statusMsg.text && (
        <div className={`mt-3 p-3 rounded text-xs whitespace-pre-line border ${
          statusMsg.type === 'error' ? 'bg-red-950/50 text-red-400 border-red-900' :
          statusMsg.type === 'success' ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900' :
          'bg-slate-800 text-teal-400 border-slate-700'
        }`}>
          {statusMsg.text}
        </div>
      )}
    </div>
  );
}
```

---

## 🚀 Ringkasan Alur Kerja & Langkah Uji Coba

Untuk memastikan implementasi ini 100% berhasil:

1. **Jalankan docker-compose**:
   ```bash
   docker compose up --build -d
   ```
2. **Koneksikan QGIS ke PostGIS**:
   Buka QGIS, buat koneksi PostgreSQL ke `localhost:5432` dengan database `polaris_db`, user `polaris_user`, password `polaris_secure_2024`. Tarik tabel `fasilitas_kesehatan` ke workspace.
3. **Instalasi library Excel di Backend**:
   Lakukan `npm install xlsx multer` di folder backend kontainer Anda atau bangun ulang Docker setelah memodifikasi `package.json`.
4. **Tambahkan Endpoint API**:
   Implementasikan kode Express di atas pada `server.js`.
5. **Uji Coba Impor**:
   * Siapkan file Excel `test.xlsx` yang memiliki kolom `nama_faskes`, `latitude`, `longitude`.
   * Beri koordinat tiruan wilayah Lampung, contoh: Latitude `-5.39000` dan Longitude `105.26000` (Bandar Lampung).
   * Kirim request POST ke `http://localhost:5000/api/import/faskes-xlsx` menggunakan Postman (format form-data, key: `excelFile`) atau melalui Komponen React di atas.
   * Periksa di QGIS dengan melakukan refresh data. Titik baru dari Excel akan langsung terplot secara otomatis.
   * Refresh dashboard WebGIS POLARIS untuk melihat pembaruan data secara real-time pada peta Leaflet.
