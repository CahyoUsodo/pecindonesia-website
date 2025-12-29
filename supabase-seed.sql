-- Seed Script untuk PEC Website
-- Jalankan script ini di Supabase SQL Editor

-- 1. Create Admin (password: admin123)
-- Password hash untuk 'admin123' menggunakan bcrypt
INSERT INTO "Admin" (id, email, password, "createdAt", "updatedAt")
VALUES (
  'clx00000000000000000000001',
  'admin@pec.id',
  '$2a$10$xHCAk/qRJABU6CInPZL6Qu5CTsrQgu.Z6Pez6MaXQdABQl0UJMboq',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- 2. Create Content
INSERT INTO "Content" (id, key, value, type, "createdAt", "updatedAt")
VALUES
  ('clx00000000000000000000002', 'hero_title', 'Selamat Datang di PEC Indonesia', 'text', NOW(), NOW()),
  ('clx00000000000000000000003', 'hero_subtitle', 'Lembaga Pendidikan Terbaik & Terbesar untuk Masa Depan Cerah', 'text', NOW(), NOW()),
  ('clx00000000000000000000004', 'hero_description', 'Kami menyediakan program pendidikan berkualitas tinggi untuk siswa SD hingga SMA. Dengan metode pembelajaran yang menyenangkan dan efektif, kami membantu siswa mencapai prestasi terbaik mereka.', 'text', NOW(), NOW()),
  ('clx00000000000000000000005', 'about_history', 'PEC (Practical Education Center) didirikan dengan visi untuk memberikan pendidikan praktis dan berkualitas tinggi. Sejak berdiri, kami telah membantu ribuan siswa mencapai impian mereka melalui program-program unggulan.', 'text', NOW(), NOW()),
  ('clx00000000000000000000006', 'about_vision', 'Menjadi lembaga pendidikan terdepan yang menghasilkan generasi unggul, berkarakter, dan siap menghadapi tantangan masa depan.', 'text', NOW(), NOW()),
  ('clx00000000000000000000007', 'about_mission', 'Menyediakan pendidikan berkualitas tinggi dengan metode pembelajaran yang inovatif, menyenangkan, dan efektif. Membangun karakter siswa yang kuat dan mendukung pengembangan potensi mereka secara maksimal.', 'text', NOW(), NOW())
ON CONFLICT (key) DO NOTHING;

-- 3. Create Services
INSERT INTO "Service" (id, title, description, slug, "imageUrl", "createdAt", "updatedAt")
VALUES
  ('clx00000000000000000000008', 'English Course', 'Program pembelajaran Bahasa Inggris yang komprehensif untuk semua level. Fokus pada speaking, listening, reading, dan writing dengan metode interaktif dan menyenangkan.', 'english-course', NULL, NOW(), NOW()),
  ('clx00000000000000000000009', 'Math Tutoring', 'Bimbingan belajar Matematika untuk siswa SD, SMP, dan SMA. Materi disesuaikan dengan kurikulum sekolah dan dilengkapi dengan latihan soal yang bervariasi.', 'math-tutoring', NULL, NOW(), NOW()),
  ('clx00000000000000000000010', 'Bimbel (Bimbingan Belajar)', 'Program bimbingan belajar lengkap untuk berbagai mata pelajaran. Cocok untuk siswa yang ingin meningkatkan nilai dan memahami konsep dengan lebih baik.', 'bimbel', NULL, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- 4. Create Branches
INSERT INTO "Branch" (id, name, address, "googleMapsLink", "contactNumber", "createdAt", "updatedAt")
VALUES
  ('clx00000000000000000000011', 'PEC Pamulang', 'Jl. Raya Pamulang No. 123, Tangerang Selatan, Banten 15417', 'https://maps.google.com/?q=PEC+Pamulang', '021-12345678', NOW(), NOW()),
  ('clx00000000000000000000012', 'PEC Depok', 'Jl. Margonda Raya No. 456, Depok, Jawa Barat 16424', 'https://maps.google.com/?q=PEC+Depok', '021-87654321', NOW(), NOW()),
  ('clx00000000000000000000013', 'PEC Jakarta Selatan', 'Jl. Fatmawati No. 789, Jakarta Selatan, DKI Jakarta 12420', 'https://maps.google.com/?q=PEC+Jakarta+Selatan', '021-11223344', NOW(), NOW());

-- 5. Create Testimonials
INSERT INTO "Testimonial" (id, "studentName", role, "reviewText", rating, "photoUrl", "createdAt", "updatedAt")
VALUES
  ('clx00000000000000000000014', 'Ahmad Rizki', 'Siswa SMA Kelas 12', 'PEC membantu saya meningkatkan nilai Bahasa Inggris secara signifikan. Metode pembelajarannya sangat menyenangkan dan mudah dipahami. Guru-gurunya juga sangat sabar dan profesional.', 5, NULL, NOW(), NOW()),
  ('clx00000000000000000000015', 'Siti Nurhaliza', 'Siswa SMP Kelas 9', 'Program Math Tutoring di PEC sangat membantu saya memahami konsep matematika yang sulit. Sekarang saya lebih percaya diri dalam menghadapi ujian.', 5, NULL, NOW(), NOW()),
  ('clx00000000000000000000016', 'Budi Santoso', 'Siswa SD Kelas 6', 'Saya senang belajar di PEC karena suasana belajarnya menyenangkan. Guru-gurunya ramah dan selalu membantu ketika saya kesulitan.', 4, NULL, NOW(), NOW()),
  ('clx00000000000000000000017', 'Dewi Lestari', 'Siswa SMA Kelas 11', 'Bimbel di PEC sangat lengkap dan terstruktur. Materi yang diajarkan sesuai dengan kurikulum sekolah dan latihan soalnya sangat membantu untuk persiapan ujian.', 5, NULL, NOW(), NOW());

-- 6. Create FAQs
INSERT INTO "Faq" (id, question, answer, "createdAt", "updatedAt")
VALUES
  ('clx00000000000000000000018', 'Apa saja program yang tersedia di PEC?', 'PEC menyediakan berbagai program pendidikan termasuk English Course, Math Tutoring, dan Bimbel (Bimbingan Belajar) untuk berbagai mata pelajaran. Program kami dirancang untuk siswa SD, SMP, dan SMA.', NOW(), NOW()),
  ('clx00000000000000000000019', 'Bagaimana cara mendaftar di PEC?', 'Anda dapat mendaftar dengan mengunjungi cabang PEC terdekat atau menghubungi kami melalui nomor telepon yang tersedia. Tim kami akan membantu proses pendaftaran dan memberikan informasi lengkap tentang program yang tersedia.', NOW(), NOW()),
  ('clx00000000000000000000020', 'Berapa biaya untuk mengikuti program di PEC?', 'Biaya bervariasi tergantung program yang dipilih. Untuk informasi lengkap mengenai biaya, silakan hubungi cabang PEC terdekat atau hubungi customer service kami.', NOW(), NOW()),
  ('clx00000000000000000000021', 'Apakah PEC menyediakan kelas online?', 'Ya, PEC menyediakan opsi pembelajaran online untuk beberapa program. Silakan hubungi kami untuk informasi lebih lanjut mengenai kelas online yang tersedia.', NOW(), NOW()),
  ('clx00000000000000000000022', 'Berapa lama durasi program di PEC?', 'Durasi program bervariasi tergantung program yang dipilih. Umumnya, program berlangsung selama satu semester atau sesuai dengan paket yang dipilih. Tim kami akan memberikan informasi lengkap saat pendaftaran.', NOW(), NOW()),
  ('clx00000000000000000000023', 'Apakah PEC menyediakan uji coba kelas?', 'Ya, PEC menyediakan kelas trial untuk calon siswa. Silakan hubungi cabang terdekat untuk informasi lebih lanjut mengenai jadwal kelas trial.', NOW(), NOW());

-- ✅ Password hash sudah di-generate untuk 'admin123'
-- ✅ Semua ID menggunakan format Prisma CUID
-- ✅ Script siap dijalankan di Supabase SQL Editor

