import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Gym, Member } from "@/types/api";

interface Props {
  member: Member | null;
  selectedGym: Gym | undefined;
  onSelectHomeGym: (gym: Gym) => void;
}

export function GymSelector({ member, selectedGym, onSelectHomeGym }: Props) {
  const homeGym = member?.HomeGym;
  const isHomeGym = !!homeGym && selectedGym?.Id === homeGym.Id;

  const btnClass = (active: boolean) =>
    cn(
      "h-10 rounded-full px-5 text-sm font-medium transition-all",
      active
        ? "bg-[#008CA0] text-[#090909] hover:bg-[#008CA0]/90 shadow-[0_0_18px_rgba(0,140,160,0.35)]"
        : "border border-border bg-transparent text-foreground hover:border-[#F08223] hover:text-[#F08223]",
    );

  return (
    <div className="flex h-full w-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Gym
        </h3>
        <span className="text-sm font-medium text-foreground">
          {selectedGym?.Name ?? "—"}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          className={btnClass(isHomeGym)}
          disabled={!homeGym}
          onClick={() => {
            if (homeGym) onSelectHomeGym(homeGym);
          }}
        >
          HomeGym
        </Button>
      </div>
    </div>
  );
}
