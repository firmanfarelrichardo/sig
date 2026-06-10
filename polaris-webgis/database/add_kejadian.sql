CREATE TABLE IF NOT EXISTS kejadian_longsor (
    id SERIAL PRIMARY KEY,
    tanggal_kejadian DATE NOT NULL,
    waktu_kejadian TIME,
    lokasi_nama VARCHAR(255) NOT NULL,
    kecamatan VARCHAR(100) NOT NULL,
    kabupaten VARCHAR(100) NOT NULL DEFAULT 'Lampung',
    tipe_longsor VARCHAR(100) NOT NULL DEFAULT 'Longsor Translasi',
    volume_material_m3 NUMERIC(12,2) DEFAULT 0,
    korban_jiwa INTEGER DEFAULT 0,
    korban_luka INTEGER DEFAULT 0,
    pengungsi INTEGER DEFAULT 0,
    rumah_rusak_berat INTEGER DEFAULT 0,
    rumah_rusak_ringan INTEGER DEFAULT 0,
    ruas_jalan_terdampak VARCHAR(255),
    panjang_jalan_putus_m NUMERIC(8,2) DEFAULT 0,
    faktor_pemicu VARCHAR(255) NOT NULL DEFAULT 'Hujan Lebat',
    curah_hujan_mm NUMERIC(6,1),
    durasi_hujan_jam NUMERIC(4,1),
    status_penanganan VARCHAR(50) NOT NULL DEFAULT 'Selesai',
    sumber_data VARCHAR(255) DEFAULT 'BPBD Provinsi Lampung',
    deskripsi TEXT,
    geom GEOMETRY(Point, 4326) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_kejadian_longsor_geom ON kejadian_longsor USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_kejadian_longsor_tanggal ON kejadian_longsor (tanggal_kejadian);

INSERT INTO kejadian_longsor (
    tanggal_kejadian, waktu_kejadian, lokasi_nama, kecamatan, kabupaten,
    tipe_longsor, volume_material_m3, korban_jiwa, korban_luka, pengungsi,
    rumah_rusak_berat, rumah_rusak_ringan, ruas_jalan_terdampak, panjang_jalan_putus_m,
    faktor_pemicu, curah_hujan_mm, durasi_hujan_jam, status_penanganan,
    sumber_data, deskripsi, geom
) VALUES
('2018-01-15','02:30:00','Desa Sukarame, Lereng Gunung Pesagi','Balik Bukit','Lampung Barat','Debris Flow',45000.00,3,12,285,8,23,'Jalan Raya Liwa (Kota Agung - Liwa)',180.00,'Hujan Lebat + Deforestasi',185.5,8.0,'Selesai','BPBD Lampung Barat + BNPB','Debris flow besar dari lereng Gunung Pesagi menerjang Desa Sukarame.',ST_SetSRID(ST_MakePoint(104.3450,-4.8680),4326)),
('2018-12-22','23:15:00','Desa Tanjung Raya, Tebing Pesisir','Pesisir Selatan','Pesisir Barat','Longsor Rotasi',12000.00,1,5,120,3,11,'Jalan Pesisir Krui (Liwa - Pesisir Barat)',95.00,'Hujan Lebat + Abrasi Pantai',142.0,6.5,'Selesai','BPBD Pesisir Barat','Tebing pantai setinggi 60 meter runtuh akibat kombinasi hujan deras dan gelombang tinggi.',ST_SetSRID(ST_MakePoint(104.0720,-5.0150),4326)),
('2019-02-08','04:45:00','Desa Sumber Agung, Perbukitan Tanggamus','Kota Agung Barat','Tanggamus','Longsor Translasi',28000.00,2,8,410,12,34,'Lintas Sumatera (Bandar Lampung - Kota Agung)',250.00,'Hujan Lebat + Saturasi Tanah',168.0,12.0,'Selesai','BPBD Tanggamus + BNPB','Longsor besar di perbukitan Tanggamus Barat menutup jalur Lintas Sumatera.',ST_SetSRID(ST_MakePoint(104.8650,-5.3200),4326)),
('2019-11-28','16:20:00','Desa Way Mengaku, Pinggir Danau Ranau','Balik Bukit','Lampung Barat','Longsor Translasi',8500.00,0,3,75,2,8,NULL,0.00,'Hujan Lebat',95.0,4.5,'Selesai','BPBD Lampung Barat','Longsor skala sedang di lereng pinggir Danau Ranau.',ST_SetSRID(ST_MakePoint(104.3780,-4.8950),4326)),
('2020-01-09','01:10:00','Desa Suoh, Kawasan Hutan Lindung','Suoh','Lampung Barat','Debris Flow',68000.00,7,22,1250,28,67,'Jalan Raya Liwa (Kota Agung - Liwa)',320.00,'Hujan Ekstrem + Tanah Vulkanik Jenuh',210.5,14.0,'Selesai','BNPB + BPBD Lampung Barat + TNI','Debris flow masif. Bencana longsor terbesar di Lampung dalam dekade terakhir.',ST_SetSRID(ST_MakePoint(104.3100,-4.8350),4326)),
('2020-03-17','14:30:00','Desa Banjar Negara, Lereng Terjal','Gunung Alip','Tanggamus','Longsor Translasi',15000.00,0,6,190,5,18,'Lintas Sumatera (Bandar Lampung - Kota Agung)',150.00,'Hujan Lebat + Kemiringan Ekstrem',135.0,7.0,'Selesai','BPBD Tanggamus','Longsor di lereng terjal Gunung Alip menutup jalur Lintas Sumatera.',ST_SetSRID(ST_MakePoint(104.9100,-5.2900),4326)),
('2021-02-14','03:00:00','Desa Pekon Balak, Lembah Sempit','Batu Brak','Lampung Barat','Debris Flow',32000.00,4,15,620,15,42,'Jalan Raya Liwa (Kota Agung - Liwa)',200.00,'Hujan Lebat Berkepanjangan + Alih Fungsi Lahan',178.0,10.0,'Selesai','BPBD Lampung Barat + Basarnas','Debris flow di lembah sempit Pekon Balak. 4 warga meninggal.',ST_SetSRID(ST_MakePoint(104.4200,-4.8100),4326)),
('2021-07-05','10:45:00','Desa Way Napal, Tebing Jalan','Krui Selatan','Pesisir Barat','Longsor Rotasi',5500.00,0,2,45,1,6,'Jalan Pesisir Krui (Liwa - Pesisir Barat)',80.00,'Hujan Sedang + Getaran Gempa Kecil',82.0,3.0,'Selesai','BPBD Pesisir Barat','Longsor tebing jalan dipicu kombinasi hujan dan gempa kecil M3.2.',ST_SetSRID(ST_MakePoint(104.1350,-4.9680),4326)),
('2022-01-03','05:20:00','Desa Fajar Bulan, Perkebunan Kopi','Way Tenong','Lampung Barat','Longsor Translasi',22000.00,2,9,350,7,25,'Jalan Raya Liwa (Kota Agung - Liwa)',175.00,'Hujan Lebat + Erosi Perkebunan',155.0,9.0,'Selesai','BPBD Lampung Barat + BNPB','Longsor besar di area perkebunan kopi Way Tenong. 2 petani meninggal.',ST_SetSRID(ST_MakePoint(104.4580,-4.8420),4326)),
('2022-11-19','20:00:00','Desa Margodadi, Perbukitan Pesawaran','Gedong Tataan','Pesawaran','Longsor Translasi',9500.00,1,4,165,4,15,NULL,0.00,'Hujan Lebat + Konversi Lahan',120.0,5.5,'Selesai','BPBD Pesawaran','Longsor di perbukitan Pesawaran menerjang perkampungan.',ST_SetSRID(ST_MakePoint(105.0800,-5.3650),4326)),
('2023-01-27','00:40:00','Desa Sukamarga, Kaki Gunung Tanggamus','Kota Agung Timur','Tanggamus','Debris Flow',38000.00,5,18,890,20,55,'Lintas Sumatera (Bandar Lampung - Kota Agung)',280.00,'Hujan Ekstrem + Deforestasi Ilegal',195.0,11.0,'Selesai','BNPB + BPBD Tanggamus + TNI + Polri','Debris flow dahsyat dari kaki Gunung Tanggamus.',ST_SetSRID(ST_MakePoint(104.8800,-5.3450),4326)),
('2023-12-10','17:30:00','Desa Kota Karang, Bantaran Sungai','Way Halim','Bandar Lampung','Longsor Tebing Sungai',3200.00,0,2,85,2,7,NULL,0.00,'Hujan Lebat + Erosi Bantaran',98.0,4.0,'Selesai','BPBD Kota Bandar Lampung','Longsor tebing sungai di area perkotaan Bandar Lampung.',ST_SetSRID(ST_MakePoint(105.2550,-5.4100),4326)),
('2024-02-20','06:15:00','Desa Gedung Surian, Pegunungan','Gedung Surian','Lampung Barat','Debris Flow',52000.00,3,14,780,18,48,'Jalan Raya Liwa (Kota Agung - Liwa)',230.00,'Hujan Ekstrem 4 Hari + Tanah Jenuh Air',205.0,13.0,'Selesai','BNPB + BPBD Lampung Barat + Basarnas','Debris flow masif di Gedung Surian. 3 korban jiwa.',ST_SetSRID(ST_MakePoint(104.3650,-4.8550),4326)),
('2024-11-05','22:45:00','Desa Air Hitam, Perbukitan','Wonosobo','Tanggamus','Longsor Translasi',18000.00,1,7,320,9,28,'Lintas Sumatera (Bandar Lampung - Kota Agung)',160.00,'Hujan Lebat + Getaran Gempa M4.1',145.0,8.0,'Selesai','BPBD Tanggamus','Longsor dipicu kombinasi hujan lebat dan gempa tektonik M4.1.',ST_SetSRID(ST_MakePoint(104.8900,-5.3100),4326)),
('2025-01-18','03:50:00','Desa Kenali, Lereng Curam','Belalau','Lampung Barat','Debris Flow',25000.00,0,8,450,10,32,'Jalan Raya Liwa (Kota Agung - Liwa)',140.00,'Hujan Ekstrem + La Nina',188.0,10.5,'Dalam Penanganan','BPBD Lampung Barat','Debris flow awal 2025 dipicu La Nina. Tidak ada korban jiwa berkat peringatan dini.',ST_SetSRID(ST_MakePoint(104.3950,-4.7900),4326));
