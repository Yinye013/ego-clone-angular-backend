import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

const entitiesPath = path.join(__dirname, "../entities/**/*.{js,ts}");
const migrationsPath = path.join(__dirname, "../migrations/**/*.{js,ts}");

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
  synchronize: false,
  logging: process.env.NODE_ENV !== "production",
  entities: [User],
  migrations: [migrationsPath],
  subscribers: [],
});

export const initializeDatabase = async (): Promise<DataSource> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✓ Database connected");
    }
    return AppDataSource;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

export default AppDataSource;
