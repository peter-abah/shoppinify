import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Deletes all data in database
// NOTE: Need to add new models to function if they are added to prisma schema
async function clearDBData() {
  await prisma.user.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.verificationToken.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.shoppingList.deleteMany({});
}

async function addDefaultData() {
  // Create categories
  const foodAndVegCategory = await prisma.category.create({
    data: {
      name: "Food and Vegetables",
    },
  });
  const meatFishCategory = await prisma.category.create({
    data: {
      name: "Meat and Fish",
    },
  });
  const beveragesCategory = await prisma.category.create({
    data: {
      name: "Beverages",
    },
  });

  // Create Items
  const items = [
    { name: "Avocado", categoryId: foodAndVegCategory.id },
    { name: "Banana", categoryId: foodAndVegCategory.id },
    { name: "Bunch of Carrots", categoryId: foodAndVegCategory.id },
    { name: "Watermelon", categoryId: foodAndVegCategory.id },
    { name: "Pepper", categoryId: foodAndVegCategory.id },
    { name: "Chicken 1kg", categoryId: meatFishCategory.id },
    { name: "Salmon", categoryId: meatFishCategory.id },
    { name: "Beef 1kg", categoryId: meatFishCategory.id },
    { name: "Lucozade boost can pack", categoryId: beveragesCategory.id },
    { name: "Cocacola drink pack", categoryId: beveragesCategory.id },
  ];
  await prisma.item.createMany({ data: items });
}

async function main() {
  await clearDBData();
  await addDefaultData();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
