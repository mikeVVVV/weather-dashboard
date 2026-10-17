import { useState } from 'react'

interface SearchBarProps {
  onSearch: (city: string) => void
  loading: boolean
}

function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [value, setValue] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const query = value.trim()
    if (query && !loading) {
      onSearch(query)
    }
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Введите город…"
        aria-label="Название города"
      />
      <button type="submit" disabled={loading || !value.trim()}>
        {loading ? 'Поиск…' : 'Найти'}
      </button>
    </form>
  )
}

export default SearchBar