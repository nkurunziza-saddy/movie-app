"use client";

import { useState, useEffect } from "react";
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
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getTvShows,
  getSeasonsByTvShowId,
} from "@/lib/actions/content-query-action";
import { createSeason } from "@/lib/actions/content-mutations";
import { toast } from "sonner";

const seasonSchema = z.object({
  tvShowId: z.string().min(1, "A TV Show must be selected."),
  seasonNumber: z.coerce.number().min(1, "Season number is required."),
  title: z.string().min(1, "Season title is required."),
});

export function CreateSeasonForm() {
  const [selectedTvShowId, setSelectedTvShowId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof seasonSchema>>({
    resolver: zodResolver(seasonSchema as any),
    defaultValues: {
      tvShowId: "",
      seasonNumber: undefined,
      title: "",
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

  useEffect(() => {
    if (seasonsOfShow) {
      const latestSeason = seasonsOfShow[0]?.seasonNumber || 0;
      const nextSeasonNumber = latestSeason + 1;
      form.setValue("seasonNumber", nextSeasonNumber);
      form.setValue("title", `Season ${nextSeasonNumber}`);
    }
  }, [seasonsOfShow, form]);

  const onSubmit = async (data: z.infer<typeof seasonSchema>) => {
    setIsSubmitting(true);
    toast.info("Creating new season...");
    try {
      await createSeason(data);
      toast.success(`Successfully created ${data.title}!`);
      form.reset();
      setSelectedTvShowId(null);
      // Manually clear the search select trigger text
      const trigger = document.querySelector("[data-radix-collection-item]");
      if (trigger) (trigger as HTMLElement).textContent = "Select TV Show...";
    } catch (error) {
      console.error("Failed to create season:", error);
      toast.error("Failed to create season.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tvShowId"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2">
              <FormLabel>TV Show</FormLabel>
              <SearchSelect>
                <SearchSelectTrigger>
                  <SearchSelectValue placeholder="Select TV Show...">
                    {
                      tvShowsData?.find((item) => item.id === field.value)
                        ?.content.title
                    }
                  </SearchSelectValue>
                </SearchSelectTrigger>
                <SearchSelectContent>
                  <SearchSelectInput
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedTvShowId(value);
                    }}
                    placeholder="Search TV shows..."
                  />
                  <SearchSelectList>
                    <SearchSelectEmpty>No shows found.</SearchSelectEmpty>
                    <SearchSelectGroup>
                      {isTvShowsLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        tvShowsData?.map((item) => (
                          <SearchSelectItem key={item.id} value={item.id}>
                            {item.content.title}
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
          name="seasonNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Season Number</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 4"
                  {...field}
                  disabled={!selectedTvShowId || isSeasonsLoading}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              </FormControl>
              {isSeasonsLoading && (
                <p className="text-xs text-muted-foreground">
                  Loading latest season...
                </p>
              )}
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
                <Input
                  placeholder="e.g., Season 4"
                  {...field}
                  disabled={!selectedTvShowId || isSeasonsLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting || !selectedTvShowId}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Season
        </Button>
      </form>
    </Form>
  );
}
