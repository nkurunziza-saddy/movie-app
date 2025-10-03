import {
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
  inet,
  pgEnum,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const contentTypeEnum = pgEnum("content_type", ["movie", "tv"]);
export const contentStatusEnum = pgEnum("content_status", [
  "completed",
  "ongoing",
  "cancelled",
]);

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

export const dubbersTable = pgTable("dubbers", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
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
  posterKey: text("poster_key"),
  backdropKey: text("backdrop_key"),
  trailerKey: text("trailer_key"),
  contentType: contentTypeEnum("content_type").notNull().default("movie"),
  status: contentStatusEnum("content_status").default("completed"),
  uploadDate: timestamp("upload_date").defaultNow(),
  uploaderId: text("uploader_id").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  dubberId: text("dubber_id").references(() => dubbersTable.id, {
    onDelete: "set null",
  }),
  downloadCount: integer("download_count").default(0),
  isActive: boolean("is_active").default(true),
});

export const seasonsTable = pgTable(
  "seasons",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    tvShowId: text("tv_show_id")
      .references(() => tvShowsTable.id, { onDelete: "cascade" })
      .notNull(),
    seasonNumber: integer("season_number").notNull(),
    title: varchar("title", { length: 255 }),
    description: text("description"),
    releaseYear: integer("release_year"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("season_number_show_unique").on(
      table.tvShowId,
      table.seasonNumber
    ),
  ]
);

export const episodesTable = pgTable("episodes", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  seasonId: text("season_id")
    .references(() => seasonsTable.id, { onDelete: "cascade" })
    .notNull(),
  episodeNumber: integer("episode_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes"),
  stillKey: text("still_key"),
  videoFileKey: text("video_file_key"),
  fileSizeMb: integer("file_size_mb"),
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
    .notNull()
    .unique(),
  durationMinutes: integer("duration_minutes"),
  movieFileKey: text("movie_file_key"),
  fileSizeMb: integer("file_size_mb"),
  isActive: boolean("is_active").default(true),
});

export const tvShowsTable = pgTable("tv_shows", {
  id: text("id")
    .primaryKey()
    .notNull()
    .default(sql`gen_random_uuid()`),
  contentId: text("content_id")
    .references(() => contentTable.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  isActive: boolean("is_active").default(true),
});

export const reviewsTable = pgTable(
  "reviews",
  {
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
    rating: integer("rating").notNull(),
    reviewText: text("review_text"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [check("rating_check", sql`${table.rating} BETWEEN 1 AND 5`)]
);

export const bookmarksTable = pgTable(
  "bookmarks",
  {
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
  },
  (table) => [
    uniqueIndex("bookmarks_user_content_unique").on(
      table.userId,
      table.contentId
    ),
  ]
);

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

export const usersRelations = relations(usersTable, ({ many }) => ({
  reviews: many(reviewsTable),
  bookmarks: many(bookmarksTable),
  downloads: many(downloadsTable),
  uploadedContent: many(contentTable),
}));

export const contentRelations = relations(contentTable, ({ one, many }) => ({
  uploader: one(usersTable, {
    fields: [contentTable.uploaderId],
    references: [usersTable.id],
  }),
  dubber: one(dubbersTable, {
    fields: [contentTable.dubberId],
    references: [dubbersTable.id],
  }),
  movie: one(moviesTable, {
    fields: [contentTable.id],
    references: [moviesTable.contentId],
  }),
  tvShow: one(tvShowsTable, {
    fields: [contentTable.id],
    references: [tvShowsTable.contentId],
  }),
  reviews: many(reviewsTable),
  bookmarks: many(bookmarksTable),
  downloads: many(downloadsTable),
}));

export const seasonsRelations = relations(seasonsTable, ({ one, many }) => ({
  tvShow: one(tvShowsTable, {
    fields: [seasonsTable.tvShowId],
    references: [tvShowsTable.id],
  }),
  episodes: many(episodesTable),
}));

export const episodesRelations = relations(episodesTable, ({ one, many }) => ({
  season: one(seasonsTable, {
    fields: [episodesTable.seasonId],
    references: [seasonsTable.id],
  }),
  downloads: many(downloadsTable),
}));

export const tvShowRelations = relations(tvShowsTable, ({ one, many }) => ({
  content: one(contentTable, {
    fields: [tvShowsTable.contentId],
    references: [contentTable.id],
  }),
  seasons: many(seasonsTable),
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

export const dubbersRelations = relations(dubbersTable, ({ many }) => ({
  contents: many(contentTable),
}));

export type ContentInterface = typeof contentTable.$inferSelect;
export type SeasonInterface = typeof seasonsTable.$inferSelect;
export type EpisodeInterface = typeof episodesTable.$inferSelect;
export type TvShowInterface = typeof tvShowsTable.$inferSelect;
export type MovieInterface = typeof moviesTable.$inferSelect;
export type ReviewInterface = typeof reviewsTable.$inferSelect;
export type BookmarkInterface = typeof bookmarksTable.$inferSelect;
export type DownloadInterface = typeof downloadsTable.$inferSelect;
export type UserInterface = typeof usersTable.$inferSelect;
export type DubberInterface = typeof dubbersTable.$inferSelect;

export type ContentWithDetails = ContentInterface & {
  dubber: {
    name: string;
  } | null;
  movie: MovieInterface;
  reviews: {
    id: string;
    createdAt: Date | null;
    rating: number;
    userId: string;
    reviewText: string | null;
    user: {
      name: string | null;
      username: string | null;
    };
  }[];
  tvShow: TvShowInterface & {
    seasons: (SeasonInterface & {
      episodes: EpisodeInterface[];
    })[];
  };
};

export type SeasonWithEpisodes = SeasonInterface & {
  episodes: EpisodeInterface[];
};

export type BookmarksWithContent = BookmarkInterface & {
  content: ContentInterface;
};
