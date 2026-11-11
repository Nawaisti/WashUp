// Pengujian service cuaca WashUp (Modul 3) tanpa dependency tambahan.
// Menjalankan: node scripts/test-weather-service.js
// Service TypeScript di-transpile sementara memakai paket `typescript` yang sudah ada.
// Skenario sukses/gagal diuji dengan fetch palsu (mock); mode --live memanggil API asli.

const fs = require('fs');
const os = require('os');
const path = require('path');
const ts = require('typescript');

const root = path.join(__dirname, '..');
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'washup-weather-'));
const source = fs.readFileSync(path.join(root, 'src', 'services', 'weatherService.ts'), 'utf8');
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
fs.writeFileSync(path.join(outDir, 'weatherService.js'), js);
const service = require(path.join(outDir, 'weatherService.js'));

const sampleBody = {
  latitude: -7.9789,
  longitude: 112.596,
  utc_offset_seconds: 25200,
  timezone: 'Asia/Jakarta',
  timezone_abbreviation: 'GMT+7',
  elevation: 546,
  current_units: {},
  current: {
    time: '2026-11-11T22:00',
    interval: 900,
    temperature_2m: 22.1,
    relative_humidity_2m: 80,
    apparent_temperature: 24.0,
    precipitation: 0,
    weather_code: 0,
    wind_speed_10m: 4.5,
  },
};

const jsonResponse = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

let passed = 0;
let failed = 0;
async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`PASS  ${name}`);
  } catch (e) {
    failed++;
    console.log(`FAIL  ${name}\n      ${e.message}`);
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}
async function expectReject(promise, pattern) {
  try {
    await promise;
  } catch (e) {
    assert(pattern.test(e.message), `pesan error tidak sesuai: "${e.message}"`);
    return;
  }
  throw new Error('seharusnya reject, tetapi resolve');
}

(async () => {
  const realFetch = global.fetch;

  await test('URL memakai HTTPS, koordinat UMM, Asia/Jakarta, tanpa API key', () => {
    const url = service.buildWeatherUrl(service.WASHUP_LOCATION);
    assert(url.startsWith('https://api.open-meteo.com/'), 'bukan HTTPS Open-Meteo');
    assert(url.includes('latitude=-7.921') && url.includes('longitude=112.5979'), 'koordinat salah');
    assert(url.includes('timezone=Asia%2FJakarta'), 'timezone salah');
    assert(!/key|token/i.test(url), 'URL mengandung API key');
  });

  await test('resolve: respons valid -> objek WeatherData typed', async () => {
    global.fetch = async () => jsonResponse(200, sampleBody);
    const data = await service.fetchWeather();
    assert(data.temperature === 22.1 && data.description === 'Cerah', 'konversi salah');
    assert(data.iconName === 'sunny-outline' && data.isRaining === false, 'ikon/hujan salah');
    assert(data.locationLabel === 'Universitas Muhammadiyah Malang', 'label lokasi salah');
  });

  await test('.then() chaining pada fetchWithTimeout (resolve)', async () => {
    global.fetch = async () => jsonResponse(200, sampleBody);
    const status = await service.fetchWithTimeout('https://x.test').then((r) => r.status);
    assert(status === 200, 'status bukan 200');
  });

  await test('reject: HTTP error (500)', async () => {
    global.fetch = async () => jsonResponse(500, {});
    await expectReject(service.fetchWeather(), /HTTP 500/);
  });

  await test('reject: kegagalan jaringan', async () => {
    global.fetch = async () => {
      throw new TypeError('Network request failed');
    };
    await expectReject(service.fetchWeather(), /terhubung/);
  });

  await test('reject: timeout', async () => {
    global.fetch = (url, opts) =>
      new Promise((_, rej) => opts.signal.addEventListener('abort', () => rej(new Error('aborted'))));
    await expectReject(service.fetchWithTimeout('https://x.test', 50), /Waktu permintaan habis/);
  });

  await test('reject: respons JSON tidak valid / field hilang', async () => {
    global.fetch = async () => jsonResponse(200, { current: { temperature_2m: 'panas' } });
    await expectReject(service.fetchWeather(), /tidak valid/);
  });

  await test('reject: body bukan JSON', async () => {
    global.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('Unexpected token <');
      },
    });
    await expectReject(service.fetchWeather(), /tidak valid/);
  });

  await test('reject: respons null', async () => {
    global.fetch = async () => jsonResponse(200, null);
    await expectReject(service.fetchWeather(), /tidak valid/);
  });

  await test('deteksi hujan dari kode cuaca/presipitasi', async () => {
    const rainy = { ...sampleBody, current: { ...sampleBody.current, weather_code: 63, precipitation: 1.2 } };
    global.fetch = async () => jsonResponse(200, rainy);
    const data = await service.fetchWeather();
    assert(data.isRaining && data.description === 'Hujan', 'hujan tidak terdeteksi');
  });

  global.fetch = realFetch;

  if (process.argv.includes('--live')) {
    await test('LIVE: panggil API Open-Meteo asli', async () => {
      const data = await service.fetchWeather();
      console.log('      ', JSON.stringify(data));
      assert(typeof data.temperature === 'number', 'suhu bukan number');
    });
  }

  fs.rmSync(outDir, { recursive: true, force: true });
  console.log(`\n${passed} lulus, ${failed} gagal`);
  process.exit(failed ? 1 : 0);
})();
