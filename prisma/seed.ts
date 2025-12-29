import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default super admin (password: admin123)
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const superAdmin = await prisma.admin.upsert({
    where: { email: 'admin@pec.id' },
    update: {},
    create: {
      email: 'admin@pec.id',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })
  console.log('✅ Super Admin created:', superAdmin.email)

  // Create default admin (password: admin123)
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.upsert({
    where: { email: 'user@pec.id' },
    update: {},
    create: {
      email: 'user@pec.id',
      password: hashedPasswordAdmin,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin created:', admin.email)

  // Create default content
  const contents = [
    {
      key: 'hero_title',
      value: 'Selamat Datang di PEC Indonesia',
      type: 'text',
    },
    {
      key: 'hero_subtitle',
      value: 'Lembaga Pendidikan Terbaik & Terbesar untuk Masa Depan Cerah',
      type: 'text',
    },
    {
      key: 'hero_description',
      value: 'Kami menyediakan program pendidikan berkualitas tinggi untuk siswa SD hingga SMA. Dengan metode pembelajaran yang menyenangkan dan efektif, kami membantu siswa mencapai prestasi terbaik mereka.',
      type: 'text',
    },
    {
      key: 'about_history',
      value: 'PEC (Practical Education Center) didirikan dengan visi untuk memberikan pendidikan praktis dan berkualitas tinggi. Sejak berdiri, kami telah membantu ribuan siswa mencapai impian mereka melalui program-program unggulan.',
      type: 'text',
    },
    {
      key: 'about_vision',
      value: 'Menjadi lembaga pendidikan terbaik, terbesar, dan terfavorit dengan menghasilkan output siswa yang berprestasi, bermental juara, serta memiliki kecerdasan emosi (EQ) yang baik.',
      type: 'text',
    },
    {
      key: 'about_mission',
      value: '• Menjadikan lembaga sebagai pusat kemuliaan dengan menolong, menyelamatkan, dan mengantarkan para siswa meraih kesuksesan.\n• Membuat sebanyak mungkin orang Indonesia mampu berbahasa Inggris dan berprestasi, dengan menciptakan metode pengajaran PEC yang mudah, sederhana, menyenangkan, serta dengan biaya yang terjangkau.\n• Mengembangkan kecerdasan emosi dan kepribadian unggul siswa.\n• Menjadi mitra terbaik sekolah, masyarakat, dan orang tua dalam meraih kesuksesan siswa.\n• Menciptakan pusat pendidikan yang bagaikan taman indah penuh bunga warna-warni harum semerbak mewangi.\n• Menjadi rumah kedua dan orang tua kedua bagi siswa.',
      type: 'text',
    },
  ]

  for (const content of contents) {
    await prisma.content.upsert({
      where: { key: content.key },
      update: {},
      create: content,
    })
  }
  console.log('✅ Content created')

  // Create services
  const services = [
    {
      title: 'English Course',
      description: 'Program pembelajaran Bahasa Inggris yang komprehensif untuk semua level. Fokus pada speaking, listening, reading, dan writing dengan metode interaktif dan menyenangkan.',
      slug: 'english-course',
      order: 1,
    },
    {
      title: 'Math Tutoring',
      description: 'Bimbingan belajar Matematika untuk siswa SD, SMP, dan SMA. Materi disesuaikan dengan kurikulum sekolah dan dilengkapi dengan latihan soal yang bervariasi.',
      slug: 'math-tutoring',
      order: 2,
    },
    {
      title: 'Bimbel (Bimbingan Belajar)',
      description: 'Program bimbingan belajar lengkap untuk berbagai mata pelajaran. Cocok untuk siswa yang ingin meningkatkan nilai dan memahami konsep dengan lebih baik.',
      slug: 'bimbel',
      order: 3,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    })
  }
  console.log('✅ Services created')

  // Create branches
  const branches = [
    {
      name: 'PEC Pamulang',
      address: 'Jl. Raya Pamulang No. 123, Tangerang Selatan, Banten 15417',
      googleMapsLink: 'https://maps.google.com/?q=PEC+Pamulang',
      contactNumber: '021-12345678',
    },
    {
      name: 'PEC Depok',
      address: 'Jl. Margonda Raya No. 456, Depok, Jawa Barat 16424',
      googleMapsLink: 'https://maps.google.com/?q=PEC+Depok',
      contactNumber: '021-87654321',
    },
    {
      name: 'PEC Jakarta Selatan',
      address: 'Jl. Fatmawati No. 789, Jakarta Selatan, DKI Jakarta 12420',
      googleMapsLink: 'https://maps.google.com/?q=PEC+Jakarta+Selatan',
      contactNumber: '021-11223344',
    },
  ]

  for (const branch of branches) {
    await prisma.branch.create({
      data: branch,
    })
  }
  console.log('✅ Branches created')

  // Create testimonials
  const testimonials = [
    {
      studentName: 'Ahmad Rizki',
      role: 'Siswa SMA Kelas 12',
      reviewText: 'PEC membantu saya meningkatkan nilai Bahasa Inggris secara signifikan. Metode pembelajarannya sangat menyenangkan dan mudah dipahami. Guru-gurunya juga sangat sabar dan profesional.',
      rating: 5,
      photoUrl: null,
    },
    {
      studentName: 'Siti Nurhaliza',
      role: 'Siswa SMP Kelas 9',
      reviewText: 'Program Math Tutoring di PEC sangat membantu saya memahami konsep matematika yang sulit. Sekarang saya lebih percaya diri dalam menghadapi ujian.',
      rating: 5,
      photoUrl: null,
    },
    {
      studentName: 'Budi Santoso',
      role: 'Siswa SD Kelas 6',
      reviewText: 'Saya senang belajar di PEC karena suasana belajarnya menyenangkan. Guru-gurunya ramah dan selalu membantu ketika saya kesulitan.',
      rating: 4,
      photoUrl: null,
    },
    {
      studentName: 'Dewi Lestari',
      role: 'Siswa SMA Kelas 11',
      reviewText: 'Bimbel di PEC sangat lengkap dan terstruktur. Materi yang diajarkan sesuai dengan kurikulum sekolah dan latihan soalnya sangat membantu untuk persiapan ujian.',
      rating: 5,
      photoUrl: null,
    },
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    })
  }
  console.log('✅ Testimonials created')

  // Create FAQs
  const faqs = [
    {
      question: 'Apa saja program yang tersedia di PEC?',
      answer: 'PEC menyediakan berbagai program pendidikan termasuk English Course, Math Tutoring, dan Bimbel (Bimbingan Belajar) untuk berbagai mata pelajaran. Program kami dirancang untuk siswa SD, SMP, dan SMA.',
    },
    {
      question: 'Bagaimana cara mendaftar di PEC?',
      answer: 'Anda dapat mendaftar dengan mengunjungi cabang PEC terdekat atau menghubungi kami melalui nomor telepon yang tersedia. Tim kami akan membantu proses pendaftaran dan memberikan informasi lengkap tentang program yang tersedia.',
    },
    {
      question: 'Berapa biaya untuk mengikuti program di PEC?',
      answer: 'Biaya bervariasi tergantung program yang dipilih. Untuk informasi lengkap mengenai biaya, silakan hubungi cabang PEC terdekat atau hubungi customer service kami.',
    },
    {
      question: 'Apakah PEC menyediakan kelas online?',
      answer: 'Ya, PEC menyediakan opsi pembelajaran online untuk beberapa program. Silakan hubungi kami untuk informasi lebih lanjut mengenai kelas online yang tersedia.',
    },
    {
      question: 'Berapa lama durasi program di PEC?',
      answer: 'Durasi program bervariasi tergantung program yang dipilih. Umumnya, program berlangsung selama satu semester atau sesuai dengan paket yang dipilih. Tim kami akan memberikan informasi lengkap saat pendaftaran.',
    },
    {
      question: 'Apakah PEC menyediakan uji coba kelas?',
      answer: 'Ya, PEC menyediakan kelas trial untuk calon siswa. Silakan hubungi cabang terdekat untuk informasi lebih lanjut mengenai jadwal kelas trial.',
    },
  ]

  for (const faq of faqs) {
    await prisma.faq.create({
      data: faq,
    })
  }
  console.log('✅ FAQs created')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

