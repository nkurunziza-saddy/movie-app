"use client";

import { useState } from "react";
import { useForm, useFieldArray, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createTvShow } from "@/lib/actions/content-mutations";
import { uploadFile } from "@/lib/helpers/upload-file";

// TODO: These schemas should be moved to @/lib/form-schema.ts
const episodeSchema = z.object({
  episodeNumber: z.coerce.number().min(1, "Episode number is required."),
  title: z.string().min(1, "Episode title is required."),
});

const seasonSchema = z.object({
  seasonNumber: z.coerce.number().min(1, "Season number is required."),
  title: z.string().optional(),
  episodes: z
    .array(episodeSchema)
    .min(1, "A season must have at least one episode."),
});

const tvShowSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  genre: z.string().optional(),
  releaseYear: z.coerce.number().optional(),
  trailerUrl: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal("")),
  status: z.enum(["completed", "ongoing", "cancelled"]).default("ongoing"),
  seasons: z
    .array(seasonSchema)
    .min(1, "A TV show must have at least one season."),
});

interface FileStore {
  [key: string]: File | null;
}

function EpisodeFields({
  control,
  seasonIndex,
  onFileChange,
}: {
  control: Control<z.infer<typeof tvShowSchema>>;
  seasonIndex: number;
  onFileChange: (key: string, file: File | null) => void;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `seasons.${seasonIndex}.episodes`,
  });

  return (
    <div className="space-y-4">
      <Separator className="my-6" />
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono">Episodes</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              episodeNumber: fields.length + 1,
              title: "",
            })
          }
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Episode
        </Button>
      </div>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 rounded-lg border bg-muted/20 p-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Episode {index + 1}</h4>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`seasons.${seasonIndex}.episodes.${index}.episodeNumber`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Episode Number</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`seasons.${seasonIndex}.episodes.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Episode Title</FormLabel>
                    <FormControl>
                      <Input placeholder="The Name of the Game" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormItem>
              <FormLabel>Video File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="video/*"
                  required
                  onChange={(e) =>
                    onFileChange(
                      `season-${seasonIndex}-episode-${index}`,
                      e.target.files?.[0] ?? null
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CreateTvShowForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<FileStore>({});

  const form = useForm<z.infer<typeof tvShowSchema>>({
    resolver: zodResolver(tvShowSchema as any),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      releaseYear: undefined,
      trailerUrl: "",
      status: "ongoing",
      seasons: [
        {
          seasonNumber: 1,
          title: "Season 1",
          episodes: [{ episodeNumber: 1, title: "" }],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "seasons",
  });

  const handleFileChange = (key: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const onSubmit = async (data: z.infer<typeof tvShowSchema>) => {
    setIsSubmitting(true);
    toast.info("Starting TV show creation process...");

    const posterFile = files["poster"];
    if (!posterFile) {
      toast.error("A poster image is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const uploadPromises: Promise<[string, string | undefined]>[] = [];

      uploadPromises.push(Promise.all(["posterKey", uploadFile(posterFile)]));
      if (files["backdrop"]) {
        uploadPromises.push(
          Promise.all(["backdropKey", uploadFile(files["backdrop"]!)])
        );
      }

      data.seasons.forEach((season, sIdx) => {
        season.episodes.forEach((episode, eIdx) => {
          const fileKey = `season-${sIdx}-episode-${eIdx}`;
          const file = files[fileKey];
          if (file) {
            uploadPromises.push(Promise.all([fileKey, uploadFile(file)]));
          } else {
            throw new Error(
              `Video file for Season ${sIdx + 1}, Episode ${
                eIdx + 1
              } is missing.`
            );
          }
        });
      });

      toast.info(`Uploading ${uploadPromises.length} files...`);
      const uploadResults = await Promise.all(uploadPromises);

      const fileKeys: { [key: string]: string } = {};
      for (const [key, result] of uploadResults) {
        if (!result) {
          throw new Error(
            `Upload failed for one of the files. Please try again.`
          );
        }
        fileKeys[key] = result;
      }

      const seasonsWithKeys = data.seasons.map((season, sIdx) => ({
        ...season,
        episodes: season.episodes.map((episode, eIdx) => ({
          ...episode,
          videoFileKey: fileKeys[`season-${sIdx}-episode-${eIdx}`],
        })),
      }));

      const actionData = {
        ...data,
        posterKey: fileKeys["posterKey"],
        backdropKey: fileKeys["backdropKey"],
        seasons: seasonsWithKeys,
      };

      toast.success("All files uploaded! Saving TV show details...");

      await createTvShow(actionData);

      toast.success("TV Show created successfully!");
      form.reset();
      setFiles({});
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => ((input as HTMLInputElement).value = ""));
    } catch (error) {
      console.error("Failed to create TV show:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during TV show creation."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-mono">TV Show Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="The Boys" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:items-start md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <FormControl>
                      <Input placeholder="Action, Comedy, Drama" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter genres separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="releaseYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Year</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2019" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="trailerUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trailer URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://youtube.com/watch?v=..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Poster</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) =>
                      handleFileChange("poster", e.target.files?.[0] ?? null)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Backdrop</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange("backdrop", e.target.files?.[0] ?? null)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-mono">
                  Season {index + 1}
                </CardTitle>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Season
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`seasons.${index}.seasonNumber`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Season Number</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`seasons.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Season Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Season ${index + 1}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <EpisodeFields
                  control={form.control}
                  seasonIndex={index}
                  onFileChange={handleFileChange}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              seasonNumber: fields.length + 1,
              title: `Season ${fields.length + 1}`,
              episodes: [{ episodeNumber: 1, title: "" }],
            })
          }
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Season
        </Button>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Uploading & Creating..." : "Create TV Show"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
