import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import RecipeResults from '../components/RecipeResults'

import {
  getMealsByCategory,
  getRandomMeals
} from '../api/mealdb'

import { getRecipes } from '../api/spoonacular'

import { translateText } from '../services/translate'

function RecipesPage() {

  const [recipes, setRecipes] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [searchParams] =
    useSearchParams()

  const category =
    searchParams.get('category')
const [translatedCategory, setTranslatedCategory] = useState('')
  useEffect(() => {

    async function fetchRecipes() {

      setLoading(true)

      // =========================
      // RECETAS POR CATEGORÍA
      // =========================
      if (category) {

        const translatedCategoryName =
          await translateText(category)

        setTranslatedCategory(
          translatedCategoryName
        )

        const meals =
          await getMealsByCategory(category)

        const translatedMeals =
          await Promise.all(

            meals.map(async meal => ({

              ...meal,

              source: 'mealdb',

              strMeal:
                await translateText(
                  meal.strMeal
                ),

              strCategory:
                translatedCategoryName,

              strArea:
                'Internacional'
            }))
          )

        setRecipes(translatedMeals)

        setLoading(false)

        return
      }

      // =========================
      // FLUJO NORMAL
      // =========================

      const mealdbRecipes =
        await getRandomMeals(25)

      const spoonacularRecipes =
        await getRecipes('', 15)

      const formattedMealdb =
        mealdbRecipes.map(meal => ({
          ...meal,
          source: 'mealdb'
        }))

      const formattedSpoonacular =
        spoonacularRecipes.map(recipe => ({
          ...recipe,
          source: 'spoonacular'
        }))

      const allRecipes = [
        ...formattedSpoonacular,
        ...formattedMealdb
        
      ]

      const translatedRecipes =
        await Promise.all(

          allRecipes.map(async recipe => {

            try {

              return {

                ...recipe,

                strMeal:
                  recipe.strMeal
                    ? await translateText(
                        recipe.strMeal
                      )
                    : recipe.strMeal,

                title:
                  recipe.title
                    ? await translateText(
                        recipe.title
                      )
                    : recipe.title,

                strCategory:
                  recipe.strCategory
                    ? await translateText(
                        recipe.strCategory
                      )
                    : recipe.strCategory,

                category:
                  recipe.category
                    ? await translateText(
                        recipe.category
                      )
                    : recipe.category,

                strArea:
                  recipe.strArea
                    ? await translateText(
                        recipe.strArea
                      )
                    : recipe.strArea,

                area:
                  recipe.area
                    ? await translateText(
                        recipe.area
                      )
                    : recipe.area
              }

            } catch (error) {

              console.error(error)

              return recipe
            }
          })
        )

      setRecipes(translatedRecipes)

      setLoading(false)
    }

    fetchRecipes()

  }, [category])

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
      title={
        category
          ? `Categoría: ${translatedCategory}`
          : 'Todas las recetas'
      }
    />

  )
}

export default RecipesPage