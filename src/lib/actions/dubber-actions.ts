/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use server";

import { db } from "@/lib/db";
import { dubbersTable } from "@/lib/db/schema";
import { ilike } from "drizzle-orm";

export async function findOrCreateDubber(name: string) {
  if (!name) return null;

  const existingDubber = await db.query.dubbersTable.findFirst({
    where: ilike(dubbersTable.name, name),
  });

  if (existingDubber) {
    return existingDubber;
  }

  const newDubber = await db
    .insert(dubbersTable)
    .values({ name })
    .returning();

  return newDubber[0]!;
}
