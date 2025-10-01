"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { downloadContentAction } from "@/lib/actions/download-action";
import { VariantProps } from "class-variance-authority";
import { ComponentProps, useState } from "react";

type DownloadButtonProps = {
  movieId?: string;
  episodeId?: string;
  fileName?: string;
  className?: string;
};

export function DownloadButton({
  movieId,
  episodeId,
  variant,
  size,
  fileName,
  className,
  ...props
}: DownloadButtonProps &
  ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!movieId && !episodeId) {
      toast.error("No content specified for download.");
      return;
    }

    setIsDownloading(true);
    toast.info("Preparing your download...");

    try {
      const result = await downloadContentAction({ movieId, episodeId });

      if (!result || !result.downloadUrl) {
        throw new Error("Could not retrieve download link.");
      }

      const link = document.createElement("a");
      link.href = result.downloadUrl;
      link.download = result.filename || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Your download has started!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Download failed. Please try again."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className={cn(
        "flex items-center gap-2",
        buttonVariants({ variant, size, className })
      )}
      {...props}
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Preparing...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Download
        </>
      )}
    </Button>
  );
}
