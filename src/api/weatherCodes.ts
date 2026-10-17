const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: 'Ясно', icon: '☀️' },
  1: { label: 'Преимущественно ясно', icon: '🌤️' },
  2: { label: 'Переменная облачность', icon: '⛅' },
  3: { label: 'Пасмурно', icon: '☁️' },
  45: { label: 'Туман', icon: '🌫️' },
  48: { label: 'Иней', icon: '🌫️' },
  51: { label: 'Лёгкий дождь', icon: '🌦️' },
  53: { label: 'Умеренный дождь', icon: '🌦️' },
  55: { label: 'Сильный дождь', icon: '🌧️' },
  56: { label: 'Лёгкая ледяная морось', icon: '🌧️' },
  57: { label: 'Ледяная морось', icon: '🌧️' },
  61: { label: 'Небольшой дождь', icon: '🌧️' },
  63: { label: 'Дождь', icon: '🌧️' },
  65: { label: 'Сильный дождь', icon: '🌧️' },
  66: { label: 'Ледяной дождь', icon: '🌨️' },
  67: { label: 'Сильный ледяной дождь', icon: '🌨️' },
  71: { label: 'Небольшой снег', icon: '🌨️' },
  73: { label: 'Снег', icon: '🌨️' },
  75: { label: 'Сильный снег', icon: '❄️' },
  77: { label: 'Снежные зёрна', icon: '❄️' },
  80: { label: 'Кратковременный дождь', icon: '🌦️' },
  81: { label: 'Кратковременный ливень', icon: '🌧️' },
  82: { label: 'Сильный ливень', icon: '⛈️' },
  85: { label: 'Снегопад', icon: '🌨️' },
  86: { label: 'Сильный снегопад', icon: '❄️' },
  95: { label: 'Гроза', icon: '⛈️' },
  96: { label: 'Гроза с градом', icon: '⛈️' },
  99: { label: 'Сильная гроза с градом', icon: '⛈️' },
}

export function weatherInfo(code: number, isDay = 1): { label: string; icon: string } {
  const info = WMO_CODES[code] ?? { label: `Код ${code}`, icon: '🌡️' }
  if (code === 0 && !isDay) return { label: 'Ясно', icon: '🌙' }
  if (code === 1 && !isDay) return { label: 'Ясно', icon: '🌙' }
  return info
}