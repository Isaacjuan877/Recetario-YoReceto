import { useEffect, useState } from 'react'
import { getRandomMeals } from '../api/mealdb'
import { Link } from 'react-router-dom'
function DailySuggestions() {

  const [recipes, setRecipes] = useState([])
  
  useEffect(() => {

    async function fetchMeals() {

      const meals = await getRandomMeals(3)

      const formattedMeals =
        meals.map(meal => ({
          ...meal,
          source: 'mealdb'
        }))

      setRecipes(formattedMeals)

      
    }

    fetchMeals()

  }, [])

  return (
    <section className="bg-[#95c36d] py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-16">

          <p className="uppercase tracking-[4px] text-white mb-4">
            Recomendaciones
          </p>

          <h2 className="text-white text-5xl md:text-6xl font-light">
            Sugerencias del día
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {recipes.map((meal, index) => (

            <div
              key={meal.idMeal}
              className="bg-white rounded-[30px] overflow-hidden shadow-xl"
            >

              <img
                src={meal.strMealThumb || meal.image}
                alt={meal.strMeal || meal.title}
                className="w-full h-72 object-cover"
              />

              <div className="p-6">

                <h3 className="text-2xl mb-6">
                  {meal.strMeal || meal.title}
                </h3>

                <Link
                  to={`/recipe/${meal.source}/${meal.idMeal || meal.id}`}
                  className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full inline-block"
                >
                  Ver receta
                </Link>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  )
}

export default DailySuggestions