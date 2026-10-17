import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DailyForecast } from '../api/types'

interface ForecastChartProps {
  daily: DailyForecast[]
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  return `${days[date.getDay()]} ${d}.${m}`
}

function ForecastChart({ daily }: ForecastChartProps) {
  const data = daily.map((day) => ({
    ...day,
    label: formatDate(day.date),
    tempMin: Math.round(day.tempMin),
    tempMax: Math.round(day.tempMax),
  }))

  return (
    <section className="card forecast-chart">
      <h2>График температуры</h2>
      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dbe9f6" />
            <XAxis
              dataKey="label"
              tick={{ fill: '#6b8299', fontSize: 13 }}
              axisLine={{ stroke: '#c4d7e8' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6b8299', fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              unit="°"
              width={40}
            />
            <Tooltip
              labelStyle={{ color: '#33475b', fontWeight: 600 }}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #cfe0f0',
                borderRadius: 8,
                color: '#33475b',
              }}
            />
            <Line
              type="monotone"
              dataKey="tempMax"
              name="Макс"
              stroke="#e07b1a"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#e07b1a', strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="tempMin"
              name="Мин"
              stroke="#1a73e8"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#1a73e8', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default ForecastChart