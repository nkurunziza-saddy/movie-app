"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Play } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DownloadButtonProps {
  movieId: string;
  className?: string;
}

export function DownloadButton({ movieId, className }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleDownload = async () => {
    if (!session) {
      toast.error("Please sign in to download movies");
      router.push("/auth/signin");
      return;
    }

    setIsDownloading(true);

    try {
      const response = await fetch(`/api/download/${movieId}`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Download failed");
      }

      const { downloadUrl, filename } = await response.json();

      // Create download link
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error instanceof Error ? error.message : "Download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className={cn("", className)}
      size="lg"
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-5 w-5 fill-current animate-spin" />
          Preparing Download...
        </>
      ) : (
        <>
          <Download className="h-5 w-5 fill-current" />
          Download
        </>
      )}
    </Button>
  );
}
