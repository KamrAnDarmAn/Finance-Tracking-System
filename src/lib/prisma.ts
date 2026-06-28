// import "dotenv/config";
import { PrismaClient } from "@prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { Pool } from "pg";
// import dotenv from "dotenv";
// dotenv.config();
//
// const databaseUrl = process.env.DATABASE_URL
//
//
// if (!databaseUrl) {
//   throw new Error("DATABASE_URL is not set in environment variables.");
// }
//
// const pool = new Pool({
//   connectionString: databaseUrl,
// });
//
// const adapter = new PrismaPg(pool);
// export const prisma = new PrismaClient({
//   adapter: adapter,
//   log: ['error']
// });

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
export { prisma };
