import { useEffect, useState } from 'react'

import { getRandomMeals } from '../api/mealdb'

import RecipeResults from '../components/RecipeResults'

import { getRecipes } from '../api/spoonacular'

function RecipesPage() {

  const [recipes, setRecipes] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    async function fetchRecipes() {

      setLoading(true)

      // 15 THEMEALDB
      const mealdbRecipes =
        await getRandomMeals(15)

      // 15 SPOONACULAR
      const spoonacularRecipes =
        await getRecipes('', 15)

      // FORMATEAR MEALDB
      const formattedMealdb =
        mealdbRecipes.map(meal => ({
          ...meal,
          source: 'mealdb'
        }))

      // FORMATEAR SPOONACULAR
      const formattedSpoonacular =
        spoonacularRecipes.map(recipe => ({
          ...recipe,
          source: 'spoonacular'
        }))

      // COMBINAR
      const allRecipes = [
        ...formattedMealdb,
        ...formattedSpoonacular
      ]

      setRecipes(allRecipes)

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