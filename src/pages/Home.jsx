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

function Home() {

  const [recipes, setRecipes] = useState([])
const [otherOptions, setOtherOptions] = useState([])

  const handleSearch = async (query) => {

  const isIngredientSearch =
  query.includes(',')

  if (isIngredientSearch) {

    const data = await smartIngredientSearch(query)

    setRecipes(data.exactMatches)

    setOtherOptions(data.partialMatches)

  } else {

    const meals = await searchMeals(query)

    setRecipes(meals)

    setOtherOptions([])
  }
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