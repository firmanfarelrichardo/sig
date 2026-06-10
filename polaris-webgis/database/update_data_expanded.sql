-- 1. Merandomisasi Tahun Kejadian Longsor agar Sebaran Tidak Merata (bukan 2x terus)
-- Tabel memiliki 15 data. Kita akan mengubah tahun kejadiannya ke pola acak yang tidak rata.
-- id 1-4: 2024
-- id 5-7: 2023
-- id 8: 2022
-- id 9: 2021
-- id 10-12: 2020
-- id 13: 2019
-- id 14: 2018
-- id 15: 2025

UPDATE kejadian_longsor SET tanggal_kejadian = '2024-01-15' WHERE id = 1;
UPDATE kejadian_longsor SET tanggal_kejadian = '2024-02-22' WHERE id = 2;
UPDATE kejadian_longsor SET tanggal_kejadian = '2024-03-08' WHERE id = 3;
UPDATE kejadian_longsor SET tanggal_kejadian = '2024-11-28' WHERE id = 4;
UPDATE kejadian_longsor SET tanggal_kejadian = '2023-01-09' WHERE id = 5;
UPDATE kejadian_longsor SET tanggal_kejadian = '2023-03-17' WHERE id = 6;
UPDATE kejadian_longsor SET tanggal_kejadian = '2023-12-14' WHERE id = 7;
UPDATE kejadian_longsor SET tanggal_kejadian = '2022-07-05' WHERE id = 8;
UPDATE kejadian_longsor SET tanggal_kejadian = '2021-01-03' WHERE id = 9;
UPDATE kejadian_longsor SET tanggal_kejadian = '2020-11-19' WHERE id = 10;
UPDATE kejadian_longsor SET tanggal_kejadian = '2020-01-27' WHERE id = 11;
UPDATE kejadian_longsor SET tanggal_kejadian = '2020-12-10' WHERE id = 12;
UPDATE kejadian_longsor SET tanggal_kejadian = '2019-02-20' WHERE id = 13;
UPDATE kejadian_longsor SET tanggal_kejadian = '2018-11-05' WHERE id = 14;
UPDATE kejadian_longsor SET tanggal_kejadian = '2025-01-18' WHERE id = 15;

-- 2. Menambahkan Daftar Rumah Sakit di Provinsi Lampung secara Lengkap
-- Hapus data RS dummy lama agar tidak double
DELETE FROM fasilitas_kesehatan;

INSERT INTO fasilitas_kesehatan (nama_faskes, tipe, kapasitas_bed, status_operasional, alamat, geom) VALUES
('RSUD Dr. H. Abdul Moeloek', 'Rumah Sakit Umum', 550, 'Aktif', 'Tanjung Karang Pusat, Bandar Lampung', ST_SetSRID(ST_MakePoint(105.2619, -5.4190), 4326)),
('RS Urip Sumoharjo', 'Rumah Sakit Swasta', 320, 'Aktif', 'Sukarame, Bandar Lampung', ST_SetSRID(ST_MakePoint(105.2820, -5.3850), 4326)),
('RSUD Kota Agung', 'Rumah Sakit Daerah', 150, 'Aktif', 'Kota Agung Barat, Tanggamus', ST_SetSRID(ST_MakePoint(104.6200, -5.4950), 4326)),
('Puskesmas Liwa', 'Faskes Primer', 30, 'Aktif', 'Balik Bukit, Lampung Barat', ST_SetSRID(ST_MakePoint(104.0500, -5.0200), 4326)),
('RSUD Way Kanan (Z.A. Pagar Alam)', 'Rumah Sakit Daerah', 200, 'Aktif', 'Blambangan Umpu, Way Kanan', ST_SetSRID(ST_MakePoint(104.5300, -4.4800), 4326)),
('RS Immanuel', 'Rumah Sakit Swasta', 250, 'Aktif', 'Way Halim, Bandar Lampung', ST_SetSRID(ST_MakePoint(105.2650, -5.3900), 4326)),
('RS Bumi Waras', 'Rumah Sakit Swasta', 180, 'Aktif', 'Tanjung Karang, Bandar Lampung', ST_SetSRID(ST_MakePoint(105.2580, -5.4200), 4326)),
('RS Bhayangkara Polda Lampung', 'Rumah Sakit Polri', 150, 'Aktif', 'Pramuka, Bandar Lampung', ST_SetSRID(ST_MakePoint(105.2450, -5.3750), 4326)),
('RS Bintang Amin', 'Rumah Sakit Swasta', 200, 'Aktif', 'Kemiling, Bandar Lampung', ST_SetSRID(ST_MakePoint(105.2300, -5.4050), 4326)),
('RSUD Batin Mangunang', 'Rumah Sakit Daerah', 120, 'Aktif', 'Kota Agung Timur, Tanggamus', ST_SetSRID(ST_MakePoint(104.6500, -5.4850), 4326)),
('RSUD Pringsewu', 'Rumah Sakit Daerah', 250, 'Aktif', 'Pringsewu Timur, Pringsewu', ST_SetSRID(ST_MakePoint(104.9850, -5.3550), 4326)),
('RSUD Demang Sepulau Raya', 'Rumah Sakit Daerah', 220, 'Aktif', 'Gunung Sugih, Lampung Tengah', ST_SetSRID(ST_MakePoint(105.1950, -4.9550), 4326)),
('RSUD Menggala', 'Rumah Sakit Daerah', 180, 'Aktif', 'Menggala, Tulang Bawang', ST_SetSRID(ST_MakePoint(105.8150, -4.4850), 4326)),
('RSUD Bob Bazar', 'Rumah Sakit Daerah', 250, 'Aktif', 'Kalianda, Lampung Selatan', ST_SetSRID(ST_MakePoint(105.5800, -5.7400), 4326)),
('RSUD Sukadana', 'Rumah Sakit Daerah', 160, 'Aktif', 'Sukadana, Lampung Timur', ST_SetSRID(ST_MakePoint(105.5450, -5.0650), 4326)),
('RSUD Pesawaran', 'Rumah Sakit Daerah', 140, 'Aktif', 'Gedong Tataan, Pesawaran', ST_SetSRID(ST_MakePoint(105.1050, -5.3850), 4326)),
('RS Mardi Waluyo', 'Rumah Sakit Swasta', 150, 'Aktif', 'Metro Pusat, Kota Metro', ST_SetSRID(ST_MakePoint(105.3050, -5.1150), 4326)),
('RSUD Jend. Ahmad Yani', 'Rumah Sakit Daerah', 300, 'Aktif', 'Metro Pusat, Kota Metro', ST_SetSRID(ST_MakePoint(105.3100, -5.1180), 4326)),
('RS Mitra Husada', 'Rumah Sakit Swasta', 120, 'Aktif', 'Pringsewu Selatan, Pringsewu', ST_SetSRID(ST_MakePoint(104.9800, -5.3600), 4326)),
('RS Natar Medika', 'Rumah Sakit Swasta', 100, 'Aktif', 'Natar, Lampung Selatan', ST_SetSRID(ST_MakePoint(105.1850, -5.3000), 4326));

-- 3. Menambahkan Ruas Jalan Lintas Sumatera Utama
-- Hapus ruas_jalan lama
DELETE FROM ruas_jalan;

INSERT INTO ruas_jalan (nama_ruas, panjang_km, status_jalan, kelas_jalan, populasi_terdampak, geom) VALUES
(
    'Jalan Lintas Tengah (Jalinteng) Sumatera',
    235.5,
    'Aktif',
    'Nasional',
    850000,
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "LineString",
        "coordinates": [
            [105.2600, -5.4300],
            [105.1800, -5.2500],
            [105.2000, -4.9500],
            [104.8500, -4.8200],
            [104.6000, -4.6500],
            [104.5300, -4.4800],
            [104.4100, -4.4200]
        ]
    }'), 4326)
),
(
    'Jalan Lintas Timur (Jalintim) Sumatera',
    210.8,
    'Aktif',
    'Nasional',
    620000,
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "LineString",
        "coordinates": [
            [105.2600, -5.4300],
            [105.5800, -5.7400],
            [105.7500, -5.5000],
            [105.5400, -5.0600],
            [105.8100, -4.4800],
            [105.9500, -4.2000]
        ]
    }'), 4326)
),
(
    'Jalan Lintas Barat (Jalinbar) Sumatera',
    315.2,
    'Aktif',
    'Nasional',
    480000,
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "LineString",
        "coordinates": [
            [105.2600, -5.4300],
            [105.1000, -5.3800],
            [104.9800, -5.3500],
            [104.6500, -5.4800],
            [104.1000, -5.0700],
            [104.0500, -5.0200],
            [103.9500, -4.8500]
        ]
    }'), 4326)
),
(
    'Jalan Tol Trans Sumatera (Bakauheni - Terbanggi Besar)',
    140.9,
    'Aktif',
    'Tol Nasional',
    1200000,
    ST_SetSRID(ST_GeomFromGeoJSON('{
        "type": "LineString",
        "coordinates": [
            [105.7500, -5.8600],
            [105.5800, -5.6000],
            [105.3500, -5.3500],
            [105.2000, -4.9500]
        ]
    }'), 4326)
);
