export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
        <span className="ml-2">{label}</span>
      </div>
    </div>
  );
}
