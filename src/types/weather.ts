// ============================================================================
// WashUp - Weather Type Definitions (Modul 3: TypeScript Interface untuk API)
// Interface di bawah ini mengikuti bentuk JSON asli dari Open-Meteo:
// https://api.open-meteo.com/v1/forecast?current=...
// ============================================================================

/**
 * Lokasi referensi cuaca (bukan GPS perangkat).
 */
export interface WeatherLocation {
  name: string;
  area: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

/**
 * Satuan data pada blok "current_units" respons Open-Meteo.
 */
export interface OpenMeteoCurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  precipitation: string;
  weather_code: string;
  wind_speed_10m: string;
}

/**
 * Nilai cuaca saat ini pada blok "current" respons Open-Meteo.
 */
export interface OpenMeteoCurrent {
  time: string; // ISO 8601, contoh: "2026-11-11T22:00"
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weather_code: number; // kode WMO
  wind_speed_10m: number;
}

/**
 * Bentuk lengkap respons mentah (raw) dari endpoint /v1/forecast.
 */
export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: OpenMeteoCurrentUnits;
  current: OpenMeteoCurrent;
}

/**
 * Objek data aplikasi (hasil konversi dari respons API) yang dipakai UI.
 */
export interface WeatherData {
  locationLabel: string;
  temperature: number; // °C
  feelsLike: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  precipitation: number; // mm
  weatherCode: number;
  description: string; // contoh: "Cerah berawan"
  iconName: string; // nama ikon Ionicons
  isRaining: boolean;
  observedAt: string; // waktu pengamatan dari API
}

/**
 * Status siklus permintaan cuaca di layar.
 */
export type WeatherStatus = 'loading' | 'success' | 'error';
