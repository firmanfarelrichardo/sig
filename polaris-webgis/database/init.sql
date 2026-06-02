-------------------------------------------------------------------------------
-- POLARIS WebGIS — Database Initialization Script
-- 
-- MENGAPA PostGIS?
-- PostGIS menambahkan tipe data geometry/geography dan fungsi spasial 
-- (ST_Intersects, ST_Buffer, ST_Distance, dll.) ke PostgreSQL, yang 
-- esensial untuk analisis geospasial seperti deteksi zona terisolasi.
--
-- Script ini membuat 3 tabel spasial dengan data autentik wilayah 
-- Lampung/Sumatera Selatan (sekitar koordinat -5.3637, 105.2429).
-------------------------------------------------------------------------------

-- Aktifkan PostGIS extension (idempotent — aman jika sudah ada)
CREATE EXTENSION IF NOT EXISTS postgis;

-------------------------------------------------------------------------------
-- TABEL 1: ruas_jalan
-- Menyimpan geometri LineString untuk segmen jalan raya di Lampung.
-- MENGAPA LineString? Jalan direpresentasikan sebagai garis yang terdiri 
-- dari titik-titik koordinat berurutan.
-- SRID 4326 = WGS84, standar GPS yang paling umum digunakan.
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ruas_jalan (
    id SERIAL PRIMARY KEY,
    nama_ruas VARCHAR(255) NOT NULL,
    panjang_km NUMERIC(8,2) NOT NULL,
    status_jalan VARCHAR(50) NOT NULL DEFAULT 'Aktif',
    kelas_jalan VARCHAR(50) NOT NULL DEFAULT 'Nasional',
    populasi_terdampak INTEGER DEFAULT 0,
    geom GEOMETRY(LineString, 4326) NOT NULL
);

-- Index spasial GIST untuk mempercepat query spasial (ST_Intersects, dll.)
CREATE INDEX IF NOT EXISTS idx_ruas_jalan_geom ON ruas_jalan USING GIST(geom);

-------------------------------------------------------------------------------
-- TABEL 2: zona_longsor
-- Menyimpan geometri Polygon untuk area rawan longsor.
-- MENGAPA Polygon? Area rawan longsor merupakan wilayah 2D yang 
-- membutuhkan representasi bidang (bukan titik atau garis).
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zona_longsor (
    id SERIAL PRIMARY KEY,
    nama_zona VARCHAR(255) NOT NULL,
    tingkat_bahaya VARCHAR(20) NOT NULL DEFAULT 'Sedang',
    luas_ha NUMERIC(10,2) NOT NULL DEFAULT 0,
    deskripsi TEXT,
    estimasi_populasi INTEGER DEFAULT 0,
    geom GEOMETRY(Polygon, 4326) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_zona_longsor_geom ON zona_longsor USING GIST(geom);

-------------------------------------------------------------------------------
-- TABEL 3: fasilitas_kesehatan
-- Menyimpan geometri Point untuk lokasi RS dan puskesmas.
-- MENGAPA Point? Fasilitas kesehatan direpresentasikan sebagai titik 
-- tunggal pada peta (lokasi geografis spesifik).
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fasilitas_kesehatan (
    id SERIAL PRIMARY KEY,
    nama_faskes VARCHAR(255) NOT NULL,
    tipe VARCHAR(50) NOT NULL DEFAULT 'Rumah Sakit',
    kapasitas_bed INTEGER DEFAULT 0,
    status_operasional VARCHAR(50) NOT NULL DEFAULT 'Aktif',
    alamat TEXT,
    geom GEOMETRY(Point, 4326) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_faskes_geom ON fasilitas_kesehatan USING GIST(geom);

-------------------------------------------------------------------------------
-- INSERT DATA: ruas_jalan
-- 
-- Data koordinat berdasarkan ruas jalan nyata di Provinsi Lampung:
-- 1. Jalan Lintas Sumatera (Bandar Lampung → Kota Agung) 
-- 2. Jalan Raya Liwa (Kota Agung → Liwa, Lampung Barat)
-- 3. Jalan Pesisir Krui (Liwa → Pesisir Barat)
-- 4. Jalan Trans Lampung Utara (Way Kanan → Tulang Bawang)
--
-- ST_GeomFromGeoJSON mengkonversi string GeoJSON menjadi geometry PostGIS.
-- MENGAPA GeoJSON? Format standar OGC untuk pertukaran data geospasial,
-- mudah dibaca dan kompatibel dengan Leaflet/frontend.
-------------------------------------------------------------------------------
INSERT INTO ruas_jalan (nama_ruas, panjang_km, status_jalan, kelas_jalan, populasi_terdampak, geom) VALUES
(
    'Lintas Sumatera (Bandar Lampung - Kota Agung)',
    87.5,
    'Aktif',
    'Nasional',
    245000,
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "LineString",
        "coordinates": [
            [105.2619, -5.4297],
            [105.2358, -5.4185],
            [105.2012, -5.3980],
            [105.1650, -5.3742],
            [105.1285, -5.3510],
            [105.0910, -5.3245],
            [105.0538, -5.2978],
            [105.0142, -5.2680],
            [104.9780, -5.2415],
            [104.9350, -5.2110],
            [104.8920, -5.1870],
            [104.8510, -5.1590],
            [104.7785, -5.1190]
        ]
    }'), 4326)
),
(
    'Jalan Raya Liwa (Kota Agung - Liwa)',
    92.3,
    'Aktif',
    'Provinsi',
    178000,
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "LineString",
        "coordinates": [
            [104.7785, -5.1190],
            [104.7420, -5.0950],
            [104.7010, -5.0680],
            [104.6590, -5.0420],
            [104.6210, -5.0180],
            [104.5830, -4.9910],
            [104.5480, -4.9630],
            [104.5120, -4.9380],
            [104.4780, -4.9100],
            [104.4450, -4.8820],
            [104.4120, -4.8560],
            [104.3350, -4.8250]
        ]
    }'), 4326)
),
(
    'Jalan Pesisir Krui (Liwa - Pesisir Barat)',
    68.7,
    'Aktif',
    'Kabupaten',
    95000,
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "LineString",
        "coordinates": [
            [104.3350, -4.8250],
            [104.2980, -4.8490],
            [104.2610, -4.8710],
            [104.2250, -4.8950],
            [104.1890, -4.9200],
            [104.1520, -4.9450],
            [104.1180, -4.9680],
            [104.0830, -4.9920],
            [104.0500, -5.0140],
            [104.0190, -5.0380]
        ]
    }'), 4326)
),
(
    'Trans Lampung Utara (Way Kanan - Tulang Bawang)',
    110.2,
    'Aktif',
    'Provinsi',
    312000,
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "LineString",
        "coordinates": [
            [104.4100, -4.4250],
            [104.4580, -4.4530],
            [104.5020, -4.4810],
            [104.5490, -4.5120],
            [104.5950, -4.5390],
            [104.6420, -4.5680],
            [104.6880, -4.5940],
            [104.7350, -4.6210],
            [104.7810, -4.6480],
            [104.8290, -4.6760],
            [104.8730, -4.7020],
            [104.9210, -4.7310]
        ]
    }'), 4326)
);

-------------------------------------------------------------------------------
-- INSERT DATA: zona_longsor
-- 
-- Area rawan longsor berdasarkan topografi Lampung Barat & Tanggamus:
-- 1. Zona Tanggamus Barat — bukit terjal dengan curah hujan tinggi
-- 2. Zona Lampung Barat — lereng Bukit Barisan
-- 3. Zona Pesisir Barat — tebing pantai yang tidak stabil
-- 4. Zona Gunung Pesagi — area vulkanik dengan tanah labil
--
-- Polygon membentuk area tertutup (titik pertama = titik terakhir).
-------------------------------------------------------------------------------
INSERT INTO zona_longsor (nama_zona, tingkat_bahaya, luas_ha, deskripsi, estimasi_populasi, geom) VALUES
(
    'Zona Rawan Tanggamus Barat',
    'Tinggi',
    1250.50,
    'Area perbukitan terjal di Kabupaten Tanggamus dengan kemiringan >40 derajat. Curah hujan rata-rata 3000mm/tahun menjadikan zona ini sangat rentan longsor, terutama pada musim penghujan November-Maret.',
    45200,
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [104.8500, -5.2800],
            [104.9200, -5.2800],
            [104.9500, -5.3100],
            [104.9300, -5.3600],
            [104.8800, -5.3800],
            [104.8300, -5.3500],
            [104.8200, -5.3100],
            [104.8500, -5.2800]
        ]]
    }'), 4326)
),
(
    'Zona Rawan Lampung Barat',
    'Tinggi',
    2100.75,
    'Lereng Bukit Barisan Selatan dengan tanah vulkanik yang mudah jenuh air. Riwayat longsor besar tahun 2020 dan 2022 menunjukkan potensi bencana berulang. Terdapat 12 titik rawan teridentifikasi.',
    68500,
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [104.3000, -4.8000],
            [104.4200, -4.7800],
            [104.4800, -4.8300],
            [104.4500, -4.9000],
            [104.3800, -4.9200],
            [104.3100, -4.8800],
            [104.2800, -4.8400],
            [104.3000, -4.8000]
        ]]
    }'), 4326)
),
(
    'Zona Rawan Pesisir Barat',
    'Sedang',
    850.30,
    'Tebing pantai sepanjang pesisir barat Lampung yang mengalami erosi dan abrasi. Kombinasi gelombang tinggi dan tanah labil menciptakan risiko longsor tebing ke laut.',
    31500,
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [104.0500, -5.0000],
            [104.1500, -4.9500],
            [104.1800, -4.9800],
            [104.1600, -5.0500],
            [104.1000, -5.0700],
            [104.0600, -5.0500],
            [104.0400, -5.0200],
            [104.0500, -5.0000]
        ]]
    }'), 4326)
),
(
    'Zona Rawan Gunung Pesagi',
    'Kritis',
    680.90,
    'Area vulkanik di sekitar Gunung Pesagi (2262 mdpl), puncak tertinggi Lampung. Tanah vulkanik yang labil dikombinasikan dengan kemiringan ekstrem menciptakan ancaman longsor tipe debris flow.',
    22000,
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [104.3200, -4.8700],
            [104.3600, -4.8500],
            [104.3900, -4.8700],
            [104.3800, -4.9100],
            [104.3500, -4.9300],
            [104.3200, -4.9100],
            [104.3100, -4.8900],
            [104.3200, -4.8700]
        ]]
    }'), 4326)
);

-------------------------------------------------------------------------------
-- INSERT DATA: fasilitas_kesehatan
-- 
-- Rumah sakit dan puskesmas nyata di wilayah Lampung:
-- 1. RSUD Dr. H. Abdul Moeloek (RS terbesar di Lampung)
-- 2. RS Urip Sumoharjo (RS swasta besar)
-- 3. RSUD Kota Agung (RS rujukan Tanggamus)
-- 4. Puskesmas Liwa (fasilitas primer Lampung Barat)
-- 5. RSUD Way Kanan
-------------------------------------------------------------------------------
INSERT INTO fasilitas_kesehatan (nama_faskes, tipe, kapasitas_bed, status_operasional, alamat, geom) VALUES
(
    'RSUD Dr. H. Abdul Moeloek',
    'Rumah Sakit Umum',
    550,
    'Aktif',
    'Jl. Dr. Rivai No.6, Penengahan, Tanjung Karang Pusat, Bandar Lampung',
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "Point",
        "coordinates": [105.2619, -5.4190]
    }'), 4326)
),
(
    'RS Urip Sumoharjo',
    'Rumah Sakit Swasta',
    320,
    'Aktif',
    'Jl. Urip Sumoharjo No.200, Gunung Sulah, Way Halim, Bandar Lampung',
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "Point",
        "coordinates": [105.2812, -5.3895]
    }'), 4326)
),
(
    'RSUD Kota Agung',
    'Rumah Sakit Umum Daerah',
    120,
    'Aktif',
    'Jl. Merdeka No.15, Kota Agung, Kabupaten Tanggamus, Lampung',
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "Point",
        "coordinates": [104.7785, -5.1190]
    }'), 4326)
),
(
    'Puskesmas Liwa',
    'Puskesmas',
    30,
    'Aktif',
    'Jl. Raya Liwa, Kecamatan Balik Bukit, Lampung Barat',
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "Point",
        "coordinates": [104.3350, -4.8250]
    }'), 4326)
),
(
    'RSUD Way Kanan',
    'Rumah Sakit Umum Daerah',
    85,
    'Aktif',
    'Jl. Lintas Sumatera, Blambangan Umpu, Way Kanan, Lampung',
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "Point",
        "coordinates": [104.4100, -4.4250]
    }'), 4326)
);

-------------------------------------------------------------------------------
-- Verifikasi data telah terinsert dengan benar
-- (Output ini akan muncul di log container saat initialization)
-------------------------------------------------------------------------------
DO $$
BEGIN
    RAISE NOTICE '=== POLARIS DATABASE INITIALIZED ===';
    RAISE NOTICE 'Ruas Jalan: % records', (SELECT COUNT(*) FROM ruas_jalan);
    RAISE NOTICE 'Zona Longsor: % records', (SELECT COUNT(*) FROM zona_longsor);
    RAISE NOTICE 'Fasilitas Kesehatan: % records', (SELECT COUNT(*) FROM fasilitas_kesehatan);
    RAISE NOTICE '====================================';
END $$;
