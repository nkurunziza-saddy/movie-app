"use client";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CreateMovieForm } from "../forms/create-movie-form";
import { AddEpisodeForm } from "../forms/add-episode-form";
import { CreateTvShowForm } from "../forms/create-tv-show-form";
import { CreateSeasonForm } from "../forms/create-season-form";

export default function CreateDialogs() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="size-8 rounded-full shadow-none"
          aria-label="Open create new content"
        >
          <PlusCircleIcon
            className="text-muted-foreground"
            size={16}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border bg-card">
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Create Movie
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="border bg-card min-w-[70vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create a new Movie</DialogTitle>
              <DialogDescription>
                Enter the details for the new movie.
              </DialogDescription>
            </DialogHeader>
            <CreateMovieForm />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Create Tv Show
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="border min-w-[60vw]  bg-card max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create a new Tv Show</DialogTitle>
              <DialogDescription>
                Enter the details for the new Tv Show.
              </DialogDescription>
            </DialogHeader>
            <CreateTvShowForm />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Add Season
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="border bg-card max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add a new Season</DialogTitle>
              <DialogDescription>
                Enter the details for the new season.
              </DialogDescription>
            </DialogHeader>
            <CreateSeasonForm />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Add Episode
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="border min-w-[60vw]  bg-card max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add a new Episode</DialogTitle>
              <DialogDescription>
                Enter the details for the new episode.
              </DialogDescription>
            </DialogHeader>
            <CreateTvShowForm />
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export function CreateDialogsInline() {
  return (
    <div className="flex gap-1">
      <Dialog>
        <DialogTrigger asChild>
          <Button size={"sm"} variant={"outline"}>
            Create Movie
          </Button>
        </DialogTrigger>
        <DialogContent className="border bg-card min-w-[70vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create a new Movie</DialogTitle>
            <DialogDescription>
              Enter the details for the new movie.
            </DialogDescription>
          </DialogHeader>
          <CreateMovieForm />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button size={"sm"} variant={"outline"}>
            Add A Season
          </Button>
        </DialogTrigger>
        <DialogContent className="border bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add a new Season</DialogTitle>
            <DialogDescription>
              Enter the details for the new season.
            </DialogDescription>
          </DialogHeader>
          <CreateSeasonForm />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button size={"sm"} variant={"outline"}>
            Create Episode
          </Button>
        </DialogTrigger>
        <DialogContent className="border min-w-[60vw]  bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create a new Episode</DialogTitle>
            <DialogDescription>
              Enter the details for the new episode.
            </DialogDescription>
          </DialogHeader>
          <AddEpisodeForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
