import { useEffect, useState } from "react";
import { fetchAttendance } from "@/services/mock";
import type { AttendancePoint } from "@/types/api";

export function useAttendance(gymId: number | undefined, dateISO: string) {
  const [data, setData] = useState<AttendancePoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (gymId == null) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchAttendance(gymId, dateISO)
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e instanceof Error ? e : new Error(String(e))))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [gymId, dateISO]);

  return { data, isLoading, error };
}
