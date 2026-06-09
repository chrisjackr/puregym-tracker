## Gym Attendance Analytics Dashboard

A single-page dashboard with a UK gym map (react-leaflet), an attendance line chart (Recharts), and date controls. Mock data wired now via an axios-shaped service so swapping to the real API later is a one-line change.

### Tech & libraries to add
- `axios` — HTTP client per spec
- `leaflet` + `react-leaflet` + `@types/leaflet` — interactive UK map
- `recharts` — line chart (already common in template)
- `date-fns` — date formatting

### Design tokens (src/styles.css)
Add to `@theme`/`:root` and force dark theme:
- `--gym-black: #090909` (background)
- `--gym-grey: #535353` (borders, gridlines, secondary text)
- `--gym-yellow: #EDCC36` (primary accent — chart line, selected marker)
- `--gym-orange: #F08223` (interactive/highlights — hover, active buttons)
- `--gym-red: #C8241E` (errors/warnings)

Map shadcn tokens (background, foreground, primary, accent, destructive, border, muted-foreground, card) to these so existing UI components inherit the theme. Apply `class="dark"` on `<html>`.

### File structure
```
src/
├── routes/index.tsx                      → renders <DashboardPage />
├── pages/DashboardPage.tsx
├── components/
│   ├── DashboardHeader.tsx
│   ├── GymMap.tsx                        (react-leaflet, UK-bounded)
│   ├── AttendanceChart.tsx               (recharts LineChart)
│   ├── DateSelector.tsx                  (Today/Yesterday + Calendar popover)
│   ├── LoadingState.tsx
│   └── ErrorState.tsx
├── services/
│   ├── api.ts                            (axios instance per user snippet)
│   └── mock.ts                           (mock gyms/member/attendance generators)
├── hooks/
│   ├── useMember.ts
│   ├── useGyms.ts
│   └── useAttendance.ts                  (refetches on gym/date change)
└── types/api.ts                          (Gym, Member, AttendancePoint)
```

### Data flow
- Axios instance exactly as provided: `baseURL: http://${VITE_API_HOST_ORIGIN}:8000`.
- Service functions (`fetchMember`, `fetchGyms`, `fetchAttendance(gymId, date)`) currently return mock data (resolved promises with small latency). A single `USE_MOCK` flag toggles to real `api.get('/member')`, `api.get('/gyms')`, `api.get('/attendance', { params: { start, end } })`.
- Mock data: ~12 UK gyms (London, Manchester, Birmingham, Leeds, Glasgow, Edinburgh, Bristol, Liverpool, Newcastle, Cardiff, Belfast, Sheffield) with real lat/long, statuses, postcodes. Member's `HomeGym` = London gym. Attendance: 1440 points (per-minute) generated with a realistic curve (low overnight, AM/PM peaks, lunch dip) varied per gym/date seed.
- Hooks manage `isLoading`/`error` state and expose `refetch`.

### Layout
- Header row: title left, selected gym + date right.
- Below header, CSS grid:
  - Left column (65%): AttendanceChart (~75% height) + DateSelector (~25% height) stacked.
  - Right column (35%): GymMap, portrait, full height.
- Responsive: stack to single column under `lg` breakpoint.

### Components

**DashboardHeader** — title "Gym Attendance Analytics" in Yellow Daisy, subtitle showing `{selectedGym.Name} · {formattedDate}`.

**GymMap** — react-leaflet `<MapContainer>` centered on UK (~54.5, -3) with bounds, dark CartoDB tile layer (`dark_all`) for theme fit. Custom `divIcon` markers: grey circle default, orange on hover, yellow filled with subtle glow when selected. `<Tooltip>` shows Name / Town / Postcode / Status. Click sets selected gym via callback.

**AttendanceChart** — Recharts `<LineChart>` with:
- X: time of day (formatted HH:mm), ticks every 2h.
- Y: attendance count.
- Line stroke Yellow Daisy, no dots, smooth (`type="monotone"`), `strokeWidth={2}`.
- Cartesian grid Atomic Grey at low opacity.
- Tooltip dark card with Time + Attendance.
- Title above chart: `{Gym.Name} Attendance — {date}`.
- Loading skeleton, empty state ("No attendance recorded"), error state.

**DateSelector** — Two pill buttons (Today, Yesterday) with active state in Yellow Daisy bg / black text; inactive transparent with grey border, orange on hover. Calendar popover (shadcn Calendar + Popover) for any date. Disable future dates.

**LoadingState** / **ErrorState** — small reusable cards with subtle pulse / red icon respectively.

### State (DashboardPage)
Local state: `selectedGym`, `selectedDate`. Hooks own `member`, `gyms`, `attendanceData` + their loading/error. When `member` loads, default `selectedGym = member.HomeGym`. `useAttendance(selectedGym?.Id, selectedDate)` refetches on either change.

### Technical notes
- Leaflet CSS imported once in `__root.tsx` (`import "leaflet/dist/leaflet.css"`).
- Marker icons: use `divIcon` with inline HTML to avoid the default-icon path issue and to style via Tailwind/CSS variables.
- All fetches client-side from components/hooks — no server functions needed (mock now, self-hosted API later, both browser-side).
- Update `__root.tsx` head: title "Gym Attendance Analytics", matching meta description.
- Update index route to render the dashboard (replace placeholder).

### Deliverable
A polished dark dashboard that loads instantly with mock data, lets the user click UK gym markers, switch dates via quick-select or calendar, and see a smooth attendance curve update in real time. Swapping to the real API is flipping `USE_MOCK = false` in `services/mock.ts`.