import prisma from "./prisma.client.ts";

export const connectDb = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export const closeDb = async () => {
  await prisma.$disconnect();
  console.log("✅ Database disconnected");
};

export const getDb = () => prisma;
