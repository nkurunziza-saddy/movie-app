import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { R2 } from "@/lib/r2";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Missing filename or contentType" },
        { status: 400 }
      );
    }

    const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
    if (!R2_BUCKET_NAME) {
      throw new Error("R2_BUCKET_NAME is not set in .env file");
    }

    const key = `uploads/${randomUUID()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(R2, command, { expiresIn: 60 * 6 });

    return NextResponse.json({ signedUrl, key });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to generate signed URL", details: errorMessage },
      { status: 500 }
    );
  }
}
