import type { DailyForecast } from '../api/types'
import { weatherInfo } from '../api/weatherCodes'

interface ForecastTableProps {
  daily: DailyForecast[]
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
  const today = new Date()
  const diff = Math.round((date.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / 86400000)
  const name = diff === 0 ? 'Сегодня' : diff === 1 ? 'Завтра' : days[date.getDay()]
  return `${name}, ${d}.${String(m).padStart(2, '0')}`
}

function ForecastTable({ daily }: ForecastTableProps) {
  return (
    <section className="card">
      <h2>Прогноз на 5 дней</h2>
      <table className="forecast-table">
        <thead>
          <tr>
            <th>День</th>
            <th className="center">Состояние</th>
            <th className="num">Мин</th>
            <th className="num">Макс</th>
          </tr>
        </thead>
        <tbody>
          {daily.map((d) => {
            const info = weatherInfo(d.weatherCode, 1)
            return (
              <tr key={d.date}>
                <td>{formatDate(d.date)}</td>
                <td className="center" title={info.label}>
                  {info.icon} {info.label}
                </td>
                <td className="num">{Math.round(d.tempMin)}°</td>
                <td className="num">{Math.round(d.tempMax)}°</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

export default ForecastTable