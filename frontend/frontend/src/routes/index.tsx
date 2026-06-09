import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/pages/DashboardPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gym Attendance Analytics" },
      {
        name: "description",
        content:
          "Monitor real-time gym occupancy trends across the United Kingdom with a polished analytics dashboard.",
      },
      { property: "og:title", content: "Gym Attendance Analytics" },
      {
        property: "og:description",
        content: "Track UK-wide gym attendance with an interactive map and live trends.",
      },
    ],
  }),
  component: DashboardPage,
});
