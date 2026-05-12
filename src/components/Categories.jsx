import { useEffect, useState } from 'react'
import { getCategories } from '../api/mealdb'
import { useNavigate } from 'react-router-dom'

import { translateText } from '../services/translate'

function Categories() {

  const [categories, setCategories] = useState([])

  const navigate = useNavigate()

  useEffect(() => {

    async function fetchCategories() {

      const data =
        await getCategories()

      const translatedCategories =
        await Promise.all(

          data.map(async category => ({

            ...category,

            translatedName:
              await translateText(
                category.strCategory
              )
          }))
        )

      setCategories(
        translatedCategories
      )
    }

    fetchCategories()

  }, [])

  return (

    <section className="bg-white py-16">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-light text-center mb-14">
          Categorías
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">

          {
            categories
              .slice(0, 6)
              .map((category) => (

                <div
                  key={category.idCategory}
                  onClick={() =>
                    navigate(
                      `/recipes?category=${category.strCategory}`
                    )
                  }
                  className="
                    flex flex-col items-center
                    text-center group cursor-pointer
                  "
                >

                  <img
                    src={
                      category.strCategoryThumb
                    }
                    alt={
                      category.translatedName
                    }
                    className="
                      w-28 h-28 rounded-full
                      object-cover shadow-lg
                      group-hover:scale-110
                      transition-all duration-300
                    "
                  />

                  <p className="mt-4 text-gray-700">

                    {
                      category.translatedName
                    }

                  </p>

                </div>

              ))
          }

        </div>

      </div>

    </section>
  )
}

export default Categories