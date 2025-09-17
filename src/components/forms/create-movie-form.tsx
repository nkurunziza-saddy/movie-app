"use client";

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

// NOTE: This schema should be moved to @/lib/form-schema.ts
const fileSchema = z.instanceof(File).optional();

const movieSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  genre: z.string().optional(),
  releaseYear: z.coerce.number().optional(),
  trailerUrl: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal("")),
  durationMinutes: z.coerce.number().optional(),
  poster: fileSchema.refine((file) => file, "Poster is required."),
  backdrop: fileSchema,
  movieFile: fileSchema.refine((file) => file, "Movie file is required."),
  status: z.enum(["completed", "ongoing", "cancelled"]).default("completed"),
});

export function CreateMovieForm() {
  const form = useForm<z.infer<typeof movieSchema>>({
    resolver: zodResolver(movieSchema as any),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      releaseYear: undefined,
      trailerUrl: "",
      durationMinutes: undefined,
      poster: undefined,
      backdrop: undefined,
      movieFile: undefined,
      status: "completed",
    },
  });

  const onSubmit = async (data: z.infer<typeof movieSchema>) => {
    try {
      // await createMovieAction(data);
      console.log("Movie data to be submitted:", data);
      // form.reset();
    } catch (error) {
      console.error("Failed to create movie:", error);
      // alert("Failed to create movie");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Movie</CardTitle>
            <FormDescription>
              Fill out the details below to add a new movie.
            </FormDescription>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <FormField
                control={form.control}
                name="poster"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poster Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="backdrop"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Backdrop Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="movieFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Movie File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Create Movie
          </Button>
        </div>
      </form>
    </Form>
  );
}
