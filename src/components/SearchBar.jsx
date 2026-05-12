import { useState } from 'react'

function SearchBar({ onSearch }) {

  const [query, setQuery] = useState('')
  const [country, setCountry] =
  useState('all')
  const handleSubmit = (e) => {

    e.preventDefault()

    onSearch(query, country)
  }

  return (
    
    <section id="search-section" className="bg-white py-14 scroll-mt-32">

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto px-6"
      >

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Busca recetas o ingredientes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-6 py-5 rounded-full border border-gray-200 outline-none text-lg shadow-sm"
          />
          <select
            value={country}
            onChange={(e) =>
              setCountry(e.target.value)
            }
            className="px-6 py-5 rounded-full border"
          >

            <option value="all">
              Todos
            </option>

            <option value="Colombian">
              Colombianas
            </option>

            <option value="Italian">
              Italianas
            </option>

            <option value="Mexican">
              Mexicanas
            </option>

          </select>

          <button
            type="submit"
            className="bg-red-400 hover:bg-red-500 text-white px-10 py-5 rounded-full transition-all"
          >
            Buscar
          </button>

        </div>

        <p className="text-center text-gray-400 mt-4 text-sm">
          Usa comas para buscar por ingredientes:
          pollo, arroz, tomate
        </p>

      </form>

    </section>
  )
}

export default SearchBar