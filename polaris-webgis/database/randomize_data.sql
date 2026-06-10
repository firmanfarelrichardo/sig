-- Script untuk merandomisasi data agar tidak stagnan di satu nilai tertentu

-- 1. Kejadian Longsor
-- Merandomisasi korban jiwa (0-5), korban luka (0-20), pengungsi (50-1000), 
-- rumah rusak berat (0-15), ringan (5-30), dan curah hujan
UPDATE kejadian_longsor
SET 
    korban_jiwa = floor(random() * 6),
    korban_luka = floor(random() * 21),
    pengungsi = floor(random() * 950 + 50),
    rumah_rusak_berat = floor(random() * 16),
    rumah_rusak_ringan = floor(random() * 26 + 5),
    volume_material_m3 = floor(random() * 60000 + 5000),
    curah_hujan_mm = floor(random() * 150 + 80) + (random()::numeric(3,1)),
    durasi_hujan_jam = floor(random() * 10 + 2) + (random()::numeric(2,1));

-- 2. Zona Terisolasi
-- Merandom durasi isolasi dan jarak ke faskes
UPDATE zona_terisolasi
SET
    durasi_isolasi_hari = floor(random() * 5 + 2),
    jarak_ke_faskes_km = floor(random() * 60 + 20) + (random()::numeric(3,1));

-- 3. Fasilitas Kesehatan
-- Merandom kapasitas bed
UPDATE fasilitas_kesehatan
SET 
    kapasitas_bed = floor(random() * 400 + 50);

-- 4. Zona Longsor
-- Merandom estimasi populasi terdampak
UPDATE zona_longsor
SET 
    estimasi_populasi = floor(random() * 60000 + 10000);

-- 5. Zona Kerawanan Longsor
-- Merandom faktor indeks 
UPDATE zona_kerawanan_longsor
SET
    faktor_curah_hujan = floor(random() * 20 + 20) + (random()::numeric(3,1)),
    faktor_kemiringan = floor(random() * 25 + 20) + (random()::numeric(3,1)),
    faktor_tanah_labil = floor(random() * 15 + 15) + (random()::numeric(3,1)),
    faktor_deforestasi = floor(random() * 15 + 5) + (random()::numeric(3,1));

-- Kalkulasi ulang indeks kerawanan
UPDATE zona_kerawanan_longsor
SET indeks_kerawanan = (faktor_curah_hujan + faktor_kemiringan + faktor_tanah_labil + faktor_deforestasi);
