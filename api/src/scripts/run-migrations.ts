import { buildDataSource } from "../db/data-source";

async function runMigrations() {
  const AppDataSource = buildDataSource();

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    console.log("Running migrations...");
    await AppDataSource.runMigrations();
    console.log("Migrations completed successfully");

    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  } catch (error) {
    console.error("Migration failed:", error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

runMigrations();
