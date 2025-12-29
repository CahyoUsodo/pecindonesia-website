# Fix Database Connection Issue

## Masalah
Direct connection tidak bisa diakses dari localhost, meskipun project Supabase healthy dan data sudah ada.

## Solusi: Gunakan Session Pooler

### Langkah 1: Dapatkan Session Pooler Connection String

1. Buka Supabase Dashboard:
   - https://supabase.com/dashboard/project/xgkmmfeyxozfarsecbgc/settings/database

2. Scroll ke **Connection string**

3. Pilih **Method: Session mode** (Pooler)

4. Copy connection string (format akan seperti):
   ```
   postgresql://postgres.xgkmmfeyxozfarsecbgc:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

5. Ganti `[YOUR-PASSWORD]` dengan password database Anda

### Langkah 2: Update .env

Update `DATABASE_URL` di file `.env`:

```env
# Ganti dengan Session Pooler connection string
DATABASE_URL="postgresql://postgres.xgkmmfeyxozfarsecbgc:mosadcahyo28112003@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

**PENTING:** 
- Gunakan port **6543** (bukan 5432)
- Format hostname berbeda: `aws-0-[region].pooler.supabase.com`

### Langkah 3: Restart Server

```bash
# Stop server (Ctrl+C)
# Lalu start lagi
npm run dev
```

### Langkah 4: Test

1. Refresh browser di `http://localhost:3000`
2. Cek console browser (F12) untuk melihat log
3. Data seharusnya sudah muncul

## Catatan

- **Session Pooler** lebih stabil untuk development dan production
- **Direct connection** hanya untuk migrations (`db:push`, `db:seed`)
- Untuk migrations, tetap gunakan direct connection string

## Alternatif: Dua Connection String

Jika ingin tetap menggunakan direct connection untuk migrations:

1. Buat `.env.local` untuk development runtime:
   ```env
   DATABASE_URL="postgresql://postgres.xgkmmfeyxozfarsecbgc:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
   ```

2. Keep `.env` untuk migrations:
   ```env
   DATABASE_URL="postgresql://postgres:password@db.xgkmmfeyxozfarsecbgc.supabase.co:5432/postgres"
   ```

