import "reflect-metadata";
import { DataSource } from "typeorm"; //this is called an entity manager in type orm
import { User } from "../entities/user.entity";
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [User],
  synchronize: true,
  migrations: ["dist/migrations/**/*.js"],
});

export const initializeDatabase = async (): Promise<DataSource> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connection established");
    }
    return AppDataSource;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};
