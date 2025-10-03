"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, ChevronDown, Loader2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { getDubbers } from "@/lib/actions/content-query-action";
import { useQuery } from "@tanstack/react-query";

const genres = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Romance",
  "Thriller",
  "Adventure",
  "Animation",
  "Documentary",
];

export function SearchAndFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q") ?? "";
  const selectedContentType = searchParams.getAll("contentType");
  const selectedGenres = searchParams.getAll("genre");
  const selectedDubbers = searchParams.getAll("dubbers") ?? "";

  const [showFilters, setShowFilters] = useState(false);

  const { data: dubbersData, isLoading: isLoadingDubbers } = useQuery({
    queryKey: ["dubbers"],
    queryFn: getDubbers,
  });
  console.log({ dubbersData });
  const updateQueryString = (newParams: URLSearchParams) => {
    router.replace(`/?${newParams.toString()}`, { scroll: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("q", e.target.value);
    } else {
      params.delete("q");
    }
    updateQueryString(params);
  };

  const toggleContentType = (content_type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentTypes = params.getAll("contentType");
    if (currentTypes.includes(content_type)) {
      params.delete("contentType");
      currentTypes
        .filter((t) => t !== content_type)
        .forEach((t) => params.append("contentType", t));
    } else {
      params.append("contentType", content_type);
    }
    updateQueryString(params);
  };

  const toggleGenre = (genre: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentGenres = params.getAll("genre");
    if (currentGenres.includes(genre)) {
      params.delete("genre");
      currentGenres
        .filter((g) => g !== genre)
        .forEach((g) => params.append("genre", g));
    } else {
      params.append("genre", genre);
    }
    updateQueryString(params);
  };

  const toggleDubber = (dubber: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentDubbers = params.getAll("dubbers");
    if (currentDubbers.includes(dubber)) {
      params.delete("dubbers");
      currentDubbers
        .filter((g) => g !== dubber)
        .forEach((g) => params.append("dubbers", g));
    } else {
      params.append("dubbers", dubber);
    }
    updateQueryString(params);
  };

  const clearFilters = () => {
    router.replace("/", { scroll: false });
  };

  const removeType = (content_type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentTypes = params.getAll("contentType");
    params.delete("contentType");
    currentTypes
      .filter((g) => g !== content_type)
      .forEach((g) => params.append("contentType", g));
    updateQueryString(params);
  };

  const removeGenre = (genre: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentGenres = params.getAll("genre");
    params.delete("genre");
    currentGenres
      .filter((g) => g !== genre)
      .forEach((g) => params.append("genre", g));
    updateQueryString(params);
  };

  const removeDubber = (dubber: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentDubbers = params.getAll("dubbers");
    params.delete("dubbers");
    currentDubbers
      .filter((g) => g !== dubber)
      .forEach((g) => params.append("dubbers", g));
    updateQueryString(params);
  };

  const removeSearchQuery = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    updateQueryString(params);
  };

  const hasActiveFilters =
    selectedGenres.length > 0 ||
    selectedDubbers.length > 0 ||
    selectedContentType.length > 0 ||
    !!searchQuery;

  return (
    <div className="mb-8 space-y-4">
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/90 h-4 w-4" />
        <Input
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 text-base"
        />
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size={"sm"}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          Filters
          {hasActiveFilters && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {selectedGenres.length +
                selectedDubbers.length +
                selectedContentType.length +
                (searchQuery ? 1 : 0)}{" "}
            </Badge>
          )}
          <ChevronDown className="size-4" />
        </Button>

        {hasActiveFilters && (
          <Button variant="secondary" size={"sm"} onClick={clearFilters}>
            <X className="size-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {showFilters && (
        <Card className="w-full">
          <CardContent className="space-y-4 p-4">
            <div>
              <h3 className="font-medium text-base text-card-foreground mb-3">
                Content type
              </h3>
              <div className="flex flex-wrap gap-3">
                {["movie", "tv"].map((content_type) => (
                  <Button
                    key={content_type}
                    variant={
                      selectedContentType.includes(content_type)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleContentType(content_type)}
                    className="capitalize"
                  >
                    {content_type}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-base text-card-foreground mb-3">
                Genres
              </h3>
              <div className="flex flex-wrap gap-3">
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    variant={
                      selectedGenres.includes(genre) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => toggleGenre(genre)}
                    className="capitalize"
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>
            {dubbersData?.length === 0 && !isLoadingDubbers ? null : (
              <div>
                <h3 className="font-medium text-base text-card-foreground mb-3">
                  Abasobanuzi
                </h3>
                <div className="flex flex-wrap gap-3">
                  {isLoadingDubbers ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    dubbersData?.map((dubber) => (
                      <Button
                        key={dubber.id}
                        variant={
                          selectedDubbers.includes(dubber.id)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => toggleDubber(dubber.id)}
                        className="capitalize"
                      >
                        {dubber.name}
                      </Button>
                    ))
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: &quot;{searchQuery}&quot;
              <X
                className="size-3 cursor-pointer"
                onClick={removeSearchQuery}
              />
            </Badge>
          )}
          {selectedContentType.map((content_type) => (
            <Badge
              key={content_type}
              variant="secondary"
              className="flex capitalize items-center gap-1"
            >
              {content_type}
              <X
                className="size-3 cursor-pointer"
                onClick={() => removeType(content_type)}
              />
            </Badge>
          ))}
          {selectedGenres.map((genre) => (
            <Badge
              key={genre}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {genre}
              <X
                className="size-3 cursor-pointer"
                onClick={() => removeGenre(genre)}
              />
            </Badge>
          ))}
          {selectedDubbers.map((dubber) => (
            <Badge
              key={dubber}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {dubbersData?.find((d) => d.id === dubber)?.name}
              <X
                className="size-3 cursor-pointer"
                onClick={() => removeDubber(dubber)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
