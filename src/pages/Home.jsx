import { useState } from 'react'

import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Categories from '../components/Categories'

import SearchBar from '../components/SearchBar'
import RecipeResults from '../components/RecipeResults'
import DailySuggestions from '../components/DailySuggestions'
import Contact from '../components/Contact'

import {
  searchMeals,
  smartIngredientSearch
} from '../api/mealdb'
import RecipesPage from './RecipesPage'
import { translateText } from '../services/translate'
import {
  getRecipes
}from '../api/spoonacular'
function Home() {

  const [recipes, setRecipes] = useState([])
  const [otherOptions, setOtherOptions] = useState([])
  const handleSearch = async (
    query,
    country
  ) => {

    // MEALDB
    const meals =
      await searchMeals(query)

    // SPOONACULAR
    const spoonacularRecipes =
      await getRecipes(query)

    // FORMATEAR
    const formattedMeals =
      meals.map(meal => ({
        ...meal,
        source: 'mealdb'
      }))

    const formattedSpoonacular =
      spoonacularRecipes.map(recipe => ({
        ...recipe,
        source: 'spoonacular'
      }))

    // UNIR
    let allRecipes = [

      ...formattedMeals,

      ...formattedSpoonacular
    ]

    // FILTRAR POR PAÍS
    if (country !== 'all') {

      allRecipes =
        allRecipes.filter(recipe => {

          // MEALDB
          if (recipe.strArea) {

            return (
              recipe.strArea
                .toLowerCase()
                .includes(
                  country.toLowerCase()
                )
            )
          }

          // SPOONACULAR
          if (recipe.cuisines) {

            return recipe.cuisines.some(
              cuisine =>
                cuisine
                  .toLowerCase()
                  .includes(
                    country.toLowerCase()
                  )
            )
          }

          return false
        })
    }

    setRecipes(allRecipes)
  }

  return (
    <div className="overflow-x-hidden">

      <Navbar />

      <Hero />

      <Categories />

      

      <SearchBar onSearch={handleSearch} />
      

      <RecipeResults recipes={recipes} />
      {otherOptions.length > 0 && (

        <RecipeResults
          title="Otras opciones"
          recipes={otherOptions}
        />

      )}

      <DailySuggestions />

      <Contact />

    </div>
  )
}

export default Home