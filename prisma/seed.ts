import { createClient } from '@libsql/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { PrismaClient } from '../app/generated/prisma/client'
import bcrypt from 'bcryptjs'
import path from 'path'

const dbPath = path.resolve(process.cwd(), 'prisma/dev.db')
const libsql = createClient({ url: `file:${dbPath}` })
const adapter = new PrismaLibSQL(libsql)
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  // Clean existing data
  await prisma.wearLog.deleteMany()
  await prisma.outfitItem.deleteMany()
  await prisma.outfit.deleteMany()
  await prisma.clothingItem.deleteMany()
  await prisma.user.deleteMany()

  // Create demo user (password: demo1234)
  const hashedPassword = await bcrypt.hash('demo1234', 10)
  const user = await prisma.user.create({
    data: {
      email: 'demo@hioo.app',
      password: hashedPassword,
      name: 'Chloe',
      measurements: JSON.stringify({ height: '5\'6"', bust: '34', waist: '26', hips: '36', shoe: '7.5' }),
    },
  })

  console.log('Created demo user: demo@hioo.app / demo1234')

  // Clothing items — realistic wardrobe
  const items = await Promise.all([
    // Tops
    prisma.clothingItem.create({ data: { userId: user.id, name: 'White Linen Button-Down', category: 'tops', color: 'white', brand: 'Everlane', occasions: 'casual,business', seasons: 'spring,summer', price: 78, timesWorn: 24, purchaseDate: new Date('2025-03-15') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Black Fitted Tee', category: 'tops', color: 'black', brand: 'COS', occasions: 'casual', seasons: 'spring,summer,fall', price: 35, timesWorn: 42, purchaseDate: new Date('2024-09-01') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Navy Breton Stripe', category: 'tops', color: 'navy', brand: 'Saint James', occasions: 'casual', seasons: 'spring,fall', price: 95, timesWorn: 18, purchaseDate: new Date('2025-05-20') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Cream Cashmere Sweater', category: 'tops', color: 'beige', brand: 'Naadam', occasions: 'casual,business', seasons: 'fall,winter', price: 145, timesWorn: 31, purchaseDate: new Date('2024-11-10') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Sage Silk Blouse', category: 'tops', color: 'green', brand: 'Reformation', occasions: 'business,formal', seasons: 'spring,summer,fall', price: 128, timesWorn: 12, purchaseDate: new Date('2025-07-05') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Grey Oversized Hoodie', category: 'tops', color: 'gray', brand: 'Nike', occasions: 'casual', seasons: 'fall,winter', price: 65, timesWorn: 38, purchaseDate: new Date('2024-08-20') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Rust Ribbed Tank', category: 'tops', color: 'orange', brand: 'Aritzia', occasions: 'casual', seasons: 'summer', price: 30, timesWorn: 15, purchaseDate: new Date('2025-06-01') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Lavender Cropped Cardigan', category: 'tops', color: 'purple', brand: 'Sézane', occasions: 'casual,business', seasons: 'spring,fall', price: 115, timesWorn: 8, purchaseDate: new Date('2025-09-15') } }),

    // Bottoms
    prisma.clothingItem.create({ data: { userId: user.id, name: 'High-Rise Straight Jeans', category: 'bottoms', color: 'blue', brand: 'AGOLDE', occasions: 'casual', seasons: 'spring,summer,fall,winter', price: 198, timesWorn: 56, purchaseDate: new Date('2024-06-15') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Black Tailored Trousers', category: 'bottoms', color: 'black', brand: 'Theory', occasions: 'business,formal', seasons: 'spring,summer,fall,winter', price: 265, timesWorn: 33, purchaseDate: new Date('2024-10-01') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Olive Cargo Pants', category: 'bottoms', color: 'green', brand: 'Zara', occasions: 'casual', seasons: 'spring,fall', price: 55, timesWorn: 20, purchaseDate: new Date('2025-04-10') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Cream Linen Midi Skirt', category: 'bottoms', color: 'beige', brand: 'Reformation', occasions: 'casual,business', seasons: 'spring,summer', price: 148, timesWorn: 9, purchaseDate: new Date('2025-05-25') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Pleated Wool Trousers', category: 'bottoms', color: 'brown', brand: 'COS', occasions: 'business,formal', seasons: 'fall,winter', price: 135, timesWorn: 14, purchaseDate: new Date('2025-01-20') } }),

    // Shoes
    prisma.clothingItem.create({ data: { userId: user.id, name: 'White Leather Sneakers', category: 'shoes', color: 'white', brand: 'Veja', occasions: 'casual', seasons: 'spring,summer,fall', price: 150, timesWorn: 60, purchaseDate: new Date('2024-05-01') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Black Chelsea Boots', category: 'shoes', color: 'black', brand: 'Blundstone', occasions: 'casual,business', seasons: 'fall,winter', price: 210, timesWorn: 45, purchaseDate: new Date('2024-09-20') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Tan Leather Sandals', category: 'shoes', color: 'brown', brand: 'Ancient Greek Sandals', occasions: 'casual', seasons: 'summer', price: 195, timesWorn: 22, purchaseDate: new Date('2025-06-10') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Nude Pointed Heels', category: 'shoes', color: 'beige', brand: 'Sam Edelman', occasions: 'formal,business', seasons: 'spring,summer,fall', price: 140, timesWorn: 7, purchaseDate: new Date('2025-08-01') } }),

    // Outerwear
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Camel Wool Coat', category: 'outerwear', color: 'brown', brand: 'Max Mara', occasions: 'casual,business,formal', seasons: 'fall,winter', price: 520, timesWorn: 28, purchaseDate: new Date('2024-10-15') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Black Leather Jacket', category: 'outerwear', color: 'black', brand: 'AllSaints', occasions: 'casual', seasons: 'spring,fall', price: 450, timesWorn: 35, purchaseDate: new Date('2024-04-10') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Olive Rain Jacket', category: 'outerwear', color: 'green', brand: 'Rains', occasions: 'casual', seasons: 'spring,fall', price: 110, timesWorn: 16, purchaseDate: new Date('2025-03-01') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Denim Jacket', category: 'outerwear', color: 'blue', brand: 'Levi\'s', occasions: 'casual', seasons: 'spring,summer,fall', price: 98, timesWorn: 21, purchaseDate: new Date('2025-02-14') } }),

    // Accessories
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Gold Chain Necklace', category: 'accessories', color: 'yellow', brand: 'Mejuri', occasions: 'casual,business,formal', seasons: 'spring,summer,fall,winter', price: 85, timesWorn: 48, purchaseDate: new Date('2024-12-25') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Tan Leather Belt', category: 'accessories', color: 'brown', brand: 'Madewell', occasions: 'casual,business', seasons: 'spring,summer,fall,winter', price: 48, timesWorn: 30, purchaseDate: new Date('2024-07-15') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Silk Scarf — Floral', category: 'accessories', color: 'pink', brand: 'Totême', occasions: 'casual,business', seasons: 'spring,fall', price: 190, timesWorn: 11, purchaseDate: new Date('2025-04-20') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Black Leather Tote', category: 'accessories', color: 'black', brand: 'Cuyana', occasions: 'casual,business', seasons: 'spring,summer,fall,winter', price: 248, timesWorn: 52, purchaseDate: new Date('2024-03-01') } }),
    prisma.clothingItem.create({ data: { userId: user.id, name: 'Straw Bucket Hat', category: 'accessories', color: 'beige', brand: 'Lack of Color', occasions: 'casual', seasons: 'summer', price: 70, timesWorn: 6, purchaseDate: new Date('2025-07-01') } }),
  ])

  console.log(`Created ${items.length} clothing items`)

  // Create outfits
  const outfits = await Promise.all([
    prisma.outfit.create({
      data: {
        userId: user.id,
        name: 'Effortless Monday',
        occasion: 'business',
        date: new Date('2026-03-23'),
        items: {
          create: [
            { clothingItemId: items[0].id },   // White linen button-down
            { clothingItemId: items[9].id },   // Black tailored trousers
            { clothingItemId: items[16].id },  // Nude heels
            { clothingItemId: items[21].id },  // Gold chain
          ],
        },
      },
    }),
    prisma.outfit.create({
      data: {
        userId: user.id,
        name: 'Weekend Coffee Run',
        occasion: 'casual',
        date: new Date('2026-03-22'),
        items: {
          create: [
            { clothingItemId: items[1].id },   // Black fitted tee
            { clothingItemId: items[8].id },   // High-rise jeans
            { clothingItemId: items[13].id },  // White sneakers
            { clothingItemId: items[24].id },  // Black tote
          ],
        },
      },
    }),
    prisma.outfit.create({
      data: {
        userId: user.id,
        name: 'Spring Brunch',
        occasion: 'casual',
        date: new Date('2026-03-21'),
        items: {
          create: [
            { clothingItemId: items[4].id },   // Sage silk blouse
            { clothingItemId: items[11].id },  // Cream linen midi skirt
            { clothingItemId: items[15].id },  // Tan leather sandals
            { clothingItemId: items[23].id },  // Silk scarf
          ],
        },
      },
    }),
    prisma.outfit.create({
      data: {
        userId: user.id,
        name: 'Dinner Date',
        occasion: 'formal',
        date: new Date('2026-03-20'),
        items: {
          create: [
            { clothingItemId: items[1].id },   // Black fitted tee
            { clothingItemId: items[9].id },   // Black tailored trousers
            { clothingItemId: items[14].id },  // Black Chelsea boots
            { clothingItemId: items[17].id },  // Camel wool coat
            { clothingItemId: items[21].id },  // Gold chain
          ],
        },
      },
    }),
    prisma.outfit.create({
      data: {
        userId: user.id,
        name: 'Rainy Day Layers',
        occasion: 'casual',
        date: new Date('2026-03-19'),
        items: {
          create: [
            { clothingItemId: items[3].id },   // Cream cashmere sweater
            { clothingItemId: items[10].id },  // Olive cargo pants
            { clothingItemId: items[14].id },  // Black Chelsea boots
            { clothingItemId: items[19].id },  // Olive rain jacket
          ],
        },
      },
    }),
    prisma.outfit.create({
      data: {
        userId: user.id,
        name: 'French Girl Friday',
        occasion: 'casual',
        date: new Date('2026-03-18'),
        items: {
          create: [
            { clothingItemId: items[2].id },   // Navy breton stripe
            { clothingItemId: items[8].id },   // High-rise jeans
            { clothingItemId: items[13].id },  // White sneakers
            { clothingItemId: items[22].id },  // Tan leather belt
          ],
        },
      },
    }),
    prisma.outfit.create({
      data: {
        userId: user.id,
        name: 'Cozy WFH',
        occasion: 'casual',
        date: new Date('2026-03-17'),
        items: {
          create: [
            { clothingItemId: items[5].id },   // Grey oversized hoodie
            { clothingItemId: items[8].id },   // High-rise jeans
            { clothingItemId: items[13].id },  // White sneakers
          ],
        },
      },
    }),
    prisma.outfit.create({
      data: {
        userId: user.id,
        name: 'Summer Office',
        occasion: 'business',
        date: new Date('2026-03-16'),
        items: {
          create: [
            { clothingItemId: items[7].id },   // Lavender cropped cardigan
            { clothingItemId: items[12].id },  // Pleated wool trousers
            { clothingItemId: items[16].id },  // Nude heels
            { clothingItemId: items[24].id },  // Black tote
          ],
        },
      },
    }),
  ])

  console.log(`Created ${outfits.length} outfits`)

  // Create wear logs for the past few weeks
  const wearLogData = [
    { outfitId: outfits[0].id, date: new Date('2026-03-23'), notes: 'Felt put-together all day' },
    { outfitId: outfits[1].id, date: new Date('2026-03-22'), notes: 'Perfect for a chill Saturday' },
    { outfitId: outfits[2].id, date: new Date('2026-03-21'), notes: 'Got compliments on the scarf' },
    { outfitId: outfits[3].id, date: new Date('2026-03-20'), notes: 'Classic and reliable' },
    { outfitId: outfits[4].id, date: new Date('2026-03-19'), notes: 'Stayed dry and warm' },
    { outfitId: outfits[5].id, date: new Date('2026-03-18') },
    { outfitId: outfits[6].id, date: new Date('2026-03-17') },
    { outfitId: outfits[7].id, date: new Date('2026-03-16'), notes: 'Love this combo' },
    { outfitId: outfits[1].id, date: new Date('2026-03-15') },
    { outfitId: outfits[0].id, date: new Date('2026-03-14') },
    { outfitId: outfits[5].id, date: new Date('2026-03-13') },
    { outfitId: outfits[3].id, date: new Date('2026-03-12'), notes: 'Wore this again — need more variety' },
    { outfitId: outfits[6].id, date: new Date('2026-03-11') },
    { outfitId: outfits[2].id, date: new Date('2026-03-10') },
    { outfitId: outfits[4].id, date: new Date('2026-03-09') },
    { outfitId: outfits[1].id, date: new Date('2026-03-08') },
    { outfitId: outfits[0].id, date: new Date('2026-03-07') },
    { outfitId: outfits[7].id, date: new Date('2026-03-06') },
    { outfitId: outfits[5].id, date: new Date('2026-03-05') },
    { outfitId: outfits[3].id, date: new Date('2026-03-04') },
  ]

  for (const log of wearLogData) {
    await prisma.wearLog.create({
      data: {
        userId: user.id,
        outfitId: log.outfitId,
        date: log.date,
        notes: log.notes,
      },
    })
  }

  console.log(`Created ${wearLogData.length} wear logs`)
  console.log('\nDemo account ready!')
  console.log('Email: demo@hioo.app')
  console.log('Password: demo1234')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
