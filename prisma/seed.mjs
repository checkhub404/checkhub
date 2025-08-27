// prisma/seed.mjs
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // --- شعب نمونه (اگر وجود نداشت بساز) ---
  const br1 = await prisma.branch.upsert({
    where: { code: 'BR-001' },
    update: {},
    create: { code: 'BR-001', name: 'شعبه اول' },
  })
  const br3 = await prisma.branch.upsert({
    where: { code: 'BR-003' },
    update: {},
    create: { code: 'BR-003', name: 'شعبه سوم' },
  })

  // --- ادمین سیستم ---
  const adminPass = await bcrypt.hash('admin123!', 10)
  await prisma.user.upsert({
    where: { email: 'admin@checkhub.local' },
    update: { passwordHash: adminPass, role: 'ADMIN', branchId: null },
    create: {
      email: 'admin@checkhub.local',
      name: 'مدیر سیستم',
      role: 'ADMIN',
      passwordHash: adminPass,
    },
  })

  // (اختیاری) یک کاربر شعبه سوم برای تست
  const branchPass = await bcrypt.hash('branch123!', 10)
  await prisma.user.upsert({
    where: { email: 'branch3@checkhub.local' },
    update: { passwordHash: branchPass, role: 'BRANCH', branchId: br3.id },
    create: {
      email: 'branch3@checkhub.local',
      name: 'کاربر شعبه سوم',
      role: 'BRANCH',
      branchId: br3.id,
      passwordHash: branchPass,
    },
  })

  console.log('✅ Seed done:')
  console.log('- Admin  : admin@checkhub.local / admin123!')
  console.log('- Branch : branch3@checkhub.local / branch123!')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
