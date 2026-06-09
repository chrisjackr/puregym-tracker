import type { AttendancePoint, Gym, Member } from "@/types/api";
import api from "./api";

/** Flip to false when the self-hosted API is reachable. */
export const USE_MOCK = true;

const mockGyms: Gym[] = [
  {
    Id: 1,
    Name: "PureGym London Bridge",
    Status: "Open",
    Location: {
      GeoLocation: { Latitude: 51.5045, Longitude: -0.0865 },
      Address: { Town: "London", Postcode: "SE1 9SG", Country: "United Kingdom" },
    },
    ContactInfo: { PhoneNumber: "+44 20 7946 0001" },
    TimeZone: "Europe/London",
  },
  {
    Id: 2,
    Name: "PureGym Manchester Central",
    Status: "Open",
    Location: {
      GeoLocation: { Latitude: 53.4795, Longitude: -2.2452 },
      Address: { Town: "Manchester", Postcode: "M2 3AE", Country: "United Kingdom" },
    },
    ContactInfo: { PhoneNumber: "+44 161 555 0102" },
    TimeZone: "Europe/London",
  },
  {
    Id: 3,
    Name: "PureGym Birmingham Bullring",
    Status: "Open",
    Location: {
      GeoLocation: { Latitude: 52.4778, Longitude: -1.8939 },
      Address: { Town: "Birmingham", Postcode: "B5 4BU", Country: "United Kingdom" },
    },
    ContactInfo: { PhoneNumber: "+44 121 555 0103" },
    TimeZone: "Europe/London",
  },
  {
    Id: 4,
    Name: "PureGym Leeds City",
    Status: "Open",
    Location: {
      GeoLocation: { Latitude: 53.7997, Longitude: -1.5492 },
      Address: { Town: "Leeds", Postcode: "LS1 4DY", Country: "United Kingdom" },
    },
    ContactInfo: { PhoneNumber: "+44 113 555 0104" },
    TimeZone: "Europe/London",
  },
  {
    Id: 5,
    Name: "PureGym Glasgow Merchant City",
    Status: "Open",
    Location: {
      GeoLocation: { Latitude: 55.8587, Longitude: -4.2502 },
      Address: { Town: "Glasgow", Postcode: "G1 1HL", Country: "United Kingdom" },
    },
    ContactInfo: { PhoneNumber: "+44 141 555 0105" },
    TimeZone: "Europe/London",
  },
  {
    Id: 6,
    Name: "PureGym Edinburgh Old Town",
    Status: "Open",
    Location: {
      GeoLocation: { Latitude: 55.9533, Longitude: -3.1883 },
      Address: { Town: "Edinburgh", Postcode: "EH1 1RE", Country: "United Kingdom" },
    },
    ContactInfo: { PhoneNumber: "+44 131 555 0106" },
    TimeZone: "Europe/London",
  },
  {
    Id: 7,
    Name: "PureGym Bristol Harbourside",
    Status: "Maintenance",
    Location: {
      GeoLocation: { Latitude: 51.4495, Longitude: -2.6005 },
      Address: { Town: "Bristol", Postcode: "BS1 5TX", Country: "United Kingdom" },
    },
    ContactInfo: { PhoneNumber: "+44 117 555 0107" },
    TimeZone: "Europe/London",
  },
  {
    Id: 8,
    Name: "PureGym Liverpool Albert Dock",
    Status: "Open",
    Location: {
      GeoLocation: { Latitude: 53.4006, Longitude: -2.9925 },
      Address: { Town: "Liverpool", Postcode: "L3 4AD", Country: "United Kingdom" },
    },
    ContactInfo: { PhoneNumber: "+44 151 555 0108" },
    TimeZone: "Europe/London",
  },
  {
    Id: 9,
    Name: "PureGym Newcastle Quayside",
    Status: "Open",
    Location: {
      GeoLocation: { Latitude: 54.9706, Longitude: -1.6021 },
      Address: { Town: "Newcastle upon Tyne", Postcode: "NE1 3DX", Country: "United Kingdom" },
    },
    ContactInfo: { PhoneNumber: "+44 191 555 0109" },
    TimeZone: "Europe/London",
  },
  {
    Id: 10,
    Name: "PureGym Cardiff Bay",
    Status: "Open",
    Location: {
      GeoLocation: { Latitude: 51.4641, Longitude: -3.1655 },
      Address: { Town: "Cardiff", Postcode: "CF10 5BZ", Country: "United Kingdom" },
    },
    ContactInfo: { PhoneNumber: "+44 29 5550 0110" },
    TimeZone: "Europe/London",
  },
  {
    Id: 11,
    Name: "PureGym Belfast Titanic",
    Status: "Open",
    Location: {
      GeoLocation: { Latitude: 54.6079, Longitude: -5.9101 },
      Address: { Town: "Belfast", Postcode: "BT3 9EP", Country: "United Kingdom" },
    },
    ContactInfo: { PhoneNumber: "+44 28 5550 0111" },
    TimeZone: "Europe/London",
  },
  {
    Id: 12,
    Name: "PureGym Sheffield Peace Gardens",
    Status: "Open",
    Location: {
      GeoLocation: { Latitude: 53.3781, Longitude: -1.4701 },
      Address: { Town: "Sheffield", Postcode: "S1 2HH", Country: "United Kingdom" },
    },
    ContactInfo: { PhoneNumber: "+44 114 555 0112" },
    TimeZone: "Europe/London",
  },
];

const mockMember: Member = {
  HomeGym: mockGyms[0],
  MemberStatus: "Active",
  PersonalDetails: { FirstName: "Alex", LastName: "Morgan" },
};

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

/**
 * Generate per-minute attendance for a single day with two realistic peaks
 * (morning and evening), lunch dip, and overnight lull.
 */
function generateAttendance(gymId: number, dateISO: string): AttendancePoint[] {
  const rand = seeded(gymId * 9973 + Number(dateISO.replace(/-/g, "")));
  const base = 20 + Math.floor(rand() * 30);
  const points: AttendancePoint[] = [];
  const date = new Date(dateISO + "T00:00:00");

  for (let m = 0; m < 1440; m++) {
    const hour = m / 60;
    // Two Gaussian-like peaks: ~7am and ~6pm, lunchtime mini-peak ~12:30
    const morning = Math.exp(-Math.pow(hour - 7, 2) / 4) * 90;
    const evening = Math.exp(-Math.pow(hour - 18, 2) / 5) * 130;
    const lunch = Math.exp(-Math.pow(hour - 12.5, 2) / 1.5) * 40;
    const overnight = hour < 5 || hour > 22.5 ? -base * 0.6 : 0;
    const noise = (rand() - 0.5) * 12;
    const count = Math.max(0, Math.round(base + morning + evening + lunch + overnight + noise));
    const t = new Date(date.getTime() + m * 60_000);
    points.push({ time: t.toISOString(), count });
  }
  return points;
}

const delay = <T,>(value: T, ms = 350) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

export async function fetchMember(): Promise<Member> {
  if (USE_MOCK) return delay(mockMember);
  const { data } = await api.get<Member>("/member");
  return data;
}

export async function fetchGyms(): Promise<Gym[]> {
  if (USE_MOCK) return delay(mockGyms);
  const { data } = await api.get<Gym[]>("/gyms");
  return data;
}

export async function fetchAttendance(
  gymId: number,
  dateISO: string,
): Promise<AttendancePoint[]> {
  if (USE_MOCK) return delay(generateAttendance(gymId, dateISO), 250);
  const { data } = await api.get<AttendancePoint[]>("/attendance", {
    params: { start: dateISO, end: dateISO, gymId },
  });
  return data;
}
