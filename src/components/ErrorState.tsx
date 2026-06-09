import { AlertTriangle } from "lucide-react";

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="flex max-w-sm flex-col items-center gap-2 text-center">
        <AlertTriangle className="h-6 w-6 text-destructive" />
        <p className="text-sm font-medium text-foreground">Something went wrong</p>
        <p className="text-xs text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
