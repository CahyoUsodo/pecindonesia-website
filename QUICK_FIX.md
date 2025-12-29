# Quick Fix - Error P1001 Database Connection

## Masalah: Can't reach database server

Jika Anda melihat error `P1001: Can't reach database server`, kemungkinan penyebabnya:

### 1. Supabase Project Paused (Paling Umum)

**Free tier Supabase bisa pause project setelah 7 hari tidak aktif.**

**Solusi:**
1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Cek apakah project Anda menunjukkan status "Paused" atau "Inactive"
3. Jika paused, klik **"Restore"** atau **"Resume"** button
4. Tunggu 1-2 menit sampai project aktif kembali
5. Coba `npm run db:push` lagi

### 2. Gunakan Session Pooler (Alternatif)

Jika Direct connection tidak bekerja, coba gunakan Session Pooler:

1. Di Supabase Dashboard > Settings > Database > Connection string
2. Pilih **Method: Session mode** (Pooler)
3. Copy connection string (format berbeda, menggunakan port 6543)
4. Update `.env` dengan connection string pooler
5. **CATATAN:** Pooler TIDAK bisa digunakan untuk `db:push` langsung

**Workaround untuk Pooler:**
- Gunakan Supabase SQL Editor untuk run migrations manual
- Atau gunakan Prisma Migrate dengan connection string pooler (beberapa fitur mungkin terbatas)

### 3. Cek Network/Firewall

Jika menggunakan corporate network atau VPN:
- Coba disable VPN
- Cek apakah port 5432 di-block oleh firewall
- Coba dari network berbeda (mobile hotspot)

### 4. Verify Project Status

1. Login ke Supabase Dashboard
2. Pastikan project masih ada dan aktif
3. Cek di **Settings > General** untuk project status
4. Jika project dihapus, buat project baru

### 5. Test Connection dengan Prisma Studio

```bash
npm run db:studio
```

Jika Prisma Studio bisa connect, berarti connection string benar tapi ada masalah dengan `db:push`.

### 6. Alternative: Gunakan Supabase SQL Editor

Jika `db:push` tidak bekerja, Anda bisa run schema manual:

1. Buka Supabase Dashboard > SQL Editor
2. Copy schema dari `prisma/schema.prisma`
3. Convert ke SQL dan run di SQL Editor
4. Atau gunakan Supabase Table Editor untuk create tables manual

## Langkah Cepat

**Coba urutan ini:**

1. ✅ Cek Supabase Dashboard - apakah project paused?
2. ✅ Jika paused, klik Restore dan tunggu 1-2 menit
3. ✅ Coba `npm run db:push` lagi
4. ✅ Jika masih error, coba dari network berbeda
5. ✅ Atau gunakan Supabase SQL Editor untuk setup manual

## Still Not Working?

Jika semua langkah di atas tidak bekerja:
- Buat project Supabase baru
- Update `DATABASE_URL` dengan connection string baru
- Coba `npm run db:push` lagi

