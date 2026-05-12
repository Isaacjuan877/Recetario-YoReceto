import {
  useSearchParams
} from 'react-router-dom'

import { useEffect, useState } from 'react'

import RecipeResults from '../components/RecipeResults'

import {
  searchMeals
} from '../api/mealdb'

import {
  getRecipes
} from '../api/spoonacular'

function SearchPage() {

  const [params] =
    useSearchParams()

  const query =
    params.get('q')

  const [recipes, setRecipes] =
    useState([])

  useEffect(() => {

    async function fetchRecipes() {

      const mealdb =
        await searchMeals(query)

      const spoonacular =
        await getRecipes(query)

      const allRecipes = [

        ...mealdb.map(meal => ({
          ...meal,
          source: 'mealdb'
        })),

        ...spoonacular.map(recipe => ({
          ...recipe,
          source: 'spoonacular'
        }))
      ]

      setRecipes(allRecipes)
    }

    fetchRecipes()

  }, [query])

  return (

    <div className="pt-32">

      <RecipeResults
        recipes={recipes}
        title={`Resultados para "${query}"`}
      />

    </div>
  )
}

export default SearchPage