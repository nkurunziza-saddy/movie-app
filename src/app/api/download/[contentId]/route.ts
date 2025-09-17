import { NextResponse } from "next/server";

export async function GET() {
  try {
    return new NextResponse("Hello");
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
