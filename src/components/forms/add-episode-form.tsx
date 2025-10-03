"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  SearchSelect,
  SearchSelectContent,
  SearchSelectEmpty,
  SearchSelectGroup,
  SearchSelectInput,
  SearchSelectItem,
  SearchSelectList,
  SearchSelectTrigger,
  SearchSelectValue,
} from "@/components/ui/search-select";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  getTvShows,
  getSeasonsByTvShowId,
} from "@/lib/actions/content-query-action";
import { createEpisode } from "@/lib/actions/content-mutations";
import { toast } from "sonner";
import { uploadFile } from "@/lib/helpers/upload-file";
import FileUpload from "@/components/ui/file-upload";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { Label } from "../ui/label";

const episodeSchema = z.object({
  seasonId: z.string().min(1, "A season must be selected."),
  episodeNumber: z.number().min(1, "Episode number is required."),
  title: z.string().min(1, "Episode title is required."),
  durationMinutes: z.number().min(1, "Duration is required."),
});

type EpisodeActionData = z.infer<typeof episodeSchema> & {
  videoFileKey: string;
};

export function AddEpisodeForm() {
  const [selectedTvShowId, setSelectedTvShowId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoFile, setVideoFile] = useState<FileWithPreview[]>([]);

  const form = useForm<z.infer<typeof episodeSchema>>({
    resolver: zodResolver(episodeSchema as any),
    defaultValues: {
      seasonId: "",
      episodeNumber: 1,
      title: "",
      durationMinutes: 1,
    },
  });

  const { data: tvShowsData, isLoading: isTvShowsLoading } = useQuery({
    queryKey: ["all-tv-shows"],
    queryFn: getTvShows,
  });

  const { data: seasonsOfShow, isLoading: isSeasonsLoading } = useQuery({
    queryKey: ["seasons-of-show", selectedTvShowId],
    queryFn: () => getSeasonsByTvShowId(selectedTvShowId!),
    enabled: !!selectedTvShowId,
  });

  const onSubmit = async (data: z.infer<typeof episodeSchema>) => {
    setIsSubmitting(true);
    toast.info("Starting episode creation...");

    if (!videoFile[0]) {
      toast.error("Video file is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const videoFileKey = await uploadFile(videoFile[0].file as File);
      if (!videoFileKey) {
        toast.error("Video file failed to upload. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const actionData: EpisodeActionData = { ...data, videoFileKey };

      toast.success("File uploaded! Saving episode details...");
      await createEpisode(actionData);
      toast.success("Episode created successfully!");

      form.reset();
      setVideoFile([]);
      setSelectedTvShowId(null);
    } catch (error) {
      console.error("Failed to create episode:", error);
      toast.error("An error occurred during episode creation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Label>TV Show</Label>
          <SearchSelect>
            <SearchSelectTrigger>
              <SearchSelectValue placeholder="Select TV Show...">
                {
                  tvShowsData?.find((item) => item.id === selectedTvShowId)
                    ?.content.title
                }
              </SearchSelectValue>
            </SearchSelectTrigger>
            <SearchSelectContent>
              <SearchSelectInput placeholder="Search TV shows..." />
              <SearchSelectList>
                <SearchSelectEmpty>No shows found.</SearchSelectEmpty>
                <SearchSelectGroup>
                  {isTvShowsLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    tvShowsData?.map((item) => (
                      <SearchSelectItem
                        onSelect={(value) => {
                          setSelectedTvShowId(value);
                          form.resetField("seasonId");
                        }}
                        key={item.id}
                        value={item.id}
                      >
                        {item.content.title}
                      </SearchSelectItem>
                    ))
                  )}
                </SearchSelectGroup>
              </SearchSelectList>
            </SearchSelectContent>
          </SearchSelect>
        </div>

        <FormField
          control={form.control}
          name="seasonId"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <FormLabel>Season</FormLabel>
              <SearchSelect>
                <SearchSelectTrigger>
                  <SearchSelectValue placeholder="Select Season...">
                    {
                      seasonsOfShow?.find((item) => item.id === field.value)
                        ?.title
                    }
                  </SearchSelectValue>
                </SearchSelectTrigger>
                <SearchSelectContent>
                  <SearchSelectInput
                    disabled={!selectedTvShowId || isSeasonsLoading}
                    placeholder="Search seasons..."
                  />
                  <SearchSelectList>
                    <SearchSelectEmpty>
                      No seasons found for this show.
                    </SearchSelectEmpty>
                    <SearchSelectGroup>
                      {isSeasonsLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        seasonsOfShow?.map((item) => (
                          <SearchSelectItem
                            onSelect={field.onChange}
                            key={item.id}
                            value={item.id}
                          >
                            {item.title}
                          </SearchSelectItem>
                        ))
                      )}
                    </SearchSelectGroup>
                  </SearchSelectList>
                </SearchSelectContent>
              </SearchSelect>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="episodeNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Episode Number</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Episode Number"
                  {...field}
                  disabled={!form.watch("seasonId")}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Episode Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Episode Title"
                  {...field}
                  disabled={!form.watch("seasonId")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="durationMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Duration (minutes)"
                  {...field}
                  disabled={!form.watch("seasonId")}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FileUpload
          label="Video File"
          onFilesChange={setVideoFile}
          maxSize={1024 * 1024 * 3200}
          accept="video/*"
        />
        <Button
          type="submit"
          disabled={isSubmitting || !form.watch("seasonId")}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Uploading..." : "Add Episode"}
        </Button>
      </form>
    </Form>
  );
}
