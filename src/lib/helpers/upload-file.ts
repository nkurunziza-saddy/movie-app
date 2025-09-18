import { toast } from "sonner";

export const uploadFile = async (file: File): Promise<string | undefined> => {
  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    });

    if (!response.ok) {
      throw new Error("Failed to get presigned URL.");
    }

    const { signedUrl, key } = await response.json();

    const uploadResponse = await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload ${file.name}.`);
    }

    return key;
  } catch (error) {
    console.error(error);
    toast.error(
      error instanceof Error
        ? error.message
        : "An unknown upload error occurred."
    );
    return undefined;
  }
};
