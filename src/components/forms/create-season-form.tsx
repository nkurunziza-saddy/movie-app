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
import { Label } from "@/components/ui/label";
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
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TvShowInterface } from "@/lib/db/schema";
import { getTvShows } from "@/lib/actions/content-query-action";

type TvShowItem = TvShowInterface & {
  content: {
    title: string;
  };
};

const seasonSchema = z.object({
  contentId: z.string().min(1, "Series is required"),
  seasonNumber: z.coerce.number().min(1, "Season number is required"),
  title: z.string().min(1, "Season title is required"),
});

export function CreateSeasonForm() {
  const form = useForm<z.infer<typeof seasonSchema>>({
    resolver: zodResolver(seasonSchema) as any,
    defaultValues: {
      contentId: "",
      seasonNumber: undefined,
      title: "",
    },
  });

  const {
    data: tvShowsData,
    error,
    isLoading,
  } = useQuery<TvShowItem[]>({
    queryKey: ["tv-shows"],
    queryFn: getTvShows,
  });

  const onSubmit = async (data: z.infer<typeof seasonSchema>) => {
    try {
      // await createSeasonAction(data);
      console.log("Season data to be submitted:", data);
      // form.reset();
    } catch (error) {
      console.error("Failed to create season:", error);
      // alert("Failed to create season");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="contentId"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <FormLabel>Season</FormLabel>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : tvShowsData ? (
                <SearchSelect>
                  <SearchSelectTrigger>
                    <SearchSelectValue placeholder="Select season...">
                      {
                        tvShowsData.find((item) => item.id === field.value)
                          ?.content.title
                      }
                    </SearchSelectValue>
                  </SearchSelectTrigger>
                  <SearchSelectContent>
                    <SearchSelectInput placeholder="Search seasons..." />
                    <SearchSelectList>
                      <SearchSelectEmpty>No content found.</SearchSelectEmpty>
                      <SearchSelectGroup>
                        {tvShowsData.map((item) => (
                          <SearchSelectItem
                            key={item.id}
                            value={item.id}
                            onSelect={() => {
                              form.setValue("contentId", item.id);
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
                            {item.content.title}
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
          name="seasonNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Season Number</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Season Number" {...field} />
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
              <FormLabel>Season Title</FormLabel>
              <FormControl>
                <Input placeholder="Season Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Season</Button>
      </form>
    </Form>
  );
}
