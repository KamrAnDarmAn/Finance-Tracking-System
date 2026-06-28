import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Charlie",
  database: "type-graphql-practice",
  synchronize: true, // Set to false in production to prevent data loss!
  logging: false,
  // entities: [__dirname + "/entities/**/*.ts"],
  // migrations: [__dirname + "/migrations/**/*.ts"],
  entities: ["./src/entities/*.ts"],
  migrations: ["./src/migrations/*.ts"],
});
