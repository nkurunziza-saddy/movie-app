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

export const requireAdmin = async () => {
  const session = await requireAuth();
  if (session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  return session;
};
