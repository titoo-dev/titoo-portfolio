// ---------------------------------------------------------------------------
// Sky model behind the decorative background: the weather the API reports,
// reduced to the few things the scene draws (time of day, condition, season,
// moon phase). Pure functions, safe on the server and the client.
// ---------------------------------------------------------------------------

/** What /api/weather returns. Times are unix milliseconds. */
export type Weather = {
  city: string | null;
  lat: number;
  temp: number;
  /** WMO weather interpretation code. */
  code: number;
  /** Total cloud cover, 0-100. */
  cloud: number;
  /** Wind speed at 10 m, km/h. */
  wind: number;
  sunrise: number;
  sunset: number;
};

export type Phase = "dawn" | "day" | "dusk" | "night";
export type Condition =
  | "clear"
  | "partly"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "storm"
  | "snow";
export type Season = "spring" | "summer" | "autumn" | "winter";

export type Scene = {
  phase: Phase;
  /** How far the sun (day) or the moon (night) is along its arc, 0-1. */
  progress: number;
  condition: Condition;
  season: Season;
  /** Lunar age as a fraction of the synodic month: 0 new, 0.5 full. */
  moon: number;
  southern: boolean;
  /** Between the tropics, where spring means jacarandas, not cherry trees. */
  tropical: boolean;
  wind: number;
  temp: number | null;
  city: string | null;
};

/** Sun above the horizon: the site's automatic theme turns light. */
export function sunUp({ phase, progress }: Scene) {
  return phase !== "night" && progress >= 0 && progress <= 1;
}

/** Overall look of the sky, which drives its palette. */
export function moodOf({ condition }: Scene) {
  if (condition === "rain" || condition === "storm") return "storm";
  if (condition === "clear" || condition === "partly") return "clear";
  return "grey";
}

/** Seasonal life (petals, leaves, butterflies) only shows in fair weather. */
export function fairWeather({ condition }: Scene) {
  return condition === "clear" || condition === "partly";
}

/** Visitors outside Vercel's geolocation (and local dev) get Antananarivo. */
export const HOME = { lat: -18.88, lon: 47.51, city: "Antananarivo" };

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
/** Half-width of the dawn and dusk windows around sunrise and sunset. */
const TWILIGHT = 0.75 * HOUR;

/** WMO codes: https://open-meteo.com/en/docs#weather_variable_documentation */
export function conditionOf(code: number, cloud: number): Condition {
  if (code >= 95) return "storm";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code === 45 || code === 48) return "fog";
  // The code says "partly cloudy" up to a mostly grey sky; trust the cover.
  if (code === 3 || cloud >= 65) return "cloudy";
  if (code === 2 || cloud >= 30) return "partly";
  return "clear";
}

export function phaseOf(
  now: number,
  sunrise: number,
  sunset: number,
): { phase: Phase; progress: number } {
  // The cached sunrise/sunset may be from another day: move them by whole
  // days so solar noon is within 12 hours of now.
  const shift = Math.round((now - (sunrise + sunset) / 2) / DAY) * DAY;
  const rise = sunrise + shift;
  const set = sunset + shift;

  if (now > rise - TWILIGHT && now < set + TWILIGHT) {
    // The sun dips just below the horizon at the edges of dawn and dusk.
    const progress = (now - rise) / (set - rise);
    const phase =
      Math.abs(now - rise) < TWILIGHT
        ? "dawn"
        : Math.abs(now - set) < TWILIGHT
          ? "dusk"
          : "day";
    return { phase, progress };
  }
  // Night: from the last sunset to the next sunrise.
  const lastSet = now > set ? set : set - DAY;
  const nextRise = now > set ? rise + DAY : rise;
  return {
    phase: "night",
    progress: (now - lastSet) / (nextRise - lastSet),
  };
}

const SEASONS: Season[] = ["winter", "spring", "summer", "autumn"];

export function seasonOf(date: Date, lat: number): Season {
  // Meteorological seasons: Dec-Feb is winter up north, summer down south.
  const quarter = Math.floor(((date.getMonth() + 1) % 12) / 3);
  return SEASONS[(quarter + (lat < 0 ? 2 : 0)) % 4];
}

const SYNODIC_MONTH = 29.530588853 * DAY;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

export function moonAgeOf(now: number) {
  const age = ((now - KNOWN_NEW_MOON) % SYNODIC_MONTH) / SYNODIC_MONTH;
  return age < 0 ? age + 1 : age;
}

/** Today's sunrise and sunset by the visitor's clock, when the API is out. */
function defaultSun(now: number) {
  const d = new Date(now);
  d.setHours(6, 0, 0, 0);
  const sunrise = d.getTime();
  return { sunrise, sunset: sunrise + 12 * HOUR };
}

export function sceneOf(weather: Weather | null, now: number): Scene {
  const sun = weather ?? defaultSun(now);
  const lat = weather?.lat ?? HOME.lat;
  return {
    ...phaseOf(now, sun.sunrise, sun.sunset),
    condition: weather ? conditionOf(weather.code, weather.cloud) : "partly",
    season: seasonOf(new Date(now), lat),
    moon: moonAgeOf(now),
    southern: lat < 0,
    tropical: Math.abs(lat) < 23.5,
    wind: weather?.wind ?? 8,
    temp: weather?.temp ?? null,
    city: weather?.city ?? null,
  };
}

/** Scenes the visitor can preview from the weather chip. */
export const PRESETS = [
  "live",
  "day",
  "dusk",
  "night",
  "rain",
  "storm",
  "snow",
] as const;
export type Preset = (typeof PRESETS)[number];

export function applyPreset(scene: Scene, preset: Preset): Scene {
  switch (preset) {
    case "live":
      return scene;
    case "day":
      return { ...scene, phase: "day", progress: 0.32, condition: "partly" };
    case "dusk":
      return { ...scene, phase: "dusk", progress: 0.97, condition: "partly" };
    case "night":
      return { ...scene, phase: "night", progress: 0.4, condition: "clear" };
    case "rain":
      return { ...scene, phase: "day", progress: 0.55, condition: "rain" };
    case "storm":
      return { ...scene, phase: "night", progress: 0.6, condition: "storm" };
    case "snow":
      return {
        ...scene,
        phase: "day",
        progress: 0.4,
        condition: "snow",
        season: "winter",
        temp: Math.min(scene.temp ?? -2, -2),
      };
  }
}
