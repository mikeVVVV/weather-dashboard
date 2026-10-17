import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchWeather } from './api/weather'
import SearchBar from './components/SearchBar'
import CurrentWeather from './components/CurrentWeather'
import HourlyTable from './components/HourlyTable'
import ForecastTable from './components/ForecastTable'
import ForecastChart from './components/ForecastChart'
import './App.css'

const DEFAULT_CITY = 'Москва'

function App() {
  const [city, setCity] = useState(DEFAULT_CITY)

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['weather', city],
    queryFn: () => searchWeather(city),
    staleTime: 10 * 60 * 1000,
  })

  function handleSearch(query: string) {
    setCity(query)
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Прогноз погоды</h1>
        <SearchBar onSearch={handleSearch} loading={isFetching} />
      </header>

      {isLoading && <div className="status">Загружаем погоду…</div>}

      {isError && (
        <div className="status status-error">
          <p>{error instanceof Error ? error.message : 'Не удалось получить данные'}</p>
          <button type="button" onClick={() => refetch()}>
            Повторить
          </button>
        </div>
      )}

      {data && (
        <main className="dashboard">
          <CurrentWeather data={data} />
          <HourlyTable hourly={data.hourly} />
          <ForecastTable daily={data.daily} />
          <ForecastChart daily={data.daily} />
        </main>
      )}
    </div>
  )
}

export default App