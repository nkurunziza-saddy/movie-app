import { db } from "@/lib/db";

async function reset() {
  const data = await db.query.downloadsTable.findMany({
    with: {
      content: true,
      user: true,
    },
  });
  console.log(data);
  process.exit(0);
}

reset().catch((err) => {
  console.error("Failed to reset database:", err);
  process.exit(1);
});
