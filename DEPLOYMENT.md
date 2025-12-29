# Deployment Guide - PEC Website ke Vercel dengan Supabase

## 1. Setup Supabase Database

### Langkah 1: Buat Project di Supabase

1. Kunjungi [supabase.com](https://supabase.com) dan buat akun/login
2. Klik "New Project"
3. Isi detail project:
   - **Name:** pec-website (atau nama lain)
   - **Database Password:** Buat password yang kuat (simpan untuk nanti!)
   - **Region:** Pilih region terdekat (Singapore untuk Indonesia)
4. Klik "Create new project" dan tunggu setup selesai (~2 menit)

### Langkah 2: Dapatkan Connection String

**PENTING:** Ada 2 jenis connection string yang berbeda:

#### A. Untuk Development (Local - db:push, migrations):

1. Di Supabase Dashboard, klik **Settings** (icon gear) > **Database**
2. Scroll ke **Connection string**
3. Pilih tab **URI**
4. Pilih **Method: Direct connection** (BUKAN Pooler!)
5. Copy connection string
6. Ganti `[YOUR-PASSWORD]` dengan password database Anda
7. **JANGAN tambahkan `?pgbouncer=true`** - ini untuk direct connection

**Format untuk Development:**
```
postgresql://postgres:[PASSWORD]@db.[project-ref].supabase.co:5432/postgres
```

#### B. Untuk Production (Vercel):

1. Di **Connection string**, pilih **Method: Session mode** (Pooler)
2. Copy connection string yang sudah include pooler
3. Format akan seperti:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**Catatan:** 
- Gunakan **Direct connection** untuk `db:push` dan `db:seed` di local
- Gunakan **Session Pooler** untuk production di Vercel

### Langkah 3: Setup Database Schema

1. Di terminal lokal, pastikan `.env` sudah diisi dengan `DATABASE_URL` dari Supabase
2. Jalankan:
   ```bash
   npm run db:push
   ```
3. Seed database dengan dummy data:
   ```bash
   npm run db:seed
   ```

## 2. Setup Vercel Deployment

### Langkah 1: Push Code ke GitHub

1. Buat repository baru di GitHub
2. Push code ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/repo-name.git
   git push -u origin main
   ```

### Langkah 2: Deploy ke Vercel

1. Kunjungi [vercel.com](https://vercel.com) dan login dengan GitHub
2. Klik **Add New Project**
3. Import repository GitHub Anda
4. Configure project:
   - **Framework Preset:** Next.js (auto-detect)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

### Langkah 3: Setup Environment Variables di Vercel

Di halaman project settings, tambahkan semua environment variables:

1. **Database:**
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[project-ref].supabase.co:5432/postgres?pgbouncer=true
   ```

2. **NextAuth:**
   ```
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=generate-random-string-here
   ```
   Untuk generate `NEXTAUTH_SECRET`, jalankan:
   ```bash
   openssl rand -base64 32
   ```

3. **Cloudinary:**
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **OpenAI:**
   ```
   OPENAI_API_KEY=your-openai-api-key
   ```

### Langkah 4: Deploy

1. Klik **Deploy**
2. Tunggu build selesai (~2-3 menit)
3. Setelah deploy berhasil, Vercel akan memberikan URL seperti: `https://your-project.vercel.app`

## 3. Post-Deployment Setup

### Update NEXTAUTH_URL

Setelah deploy, update `NEXTAUTH_URL` di Vercel environment variables dengan URL production Anda:
```
NEXTAUTH_URL=https://your-project.vercel.app
```

### Setup Custom Domain (Optional)

1. Di Vercel project settings, pilih **Domains**
2. Tambahkan custom domain Anda
3. Follow instruksi untuk setup DNS

### Run Database Migrations di Production

Jika perlu, Anda bisa run migrations langsung ke Supabase:
```bash
# Set DATABASE_URL di local .env ke Supabase production URL
npm run db:push
```

## 4. Troubleshooting

### Error: Database Connection Failed
- Pastikan `DATABASE_URL` sudah benar
- Pastikan password di connection string sudah benar
- Cek apakah Supabase project masih aktif

### Error: NextAuth Issues
- Pastikan `NEXTAUTH_URL` sesuai dengan domain production
- Pastikan `NEXTAUTH_SECRET` sudah di-set
- Clear browser cache dan cookies

### Error: Build Failed
- Cek apakah semua environment variables sudah di-set di Vercel
- Pastikan tidak ada syntax errors di code
- Cek build logs di Vercel dashboard

## 5. Monitoring

- **Vercel Analytics:** Aktifkan di project settings untuk monitoring traffic
- **Supabase Dashboard:** Monitor database usage dan performance
- **Logs:** Check Vercel function logs untuk debugging

## Tips

1. **Connection Pooling:** Gunakan `?pgbouncer=true` di connection string untuk better performance
2. **Environment Variables:** Jangan commit `.env` file ke GitHub (sudah di `.gitignore`)
3. **Database Backups:** Supabase otomatis backup, tapi bisa setup manual backup juga
4. **Preview Deployments:** Vercel otomatis membuat preview untuk setiap PR

