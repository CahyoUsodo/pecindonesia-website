# 🚀 Panduan Lengkap: Publish ke GitHub & Deploy ke Vercel

Panduan step-by-step yang bisa di-copy paste untuk mempublish project ke GitHub dan deploy ke Vercel.

---

## 📋 PRASYARAT

Sebelum mulai, pastikan Anda sudah memiliki:
- ✅ Akun GitHub (buat di [github.com](https://github.com))
- ✅ Akun Vercel (buat di [vercel.com](https://vercel.com) - bisa login dengan GitHub)
- ✅ Git terinstall di komputer (cek dengan: `git --version`)
- ✅ Node.js terinstall (cek dengan: `node --version`)

---

## 📝 BAGIAN 1: PUSH KE GITHUB

### Langkah 1: Buat Repository di GitHub

1. Buka [github.com](https://github.com) dan login
2. Klik tombol **"+"** di pojok kanan atas → pilih **"New repository"**
3. Isi form:
   - **Repository name:** `pec-website` (atau nama lain)
   - **Description:** `Company Profile Website untuk PEC Indonesia`
   - **Visibility:** Pilih **Public** atau **Private** (sesuai kebutuhan)
   - **JANGAN centang** "Add a README file" (karena kita sudah punya)
   - **JANGAN centang** "Add .gitignore" (karena kita sudah punya)
4. Klik **"Create repository"**

### Langkah 2: Inisialisasi Git di Project (Jika Belum Ada)

Buka terminal/command prompt di folder project Anda (`C:\xampp\htdocs\ProfilePEC`), lalu jalankan:

```bash
git init
```

### Langkah 3: Tambahkan Semua File ke Git

```bash
git add .
```

### Langkah 4: Buat Commit Pertama

```bash
git commit -m "Initial commit: PEC Company Profile Website"
```

### Langkah 5: Set Branch ke Main

```bash
git branch -M main
```

### Langkah 6: Hubungkan dengan GitHub Repository

**GANTI `username` dan `repo-name` dengan username GitHub dan nama repository Anda:**

```bash
git remote add origin https://github.com/username/repo-name.git
```

**Contoh:**
```bash
git remote add origin https://github.com/johndoe/pec-website.git
```

### Langkah 7: Push ke GitHub

```bash
git push -u origin main
```

**Catatan:** Jika diminta login, gunakan GitHub username dan Personal Access Token (bukan password).

**Jika belum punya Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Beri nama: `vercel-deploy`
4. Centang scope: `repo` (full control)
5. Generate token
6. **SIMPAN TOKEN INI** (hanya muncul sekali!)
7. Gunakan token sebagai password saat push

### Langkah 8: Verifikasi

Buka repository di GitHub, pastikan semua file sudah ter-upload.

---

## 🌐 BAGIAN 2: DEPLOY KE VERCEL

### Langkah 1: Login ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Klik **"Sign Up"** atau **"Log In"**
3. Pilih **"Continue with GitHub"** (paling mudah)
4. Authorize Vercel untuk akses GitHub Anda

### Langkah 2: Import Project dari GitHub

1. Setelah login, klik **"Add New..."** → **"Project"**
2. Di halaman "Import Git Repository", pilih repository yang baru saja dibuat
3. Klik **"Import"**

### Langkah 3: Konfigurasi Project

Di halaman "Configure Project":

1. **Project Name:** Biarkan default atau ubah sesuai keinginan
2. **Framework Preset:** Otomatis terdeteksi sebagai "Next.js" ✅
3. **Root Directory:** Biarkan `./` (default)
4. **Build Command:** Biarkan `npm run build` (default)
5. **Output Directory:** Biarkan `.next` (default)
6. **Install Command:** Biarkan `npm install` (default)

**JANGAN klik "Deploy" dulu!** Kita perlu setup environment variables terlebih dahulu.

### Langkah 4: Setup Environment Variables

1. Di halaman konfigurasi, scroll ke bawah ke bagian **"Environment Variables"**
2. Klik **"Add"** untuk setiap variable berikut:

#### Variable 1: DATABASE_URL

**Name:** `DATABASE_URL`

**Value:** Connection string dari Supabase (gunakan **Session Pooler** untuk production)

**Cara mendapatkan:**
1. Buka Supabase Dashboard → Project Anda
2. Settings (icon gear) → Database
3. Scroll ke "Connection string"
4. Pilih tab **"URI"**
5. Pilih **"Method: Session mode"** (Pooler)
6. Copy connection string
7. Ganti `[YOUR-PASSWORD]` dengan password database Anda

**Format:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**Paste di Value field, lalu klik "Add"**

---

#### Variable 2: NEXTAUTH_URL

**Name:** `NEXTAUTH_URL`

**Value:** `https://your-project.vercel.app` (akan diupdate setelah deploy)

**Untuk sementara, isi dengan:** `https://your-project.vercel.app`

**Klik "Add"**

---

#### Variable 3: NEXTAUTH_SECRET

**Name:** `NEXTAUTH_SECRET`

**Value:** Generate secret key

**Cara generate:**
1. Buka terminal/command prompt
2. Jalankan:
```bash
openssl rand -base64 32
```
3. Copy hasilnya (contoh: `aBc123XyZ456...`)
4. Paste di Value field

**Klik "Add"**

---

#### Variable 4: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

**Name:** `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

**Value:** Cloud name dari Cloudinary Anda

**Cara mendapatkan:**
1. Login ke [cloudinary.com](https://cloudinary.com)
2. Dashboard → lihat "Cloud name" di bagian atas

**Klik "Add"**

---

#### Variable 5: NEXT_PUBLIC_CLOUDINARY_API_KEY

**Name:** `NEXT_PUBLIC_CLOUDINARY_API_KEY`

**Value:** API Key dari Cloudinary

**Cara mendapatkan:**
1. Cloudinary Dashboard → Settings (icon gear)
2. Tab "Security"
3. Copy "API Key"

**Klik "Add"**

---

#### Variable 6: CLOUDINARY_API_SECRET

**Name:** `CLOUDINARY_API_SECRET`

**Value:** API Secret dari Cloudinary

**Cara mendapatkan:**
1. Cloudinary Dashboard → Settings (icon gear)
2. Tab "Security"
3. Klik "Reveal" di "API Secret"
4. Copy API Secret

**Klik "Add"**

---

#### Variable 7: OPENAI_API_KEY

**Name:** `OPENAI_API_KEY`

**Value:** API Key dari OpenAI

**Cara mendapatkan:**
1. Login ke [platform.openai.com](https://platform.openai.com)
2. API Keys → Create new secret key
3. Copy API key (hanya muncul sekali, simpan dengan baik!)

**Klik "Add"**

---

### Langkah 5: Deploy Project

1. Setelah semua environment variables ditambahkan, scroll ke atas
2. Klik tombol **"Deploy"**
3. Tunggu proses build selesai (~2-5 menit)
4. Anda akan melihat progress build di layar

### Langkah 6: Update NEXTAUTH_URL

Setelah deploy selesai:

1. Vercel akan memberikan URL seperti: `https://pec-website-abc123.vercel.app`
2. **Copy URL ini**
3. Di Vercel Dashboard → Project Anda → Settings → Environment Variables
4. Cari `NEXTAUTH_URL`
5. Klik **"Edit"**
6. Ganti value dengan URL production Anda (contoh: `https://pec-website-abc123.vercel.app`)
7. Klik **"Save"**
8. Kembali ke tab **"Deployments"**
9. Klik **"..."** di deployment terbaru → **"Redeploy"**
10. Tunggu redeploy selesai

---

## ✅ BAGIAN 3: VERIFIKASI & TESTING

### Test Website Production

1. Buka URL production dari Vercel (contoh: `https://pec-website-abc123.vercel.app`)
2. Test halaman-halaman berikut:
   - ✅ Homepage (`/`)
   - ✅ About (`/about`)
   - ✅ Services (`/services`)
   - ✅ Testimonials (`/testimonials`)
   - ✅ Branches (`/branches`)

### Test Admin Panel

1. Buka `/admin/login`
2. Login dengan:
   - **Email:** `admin@pec.id`
   - **Password:** `admin123`
3. Test fitur admin:
   - ✅ Dashboard
   - ✅ CRUD Content
   - ✅ CRUD Services
   - ✅ CRUD Testimonials
   - ✅ CRUD Branches
   - ✅ CRUD FAQs

### Test Chatbot

1. Klik floating chatbot button (pojok kanan bawah)
2. Test dengan pertanyaan seperti:
   - "Apakah PEC menyediakan kelas online?"
   - "Berapa biaya kursus?"
   - "Dimana lokasi cabang?"

---

## 🔧 TROUBLESHOOTING

### Error: Build Failed

**Kemungkinan penyebab:**
- Environment variables belum lengkap
- Connection string salah

**Solusi:**
1. Cek semua environment variables sudah ditambahkan
2. Pastikan `DATABASE_URL` menggunakan Session Pooler (bukan Direct)
3. Redeploy project

### Error: Database Connection Failed

**Kemungkinan penyebab:**
- `DATABASE_URL` salah
- Password mengandung special characters yang perlu di-encode

**Solusi:**
1. Cek connection string di Supabase
2. Jika password mengandung `@`, `#`, `%`, dll, URL-encode mereka:
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`
3. Update `DATABASE_URL` di Vercel
4. Redeploy

### Error: NextAuth Not Working

**Kemungkinan penyebab:**
- `NEXTAUTH_URL` belum diupdate dengan URL production

**Solusi:**
1. Update `NEXTAUTH_URL` di Vercel dengan URL production
2. Redeploy project

### Website Blank / Error 500

**Kemungkinan penyebab:**
- Database belum di-seed
- Environment variables salah

**Solusi:**
1. Cek logs di Vercel Dashboard → Deployments → klik deployment → View Function Logs
2. Pastikan database sudah di-seed (jalankan `npm run db:seed` di local, data akan tersimpan di Supabase)
3. Cek semua environment variables

---

## 📌 CHECKLIST FINAL

Sebelum menutup, pastikan:

- [ ] Code sudah ter-push ke GitHub
- [ ] Project sudah ter-deploy di Vercel
- [ ] Semua environment variables sudah di-set
- [ ] `NEXTAUTH_URL` sudah diupdate dengan URL production
- [ ] Website production bisa diakses
- [ ] Admin panel bisa login
- [ ] Database sudah di-seed dengan data
- [ ] Chatbot berfungsi
- [ ] Semua halaman public bisa diakses

---

## 🎉 SELESAI!

Website Anda sudah live di Vercel! 

**URL Production:** `https://your-project.vercel.app`

**Tips:**
- Setiap kali push ke GitHub, Vercel akan otomatis deploy ulang
- Untuk update environment variables, edit di Vercel Dashboard → Settings → Environment Variables → Redeploy
- Untuk melihat logs, buka Vercel Dashboard → Deployments → klik deployment → View Function Logs

---

## 📞 BUTUH BANTUAN?

Jika ada error atau masalah, cek:
1. Vercel Function Logs (untuk melihat error detail)
2. Supabase Dashboard → Logs (untuk melihat database errors)
3. File `TROUBLESHOOTING.md` di project

**Selamat! Website Anda sudah online! 🚀**

