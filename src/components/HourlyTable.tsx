import type { HourlyForecast } from '../api/types'
import { weatherInfo } from '../api/weatherCodes'

interface HourlyTableProps {
  hourly: HourlyForecast[]
}

function formatHour(time: string, hour: number): string {
  const date = new Date(time)
  const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
  const d = days[date.getDay()]
  const h = String(hour).padStart(2, '0')
  return `${d} ${h}:00`
}

function HourlyTable({ hourly }: HourlyTableProps) {
  return (
    <section className="card">
      <h2>Прогноз по часам</h2>
      <div className="hourly-table-wrap">
        <table className="hourly-table">
          <thead>
            <tr>
              <th>Время</th>
              <th className="center">Состояние</th>
              <th className="num">T°</th>
              <th className="num">Влажность</th>
              <th className="num">Ветер</th>
              <th className="num">Осадки, мм</th>
            </tr>
          </thead>
          <tbody>
            {hourly.map((h) => {
              const info = weatherInfo(h.weatherCode, h.isDay)
              return (
                <tr key={h.time}>
                  <td>{formatHour(h.time, h.hour)}</td>
                  <td className="center" title={info.label}>
                    {info.icon} {info.label}
                  </td>
                  <td className="num">{Math.round(h.temperature)}°</td>
                  <td className="num">{Math.round(h.humidity)}%</td>
                  <td className="num">{h.windSpeed.toFixed(1)}</td>
                  <td className="num">{h.precipitationMm > 0 ? h.precipitationMm.toFixed(1) : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default HourlyTable