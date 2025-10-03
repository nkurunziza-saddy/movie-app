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
import {
  createTvShow,
  deleteContent,
  updateTvShow,
} from "@/lib/actions/content-mutations";
import { uploadFile } from "@/lib/helpers/upload-file";
import { ContentWithDetails, DubberInterface } from "@/lib/db/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import FileUpload from "@/components/ui/file-upload";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { useQuery } from "@tanstack/react-query";
import { getDubbers } from "@/lib/actions/content-query-action";
import { findOrCreateDubber } from "@/lib/actions/dubber-actions";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";

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
  dubberName: z.string().optional(),
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
  isEditMode,
}: {
  control: Control<z.infer<typeof tvShowSchema>>;
  seasonIndex: number;
  onFileChange: (key: string, files: FileWithPreview[]) => void;
  isEditMode: boolean;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `seasons.${seasonIndex}.episodes`,
  });

  return (
    <div className="space-y-4">
      <Separator className="my-6" />
      <div className="flex items-center justify-between">
        <h3 className="text-sm ">Episodes</h3>
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
            <FileUpload
              label="Video File"
              onFilesChange={(files) =>
                onFileChange(`season-${seasonIndex}-episode-${index}`, files)
              }
              accept="video/*"
              maxSize={1024 * 1024 * 500} // 500MB
            />
          </div>
        ))}
      </div>
    </div>
  );
}

type TvShowFormProps = {
  initialData?: ContentWithDetails;
};

export function CreateTvShowForm({ initialData }: TvShowFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posterFile, setPosterFile] = useState<FileWithPreview[]>([]);
  const [backdropFile, setBackdropFile] = useState<FileWithPreview[]>([]);
  const [episodeFiles, setEpisodeFiles] = useState<{
    [key: string]: FileWithPreview[];
  }>({});

  const isEditMode = !!initialData;

  const { data: dubbers, isLoading: isLoadingDubbers } = useQuery({
    queryKey: ["dubbers"],
    queryFn: getDubbers,
  });

  const form = useForm<z.infer<typeof tvShowSchema>>({
    resolver: zodResolver(tvShowSchema as any),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      genre: initialData?.genre?.join(", ") || "",
      releaseYear: initialData?.releaseYear || undefined,
      trailerUrl: initialData?.trailerKey || "",
      status: initialData?.status || "ongoing",
      dubberName: initialData?.dubber?.name || undefined,
      seasons: initialData?.tvShow?.seasons?.length
        ? initialData.tvShow.seasons.map((s) => ({
            seasonNumber: s.seasonNumber,
            title: s.title || "",
            episodes: s.episodes.map((e) => ({
              episodeNumber: e.episodeNumber,
              title: e.title || "",
            })),
          }))
        : [
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

  const handleEpisodeFileChange = (key: string, files: FileWithPreview[]) => {
    setEpisodeFiles((prev) => ({ ...prev, [key]: files }));
  };

  const onSubmit = async (data: z.infer<typeof tvShowSchema>) => {
    setIsSubmitting(true);
    toast.info(
      isEditMode
        ? "Starting TV show update..."
        : "Starting TV show creation process..."
    );

    if (!isEditMode && !posterFile[0]) {
      toast.error("A poster image is required for new TV shows.");
      setIsSubmitting(false);
      return;
    }

    try {
      const uploadPromises: Promise<any>[] = [];
      let posterKey = initialData?.posterKey ?? undefined;
      let backdropKey = initialData?.backdropKey ?? undefined;

      if (posterFile[0]) {
        uploadPromises.push(
          uploadFile(posterFile[0].file as File).then(
            (key) => (posterKey = key)
          )
        );
      }
      if (backdropFile[0]) {
        uploadPromises.push(
          uploadFile(backdropFile[0].file as File).then(
            (key) => (backdropKey = key)
          )
        );
      }

      const episodeFileKeys: { [key: string]: string } = {};

      data.seasons.forEach((season, sIdx) => {
        season.episodes.forEach((episode, eIdx) => {
          const fileKey = `season-${sIdx}-episode-${eIdx}`;
          const file = episodeFiles[fileKey]?.[0];
          if (file) {
            uploadPromises.push(
              uploadFile(file.file as File).then(
                (key) => (episodeFileKeys[fileKey] = key!)
              )
            );
          } else if (!isEditMode) {
            throw new Error(
              `Video file for Season ${sIdx + 1}, Episode ${
                eIdx + 1
              } is missing.`
            );
          }
        });
      });

      if (uploadPromises.length > 0) {
        toast.info(`Uploading ${uploadPromises.length} files...`);
        await Promise.all(uploadPromises);
      }

      const seasonsWithKeys = data.seasons.map((season, sIdx) => ({
        ...season,
        episodes: season.episodes.map((episode, eIdx) => {
          const fileKey = `season-${sIdx}-episode-${eIdx}`;
          const newVideoFileKey = episodeFileKeys[fileKey];
          const existingEpisode =
            initialData?.tvShow?.seasons?.[sIdx]?.episodes?.[eIdx];
          return {
            ...episode,
            videoFileKey:
              newVideoFileKey || existingEpisode?.videoFileKey || "",
          };
        }),
      }));

      const actionData = {
        ...data,
        posterKey: posterKey,
        backdropKey: backdropKey,
        seasons: seasonsWithKeys,
      };

      if (isEditMode) {
        await updateTvShow(initialData.id, actionData);
        toast.success("TV Show updated successfully!");
      } else {
        await createTvShow(actionData);
        toast.success("TV Show created successfully!");
        form.reset();
        setPosterFile([]);
        setBackdropFile([]);
        setEpisodeFiles({});
      }
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} TV show:`,
        error
      );
      toast.error(
        error instanceof Error
          ? error.message
          : `An error occurred during TV show ${
              isEditMode ? "update" : "creation"
            }.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData) return;
    setIsSubmitting(true);
    toast.info("Deleting TV Show...");
    try {
      await deleteContent(initialData.id);
      toast.success("TV Show deleted successfully!");
      // Optionally, redirect or perform other cleanup
    } catch (error) {
      console.error("Failed to delete TV show:", error);
      toast.error("An error occurred during TV show deletion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm ">
              {isEditMode ? "Edit TV Show" : "TV Show Details"}
            </CardTitle>
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
              <FileUpload
                label="Poster"
                onFilesChange={setPosterFile}
                accept="image/*"
              />
              <FileUpload
                label="Backdrop"
                onFilesChange={setBackdropFile}
                accept="image/*"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <FormField
                control={form.control}
                name="dubberName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dubber</FormLabel>
                    <CreatableCombobox
                      options={
                        dubbers?.map((d) => ({ value: d.id, label: d.name })) ??
                        []
                      }
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select or create a dubber..."
                      emptyMessage="No dubbers found."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm ">Season {index + 1}</CardTitle>
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
                  onFileChange={handleEpisodeFileChange}
                  isEditMode={isEditMode}
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

        <div className="flex justify-end gap-4">
          {isEditMode && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="lg">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete TV Show
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the TV show and all its associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update TV Show" : "Create TV Show"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
