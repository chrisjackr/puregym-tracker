import { format } from "date-fns";
import type { Gym } from "@/types/api";

interface Props {
  gym: Gym | undefined;
  date: Date;
}

export function DashboardHeader({ gym, date }: Props) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 pb-6">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#008CA0] shadow-[0_0_10px_rgba(0,140,160,0.6)]" />
          PureGym Analytics
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Gym Attendance <span className="text-[#008CA0]">Analytics</span>
        </h1>
      </div>
      <div className="flex flex-col items-end gap-1 text-right">
        <div className="text-sm font-medium text-foreground">{gym?.Name ?? "—"}</div>
        <div className="text-xs text-muted-foreground">
          {gym ? `${gym.Location.Address.Town ?? ""} · ${gym.Location.Address.Postcode}` : ""}
        </div>
        <div className="mt-1 text-xs uppercase tracking-widest text-[#F08223]">
          {format(date, "EEE, d MMM yyyy")}
        </div>
      </div>
    </header>
  );
}
