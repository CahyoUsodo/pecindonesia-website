# Quick Setup Guide - Supabase

## 1. Buat Project Supabase

1. Login ke [supabase.com](https://supabase.com)
2. Klik **New Project**
3. Isi informasi:
   - **Name:** pec-website
   - **Database Password:** (buat password kuat, simpan!)
   - **Region:** Singapore (terdekat untuk Indonesia)
4. Tunggu ~2 menit sampai project ready

## 2. Dapatkan Connection String

### Untuk Development (db:push, migrations):

1. Di dashboard Supabase, klik **Settings** (⚙️) > **Database**
2. Scroll ke **Connection string**
3. Pilih tab **URI**
4. Pilih **Method: Direct connection** (BUKAN Pooler!)
5. Copy connection string
6. Ganti `[YOUR-PASSWORD]` dengan password database Anda
7. **JANGAN tambahkan `?pgbouncer=true`** untuk direct connection

**Format untuk Development:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Untuk Production (Vercel):

1. Di **Connection string**, pilih **Method: Session mode** (Pooler)
2. Copy connection string yang sudah include pooler
3. Format akan seperti:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**PENTING:** 
- Development: Gunakan **Direct connection** (untuk Prisma migrations)
- Production: Gunakan **Session Pooler** (untuk Vercel deployment)

## 3. Setup Database Schema

Di terminal lokal (setelah setup `.env`):

```bash
# Push schema ke Supabase
npm run db:push

# Seed dengan dummy data
npm run db:seed
```

## 4. Verify di Supabase

1. Klik **Table Editor** di sidebar Supabase
2. Anda akan melihat tables: Admin, Content, Service, Branch, Testimonial, Faq
3. Cek apakah data sudah ter-seed dengan benar

## Tips

- **Connection Pooling:** Selalu gunakan `?pgbouncer=true` untuk production
- **Direct Connection:** Untuk Prisma Studio, gunakan connection string tanpa `?pgbouncer=true`
- **Backup:** Supabase otomatis backup setiap hari
- **Monitoring:** Cek **Database** > **Usage** untuk monitor usage

