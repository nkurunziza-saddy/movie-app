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
import { AlertCircle, Loader2 } from "lucide-react";
import {
  getTvShows,
  getSeasonsByTvShowId,
} from "@/lib/actions/content-query-action";
import { createSeason } from "@/lib/actions/content-mutations";
import { toast } from "sonner";
import { Alert, AlertDescription } from "../ui/alert";

const seasonSchema = z.object({
  tvShowId: z.string().min(1, "A TV Show must be selected."),
  seasonNumber: z.number().positive("Season number is required."),
  title: z.string().min(1, "Season title is required."),
});

type CreateSeasonFormData = z.infer<typeof seasonSchema>;

export function CreateSeasonForm() {
  const [selectedTvShowId, setSelectedTvShowId] = useState<string | null>(null);
  const [dataError, setDataError] = useState("");
  const form = useForm<CreateSeasonFormData>({
    resolver: zodResolver(seasonSchema as any),
    defaultValues: {
      tvShowId: "",
      seasonNumber: 1,
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
  const seasonNumberValue = form.watch("seasonNumber");
  useEffect(() => {
    if (seasonsOfShow?.length) {
      const seasonsNumbers = seasonsOfShow
        .map((t) => t.seasonNumber)
        .sort((a, b) => a - b);

      const latestSeason = seasonsNumbers[seasonsNumbers.length - 1] ?? 0;
      const nextSeasonNumber = latestSeason + 1;

      const areConsecutive = seasonsNumbers.every(
        (num, idx) => idx === 0 || num - seasonsNumbers[idx - 1] === 1
      );

      if (!areConsecutive) {
        setDataError(
          `Your seasons are not consecutive: ${seasonsNumbers.join(", ")}`
        );
      }

      if (!form.getValues("seasonNumber")) {
        form.setValue("seasonNumber", nextSeasonNumber);
      }
      if (!form.getValues("title")) {
        form.setValue("title", `Season ${nextSeasonNumber}`);
      }
    }
  }, [seasonsOfShow, form, seasonNumberValue]);

  const onSubmit = async (data: z.infer<typeof seasonSchema>) => {
    toast.info("Creating new season...");
    try {
      await createSeason(data);
      toast.success(`Successfully created ${data.title}!`);
      form.reset();
      setSelectedTvShowId(null);
    } catch (error) {
      console.error("Failed to create season:", error);
      toast.error("Failed to create season.");
    }
  };
  const { isSubmitting } = form.formState;
  return (
    <Form {...form}>
      {dataError && (
        <Alert className="mb-4" variant={"warning"}>
          <AlertCircle />
          <AlertDescription>{dataError}</AlertDescription>
        </Alert>
      )}

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
                              field.onChange(value);
                              setSelectedTvShowId(value);
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
                  min="1"
                  step="1"
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
