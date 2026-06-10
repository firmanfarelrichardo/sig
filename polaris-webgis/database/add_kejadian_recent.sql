-- ===== TAMBAHAN DATA KEJADIAN LONGSOR TAHUN 2025 & 2026 =====
-- Data dummy realistis untuk melengkapi filter tahunan di POLARIS

INSERT INTO kejadian_longsor (
    tanggal_kejadian, waktu_kejadian, lokasi_nama, kecamatan, kabupaten,
    tipe_longsor, volume_material_m3, korban_jiwa, korban_luka, pengungsi,
    rumah_rusak_berat, rumah_rusak_ringan, ruas_jalan_terdampak, panjang_jalan_putus_m,
    faktor_pemicu, curah_hujan_mm, durasi_hujan_jam, status_penanganan,
    sumber_data, deskripsi, geom
) VALUES
-- ===== TAHUN 2025 =====
(
    '2025-01-08', '03:45:00',
    'Desa Pekon Balak, Lereng Curam', 'Belalau', 'Lampung Barat',
    'Debris Flow', 28000.00,
    1, 5, 120,
    4, 12,
    'Jalan Liwa - Krui', 95.00,
    'Hujan Lebat + Gempa Mikro', 165.0, 6.0,
    'Selesai', 'BPBD Lampung Barat',
    'Aliran debris dari lereng curam menerjang jalan utama penghubung Liwa-Krui. Satu korban jiwa tertimpa material longsor saat tidur.',
    ST_SetSRID(ST_MakePoint(104.2100, -4.9200), 4326)
),
(
    '2025-03-22', '14:30:00',
    'Desa Way Harong, Perbukitan Tanggamus', 'Kota Agung', 'Tanggamus',
    'Longsor Translasi', 15000.00,
    0, 3, 85,
    2, 8,
    'Jalan Lintas Barat (Kota Agung - Liwa)', 60.00,
    'Hujan Lebat Berkepanjangan', 142.0, 10.0,
    'Selesai', 'BPBD Tanggamus',
    'Longsor translasi menutup separuh badan jalan Lintas Barat. Lalu lintas dialihkan selama 2 hari.',
    ST_SetSRID(ST_MakePoint(104.4700, -5.4800), 4326)
),
(
    '2025-06-15', '08:20:00',
    'Desa Sukamarga, Tebing Sungai', 'Semaka', 'Tanggamus',
    'Longsor Rotasi', 8500.00,
    0, 1, 45,
    1, 5,
    NULL, 0,
    'Erosi Sungai + Hujan', 98.0, 4.0,
    'Selesai', 'BPBD Tanggamus',
    'Tebing sungai Way Semaka runtuh mengenai area pemukiman. Satu warga mengalami luka ringan.',
    ST_SetSRID(ST_MakePoint(104.5200, -5.5500), 4326)
),
(
    '2025-11-28', '01:00:00',
    'Desa Tanjung Iman, Pesisir Tebing', 'Ngambur', 'Pesisir Barat',
    'Longsor Badan Jalan', 22000.00,
    2, 7, 200,
    6, 15,
    'Jalan Lintas Barat (Krui - Bengkulu)', 140.00,
    'Hujan Lebat + Gelombang Tinggi', 195.0, 12.0,
    'Dalam Penanganan', 'BPBD Pesisir Barat + BNPB',
    'Longsor besar menutup total akses jalan lintas barat. Dua korban jiwa dalam kendaraan yang tertimbun. Evakuasi berlangsung 5 hari.',
    ST_SetSRID(ST_MakePoint(103.9500, -5.1800), 4326)
),

-- ===== TAHUN 2026 =====
(
    '2026-01-12', '22:45:00',
    'Desa Fajar Bulan, Perbukitan', 'Way Tenong', 'Lampung Barat',
    'Debris Flow', 35000.00,
    0, 4, 150,
    3, 10,
    'Jalan Liwa - Bukit Kemuning', 110.00,
    'Hujan Lebat Ekstrem', 210.0, 8.0,
    'Dalam Penanganan', 'BPBD Lampung Barat',
    'Debris flow besar dari lereng perbukitan menutup akses jalan provinsi. Evakuasi menggunakan alat berat selama 3 hari.',
    ST_SetSRID(ST_MakePoint(104.3800, -4.8900), 4326)
),
(
    '2026-02-18', '05:30:00',
    'Desa Penengahan, Lereng Gunung Rajabasa', 'Rajabasa', 'Lampung Selatan',
    'Longsor Translasi', 12000.00,
    0, 2, 75,
    2, 6,
    NULL, 0,
    'Hujan Lebat', 135.0, 5.0,
    'Selesai', 'BPBD Lampung Selatan',
    'Material longsor mengenai area perkebunan dan sebagian jalan desa. Dua warga terluka ringan.',
    ST_SetSRID(ST_MakePoint(105.6200, -5.7800), 4326)
),
(
    '2026-04-05', '16:00:00',
    'Desa Gedung Surian, Perbukitan Terjal', 'Gedung Surian', 'Lampung Barat',
    'Longsor Rotasi', 18000.00,
    1, 3, 95,
    3, 9,
    'Jalan Desa Gedung Surian - Liwa', 75.00,
    'Hujan Lebat + Deforestasi', 155.0, 7.0,
    'Dalam Penanganan', 'BPBD Lampung Barat',
    'Longsor rotasi besar di area bekas pembukaan lahan. Satu pekerja kebun tertimbun. Jalan desa terputus.',
    ST_SetSRID(ST_MakePoint(104.2700, -4.9500), 4326)
),
(
    '2026-06-01', '11:15:00',
    'Desa Padang Cahya, Pinggir Jalan Lintas', 'Balik Bukit', 'Lampung Barat',
    'Longsor Badan Jalan', 9000.00,
    0, 0, 0,
    0, 2,
    'Jalan Lintas Tengah (Liwa - Sumber Jaya)', 40.00,
    'Hujan Ringan + Getaran Kendaraan Berat', 75.0, 3.0,
    'Selesai', 'BPBD Lampung Barat',
    'Longsor kecil pada badan jalan lintas tengah. Tidak ada korban jiwa maupun luka. Pembersihan selesai dalam 6 jam.',
    ST_SetSRID(ST_MakePoint(104.3200, -4.8500), 4326)
);
