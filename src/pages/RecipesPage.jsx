import { useEffect, useState } from 'react'

import { getRandomMeals } from '../api/mealdb'

import RecipeResults from '../components/RecipeResults'

import { translateMeal } from '../services/translateMeal'

function RecipesPage() {

  const [recipes, setRecipes] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    async function fetchRecipes() {

      setLoading(true)

      const data =
        await getRandomMeals(12)

      const translatedMeals =
        await Promise.all(

          data.map(meal =>
            translateMeal(meal)
          )

        )

      setRecipes(translatedMeals)

      setLoading(false)
    }

    fetchRecipes()

  }, [])

  if (loading) {

    return (

      <div className="min-h-screen flex flex-col items-center justify-center gap-6">

        <div className="w-16 h-16 border-4 border-red-300 border-t-red-500 rounded-full animate-spin"></div>

        <p className="text-2xl text-gray-500">
          Preparando recetas deliciosas 🍜
        </p>

      </div>
    )
  }

  return (

    <RecipeResults
      recipes={recipes}
      title="Todas las recetas"
    />

  )
}

export default RecipesPage