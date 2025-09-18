"use server";

import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateUsername(username: string) {
  const session = await requireAuth();

  if (!username || username.length < 3) {
    throw new Error("Username must be at least 3 characters long.");
  }

  try {
    await db
      .update(usersTable)
      .set({ name: username, updatedAt: new Date() })
      .where(eq(usersTable.id, session.user.id));

    revalidatePath("/activity/settings");

    return { success: true };
  } catch (error) {
    console.error("Error updating username:", error);
    throw new Error("Failed to update username. Please try again.");
  }
}

export async function deleteUserAccount() {
  const session = await requireAuth();

  try {
    await db.delete(usersTable).where(eq(usersTable.id, session.user.id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw new Error("Failed to delete account. Please try again.");
  }
}
