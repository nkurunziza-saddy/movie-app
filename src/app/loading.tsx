export default function Loading() {
  return (
    <div className="absolute inset-0 bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
    </div>
  );
}
