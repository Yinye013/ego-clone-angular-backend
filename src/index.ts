import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import app from "./server";
import { AppDataSource, initializeDatabase } from "./config/database.config";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log("Attempting to connect to database...");
    await initializeDatabase();

    const server = app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });

    // Improved graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`Received ${signal}, shutting down gracefully...`);

      server.close(async () => {
        try {
          if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log("✓ Database disconnected");
          }
          process.exit(0);
        } catch (error) {
          console.error("Error during shutdown:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error);
    console.error("Please check:");
    console.error("1. Your Neon database is active");
    console.error("2. Your DATABASE_URL is correct");
    console.error("3. Your internet connection");
    process.exit(1);
  }
}

startServer();
