# Troubleshooting Guide

## Error: P1001 - Can't reach database server

### Penyebab:
1. Menggunakan connection string dengan `?pgbouncer=true` untuk direct connection
2. Password belum diganti dari `[YOUR-PASSWORD]`
3. Network/firewall blocking connection

### Solusi:

#### 1. Pastikan Menggunakan Direct Connection untuk Development

Untuk `npm run db:push` dan `npm run db:seed`, gunakan **Direct connection** (BUKAN Pooler):

1. Buka Supabase Dashboard > Settings > Database
2. Di **Connection string**, pilih **Method: Direct connection**
3. Copy connection string (format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
4. **JANGAN tambahkan `?pgbouncer=true`**
5. Pastikan password sudah diganti (bukan `[YOUR-PASSWORD]`)

**Contoh yang BENAR:**
```env
DATABASE_URL="postgresql://postgres:MySecurePassword123@db.xgkmmfeyxozfarsecbgc.supabase.co:5432/postgres"
```

**Contoh yang SALAH:**
```env
# ❌ SALAH - menggunakan pgbouncer untuk direct connection
DATABASE_URL="postgresql://postgres:MyPassword@db.xgkmmfeyxozfarsecbgc.supabase.co:5432/postgres?pgbouncer=true"

# ❌ SALAH - password belum diganti
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xgkmmfeyxozfarsecbgc.supabase.co:5432/postgres"
```

#### 2. Verifikasi Password

1. Pastikan password di `.env` sudah diganti dengan password database yang Anda buat saat setup Supabase
2. Jika lupa password, reset di Supabase Dashboard > Settings > Database > Reset database password

#### 3. Test Connection

Coba test connection dengan Prisma Studio:
```bash
npm run db:studio
```

Jika Prisma Studio bisa connect, berarti connection string sudah benar.

## Error: IPv4 Compatibility

Jika melihat warning "Not IPv4 compatible" di Supabase:

### Solusi:
1. Gunakan **Session Pooler** connection string (bukan Direct connection)
2. Atau gunakan **Transaction mode** pooler
3. Format pooler: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres`

**Catatan:** Pooler connection string TIDAK bisa digunakan untuk `db:push`. Gunakan Direct connection untuk migrations, lalu switch ke Pooler untuk production.

## Error: Build Failed di Vercel

### Penyebab:
- Environment variables belum di-set
- Connection string salah
- Missing dependencies

### Solusi:

1. **Cek Environment Variables di Vercel:**
   - Project Settings > Environment Variables
   - Pastikan semua variables sudah di-set:
     - `DATABASE_URL` (gunakan Session Pooler untuk production)
     - `NEXTAUTH_URL`
     - `NEXTAUTH_SECRET`
     - Cloudinary credentials
     - OpenAI API key

2. **Pastikan Connection String untuk Production:**
   - Gunakan **Session Pooler** connection string (bukan Direct)
   - Format: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres`

3. **Redeploy setelah update environment variables**

## Error: NextAuth Issues

### Penyebab:
- `NEXTAUTH_URL` tidak sesuai dengan domain production
- `NEXTAUTH_SECRET` belum di-set

### Solusi:

1. **Update NEXTAUTH_URL:**
   ```env
   # Development
   NEXTAUTH_URL="http://localhost:3000"
   
   # Production (Vercel)
   NEXTAUTH_URL="https://your-project.vercel.app"
   ```

2. **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

3. **Update di Vercel Environment Variables**

## Tips Umum

1. **Dua Connection String:**
   - Development: Direct connection (untuk migrations)
   - Production: Session Pooler (untuk Vercel)

2. **Password Encoding:**
   - Jika password mengandung special characters, URL-encode mereka
   - Contoh: `@` menjadi `%40`, `#` menjadi `%23`

3. **Test Local First:**
   - Pastikan `npm run db:push` berhasil di local sebelum deploy
   - Test dengan `npm run db:studio` untuk verify connection

4. **Check Supabase Status:**
   - Pastikan project Supabase masih aktif
   - Cek di Supabase Dashboard > Settings > General

