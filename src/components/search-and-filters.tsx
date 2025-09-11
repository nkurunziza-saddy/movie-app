"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Card, CardContent } from "./ui/card";

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

const qualities = ["720p", "1080p", "4K"];

export function SearchAndFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedQuality("");
    setSearchQuery("");
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
          onChange={(e) => setSearchQuery(e.target.value)}
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
          {/* <Filter className="h-4 w-4" /> */}
          Filters
          {hasActiveFilters && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {selectedGenres.length + (selectedQuality ? 1 : 0)}
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
                    className=""
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm text-card-foreground mb-2">
                Quality
              </h3>
              <div className="flex gap-2">
                {qualities.map((quality) => (
                  <Button
                    key={quality}
                    variant={
                      selectedQuality === quality ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setSelectedQuality(
                        selectedQuality === quality ? "" : quality
                      )
                    }
                    className=""
                  >
                    {quality}
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
              Search: "{searchQuery}"
              <X className="size-3" onClick={() => setSearchQuery("")} />
            </Badge>
          )}
          {selectedGenres.map((genre) => (
            <Badge
              key={genre}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {genre}
              <X className="size-3" onClick={() => toggleGenre(genre)} />
            </Badge>
          ))}
          {selectedQuality && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {selectedQuality}
              <X className="size-3" onClick={() => setSelectedQuality("")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
