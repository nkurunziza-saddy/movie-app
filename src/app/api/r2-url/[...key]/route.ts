import { getPresignedUrl } from "@/lib/actions/r2-actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const key = (await params).key.join("/");
  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  try {
    const url = await getPresignedUrl(key);
    return NextResponse.json(
      { url },
      {
        headers: {
          "Cache-Control": "public, max-age=518400, immutable",
        },
      }
    );
  } catch (error) {
    console.error("Error getting presigned URL:", error);
    return NextResponse.json(
      { error: "Error getting presigned URL" },
      { status: 500 }
    );
  }
}
