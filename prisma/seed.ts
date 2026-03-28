import { PrismaClient } from "@prisma/client";

const seedPrisma = new PrismaClient();

async function main() {
  await seedPrisma.product.deleteMany(); // Clear existing

  const dummyProducts = [
    { name: "Aura React Pro", description: "Premium street sneaker.", price: 2024, original: 4499, discount: "-55%", category: "new", tag: "NEW", imageUrl: "/images/hero-shoe.png" },
    { name: "Velocity X Street", description: "Everyday comfort.", price: 3499, original: 6999, discount: "-50%", category: "men", tag: null, imageUrl: "/images/hero-shoe.png" },
    { name: "Cloud Runner Lite", description: "Lightweight running shoe.", price: 2599, original: 4999, discount: "-40%", category: "women", tag: "TRENDING", imageUrl: "/images/hero-shoe.png" },
    { name: "Fade Pro Sneakers", description: "Advanced stability.", price: 4399, original: 7999, discount: "-45%", category: "men", tag: null, imageUrl: "/images/hero-shoe.png" },
    { name: "Street Element", description: "Urban style.", price: 1299, original: 1999, discount: "-30%", category: "men", tag: null, imageUrl: "/images/hero-shoe.png" },
    { name: "Aero Float", description: "Aero dynamics.", price: 1899, original: 2999, discount: "-35%", category: "women", tag: null, imageUrl: "/images/hero-shoe.png" },
    { name: "Titan Max", description: "Premium build.", price: 5200, original: 8999, discount: "-40%", category: "men", tag: "PREMIUM", imageUrl: "/images/hero-shoe.png" },
    { name: "Neon Flux", description: "Neon accent sneakers.", price: 2100, original: 3000, discount: "-30%", category: "new", tag: "LIMITED", imageUrl: "/images/hero-shoe.png" },
  ];

  for (const product of dummyProducts) {
    await seedPrisma.product.create({ data: product });
  }

  console.log("Database seeded successfully with dummy products!");
}

main()
  .then(async () => {
    await seedPrisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await seedPrisma.$disconnect();
    process.exit(1);
  });
