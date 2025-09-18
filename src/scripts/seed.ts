import { db } from "@/lib/db";

async function reset() {
  const contents = await db.query.contentTable.findMany({
    with: {
      movie: true,
      tvShow: true,
      uploader: true,
    },
  });
  console.log(contents);
  process.exit(0);
}

reset().catch((err) => {
  console.error("Failed to reset database:", err);
  process.exit(1);
});
