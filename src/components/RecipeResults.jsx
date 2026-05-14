import { Link } from 'react-router-dom'

function RecipeResults({
  recipes,
  translatedTitles = {},
  title = 'Resultados',
  isFavoritesPage = false,
  onRemove
}) {

  return (

    <section className="py-20 bg-[#f7f3ed]">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between mb-12">

          <h2 className="text-5xl font-light">
            {title}
          </h2>

          <p className="text-gray-500">
            {recipes.length} recetas encontradas
          </p>

        </div>

        {
          recipes.length === 0 ? (

            <div className="text-center py-20 text-gray-500">

              <p className="text-2xl">
                Busca una receta deliciosa 🍜
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

              {
                recipes.map((meal, index) => (

                  <div
                    key={`${meal.idMeal || meal.id || meal.recipe_id}-${index}`}
                    className="bg-white rounded-[30px] overflow-hidden shadow-lg hover:-translate-y-2 transition-all duration-300"
                  >

                    <div className="relative">

                      {
                        isFavoritesPage && (

                          <button
                            onClick={() => onRemove(meal)}
                            className="
                              absolute top-4 right-4
                              w-11 h-11 rounded-full
                              bg-white shadow-lg
                              flex items-center justify-center
                              hover:scale-110 transition-all
                              z-10 text-xl
                            "
                          >
                            🗑️
                          </button>

                        )
                      }

                      <img
                        src={
                          meal.strMealThumb ||
                          meal.image
                        }
                        alt={
                          translatedTitles[
                            meal.id ||
                            meal.idMeal ||
                            meal.spoonacular_id
                          ] ||

                          meal.translatedTitle ||

                          meal.strMeal ||

                          meal.title
                        }
                        className="w-full h-72 object-cover"
                      />

                    </div>

                    <div className="p-6">

                      <div className="flex justify-between items-center mb-4">

                        <span className="text-sm text-red-400 uppercase tracking-[2px]">

                          {
                            meal.strCategory ||
                            meal.category ||
                            'Receta'
                          }

                        </span>

                        <div className="flex flex-col items-end">

                          <span className="text-sm text-gray-400">

                            {
                              meal.strArea ||
                              meal.area ||
                              'Internacional'
                            }

                          </span>

                          {
                            meal.score && meal.score > 0 && (

                              <span className="text-sm text-green-500">

                                {meal.score} ingredientes coinciden

                              </span>
                            )
                          }

                        </div>

                      </div>
                      <h3 className="text-2xl mb-6 leading-snug">

                        {
                          translatedTitles[
                            meal.id ||
                            meal.idMeal ||
                            meal.spoonacular_id
                          ] ||

                          meal.translatedTitle ||

                          meal.strMeal ||

                          meal.title
                        }

                      </h3>

                     <Link
                        to={`/recipe/${meal.source}/${meal.spoonacular_id || meal.idMeal || meal.id || meal.recipe_id}`}
                        className="bg-red-400 hover:bg-red-500 text-white px-6 py-3 rounded-full inline-block transition-all"
                      >
                        Ver receta
                      </Link>

                    </div>

                  </div>

                ))
              }

            </div>

          )
        }

      </div>

    </section>

  )
}

export default RecipeResults