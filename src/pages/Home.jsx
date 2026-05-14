import { useState }
from 'react'

import Navbar
from '../components/Navbar'

import Hero
from '../components/Hero'

import Categories
from '../components/Categories'

import SearchBar
from '../components/SearchBar'

import RecipeResults
from '../components/RecipeResults'

import DailySuggestions
from '../components/DailySuggestions'

import Contact
from '../components/Contact'

import { translateText }
from '../services/translate'

import {

  searchRecipes,

  searchRecipesByIngredients

} from '../api/recipes'
import {searchByIngredients, searchMeals } from '../api/mealdb'


function Home() {

  const [recipes, setRecipes] =
    useState([])

  const [otherOptions, setOtherOptions] =
    useState([])

  const [loading, setLoading] =
    useState(false)

 const handleSearch = async (query, searchType) => {
  try {
    setLoading(true);
    
    // 1. DECLARACIÓN CRUCIAL: Declaramos allRecipes aquí arriba
    let allRecipes = []; 

    // 2. Traducción inicial del término de búsqueda
    const translatedQuery = await translateText(query, 'es', 'en');

    if (searchType === 'recipe') {
      const [dbRecipes, apiMeals] = await Promise.all([
        searchRecipes(translatedQuery),
        searchMeals(translatedQuery)
      ]);

      const formattedDb = dbRecipes.map(r => ({ ...r, source: 'recetario' }));
      const formattedApi = apiMeals.map(m => ({
        id: m.idMeal,
        title: m.strMeal,
        image: m.strMealThumb,
        category: m.strCategory,
        area: m.strArea,
        source: 'mealdb'
      }));

      allRecipes = [...formattedDb, ...formattedApi];

    } else if (searchType === 'ingredients') {
      const userIngredients = translatedQuery.split(',').map(i => i.trim().toLowerCase());
      const basicPantry = ['water', 'salt', 'oil'];
      const totalIngredients = [...new Set([...userIngredients, ...basicPantry])];

      const [localResults, apiResults] = await Promise.all([
        searchRecipesByIngredients(totalIngredients),
        searchByIngredients(query)
      ]);

      const formattedLocal = localResults.map(r => ({
        ...r,
        // IMPORTANTE: Sobrescribimos el id interno (305) con el de la receta (642135)
        id: r.spoonacular_id, 
        source: 'recetario',
        title: r.title,
        image: r.image
      }));

      const formattedApi = apiResults.map(m => ({
        id: m.idMeal,
        title: m.strMeal,
        image: m.strMealThumb,
        source: 'mealdb'
      }));

      allRecipes = [...formattedLocal, ...formattedApi];
    }

    // 3. Procesamiento final (esto fallaba porque allRecipes no "existía" aquí fuera)
    const uniqueResults = allRecipes.filter(
      (recipe, index, self) =>
        index === self.findIndex((r) => r.title === recipe.title)
    );

    const limitedResults = uniqueResults.slice(0, 15);

    const translatedResults = await Promise.all(
      limitedResults.map(async (recipe) => {
        try {
          const tTitle = await translateText(recipe.title, 'en', 'es');
          return { ...recipe, translatedTitle: tTitle };
        } catch {
          return { ...recipe, translatedTitle: recipe.title };
        }
      })
    );

    setRecipes(translatedResults);

  } catch (error) {
    console.error("Error en búsqueda:", error);
  } finally {
    setLoading(false);
  }
};
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

            <div
              className="
                w-14 h-14
                border-4
                border-red-300
                border-t-transparent
                rounded-full
                animate-spin
              "
            />

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