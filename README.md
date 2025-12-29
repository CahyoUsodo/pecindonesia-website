# PEC Company Profile Website

Website Company Profile untuk Practical Education Center (PEC) Indonesia - Lembaga Pendidikan Terbaik & Terbesar.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** PostgreSQL dengan Prisma ORM
- **Authentication:** NextAuth.js v5
- **Media Storage:** Cloudinary
- **AI Chatbot:** OpenAI API
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Buat file `.env` di root directory dengan isi:

```env
# Database (Supabase) - Development (Direct Connection)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
# Catatan: JANGAN gunakan ?pgbouncer=true untuk development/migrations
# Untuk production di Vercel, gunakan Session Pooler connection string

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
# Generate secret dengan: openssl rand -base64 32

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

**Untuk Supabase:**
1. Buat project di [supabase.com](https://supabase.com)
2. Dapatkan connection string dari Settings > Database
3. Ganti `[PASSWORD]` dengan database password Anda
4. Ganti `[PROJECT-REF]` dengan project reference ID dari Supabase

**Lihat `DEPLOYMENT.md` untuk panduan lengkap setup Supabase dan deployment ke Vercel.**

### 3. Setup Database

```bash
# Push schema ke database
npm run db:push

# Seed database dengan dummy data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Admin Access

- **URL:** `/admin`
- **Default Email:** `admin@pec.id`
- **Default Password:** `admin123`

**PENTING:** Ganti password default setelah pertama kali login!

## Struktur Project

```
ProfilePEC/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public pages
│   ├── admin/             # Admin panel (protected)
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── admin/            # Admin-specific components
├── lib/                  # Utilities & configs
├── prisma/               # Prisma schema & seed
└── public/               # Static assets
```

## Features

### Public Pages
- ✅ Homepage dengan Hero section dan Highlights
- ✅ About page (Sejarah, Visi, Misi)
- ✅ Services page (Daftar layanan)
- ✅ Testimonials page (Testimoni siswa)
- ✅ Branches page (Lokasi cabang)

### Admin Panel
- ✅ Dashboard dengan statistik
- ✅ CRUD untuk Content (dynamic text)
- ✅ CRUD untuk Services
- ✅ CRUD untuk Testimonials
- ✅ CRUD untuk Branches
- ✅ CRUD untuk FAQs

### Additional Features
- ✅ AI Chatbot dengan OpenAI integration
- ✅ SEO optimization (Metadata, Sitemap, JSON-LD)
- ✅ Framer Motion animations
- ✅ Responsive design
- ✅ Image upload via Cloudinary

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:seed` - Seed database with dummy data
- `npm run db:studio` - Open Prisma Studio

## Notes

- Logo harus ditempatkan di `public/logo.png` untuk favicon
- Pastikan semua environment variables sudah diisi sebelum menjalankan aplikasi
- Database harus sudah dibuat sebelum menjalankan `db:push`
- Untuk production deployment ke Vercel dengan Supabase, lihat `DEPLOYMENT.md`

## Deployment

Lihat file `DEPLOYMENT.md` untuk panduan lengkap:
- Setup Supabase database
- Deploy ke Vercel
- Konfigurasi environment variables
- Troubleshooting

