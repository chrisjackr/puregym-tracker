import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import type { AttendancePoint } from "@/types/api";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";

interface Props {
  gymName: string;
  date: Date;
  data: AttendancePoint[];
  isLoading: boolean;
  error: Error | null;
}

export function AttendanceChart({ gymName, date, data, isLoading, error }: Props) {
  const chartData = useMemo(
    () =>
      data.map((p) => ({
        timeMs: new Date(p.time).getTime(),
        timeLabel: format(parseISO(p.time), "HH:mm"),
        count: p.count,
      })),
    [data],
  );

  const dateLabel = format(date, "EEE, d MMM yyyy");
  const title = `${gymName} Attendance — ${dateLabel}`;

  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Per-minute footfall
        </span>
      </div>

      <div className="relative flex-1">
        {isLoading ? (
          <LoadingState label="Loading attendance…" />
        ) : error ? (
          <ErrorState message={error.message} />
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No attendance recorded for this day.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid stroke="#535353" strokeOpacity={0.25} vertical={false} />
              <XAxis
                dataKey="timeLabel"
                stroke="#535353"
                tick={{ fill: "#9a9a9a", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#535353", strokeOpacity: 0.4 }}
                interval={119}
                minTickGap={20}
              />
              <YAxis
                stroke="#535353"
                tick={{ fill: "#9a9a9a", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#535353", strokeOpacity: 0.4 }}
                width={40}
              />
              <Tooltip
                cursor={{ stroke: "#F08223", strokeOpacity: 0.5, strokeWidth: 1 }}
                contentStyle={{
                  background: "#0f0f0f",
                  border: "1px solid #535353",
                  borderRadius: 10,
                  color: "#fafafa",
                  fontSize: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                }}
                labelStyle={{ color: "#008CA0", fontWeight: 600 }}
                formatter={(value) => [String(value), "Members"]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#008CA0"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#F08223", stroke: "#008CA0", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
