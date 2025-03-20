import { PrismaClient } from "@prisma/client";
import { nodeEnv } from "../config/environment";

const prisma = new PrismaClient();

const resetDatabase = async () => {
  if (nodeEnv !== "test") {
    console.log("Resetting database...");
    await prisma.$executeRaw`DROP SCHEMA IF EXISTS public CASCADE`;
    await prisma.$executeRaw`CREATE SCHEMA public`;
    console.log("Database reset complete.");
  }
};

const applyMigrations = async () => {
  console.log("Applying migrations...");
  await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await prisma.$executeRaw`SET search_path TO public`;
  await prisma.$executeRaw`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO PUBLIC`;
  await prisma.$executeRaw`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO PUBLIC`;
  console.log("Migrations applied.");
};

const buildModels = async () => {
  await resetDatabase();
  await applyMigrations();
};

if (nodeEnv !== "test") buildModels();

export default buildModels;
