import { useEffect, useState } from "react";
import { startOfDay } from "date-fns";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AttendanceChart } from "@/components/AttendanceChart";
import { DateSelector } from "@/components/DateSelector";
import { GymSelector } from "@/components/GymSelector";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { useMember } from "@/hooks/useMember";
import { useGyms } from "@/hooks/useGyms";
import { useAttendance } from "@/hooks/useAttendance";
import type { Gym } from "@/types/api";

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DashboardPage() {
  const { member, isLoading: isLoadingMember, error: memberError } = useMember();
  const { gyms, isLoading: isLoadingGyms, error: gymError } = useGyms();

  const [selectedGym, setSelectedGym] = useState<Gym | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date>(() => startOfDay(new Date()));

  const [GymMapComponent, setGymMapComponent] = useState<
    React.ComponentType<{
      gyms: Gym[];
      selectedGymId: number | undefined;
      onSelect: (gym: Gym) => void;
    }> | null
  >(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    import("@/components/GymMap").then((mod) => {
      setGymMapComponent(() => mod.GymMap);
    });
  }, []);

  useEffect(() => {
    if (!selectedGym && member?.HomeGym) setSelectedGym(member.HomeGym);
  }, [member, selectedGym]);

  const {
    data: attendanceData,
    isLoading: isLoadingAttendance,
    error: attendanceError,
  } = useAttendance(selectedGym?.Id, toISODate(selectedDate));

  const initialLoading = isLoadingMember || isLoadingGyms;
  const initialError = memberError ?? gymError;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1600px] px-6 py-8">
        <DashboardHeader gym={selectedGym} date={selectedDate} />

        {initialLoading ? (
          <div className="flex h-[70vh] items-center justify-center rounded-2xl border border-border bg-card">
            <LoadingState label="Loading dashboard…" />
          </div>
        ) : initialError ? (
          <div className="flex h-[70vh] items-center justify-center rounded-2xl border border-border bg-card">
            <ErrorState message={initialError.message} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(320px,35%)]">
            {/* Left column: chart + date controls */}
            <div className="flex min-h-[70vh] flex-col gap-6">
              <div className="min-h-[480px] flex-[3]">
                <AttendanceChart
                  gymName={selectedGym?.Name ?? ""}
                  date={selectedDate}
                  data={attendanceData}
                  isLoading={isLoadingAttendance}
                  error={attendanceError}
                />
              </div>
              <div className="flex-[1] grid grid-cols-1 gap-6 md:grid-cols-2">
                <DateSelector date={selectedDate} onChange={setSelectedDate} />
                <GymSelector
                  member={member}
                  selectedGym={selectedGym}
                  onSelectHomeGym={setSelectedGym}
                />
              </div>
            </div>

            {/* Right column: map */}
            <div className="min-h-[70vh]">
              {GymMapComponent ? (
                <GymMapComponent
                  gyms={gyms}
                  selectedGymId={selectedGym?.Id}
                  onSelect={setSelectedGym}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-2xl border border-border bg-card">
                  <LoadingState label="Loading map…" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
