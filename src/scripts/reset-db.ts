import { db } from "@/lib/db";
import {
  contentTable,
  moviesTable,
  seasonsTable,
  episodesTable,
  reviewsTable,
  bookmarksTable,
  downloadsTable,
  tvShowsTable,
} from "@/lib/db/schema";

async function reset() {
  console.log("Resetting database...");

  await db.transaction(async (tx) => {
    // Clear existing data
    console.log("Clearing existing data...");
    await tx.delete(reviewsTable);
    await tx.delete(bookmarksTable);
    await tx.delete(downloadsTable);
    await tx.delete(episodesTable);
    await tx.delete(seasonsTable);
    await tx.delete(moviesTable);
    await tx.delete(tvShowsTable);
    await tx.delete(contentTable);
  });

  console.log("Database reset successfully!");
  process.exit(0);
}

reset().catch((err) => {
  console.error("Failed to reset database:", err);
  process.exit(1);
});
