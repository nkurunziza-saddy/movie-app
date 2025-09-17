"use client";

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
import { PlusCircle, Trash2 } from "lucide-react";

// NOTE: These schemas should be moved to @/lib/form-schema.ts
const fileSchema = z.instanceof(File).optional();

const episodeSchema = z.object({
  episodeNumber: z.coerce.number().min(1, "Episode number is required."),
  title: z.string().min(1, "Episode title is required."),
  videoFile: fileSchema.refine((file) => file, "Video file is required."),
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
  poster: fileSchema.refine((file) => file, "Poster is required."),
  backdrop: fileSchema,
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
// End of schemas

function EpisodeFields({
  control,
  seasonIndex,
}: {
  control: Control<z.infer<typeof tvShowSchema>>;
  seasonIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `seasons.${seasonIndex}.episodes`,
  });

  return (
    <div className="space-y-4">
      <Separator className="my-6" />
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Episodes</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              episodeNumber: fields.length + 1,
              title: "",
              videoFile: undefined,
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
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
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
            <FormField
              control={control}
              name={`seasons.${seasonIndex}.episodes.${index}.videoFile`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video File</FormLabel>
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
          </div>
        ))}
      </div>
    </div>
  );
}

export function CreateTvShowForm() {
  const form = useForm<z.infer<typeof tvShowSchema>>({
    resolver: zodResolver(tvShowSchema as any),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      releaseYear: undefined,
      poster: undefined,
      backdrop: undefined,
      trailerUrl: "",
      status: "ongoing",
      seasons: [
        {
          seasonNumber: 1,
          title: "Season 1",
          episodes: [{ episodeNumber: 1, title: "", videoFile: undefined }],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "seasons",
  });

  const onSubmit = async (data: z.infer<typeof tvShowSchema>) => {
    console.log("TV Show data to be submitted:", data);
    // Implement your submission logic here
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>TV Show Details</CardTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <FormField
                control={form.control}
                name="poster"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poster</FormLabel>
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
                    <FormLabel>Backdrop</FormLabel>
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
                <CardTitle>Season {index + 1}</CardTitle>
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
                <EpisodeFields control={form.control} seasonIndex={index} />
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
              episodes: [{ episodeNumber: 1, title: "", videoFile: undefined }],
            })
          }
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Season
        </Button>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Create TV Show
          </Button>
        </div>
      </form>
    </Form>
  );
}
