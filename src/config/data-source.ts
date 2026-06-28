import "reflect-metadata";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DataSource } from "typeorm";
import { env } from "./env.js";
import { User } from "../entities/users.entity.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  synchronize: env.NODE_ENV === "development",
  logging: env.NODE_ENV === "development",
  entities: [User],
  migrations: [path.join(__dirname, "..", "migrations", "*.ts")],
  subscribers: [],
});

export const initializeDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("TypeORM connection initialized");
  }
};
