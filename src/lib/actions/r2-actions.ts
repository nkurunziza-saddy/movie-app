"use server";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { R2 } from "@/lib/r2";
import { cache } from "react";

export const getPresignedUrl = cache(
  async (key: string, filename?: string): Promise<string> => {
    const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
    if (!R2_BUCKET_NAME) {
      throw new Error("R2_BUCKET_NAME is not set in .env file");
    }

    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ResponseContentDisposition: filename
        ? `attachment; filename=\"${filename}\"`
        : undefined,
    });

    const signedUrl = await getSignedUrl(R2, command, { expiresIn: 604800 }); // 7 days

    return signedUrl;
  }
);
