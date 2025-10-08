import { PrismaClient, UserRole } from '@businessdirectory/database';
import bcrypt from 'bcryptjs';
import { randomInt, randomChoice, randomFloat } from '../utils/random';

const prisma = new PrismaClient();

const categories = [
  { name: 'Restaurant', description: 'Food and dining establishments' },
  { name: 'Shopping', description: 'Retail stores and shopping centers' },
  { name: 'Healthcare', description: 'Medical and health services' },
  { name: 'Entertainment', description: 'Movies, games, and entertainment' },
  { name: 'Education', description: 'Schools and educational institutions' },
  { name: 'Technology', description: 'Tech companies and IT services' },
  { name: 'Automotive', description: 'Car services and dealerships' },
  {
    name: 'Beauty & Wellness',
    description: 'Salons, spas, and wellness centers',
  },
];

const businessNames = [
  'Urban Eats',
  'Tech Hub',
  'Green Market',
  'Quick Fix Auto',
  'Wellness Center',
  'Book Haven',
  'Coffee Corner',
  'Fitness First',
  'Pet Paradise',
  'Home Depot',
  'Fashion Forward',
  'Digital Dreams',
];

const addresses = [
  'Peace Avenue 15, Ulaanbaatar',
  'Seoul Street 22, Ulaanbaatar',
  'Chinggis Avenue 44, Ulaanbaatar',
  'Enkh Taivan Avenue 33, Ulaanbaatar',
  'Baga Toiruu 55, Ulaanbaatar',
  'Ikh Toiruu 66, Ulaanbaatar',
];

async function clearDatabase() {
  console.log('🗑️  Clearing database...');

  await prisma.richReviewContent.deleteMany();
  await prisma.reviews.deleteMany();
  await prisma.businessAdmin.deleteMany();
  await prisma.businessAddress.deleteMany();
  await prisma.business.deleteMany();
  await prisma.businessCategory.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Database cleared');
}

async function seedUsers() {
  console.log('👥 Seeding users...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@business.mn',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+97699999999',
        hashedPassword,
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        email: 'superadmin@business.mn',
        firstName: 'Super',
        lastName: 'Admin',
        phone: '+97699999998',
        hashedPassword,
        role: UserRole.SUPERADMIN,
      },
    }),
    ...Array.from({ length: 10 }, (_, i) =>
      prisma.user.create({
        data: {
          email: `user${i + 1}@example.com`,
          firstName: `User${i + 1}`,
          lastName: `Test`,
          phone: `+9769999${String(i).padStart(4, '0')}`,
          hashedPassword,
          role: UserRole.USER,
        },
      })
    ),
  ]);

  console.log(`✅ Created ${users.length} users`);
  return users;
}

async function seedCategories() {
  console.log('🏷️  Seeding business categories...');

  const createdCategories = await Promise.all(
    categories.map((cat) => prisma.businessCategory.create({ data: cat }))
  );

  console.log(`✅ Created ${createdCategories.length} categories`);
  return createdCategories;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedBusinesses(categories: any[]) {
  console.log('🏢 Seeding businesses...');

  const businesses = await Promise.all(
    businessNames.map((name, i) =>
      prisma.business.create({
        data: {
          name,
          email: `${name.toLowerCase().replace(/\s+/g, '')}@business.mn`,
          photo: `https://picsum.photos/seed/${i}/800/600`,
          link: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.mn`,
          summary: `${name} - Your trusted partner in ${randomChoice(
            categories
          ).name.toLowerCase()}`,
          richContent: `<h1>${name}</h1><p>We provide excellent services and products to our valued customers.</p>`,
          description: `Welcome to ${name}. We have been serving the community for years with dedication and quality.`,
          isActive: randomInt(0, 10) > 1, // 90% active
          isInsideMall: randomInt(0, 1) === 1,
          categoryId: randomChoice(categories).id,
        },
      })
    )
  );

  console.log(`✅ Created ${businesses.length} businesses`);
  return businesses;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedBusinessAddresses(businesses: any[]) {
  console.log('📍 Seeding business addresses...');

  const businessAddresses = await Promise.all(
    businesses.flatMap((business) =>
      Array.from({ length: randomInt(1, 3) }, () =>
        prisma.businessAddress.create({
          data: {
            businessId: business.id,
            address: randomChoice(addresses),
            latitude: randomFloat(47.8, 47.95), // Ulaanbaatar coordinates
            longitude: randomFloat(106.8, 106.95),
          },
        })
      )
    )
  );

  console.log(`✅ Created ${businessAddresses.length} business addresses`);
  return businessAddresses;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedReviews(businesses: any[], users: any[]) {
  console.log('⭐ Seeding reviews...');

  const reviews = [];

  for (const business of businesses) {
    const numReviews = randomInt(2, 8);
    const reviewUsers = users.slice(2, 2 + numReviews); // Skip admin users

    for (const user of reviewUsers) {
      try {
        const review = await prisma.reviews.create({
          data: {
            businessId: business.id,
            userId: user.id,
            rating: randomInt(3, 5),
            comment: randomChoice([
              'Great service and friendly staff!',
              'Highly recommend this place.',
              'Good quality products.',
              'Will definitely come back.',
              'Excellent experience overall.',
              'Very professional and efficient.',
            ]),
          },
        });
        reviews.push(review);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Skip duplicate reviews
      }
    }
  }

  console.log(`✅ Created ${reviews.length} reviews`);
  return reviews;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedBusinessAdmins(businesses: any[], users: any[]) {
  console.log('👔 Seeding business admins...');

  const adminUser = users[0]; // First admin user
  const admins = [];

  for (const business of businesses.slice(0, 5)) {
    try {
      const admin = await prisma.businessAdmin.create({
        data: {
          businessId: business.id,
          userId: adminUser.id,
        },
      });
      admins.push(admin);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Skip duplicates
    }
  }

  console.log(`✅ Created ${admins.length} business admins`);
  return admins;
}

export async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    await clearDatabase();

    const users = await seedUsers();
    const categories = await seedCategories();
    const businesses = await seedBusinesses(categories);
    await seedBusinessAddresses(businesses);
    await seedReviews(businesses, users);
    await seedBusinessAdmins(businesses, users);

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('  Super Admin: superadmin@business.mn / password123');
    console.log('  Admin: admin@business.mn / password123');
    console.log('  User: user1@example.com / password123\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed if called directly
if (require.main === module) {
  seed()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
