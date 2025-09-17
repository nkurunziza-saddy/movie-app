"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, ChevronDown } from "lucide-react";
import { Card, CardContent } from "../ui/card";

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
  const selectedQuality = searchParams.get("quality") ?? "";

  const [showFilters, setShowFilters] = useState(false);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const updateQueryString = (newParams: URLSearchParams) => {
    router.replace(`/?${newParams.toString()}`);
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
    if (selectedQuality === content_type) {
      params.delete("contentType");
    } else {
      params.set("contentType", content_type);
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

  const clearFilters = () => {
    router.replace("/");
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

  const removeSearchQuery = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    updateQueryString(params);
  };

  const hasActiveFilters =
    selectedGenres.length > 0 || selectedQuality || searchQuery;

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
                (selectedContentType ? 1 : 0) +
                (searchQuery ? 1 : 0)}
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
        <Card>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-medium text-sm text-card-foreground mb-2">
                Content type
              </h3>
              <div className="flex flex-wrap gap-2">
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
              <h3 className="font-medium text-sm text-card-foreground mb-2">
                Genres
              </h3>
              <div className="flex flex-wrap gap-2">
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
        </div>
      )}
    </div>
  );
}
