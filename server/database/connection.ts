import { PrismaClient } from "@prisma/client";
import { dbDev, dbTest, dbProduction, nodeEnv } from "../config/environment";

let connectionString: string | undefined = "";

if (nodeEnv === "development") {
  connectionString = dbDev;
} else if (nodeEnv === "test") {
  connectionString = dbTest;
} else if (nodeEnv === "production") {
  connectionString = dbProduction;
} else {
  throw new Error("Invalid NODE_ENV variable or not given at all.");
}

if (!connectionString) {
  throw new Error("Database URL is not a valid PostgreSQL connection URL.");
}

// Set the DATABASE_URL environment variable
process.env.DATABASE_URL = connectionString;

const prisma = new PrismaClient();

export default prisma;
