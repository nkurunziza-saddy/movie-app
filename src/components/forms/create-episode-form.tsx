"use client";

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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getSeasons } from "@/lib/db/actions/queries/basic";
import { episodeSchema } from "@/lib/form-schema";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

export function CreateEpisodeForm() {
  const form = useForm<z.infer<typeof episodeSchema>>({
    resolver: zodResolver(episodeSchema) as any,
    defaultValues: {
      seasonId: "",
      episodeNumber: undefined,
      title: "",
      durationMinutes: undefined,
      videoFile: undefined,
    },
  });

  const {
    data: seasonsData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["seasons"],
    queryFn: getSeasons,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const onSubmit = async (data: z.infer<typeof episodeSchema>) => {
    try {
      // await createEpisodeAction(data);
      console.log(data);
      alert("Episode created successfully!");
      form.reset();
    } catch (error) {
      console.error("Failed to create episode:", error);
      alert("Failed to create episode");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="seasonId"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <FormLabel>Season</FormLabel>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : seasonsData ? (
                <SearchSelect>
                  <SearchSelectTrigger>
                    <SearchSelectValue placeholder="Select season...">
                      {
                        seasonsData.find((item) => item.id === field.value)
                          ?.title
                      }
                    </SearchSelectValue>
                  </SearchSelectTrigger>
                  <SearchSelectContent>
                    <SearchSelectInput placeholder="Search seasons..." />
                    <SearchSelectList>
                      <SearchSelectEmpty>No content found.</SearchSelectEmpty>
                      <SearchSelectGroup>
                        {seasonsData.map((item) => (
                          <SearchSelectItem
                            key={item.id}
                            value={item.id}
                            onSelect={() => {
                              form.setValue("seasonId", item.id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === item.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {item.title}
                          </SearchSelectItem>
                        ))}
                      </SearchSelectGroup>
                    </SearchSelectList>
                  </SearchSelectContent>
                </SearchSelect>
              ) : null}
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
                <Input type="number" placeholder="Episode Number" {...field} />
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
                <Input placeholder="Episode Title" {...field} />
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="videoFile"
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
        <Button type="submit">Create Episode</Button>
      </form>
    </Form>
  );
}
