import { AddEpisodeForm } from "@/components/forms/add-episode-form";
import { CreateMovieForm } from "@/components/forms/create-movie-form";
import { CreateSeasonForm } from "@/components/forms/create-season-form";
import { CreateTvShowForm } from "@/components/forms/create-tv-show-form";
import { notFound } from "next/navigation";

export const FORMS_DETAILS = [
  {
    name: "create-movie",
    title: "Create New Movie",
    description: "Upload to a new movie to app.",
  },
  {
    name: "create-show",
    title: "Create New Tv Show",
    description: "Upload to a new tv show to app.",
  },
  {
    name: "create-season",
    title: "Create New Season",
    description: "Upload to a new season to existing show.",
  },
  {
    name: "create-episode",
    title: "Add New Episode",
    description: "Upload to a new episode to an existing show.",
  },
];

export function renderForm(name: string) {
  switch (name) {
    case "create-movie":
      return <CreateMovieForm />;
    case "create-show":
      return <CreateTvShowForm />;
    case "create-season":
      return <CreateSeasonForm />;
    case "create-episode":
      return <AddEpisodeForm />;
    default:
      return null;
  }
}
