// ============================================================================
// WashUp - Weather Service (Modul 3: Asynchronous Programming & API Call)
//
// Alur data:
//   fetchWithTimeout()  -> Promise manual (resolve / reject) membungkus fetch()
//   fetchWeather()      -> fungsi async/await kustom: request -> validasi -> objek typed
//   parseWeatherResponse() -> konversi JSON API menjadi interface WeatherData
// ============================================================================

import type {
  OpenMeteoResponse,
  WeatherData,
  WeatherLocation,
} from '../types/weather';

/**
 * Lokasi referensi cuaca WashUp: kampus utama Universitas Muhammadiyah Malang.
 * Satu-satunya tempat koordinat didefinisikan; ubah di sini untuk mengganti lokasi.
 * Tidak memakai GPS perangkat.
 */
export const WASHUP_LOCATION: WeatherLocation = {
  name: 'Universitas Muhammadiyah Malang',
  area: 'Tlogomas, Lowokwaru, Malang',
  latitude: -7.921,
  longitude: 112.5979,
  timezone: 'Asia/Jakarta',
};

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 10000;

/**
 * Menyusun URL HTTPS Open-Meteo (tanpa API key).
 */
export function buildWeatherUrl(location: WeatherLocation): string {
  const params = [
    `latitude=${location.latitude}`,
    `longitude=${location.longitude}`,
    'current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
    `timezone=${encodeURIComponent(location.timezone)}`,
  ];
  return `${OPEN_METEO_BASE_URL}?${params.join('&')}`;
}

/**
 * CUSTOM PROMISE (new Promise + resolve + reject + .then()).
 *
 * fetch() bawaan tidak punya timeout, jadi dibungkus Promise manual:
 *  - resolve(response)  : fetch berhasil mendapat respons dalam batas waktu
 *  - reject(Error)      : waktu habis, atau jaringan gagal
 */
export function fetchWithTimeout(
  url: string,
  timeoutMs: number = REQUEST_TIMEOUT_MS
): Promise<Response> {
  return new Promise<Response>((resolve, reject) => {
    const controller = new AbortController();

    // Jalur reject #1: timeout
    const timer = setTimeout(() => {
      controller.abort();
      reject(new Error('Waktu permintaan habis. Periksa koneksi internet Anda.'));
    }, timeoutMs);

    // fetch() adalah fungsi asynchronous bawaan yang mengembalikan Promise
    fetch(url, { signal: controller.signal })
      .then((response) => {
        clearTimeout(timer);
        resolve(response); // Jalur resolve
      })
      .catch(() => {
        clearTimeout(timer);
        // Jalur reject #2: kegagalan jaringan
        reject(new Error('Tidak dapat terhubung ke server cuaca. Periksa koneksi internet Anda.'));
      });
  });
}

/**
 * Deskripsi & ikon berdasarkan kode cuaca WMO (Condition + Function).
 */
export function describeWeatherCode(code: number): { description: string; iconName: string } {
  if (code === 0) return { description: 'Cerah', iconName: 'sunny-outline' };
  if (code === 1) return { description: 'Cerah berawan', iconName: 'partly-sunny-outline' };
  if (code === 2) return { description: 'Berawan sebagian', iconName: 'partly-sunny-outline' };
  if (code === 3) return { description: 'Mendung', iconName: 'cloudy-outline' };
  if (code === 45 || code === 48) return { description: 'Berkabut', iconName: 'cloud-outline' };
  if (code >= 51 && code <= 57) return { description: 'Gerimis', iconName: 'rainy-outline' };
  if (code >= 61 && code <= 67) return { description: 'Hujan', iconName: 'rainy-outline' };
  if (code >= 71 && code <= 77) return { description: 'Salju', iconName: 'snow-outline' };
  if (code >= 80 && code <= 82) return { description: 'Hujan lebat sesaat', iconName: 'rainy-outline' };
  if (code === 85 || code === 86) return { description: 'Hujan salju', iconName: 'snow-outline' };
  if (code >= 95 && code <= 99) return { description: 'Badai petir', iconName: 'thunderstorm-outline' };
  return { description: 'Kondisi tidak diketahui', iconName: 'cloud-outline' };
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Validasi JSON mentah lalu konversi menjadi objek typed WeatherData.
 * Melempar Error jika respons tidak sesuai interface OpenMeteoResponse.
 */
export function parseWeatherResponse(json: unknown, location: WeatherLocation): WeatherData {
  const data = json as Partial<OpenMeteoResponse> | null;
  const current = data && typeof data === 'object' ? data.current : undefined;

  if (
    !current ||
    typeof current !== 'object' ||
    !isFiniteNumber(current.temperature_2m) ||
    !isFiniteNumber(current.apparent_temperature) ||
    !isFiniteNumber(current.relative_humidity_2m) ||
    !isFiniteNumber(current.wind_speed_10m) ||
    !isFiniteNumber(current.precipitation) ||
    !isFiniteNumber(current.weather_code) ||
    typeof current.time !== 'string'
  ) {
    throw new Error('Data cuaca dari server tidak valid.');
  }

  const { description, iconName } = describeWeatherCode(current.weather_code);

  return {
    locationLabel: location.name,
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    precipitation: current.precipitation,
    weatherCode: current.weather_code,
    description,
    iconName,
    isRaining: current.precipitation > 0 || (current.weather_code >= 51 && current.weather_code <= 99),
    observedAt: current.time,
  };
}

/**
 * CUSTOM ASYNC FUNCTION (async/await).
 *
 * Langkah:
 *  1. await fetchWithTimeout()  -> menunggu respons jaringan
 *  2. cek response.ok           -> error HTTP
 *  3. await response.json()     -> metode async bawaan untuk membaca body
 *  4. parseWeatherResponse()    -> JSON -> WeatherData (typed)
 * Setiap kegagalan menjadi Error sehingga pemanggil cukup memakai .catch().
 */
export async function fetchWeather(
  location: WeatherLocation = WASHUP_LOCATION
): Promise<WeatherData> {
  const response = await fetchWithTimeout(buildWeatherUrl(location));

  if (!response.ok) {
    throw new Error(`Server cuaca merespons dengan kesalahan (HTTP ${response.status}).`);
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new Error('Data cuaca dari server tidak valid.');
  }

  return parseWeatherResponse(json, location);
}
