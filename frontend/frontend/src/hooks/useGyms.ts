import { useEffect, useState } from "react";
import { fetchGyms } from "@/services/mock";
import type { Gym } from "@/types/api";

export function useGyms() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchGyms()
      .then((g) => !cancelled && setGyms(g))
      .catch((e) => !cancelled && setError(e instanceof Error ? e : new Error(String(e))))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return { gyms, isLoading, error };
}
