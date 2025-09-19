import { betterAuth } from "better-auth";
import { db } from "../db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  user: {
    modelName: "usersTable",
  },
  session: {
    modelName: "sessionsTable",
  },
  account: {
    modelName: "accountsTable",
  },
  verification: {
    modelName: "verificationsTable",
  },
});

export type SessionUser = typeof auth.$Infer.Session.user;
