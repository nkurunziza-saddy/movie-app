import {
  pgTable,
  varchar,
  text,
  integer,
  decimal,
  timestamp,
  boolean,
  inet,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free",
  "premium",
]);
export const qualityEnum = pgEnum("quality", ["720p", "1080p", "4K"]);
export const contentTypeEnum = pgEnum("content_type", ["movie", "series"]);

export const usersTable = pgTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  username: text("username"),
});

export const sessionsTable = pgTable("sessions", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const accountsTable = pgTable("accounts", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const subscriptionTable = pgTable("subscription", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  plan: text("plan").notNull(),
  referenceId: text("reference_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").notNull(),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end"),
  seats: integer("seats"),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
});

export const verificationsTable = pgTable("verifications", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const contentTable = pgTable("content", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  genre: varchar("genre", { length: 100 }).array(),
  releaseYear: integer("release_year"),
  posterUrl: varchar("poster_url", { length: 500 }),
  backdropUrl: varchar("backdrop_url", { length: 500 }),
  trailerUrl: varchar("trailer_url", { length: 500 }),
  contentType: contentTypeEnum("content_type").notNull().default("movie"),
  totalSeasons: integer("total_seasons").default(0),
  status: varchar("status", { length: 50 }).default("completed"),
  uploadDate: timestamp("upload_date").defaultNow(),
  uploaderId: text("uploader_id").references(() => usersTable.id),
  downloadCount: integer("download_count").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default(
    "0"
  ),
  isActive: boolean("is_active").default(true),
  isPremium: boolean("is_premium").default(false),
});

export const seasonsTable = pgTable("seasons", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  contentId: text("content_id")
    .references(() => contentTable.id, { onDelete: "cascade" })
    .notNull(),
  seasonNumber: integer("season_number").notNull(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  releaseYear: integer("release_year"),
  posterUrl: varchar("poster_url", { length: 500 }),
  totalEpisodes: integer("total_episodes").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const episodesTable = pgTable("episodes", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  seasonId: text("season_id")
    .references(() => seasonsTable.id, { onDelete: "cascade" })
    .notNull(),
  contentId: text("content_id")
    .references(() => contentTable.id, { onDelete: "cascade" })
    .notNull(),
  episodeNumber: integer("episode_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes"),
  stillUrl: varchar("still_url", { length: 500 }),
  videoFileUrl: varchar("video_file_url", { length: 500 }),
  fileSizeMb: integer("file_size_mb"),
  quality: qualityEnum("quality"),
  airDate: timestamp("air_date"),
  isActive: boolean("is_active").default(true),
  uploadDate: timestamp("upload_date").defaultNow(),
});

export const moviesTable = pgTable("movies", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  contentId: text("content_id")
    .references(() => contentTable.id, { onDelete: "cascade" })
    .notNull(),
  durationMinutes: integer("duration_minutes"),
  movieFileUrl: varchar("movie_file_url", { length: 500 }),
  fileSizeMb: integer("file_size_mb"),
  quality: qualityEnum("quality"),
  isActive: boolean("is_active").default(true),
});

export const reviewsTable = pgTable("reviews", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id")
    .references(() => usersTable.id)
    .notNull(),
  contentId: text("content_id")
    .references(() => contentTable.id)
    .notNull(),
  seasonId: text("season_id").references(() => seasonsTable.id),
  episodeId: text("episode_id").references(() => episodesTable.id),
  rating: integer("rating").notNull(),
  reviewText: text("review_text"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bookmarksTable = pgTable("bookmarks", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id")
    .references(() => usersTable.id)
    .notNull(),
  contentId: text("content_id")
    .references(() => contentTable.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const downloadsTable = pgTable("downloads", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id").references(() => usersTable.id),
  contentId: text("content_id")
    .references(() => contentTable.id)
    .notNull(),
  movieId: text("movie_id").references(() => moviesTable.id),
  episodeId: text("episode_id").references(() => episodesTable.id),
  downloadDate: timestamp("download_date").defaultNow(),
  ipAddress: inet("ip_address"),
  userAgent: varchar("user_agent", { length: 500 }),
});

export const watchProgressTable = pgTable("watch_progress", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id")
    .references(() => usersTable.id)
    .notNull(),
  contentId: text("content_id")
    .references(() => contentTable.id)
    .notNull(),
  seasonId: text("season_id").references(() => seasonsTable.id),
  episodeId: text("episode_id").references(() => episodesTable.id),
  progressSeconds: integer("progress_seconds").default(0),
  totalSeconds: integer("total_seconds"),
  completed: boolean("completed").default(false),
  lastWatched: timestamp("last_watched").defaultNow(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  reviews: many(reviewsTable),
  bookmarks: many(bookmarksTable),
  downloads: many(downloadsTable),
  watchProgress: many(watchProgressTable),
  uploadedContent: many(contentTable),
}));

export const contentRelations = relations(contentTable, ({ one, many }) => ({
  uploader: one(usersTable, {
    fields: [contentTable.uploaderId],
    references: [usersTable.id],
  }),
  seasons: many(seasonsTable),
  episodes: many(episodesTable),
  movie: one(moviesTable),
  reviews: many(reviewsTable),
  bookmarks: many(bookmarksTable),
  downloads: many(downloadsTable),
  watchProgress: many(watchProgressTable),
}));

export const seasonsRelations = relations(seasonsTable, ({ one, many }) => ({
  content: one(contentTable, {
    fields: [seasonsTable.contentId],
    references: [contentTable.id],
  }),
  episodes: many(episodesTable),
  reviews: many(reviewsTable),
  watchProgress: many(watchProgressTable),
}));

export const episodesRelations = relations(episodesTable, ({ one, many }) => ({
  season: one(seasonsTable, {
    fields: [episodesTable.seasonId],
    references: [seasonsTable.id],
  }),
  content: one(contentTable, {
    fields: [episodesTable.contentId],
    references: [contentTable.id],
  }),
  reviews: many(reviewsTable),
  downloads: many(downloadsTable),
  watchProgress: many(watchProgressTable),
}));

export const moviesRelations = relations(moviesTable, ({ one, many }) => ({
  content: one(contentTable, {
    fields: [moviesTable.contentId],
    references: [contentTable.id],
  }),
  downloads: many(downloadsTable),
}));

export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [reviewsTable.userId],
    references: [usersTable.id],
  }),
  content: one(contentTable, {
    fields: [reviewsTable.contentId],
    references: [contentTable.id],
  }),
  season: one(seasonsTable, {
    fields: [reviewsTable.seasonId],
    references: [seasonsTable.id],
  }),
  episode: one(episodesTable, {
    fields: [reviewsTable.episodeId],
    references: [episodesTable.id],
  }),
}));

export const bookmarksRelations = relations(bookmarksTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [bookmarksTable.userId],
    references: [usersTable.id],
  }),
  content: one(contentTable, {
    fields: [bookmarksTable.contentId],
    references: [contentTable.id],
  }),
}));

export const downloadsRelations = relations(downloadsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [downloadsTable.userId],
    references: [usersTable.id],
  }),
  content: one(contentTable, {
    fields: [downloadsTable.contentId],
    references: [contentTable.id],
  }),
  movie: one(moviesTable, {
    fields: [downloadsTable.movieId],
    references: [moviesTable.id],
  }),
  episode: one(episodesTable, {
    fields: [downloadsTable.episodeId],
    references: [episodesTable.id],
  }),
}));

export const watchProgressRelations = relations(
  watchProgressTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [watchProgressTable.userId],
      references: [usersTable.id],
    }),
    content: one(contentTable, {
      fields: [watchProgressTable.contentId],
      references: [contentTable.id],
    }),
    season: one(seasonsTable, {
      fields: [watchProgressTable.seasonId],
      references: [seasonsTable.id],
    }),
    episode: one(episodesTable, {
      fields: [watchProgressTable.episodeId],
      references: [episodesTable.id],
    }),
  })
);

export type ContentInterface = typeof contentTable.$inferSelect;
export type SeasonInterface = typeof seasonsTable.$inferSelect;
export type EpisodeInterface = typeof episodesTable.$inferSelect;
export type MovieInterface = typeof moviesTable.$inferSelect;
export type ReviewInterface = typeof reviewsTable.$inferSelect;
export type BookmarkInterface = typeof bookmarksTable.$inferSelect;
export type DownloadInterface = typeof downloadsTable.$inferSelect;
export type WatchProgressInterface = typeof watchProgressTable.$inferSelect;
export type UserInterface = typeof usersTable.$inferSelect;

export type ContentWithDetails = ContentInterface & {
  seasons?: (SeasonInterface & {
    episodes?: EpisodeInterface[];
  })[];
  movie?: MovieInterface;
  reviews?: ReviewInterface[];
};

export type SeasonWithEpisodes = SeasonInterface & {
  episodes: EpisodeInterface[];
};
