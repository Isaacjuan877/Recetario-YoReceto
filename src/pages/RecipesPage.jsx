import { useEffect, useState } from 'react'

import { useSearchParams }
from 'react-router-dom'

import RecipeResults
from '../components/RecipeResults'

import {
  getMealsByCategory,
  getRandomMeals
}
from '../api/mealdb'

import { supabase }
from '../assets/services/supabase'

import { translateText }
from '../services/translate'

function RecipesPage() {

  const [recipes, setRecipes] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [translatedTitles,
    setTranslatedTitles] =
      useState({})

  const [searchParams] =
    useSearchParams()

  const category =
    searchParams.get('category')

  const [translatedCategory,
    setTranslatedCategory] =
      useState('')

  useEffect(() => {

    async function fetchRecipes() {

      setLoading(true)

      try {

        /* =========================
           CATEGORÍAS
           SOLO MEALDB
        ========================= */

        if (category) {

          const translatedCategoryName =
            await translateText(
              category,
              'en',
              'es'
            )

          setTranslatedCategory(
            translatedCategoryName
          )

          const meals =
            await getMealsByCategory(
              category
            )

          const translatedMeals =
            await Promise.all(

              (meals || []).map(
                async meal => {

                  try {

                    return {

                      ...meal,

                      source:
                        'mealdb',

                      id:
                        meal.idMeal,

                      strMeal:
                        await translateText(
                          meal.strMeal,
                          'en',
                          'es'
                        ),

                      strCategory:
                        translatedCategoryName,

                      strArea:
                        'Internacional'
                    }

                  } catch {

                    return {

                      ...meal,

                      source:
                        'mealdb',

                      id:
                        meal.idMeal,

                      strCategory:
                        translatedCategoryName,

                      strArea:
                        'Internacional'
                    }
                  }
                })
            )

          setRecipes(
            translatedMeals
          )

          setLoading(false)

          return
        }

        /* =========================
           CATÁLOGO MIXTO
        ========================= */

        const [

          mealdbRecipes,

          {
            data: localRecipes,
            error: localError
          }

        ] = await Promise.all([

          getRandomMeals(25),

          supabase
            .from('recipes')
            .select('*')
            .limit(15)
        ])

        if (localError) {

          console.error(
            localError
          )
        }

        /* =========================
           FORMATEAR MEALDB
        ========================= */

        const formattedMealdb =
          (mealdbRecipes || []).map(
            meal => ({

              ...meal,

              id:
                meal.idMeal,

              title:
                meal.strMeal,

              source:
                'mealdb'
            })
          )

        /* =========================
           FORMATEAR LOCALES
        ========================= */

        const formattedLocal =
          (localRecipes || []).map(
            recipe => ({

              ...recipe,

              id:
                recipe.spoonacular_id,

              source:
                'recetario'
            })
          )

        /* =========================
           UNIR
        ========================= */

        let allRecipes = [

          ...formattedLocal,

          ...formattedMealdb
        ]

        /* =========================
           ELIMINAR DUPLICADOS
        ========================= */

        allRecipes =
          allRecipes.filter(
            (recipe, index, self) =>

              index ===
              self.findIndex(r => {

                const title1 =
                  (
                    r.title ||
                    r.strMeal ||
                    ''
                  )
                    .toLowerCase()

                const title2 =
                  (
                    recipe.title ||
                    recipe.strMeal ||
                    ''
                  )
                    .toLowerCase()

                return (
                  title1 === title2
                )
              })
          )

        /* =========================
           RENDER INMEDIATO
        ========================= */

        setRecipes(
          allRecipes
        )

      } catch (error) {

        console.error(
          'Error:',
          error
        )

      } finally {

        setLoading(false)
      }
    }

    fetchRecipes()

  }, [category])

  /* =========================
     TRADUCCIÓN PROGRESIVA
  ========================= */

  useEffect(() => {

    async function translateVisibleTitles() {

      if (recipes.length === 0)
        return

      for (const recipe of recipes) {

        try {

          const originalTitle =

            recipe.title ||

            recipe.strMeal

          const translated =
            await translateText(
              originalTitle,
              'en',
              'es'
            )

          setTranslatedTitles(
            prev => ({

              ...prev,

              [recipe.id]:
                translated
            })
          )

        } catch {}
      }
    }

    // SOLO PARA CATÁLOGO MIXTO
    if (!category) {

      translateVisibleTitles()
    }

  }, [recipes, category])

  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (

      <div className="min-h-screen flex flex-col items-center justify-center gap-6">

        <div className="w-16 h-16 border-4 border-red-300 border-t-red-500 rounded-full animate-spin" />

        <p className="text-2xl text-gray-500">

          Preparando recetas deliciosas 🍜

        </p>

      </div>
    )
  }

  /* =========================
     RENDER
  ========================= */

  return (

    <RecipeResults

      recipes={recipes}

      translatedTitles={
        translatedTitles
      }

      title={
        category

          ? `Categoría: ${translatedCategory}`

          : 'Todas las recetas'
      }
    />
  )
}

export default RecipesPage