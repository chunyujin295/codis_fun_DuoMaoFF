import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10)
  const admin = await prisma.user.upsert({
    where: { username: process.env.ADMIN_USERNAME || 'admin' },
    update: {},
    create: {
      username: process.env.ADMIN_USERNAME || 'admin',
      password: adminPassword,
    },
  })
  console.log('Created admin user:', admin.username)

  // Create cats
  const duoduo = await prisma.cat.upsert({
    where: { id: 'duoduo' },
    update: {},
    create: {
      id: 'duoduo',
      name: '多多',
      description: '多多是一只活泼可爱的小橘猫，最喜欢在阳光下打盹，对一切都充满好奇心。',
      personality: '活泼、好奇、爱撒娇',
      color: '橘白',
      birthday: new Date('2023-03-15'),
    },
  })
  console.log('Created cat:', duoduo.name)

  const maomao = await prisma.cat.upsert({
    where: { id: 'maomao' },
    update: {},
    create: {
      id: 'maomao',
      name: '毛毛',
      description: '毛毛是一只温柔优雅的布偶猫，有着蓬松的毛发和蓝宝石般的眼睛，最喜欢被抱着抚摸。',
      personality: '温柔、优雅、粘人',
      color: '重点色',
      birthday: new Date('2023-05-20'),
    },
  })
  console.log('Created cat:', maomao.name)

  // Create sample diary entries
  const diary1 = await prisma.diary.create({
    data: {
      title: '多多的第一个春天',
      content: '今天带多多去院子里晒太阳，它第一次看到蝴蝶，追着跑了好久。最后累得趴在草地上睡着了，真是个可爱的小家伙。',
      mood: '😊',
      weather: '☀️',
      catId: 'duoduo',
    },
  })
  console.log('Created diary entry:', diary1.title)

  const diary2 = await prisma.diary.create({
    data: {
      title: '毛毛的下午茶',
      content: '毛毛今天偷喝了我杯子里的牛奶，被我发现后一脸无辜地看着我。算了，谁让它这么可爱呢。',
      mood: '😋',
      weather: '⛅',
      catId: 'maomao',
    },
  })
  console.log('Created diary entry:', diary2.title)

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
