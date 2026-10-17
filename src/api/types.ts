export interface City {
  name: string
  latitude: number
  longitude: number
  country: string
}

export interface CurrentWeather {
  time: string
  temperature: number
  apparentTemperature: number
  humidity: number
  windSpeed: number
  weatherCode: number
  isDay: number
}

export interface HourlyForecast {
  time: string
  hour: number
  temperature: number
  humidity: number
  windSpeed: number
  weatherCode: number
  isDay: number
  precipitationMm: number
}

export interface DailyForecast {
  date: string
  tempMin: number
  tempMax: number
  weatherCode: number
  precipitationProbability: number
}

export interface WeatherData {
  city: City
  timezone: string
  current: CurrentWeather
  hourly: HourlyForecast[]
  daily: DailyForecast[]
}