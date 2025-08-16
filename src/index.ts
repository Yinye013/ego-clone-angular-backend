import dotenv from "dotenv";
dotenv.config();
import app from "./server";

import prisma from "./config/db.config";

const PORT = process.env.PORT || 3000;

async function connectWithRetry(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      console.log("✓ Database connected");
      return true;
    } catch (error) {
      console.log(
        `Database connection attempt ${i + 1} failed:`,
        error instanceof Error ? error.message : error
      );

      if (i === retries - 1) {
        throw error;
      }

      console.log(`Retrying in 2 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  return false;
}

async function startServer() {
  try {
    console.log("Attempting to connect to database...");
    await connectWithRetry();

    const server = app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });

    // Improved graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`Received ${signal}, shutting down gracefully...`);

      server.close(async () => {
        try {
          await prisma.$disconnect();
          console.log("✓ Database disconnected");
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
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
