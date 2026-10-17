import type { WeatherData } from '../api/types'
import { weatherInfo } from '../api/weatherCodes'

interface CurrentWeatherProps {
  data: WeatherData
}

function CurrentWeather({ data }: CurrentWeatherProps) {
  const { city, current } = data
  const { label, icon } = weatherInfo(current.weatherCode, current.isDay)
  const updated = new Date(current.time)
  const updatedText = updated.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <section className="card current-weather">
      <div className="current-location">
        <h2>{city.name}</h2>
        <span className="country">{city.country}</span>
      </div>

      <div className="current-main">
        <div className="current-icon" aria-hidden="true">
          {icon}
        </div>
        <div className="current-temp">{Math.round(current.temperature)}°C</div>
      </div>

      <div className="current-label">{label}</div>

      <dl className="current-details">
        <div>
          <dt>Ощущается как</dt>
          <dd>{Math.round(current.apparentTemperature)}°C</dd>
        </div>
        <div>
          <dt>Влажность</dt>
          <dd>{current.humidity}%</dd>
        </div>
        <div>
          <dt>Ветер</dt>
          <dd>{current.windSpeed} м/с</dd>
        </div>
      </dl>

      <div className="current-updated">Обновлено: {updatedText}</div>
    </section>
  )
}

export default CurrentWeather