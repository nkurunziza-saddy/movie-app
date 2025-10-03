"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  createMovie,
  deleteContent,
  updateMovie,
} from "@/lib/actions/content-mutations";
import { getDubbers } from "@/lib/actions/content-query-action";
import { findOrCreateDubber } from "@/lib/actions/dubber-actions";
import { uploadFile } from "@/lib/helpers/upload-file";
import { movieSchema } from "@/lib/form-schema";
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
import type { ContentWithDetails, DubberInterface } from "@/lib/db/schema";
import FileUpload from "@/components/ui/file-upload";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { useQuery } from "@tanstack/react-query";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";

type MovieFormProps = {
  initialData?: ContentWithDetails;
};

export function CreateMovieForm({ initialData }: MovieFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posterFile, setPosterFile] = useState<FileWithPreview[]>([]);
  const [backdropFile, setBackdropFile] = useState<FileWithPreview[]>([]);
  const [movieFile, setMovieFile] = useState<FileWithPreview[]>([]);
  const isEditMode = !!initialData;

  const { data: dubbers, isLoading: isLoadingDubbers } = useQuery({
    queryKey: ["dubbers"],
    queryFn: getDubbers,
  });

  const form = useForm<z.infer<typeof movieSchema>>({
    resolver: zodResolver(movieSchema as any),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      genre: initialData?.genre?.join(", ") || "",
      releaseYear: initialData?.releaseYear || undefined,
      trailerUrl: initialData?.trailerKey || "",
      durationMinutes: initialData?.movie?.durationMinutes || undefined,
      status: initialData?.status || "completed",
      dubberName: initialData?.dubber?.name || undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof movieSchema>) => {
    setIsSubmitting(true);
    toast.info(
      isEditMode ? "Updating movie..." : "Starting movie creation process..."
    );

    if (!isEditMode && (!posterFile[0] || !movieFile[0])) {
      toast.error("Poster and Movie File are required for new movies.");
      setIsSubmitting(false);
      return;
    }

    try {
      let posterKey = initialData?.posterKey ?? undefined;
      let backdropKey = initialData?.backdropKey ?? undefined;
      let movieFileKey = initialData?.movie?.movieFileKey;
      const uploadPromises: Promise<any>[] = [];
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
      if (movieFile[0]) {
        uploadPromises.push(
          uploadFile(movieFile[0].file as File).then(
            (key) => (movieFileKey = key)
          )
        );
      }

      if (uploadPromises.length > 0) {
        toast.info(`Uploading ${uploadPromises.length} file(s)...`);
        await Promise.all(uploadPromises);
      }

      if (!posterKey || !movieFileKey) {
        toast.error("A required file is missing or failed to upload.");
        setIsSubmitting(false);
        return;
      }

      const actionData = {
        ...data,
        posterKey,
        backdropKey,
        movieFileKey,
      };

      if (isEditMode) {
        toast.success("Files updated! Now saving movie details...");
        await updateMovie(initialData.id, actionData);
        toast.success("Movie updated successfully!");
      } else {
        toast.success("Files uploaded! Now saving movie details...");
        await createMovie(actionData);
        toast.success("Movie created successfully!");
        form.reset();
        setPosterFile([]);
        setBackdropFile([]);
        setMovieFile([]);
      }
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} movie:`,
        error
      );
      toast.error(
        `An error occurred during movie ${isEditMode ? "update" : "creation"}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData) return;
    setIsSubmitting(true);
    toast.info("Deleting movie...");
    try {
      await deleteContent(initialData.id);
      toast.success("Movie deleted successfully!");
      // TODO: Redirect
    } catch (error) {
      console.error("Failed to delete movie:", error);
      toast.error("An error occurred during movie deletion.");
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
              {isEditMode ? "Edit Movie" : "Movie details"}
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
                    <Input
                      placeholder="Avatar: The Last Airbender"
                      {...field}
                    />
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
                    <Textarea
                      placeholder="Tell us about the movie..."
                      {...field}
                    />
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
                      <Input
                        placeholder="Action, Adventure, Fantasy"
                        {...field}
                      />
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
                      <Input type="number" placeholder="2009" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="162" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <FormField
                control={form.control}
                name="trailerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trailer URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.youtube.com/watch?v=..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUpload
                label="Poster Image"
                onFilesChange={setPosterFile}
                accept="image/*"
              />
              <FileUpload
                label="Backdrop Image"
                onFilesChange={setBackdropFile}
                accept="image/*"
              />
            </div>
            <FileUpload
              label="Movie File"
              onFilesChange={setMovieFile}
              accept="video/*"
              maxSize={1024 * 1024 * 500} // 500MB
            />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-4">
          {isEditMode && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="lg">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Movie
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the movie and all its associated data.
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
            {isEditMode
              ? isSubmitting
                ? "Updating..."
                : "Update Movie"
              : isSubmitting
              ? "Uploading..."
              : "Create Movie"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
