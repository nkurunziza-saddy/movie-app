import { db } from "@/lib/db";
import {
  contentTable,
  moviesTable,
  seasonsTable,
  episodesTable,
  reviewsTable,
  usersTable,
  bookmarksTable,
  downloadsTable,
  tvShowsTable,
} from "@/lib/db/schema";

async function seed() {
  console.log("Seeding database...");

  const users = await db.select().from(usersTable);
  console.log(`Found ${users.length} users in the database.`);
  if (users.length === 0) {
    console.error("No users found. Please create a user first.");
    process.exit(1);
  }
  const userId = users[0].id;

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

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Failed to seed database:", err);
  process.exit(1);
});
