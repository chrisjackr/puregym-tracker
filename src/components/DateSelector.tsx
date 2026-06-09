import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format, isSameDay, startOfDay, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Props {
  date: Date;
  onChange: (d: Date) => void;
}

export function DateSelector({ date, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);
  const isToday = isSameDay(date, today);
  const isYesterday = isSameDay(date, yesterday);

  const quick = (active: boolean) =>
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
          Date
        </h3>
        <span className="text-sm font-medium text-foreground">
          {format(date, "EEEE, d MMMM yyyy")}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" className={quick(isToday)} onClick={() => onChange(today)}>
          Today
        </Button>
        <Button type="button" className={quick(isYesterday)} onClick={() => onChange(yesterday)}>
          Yesterday
        </Button>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              className={cn(
                "h-10 gap-2 rounded-full border border-border bg-transparent px-5 text-sm font-medium text-foreground hover:border-[#F08223] hover:text-[#F08223]",
                !isToday && !isYesterday && "border-[#F08223] text-[#F08223]",
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              Pick a date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (d) {
                  onChange(startOfDay(d));
                  setOpen(false);
                }
              }}
              disabled={(d) => d > today}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
