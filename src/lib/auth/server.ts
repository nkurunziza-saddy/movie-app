import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export const requireAuth = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return session;
};
