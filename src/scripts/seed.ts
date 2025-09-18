import "dotenv/config";
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
  console.log("Seeding database with R2-compatible data...");

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

    // Insert Movies
    console.log("Inserting movies...");
    const moviesData = [
      {
        content: {
          title: "Inception",
          description:
            "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
          genre: ["Sci-Fi", "Action", "Thriller"],
          releaseYear: 2010,
          posterKey: "uploads/inception-movie-poster.png",
          trailerKey: "https://www.youtube.com/watch?v=YoHD9XEInc0",
          contentType: "movie" as const,
          uploaderId: userId,
        },
        movie: {
          durationMinutes: 148,
          movieFileKey: "uploads/placeholder.mp4",
        },
      },
      {
        content: {
          title: "The Matrix",
          description:
            "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
          genre: ["Sci-Fi", "Action"],
          releaseYear: 1999,
          posterKey: "uploads/matrix-movie-poster.png",
          trailerKey: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
          contentType: "movie" as const,
          uploaderId: userId,
        },
        movie: {
          durationMinutes: 136,
          movieFileKey: "uploads/placeholder.mp4",
        },
      },
      {
        content: {
          title: "Interstellar",
          description:
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
          genre: ["Sci-Fi", "Drama", "Adventure"],
          releaseYear: 2014,
          posterKey: "uploads/interstellar-movie-poster.jpg",
          trailerKey: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
          contentType: "movie" as const,
          uploaderId: userId,
        },
        movie: {
          durationMinutes: 169,
          movieFileKey: "uploads/placeholder.mp4",
        },
      },
      {
        content: {
          title: "Pulp Fiction",
          description:
            "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
          genre: ["Crime", "Drama"],
          releaseYear: 1994,
          posterKey: "uploads/pulp-fiction-poster.png",
          trailerKey: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
          contentType: "movie" as const,
          uploaderId: userId,
        },
        movie: {
          durationMinutes: 154,
          movieFileKey: "uploads/placeholder.mp4",
        },
      },
      {
        content: {
          title: "The Dark Knight",
          description:
            "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
          genre: ["Action", "Crime", "Drama"],
          releaseYear: 2008,
          posterKey: "uploads/dark-knight-poster.png",
          trailerKey: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
          contentType: "movie" as const,
          uploaderId: userId,
        },
        movie: {
          durationMinutes: 152,
          movieFileKey: "uploads/placeholder.mp4",
        },
      },
    ];

    const insertedMovies = [];
    for (const movieData of moviesData) {
      const [newContent] = await tx
        .insert(contentTable)
        .values(movieData.content)
        .returning();
      const [newMovie] = await tx
        .insert(moviesTable)
        .values({ ...movieData.movie, contentId: newContent.id })
        .returning();
      insertedMovies.push({ ...newContent, movie: newMovie });
    }

    // Insert Series
    console.log("Inserting series...");
    const [seriesContent] = await tx
      .insert(contentTable)
      .values({
        title: "Generic Sci-Fi Series",
        description: "A thrilling journey through space and time.",
        genre: ["Sci-Fi", "Adventure"],
        releaseYear: 2023,
        posterKey: "uploads/generic-sci-fi-poster.png",
        contentType: "tv" as const,
        uploaderId: userId,
      })
      .returning();

    const [tvShow] = await tx
      .insert(tvShowsTable)
      .values({ contentId: seriesContent.id })
      .returning();

    const [season1] = await tx
      .insert(seasonsTable)
      .values({
        tvShowId: tvShow.id,
        seasonNumber: 1,
        title: "The First Chapter",
      })
      .returning();

    await tx.insert(episodesTable).values([
      {
        seasonId: season1.id,
        episodeNumber: 1,
        title: "The Awakening",
        description: "A new hero emerges.",
        durationMinutes: 45,
        videoFileKey: "uploads/placeholder.mp4",
      },
      {
        seasonId: season1.id,
        episodeNumber: 2,
        title: "The First Challenge",
        description: "The hero faces their first test.",
        durationMinutes: 48,
        videoFileKey: "uploads/placeholder.mp4",
      },
    ]);

    // Insert reviews
    console.log("Inserting reviews...");
    await tx.insert(reviewsTable).values([
      {
        userId: userId,
        contentId: insertedMovies[0].id,
        rating: 5,
        reviewText: "Mind-bendingly brilliant! A must-watch.",
      },
      {
        userId: userId,
        contentId: insertedMovies[0].id,
        rating: 4,
        reviewText: "Complex but rewarding. Great film.",
      },
      {
        userId: userId,
        contentId: insertedMovies[1].id,
        rating: 5,
        reviewText:
          "A cinematic revolution. Changed my perspective on reality.",
      },
    ]);
  });

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Failed to seed database:", err);
  process.exit(1);
});