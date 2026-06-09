import { useEffect, useState } from "react";
import { fetchMember } from "@/services/mock";
import type { Member } from "@/types/api";

export function useMember() {
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchMember()
      .then((m) => !cancelled && setMember(m))
      .catch((e) => !cancelled && setError(e instanceof Error ? e : new Error(String(e))))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return { member, isLoading, error };
}
