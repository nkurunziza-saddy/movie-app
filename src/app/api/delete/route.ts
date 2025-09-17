import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
