import { useState } from 'react'

import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import SearchBar from '../components/SearchBar'
import RecipeResults from '../components/RecipeResults'
import DailySuggestions from '../components/DailySuggestions'
import Contact from '../components/Contact'
import { translateText } from '../services/translate'
import { translateMeal } from '../services/translateMeal'
import {
  searchMeals,
  searchByIngredients
} from '../api/mealdb'

import {
  getRecipes
} from '../api/spoonacular'

function Home() {

  const [recipes, setRecipes] =
    useState([])

  const [otherOptions, setOtherOptions] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const handleSearch = async (
    query,
    searchType
  ) => {

    try {

      setLoading(true)

      let allRecipes = []

      /* =========================
         BUSCAR POR RECETA
      ========================= */

      if (searchType === 'recipe') {

        // traducir búsqueda a inglés
        const translatedQuery =
          await translateText(
            query,
            'es',
            'en'
          )

        const [
          meals,
          spoonacularRecipes
        ] = await Promise.all([

          searchMeals(translatedQuery),

          getRecipes(translatedQuery)
        ])

        const formattedMeals =
          meals.map(meal => ({

            ...meal,

            source: 'themealdb'
          }))

        const formattedSpoonacular =
          spoonacularRecipes.map(recipe => ({

            ...recipe,

            source: 'spoonacular'
          }))

        allRecipes = [

          ...formattedSpoonacular,

          ...formattedMeals
        ]
        const translatedRecipes =
          await Promise.all(

            allRecipes.map(async recipe => {

              try {

                const originalTitle =
                  recipe.strMeal ||
                  recipe.title

                const translatedTitle =
                  await translateText(
                    originalTitle,
                    'en',
                    'es'
                  )

                const originalCategory =
                  recipe.strCategory ||
                  recipe.category ||
                  'Receta'

                const translatedCategory =
                  await translateText(
                    originalCategory,
                    'en',
                    'es'
                  )

                const originalArea =
                  recipe.strArea ||
                  recipe.area ||
                  'Internacional'

                const translatedArea =
                  await translateText(
                    originalArea,
                    'en',
                    'es'
                  )

                return {

                  ...recipe,

                  translatedTitle,

                  translatedCategory,

                  translatedArea
                }

              } catch (error) {

                return recipe
              }
            })
          )

        allRecipes = translatedRecipes
        setRecipes(allRecipes)
      }
      /* =========================
         BUSCAR POR INGREDIENTES
      ========================= */

      if (searchType === 'ingredients') {

        const meals =
          await searchByIngredients(query)

        const translatedMeals =
          await Promise.all(

            meals.map(async meal => {

              try {

                return {

                  ...(await translateMeal(meal)),

                  source: 'mealdb'
                }

              } catch {

                return {

                  ...meal,

                  source: 'mealdb'
                }
              }
            })
          )

        allRecipes = translatedMeals
      }

      /* =========================
         ELIMINAR DUPLICADOS
      ========================= */

      allRecipes =
        allRecipes.filter(
          (recipe, index, self) =>

            index ===
            self.findIndex(r => {

              const name1 =
                r.strMeal ||
                r.title

              const name2 =
                recipe.strMeal ||
                recipe.title

              return name1 === name2
            })
        )

      setRecipes(allRecipes)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)
    }
  }

  return (

    <div className="overflow-x-hidden">

      <Navbar />

      <Hero />

      <Categories />

      <SearchBar
        onSearch={handleSearch}
      />

      {
        loading ? (

          <div className="py-20 flex justify-center">

            <div className=" w-14 h-14 border-4 border-red-300 border-t-transparent rounded-full animate-spin" />

          </div>

        ) : (

          <RecipeResults
            recipes={recipes}
          />
        )
      }

      {
        otherOptions.length > 0 && (

          <RecipeResults
            title="Otras opciones"
            recipes={otherOptions}
          />
        )
      }
     

      <DailySuggestions />

      <Contact />

    </div>
  )
}

export default Home