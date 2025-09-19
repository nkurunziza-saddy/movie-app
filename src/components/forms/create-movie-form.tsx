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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createMovie } from "@/lib/actions/content-mutations";
import { uploadFile } from "@/lib/helpers/upload-file";
import { movieSchema } from "@/lib/form-schema";

type MovieActionData = z.infer<typeof movieSchema> & {
  posterKey: string;
  backdropKey?: string;
  movieFileKey: string;
};

export function CreateMovieForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [backdropFile, setBackdropFile] = useState<File | null>(null);
  const [movieFile, setMovieFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof movieSchema>>({
    resolver: zodResolver(movieSchema as any),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      releaseYear: undefined,
      trailerUrl: "",
      durationMinutes: undefined,
      status: "completed",
    },
  });

  const onSubmit = async (data: z.infer<typeof movieSchema>) => {
    setIsSubmitting(true);
    toast.info("Starting movie creation process...");

    if (!posterFile || !movieFile) {
      toast.error("Poster and Movie File are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const [posterKey, backdropKey, movieFileKey] = await Promise.all([
        uploadFile(posterFile),
        backdropFile ? uploadFile(backdropFile) : Promise.resolve(undefined),
        uploadFile(movieFile),
      ]);

      if (!posterKey || !movieFileKey) {
        toast.error("A required file failed to upload. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const actionData: MovieActionData = {
        ...data,
        posterKey,
        backdropKey,
        movieFileKey,
      };

      toast.success("Files uploaded! Now saving movie details...");

      await createMovie(actionData);

      toast.success("Movie created successfully!");
      form.reset();
      setPosterFile(null);
      setBackdropFile(null);
      setMovieFile(null);
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => ((input as HTMLInputElement).value = ""));
    } catch (error) {
      console.error("Failed to create movie:", error);
      toast.error("An error occurred during movie creation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-mono">Movie details</CardTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Poster Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPosterFile(e.target.files?.[0] ?? null)}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Backdrop Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setBackdropFile(e.target.files?.[0] ?? null)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
            <FormItem>
              <FormLabel>Movie File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setMovieFile(e.target.files?.[0] ?? null)}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Uploading..." : "Create Movie"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
