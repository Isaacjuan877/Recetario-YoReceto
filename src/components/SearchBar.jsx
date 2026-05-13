import { useState } from 'react'

function SearchBar({ onSearch }) {

  const [query, setQuery] =
    useState('')

  const [searchType, setSearchType] =
    useState('recipe')

  function handleSubmit(e) {

    e.preventDefault()

    if (!query.trim()) return

    onSearch(
      query,
      searchType
    )
  }

  return (

    <section
      id="search-section"
      className="
        bg-white py-14
        scroll-mt-32
      "
    >

      <form
        onSubmit={handleSubmit}
        className="
          max-w-3xl mx-auto px-6
        "
      >

        <div
          className="
            flex flex-col md:flex-row
            gap-4
          "
        >

          {/* INPUT */}
          <input
            type="text"
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }

            placeholder={
              searchType === 'ingredients'
                ? 'Ej: pollo, arroz, tomate'
                : 'Buscar recetas...'
            }

            className="
              flex-1
              px-6 py-5
              rounded-full
              border border-gray-200
              outline-none
              text-lg
              shadow-sm
            "
          />

          {/* SELECT */}
          <select
            value={searchType}
            onChange={(e) =>
              setSearchType(
                e.target.value
              )
            }

            className="
              px-6 py-5
              rounded-full
              border border-gray-200
            "
          >

            <option value="recipe">
              Receta
            </option>

            <option value="ingredients">
              Ingredientes
            </option>

          </select>

          {/* BUTTON */}
          <button
            type="submit"
            className="
              bg-red-400
              hover:bg-red-500
              text-white
              px-10 py-5
              rounded-full
              transition-all
            "
          >
            Buscar
          </button>

        </div>

        {
          searchType ===
          'ingredients' && (

            <p
              className="
                text-center
                text-red-400
                mt-4 text-sm
              "
            >
              Usa comas para separar ingredientes:
              pollo, arroz, tomate
            </p>
          )
        }

      </form>

    </section>
  )
}

export default SearchBar