import { db } from "@/lib/db";
import { dubbersTable } from "@/lib/db/schema";

async function main() {
  const data = await db.query.dubbersTable.findMany({
    with: {
      contents: true,
    },
  });
  console.log(data);
  process.exit(0);
}

main().catch((err) => {
  process.exit(1);
});
