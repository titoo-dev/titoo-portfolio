import type { NextRequest } from "next/server";
import { HOME, type Weather } from "@/lib/sky";

/**
 * Current weather where the visitor is, for the decorative sky. Location
 * comes from Vercel's IP geolocation headers (Antananarivo when absent, e.g.
 * in dev); the forecast from Open-Meteo, which needs no key. Coordinates are
 * rounded to ~10 km so nearby visitors share one cached upstream call.
 */
export async function GET(request: NextRequest) {
  const h = request.headers;
  const lat = Number.parseFloat(h.get("x-vercel-ip-latitude") ?? "");
  const lon = Number.parseFloat(h.get("x-vercel-ip-longitude") ?? "");
  const located = Number.isFinite(lat) && Number.isFinite(lon);
  const at = located
    ? { lat: Math.round(lat * 10) / 10, lon: Math.round(lon * 10) / 10 }
    : HOME;
  const city = located ? decodeCity(h.get("x-vercel-ip-city")) : HOME.city;

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(at.lat),
    longitude: String(at.lon),
    current: "temperature_2m,weather_code,cloud_cover,wind_speed_10m",
    daily: "sunrise,sunset",
    timezone: "auto",
    forecast_days: "1",
    timeformat: "unixtime",
  }).toString();

  try {
    const res = await fetch(url, {
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
    const data = await res.json();
    const weather: Weather = {
      city,
      lat: at.lat,
      temp: Math.round(data.current.temperature_2m),
      code: data.current.weather_code,
      cloud: data.current.cloud_cover,
      wind: data.current.wind_speed_10m,
      sunrise: data.daily.sunrise[0] * 1000,
      sunset: data.daily.sunset[0] * 1000,
    };
    return Response.json(weather, {
      headers: { "Cache-Control": "private, max-age=600" },
    });
  } catch {
    return Response.json({ error: "weather unavailable" }, { status: 502 });
  }
}

function decodeCity(raw: string | null) {
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
