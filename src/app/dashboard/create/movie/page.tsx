import { CreateMovieForm } from "@/components/forms/create-movie-form";

export default function CreateMoviePage() {
  return (
    <div>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-mono font-medium text-foreground">
                Create New Movie
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Add a new movie to the library.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-8">
        <CreateMovieForm />
      </div>
    </div>
  );
}