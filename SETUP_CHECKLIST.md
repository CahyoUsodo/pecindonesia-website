# Setup Checklist - PEC Website

Gunakan checklist ini untuk memastikan semua langkah setup sudah dilakukan.

## Pre-Setup

- [ ] Node.js terinstall (v18 atau lebih baru)
- [ ] Git terinstall
- [ ] Akun Supabase sudah dibuat
- [ ] Akun Vercel sudah dibuat
- [ ] Akun Cloudinary sudah dibuat (untuk image upload)
- [ ] OpenAI API key sudah didapatkan

## Local Development Setup

- [ ] Clone/download project
- [ ] Run `npm install`
- [ ] Buat file `.env` di root directory
- [ ] Isi `DATABASE_URL` dengan connection string Supabase
- [ ] Isi `NEXTAUTH_URL` dengan `http://localhost:3000`
- [ ] Generate `NEXTAUTH_SECRET` dengan `openssl rand -base64 32`
- [ ] Isi Cloudinary credentials
- [ ] Isi OpenAI API key
- [ ] Run `npm run db:push` untuk setup database schema
- [ ] Run `npm run db:seed` untuk seed dummy data
- [ ] Upload logo ke `public/logo.png`
- [ ] Run `npm run dev` dan test di browser

## Supabase Setup

- [ ] Buat project baru di Supabase
- [ ] Pilih region Singapore (terdekat)
- [ ] Simpan database password dengan aman
- [ ] Dapatkan connection string dari Settings > Database
- [ ] Tambahkan `?pgbouncer=true` di akhir connection string
- [ ] Test connection dengan `npm run db:push`
- [ ] Verify tables sudah dibuat di Supabase Table Editor

## Vercel Deployment

- [ ] Push code ke GitHub repository
- [ ] Import project ke Vercel
- [ ] Setup environment variables di Vercel:
  - [ ] `DATABASE_URL` (dari Supabase)
  - [ ] `NEXTAUTH_URL` (akan diupdate setelah deploy)
  - [ ] `NEXTAUTH_SECRET`
  - [ ] Cloudinary credentials
  - [ ] OpenAI API key
- [ ] Deploy project
- [ ] Update `NEXTAUTH_URL` dengan URL production dari Vercel
- [ ] Redeploy untuk apply perubahan `NEXTAUTH_URL`
- [ ] Test website di production URL

## Post-Deployment

- [ ] Test semua public pages (Home, About, Services, Testimonials, Branches)
- [ ] Test admin login di `/admin/login`
- [ ] Ganti password admin default
- [ ] Test CRUD operations di admin panel
- [ ] Test chatbot widget
- [ ] Test image upload (jika sudah setup Cloudinary)
- [ ] Setup custom domain (optional)
- [ ] Enable Vercel Analytics (optional)

## Security Checklist

- [ ] Password admin default sudah diganti
- [ ] `NEXTAUTH_SECRET` menggunakan random string yang kuat
- [ ] Database password kuat dan aman
- [ ] Environment variables tidak di-commit ke GitHub
- [ ] `.env` file sudah di `.gitignore`

## Optional Enhancements

- [ ] Setup custom domain
- [ ] Enable Vercel Analytics
- [ ] Setup Supabase backups (otomatis, tapi bisa review settings)
- [ ] Setup monitoring/error tracking (Sentry, dll)
- [ ] Optimize images dengan Cloudinary transformations
- [ ] Setup CDN untuk static assets

## Troubleshooting

Jika ada masalah, cek:
- [ ] Semua environment variables sudah di-set dengan benar
- [ ] Database connection string sudah benar
- [ ] Build logs di Vercel untuk error messages
- [ ] Browser console untuk client-side errors
- [ ] Network tab untuk API errors

---

**Tips:**
- Simpan semua credentials di password manager
- Dokumentasikan custom configurations
- Backup database secara berkala
- Monitor usage di Supabase dan Vercel dashboards

