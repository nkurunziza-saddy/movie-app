import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    return NextResponse.json("hellp");
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
