import type { City, WeatherData } from './types'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const METNO_URL = 'https://api.met.no/weatherapi/locationforecast/2.0/compact'

interface GeocodingResponse {
  results?: {
    name: string
    latitude: number
    longitude: number
    country: string
  }[]
}

interface MetNoPoint {
  time: string
  data: {
    instant: {
      details: {
        air_temperature: number
        relative_humidity: number
        wind_speed: number
      }
    }
    next_1_hours?: {
      summary: { symbol_code: string }
      details: { precipitation_amount: number }
    }
  }
}

interface MetNoResponse {
  geometry: { coordinates: number[] }
  properties: { timeseries: MetNoPoint[] }
}

const SYMBOL_TO_WMO: Record<string, number> = {
  clearsky_day: 0,
  clearsky_night: 0,
  fair_day: 1,
  fair_night: 1,
  partlycloudy_day: 2,
  partlycloudy_night: 2,
  cloudy: 3,
  fog: 45,
  lightrainshowers_day: 61,
  lightrainshowers_night: 61,
  lightrainshowersandthunder_day: 95,
  lightrainshowersandthunder_night: 95,
  rainshowers_day: 63,
  rainshowers_night: 63,
  rainshowersandthunder_day: 95,
  rainshowersandthunder_night: 95,
  heavyshowers_day: 65,
  heavyshowers_night: 65,
  heavyshowersandthunder_day: 95,
  heavyshowersandthunder_night: 95,
  lightrain: 61,
  rain: 63,
  heavyrain: 65,
  lightrainandthunder: 95,
  rainandthunder: 95,
  heavyrainandthunder: 95,
  lightsleet: 71,
  sleet: 73,
  heavysleet: 75,
  lightsleetshowers_day: 71,
  lightsleetshowers_night: 71,
  sleetshowers_day: 73,
  sleetshowers_night: 73,
  heavysleetshowers_day: 75,
  heavysleetshowers_night: 75,
  lightsnow: 71,
  snow: 73,
  heavysnow: 75,
  lightssnowshowers_day: 71,
  lightssnowshowers_night: 71,
  snowshowers_day: 73,
  snowshowers_night: 73,
  heavysnowshowers_day: 75,
  heavysnowshowers_night: 75,
  fairandthunder_day: 95,
  fairandthunder_night: 95,
}

function wmoCode(symbol: string): number {
  const base = symbol.replace(/_poly\d+/i, '')
  return SYMBOL_TO_WMO[base] ?? 3
}

function isDay(symbol: string): number {
  return symbol.endsWith('_night') ? 0 : 1
}

function dayKey(date: string): string {
  return date.slice(0, 10)
}

interface DailyAgg {
  min: number
  max: number
  codes: Set<number>
  dayCodes: Set<number>
  precipitation: number
}

export async function geocodeCity(query: string): Promise<City> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=1&language=ru&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Геокодинг не удался (${res.status})`)

  const data = (await res.json()) as GeocodingResponse
  const result = data.results?.[0]
  if (!result) throw new Error(`Город «${query}» не найден`)

  return {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
  }
}

export async function getWeather(city: City): Promise<WeatherData> {
  const url = `${METNO_URL}?lat=${city.latitude.toFixed(3)}&lon=${city.longitude.toFixed(3)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Прогноз недоступен (${res.status})`)

  const data = (await res.json()) as MetNoResponse
  const points = data.properties.timeseries

  const first = points[0]
  const details = first.data.instant.details
  const symbol = first.data.next_1_hours?.summary.symbol_code ?? 'fair_day'

  const current: WeatherData['current'] = {
    time: first.time,
    temperature: details.air_temperature,
    apparentTemperature: details.air_temperature,
    humidity: details.relative_humidity,
    windSpeed: details.wind_speed,
    weatherCode: wmoCode(symbol),
    isDay: isDay(symbol),
  }

  const dailyMap = new Map<string, DailyAgg>()
  for (const p of points) {
    const key = dayKey(p.time)
    const t = p.data.instant.details.air_temperature
    const agg = dailyMap.get(key)
    if (!agg) {
      const sym = p.data.next_1_hours?.summary.symbol_code ?? 'fair_day'
      dailyMap.set(key, {
        min: t,
        max: t,
        codes: new Set([wmoCode(sym)]),
        dayCodes: isDay(sym) ? new Set([wmoCode(sym)]) : new Set(),
        precipitation: p.data.next_1_hours?.details.precipitation_amount ?? 0,
      })
      continue
    }
    agg.min = Math.min(agg.min, t)
    agg.max = Math.max(agg.max, t)
    const sym = p.data.next_1_hours?.summary.symbol_code ?? 'fair_day'
    agg.codes.add(wmoCode(sym))
    if (isDay(sym)) agg.dayCodes.add(wmoCode(sym))
    agg.precipitation += p.data.next_1_hours?.details.precipitation_amount ?? 0
  }

  const daily: WeatherData['daily'] = [...dailyMap.entries()]
    .slice(0, 5)
    .map(([key, agg]) => {
      const dayCode = agg.dayCodes.size > 0 ? [...agg.dayCodes][0] : [...agg.codes][0]
      return {
        date: key,
        tempMin: agg.min,
        tempMax: agg.max,
        weatherCode: dayCode,
        precipitationProbability: agg.precipitation > 0 ? 100 : 0,
      }
    })

  const hourly: WeatherData['hourly'] = points
    .slice(0, 24)
    .map((p) => {
      const d = p.data.instant.details
      const sym = p.data.next_1_hours?.summary.symbol_code ?? 'fair_day'
      return {
        time: p.time,
        hour: new Date(p.time).getUTCHours(),
        temperature: d.air_temperature,
        humidity: d.relative_humidity,
        windSpeed: d.wind_speed,
        weatherCode: wmoCode(sym),
        isDay: isDay(sym),
        precipitationMm: p.data.next_1_hours?.details.precipitation_amount ?? 0,
      }
    })

  return {
    city,
    timezone: 'UTC',
    current,
    hourly,
    daily,
  }
}

export async function searchWeather(query: string): Promise<WeatherData> {
  const city = await geocodeCity(query)
  return getWeather(city)
}