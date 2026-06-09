import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import type { Gym } from "@/types/api";

interface Props {
  gyms: Gym[];
  selectedGymId: number | undefined;
  onSelect: (gym: Gym) => void;
}

const UK_CENTER: [number, number] = [54.5, -3.2];
const UK_BOUNDS: [[number, number], [number, number]] = [
  [49.5, -8.7],
  [60.9, 2.2],
];

function makeIcon(state: "default" | "hover" | "selected") {
  const bg =
    state === "selected" ? "#008CA0" : state === "hover" ? "#F08223" : "rgba(83,83,83,0.95)";
  const ring =
    state === "selected"
      ? "0 0 0 4px rgba(0,140,160,0.25), 0 0 16px rgba(0,140,160,0.55)"
      : state === "hover"
        ? "0 0 0 3px rgba(240,130,35,0.25)"
        : "0 1px 4px rgba(0,0,0,0.6)";
  const size = state === "selected" ? 18 : 14;
  const html = `
    <div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${bg};
      border:2px solid #090909;
      box-shadow:${ring};
      transition: all .2s ease;
    "></div>
  `;
  return L.divIcon({
    html,
    className: "gym-marker-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FlyToSelected({ gym }: { gym: Gym | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (!gym) return;
    map.flyTo([gym.Location.GeoLocation.Latitude, gym.Location.GeoLocation.Longitude], 7, {
      duration: 0.8,
    });
  }, [gym, map]);
  return null;
}

export function GymMap({ gyms, selectedGymId, onSelect }: Props) {
  const [hoverId, setHoverId] = useState<number | null>(null);
  const selectedGym = useMemo(() => gyms.find((g) => g.Id === selectedGymId), [gyms, selectedGymId]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <div className="flex items-baseline justify-between px-5 pt-5">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">UK Locations</h2>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          {gyms.length} gyms
        </span>
      </div>
      <div className="m-4 flex-1 overflow-hidden rounded-xl">
        <MapContainer
          center={UK_CENTER}
          zoom={5}
          maxBounds={UK_BOUNDS}
          minZoom={5}
          maxZoom={12}
          scrollWheelZoom
          style={{ height: "100%", width: "100%", background: "#0a0a0a" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <FlyToSelected gym={selectedGym} />
          {gyms.map((gym) => {
            const state =
              gym.Id === selectedGymId ? "selected" : gym.Id === hoverId ? "hover" : "default";
            return (
              <Marker
                key={gym.Id}
                position={[gym.Location.GeoLocation.Latitude, gym.Location.GeoLocation.Longitude]}
                icon={makeIcon(state)}
                eventHandlers={{
                  click: () => onSelect(gym),
                  mouseover: () => setHoverId(gym.Id),
                  mouseout: () => setHoverId((id) => (id === gym.Id ? null : id)),
                }}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={1} className="gym-tooltip">
                  <div className="text-xs">
                    <div className="font-semibold text-foreground">{gym.Name}</div>
                    <div className="text-muted-foreground">
                      {gym.Location.Address.Town ?? "—"} · {gym.Location.Address.Postcode}
                    </div>
                    <div
                      className="mt-1 inline-flex items-center gap-1"
                      style={{
                        color: gym.Status === "Open" ? "#008CA0" : "#C8241E",
                      }}
                    >
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{
                          background: gym.Status === "Open" ? "#008CA0" : "#C8241E",
                        }}
                      />
                      {gym.Status}
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
