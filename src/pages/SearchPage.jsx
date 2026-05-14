import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import RecipeResults from '../components/RecipeResults'
import { searchMeals } from '../api/mealdb'
import { translateText } from '../services/translate'
// IMPORTANTE: Importa la misma función que usas en el Home
import {  searchRecipes} from '../api/recipes'

function SearchPage() {
  const [params] = useSearchParams()
  const query = params.get('q')

  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCombinedResults() {
      if (!query) return;
      setLoading(true)

      try {
        // 1. TRADUCCIÓN (Igual que handleSearch)
        const translatedQuery = await translateText(query, 'es', 'en');

        // 2. BÚSQUEDA DUAL (Usando searchRecipes para mantener la misma lógica)
        const [dbRecipes, apiMeals] = await Promise.all([
          searchRecipes(translatedQuery), // <-- Aquí está la clave del éxito
          searchMeals(translatedQuery)
        ]);

        // 3. FORMATEO (Idéntico a handleSearch bloque 'recipe')
        const formattedDb = (dbRecipes || []).map(r => ({ 
          ...r, 
          id: r.spoonacular_id, // Aseguramos el ID para la navegación
          source: 'recetario' 
        }));

        const formattedApi = (apiMeals || []).map(m => ({
          id: m.idMeal,
          title: m.strMeal,
          image: m.strMealThumb,
          category: m.strCategory,
          area: m.strArea,
          source: 'mealdb'
        }));

        const allRecipes = [...formattedDb, ...formattedApi];

        // 4. ELIMINAR DUPLICADOS Y LIMITAR (Igual que handleSearch)
        const uniqueResults = allRecipes.filter(
          (recipe, index, self) =>
            index === self.findIndex((r) => r.title === recipe.title)
        );

        const limitedResults = uniqueResults.slice(0, 15);

        // 5. TRADUCCIÓN FINAL DE TÍTULOS
        const translatedResults = await Promise.all(
          limitedResults.map(async (recipe) => {
            try {
              const tTitle = await translateText(recipe.title, 'en', 'es');
              return { ...recipe, title: tTitle };
            } catch {
              return recipe;
            }
          })
        );

        setRecipes(translatedResults);

      } catch (error) {
        console.error("Error en SearchPage:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCombinedResults()
  }, [query])

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f3ed]">
      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium">Buscando "{query}"...</p>
    </div>
  )

  return (
    <div className="pt-32 min-h-screen bg-[#f7f3ed]">
      <RecipeResults
        recipes={recipes}
        title={recipes.length > 0 
          ? `Resultados para "${query}"` 
          : `No encontramos nada para "${query}"`
        }
      />
    </div>
  )
}

export default SearchPage