import 'dotenv/config'

import { createClient }
from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/* =========================
   API KEYS
========================= */

const API_KEYS = [

  process.env.SPOON_1,
  process.env.SPOON_2,
  process.env.SPOON_3
]

let currentKey = 0

function getApiKey() {

  const key =
    API_KEYS[currentKey]

  currentKey =
    (currentKey + 1)
    % API_KEYS.length

  return key
}

/* =========================
   DELAY
========================= */

function sleep(ms) {

  return new Promise(
    resolve =>
      setTimeout(resolve, ms)
  )
}

/* =========================
   EVITAR DUPLICADOS
========================= */

const processedIds =
  new Set()

/* =========================
   BÚSQUEDAS
========================= */

const SEARCHES = [

  /* 'chicken',
  'beef',
  'pasta',
  'dessert', 
  'fish',
  'rice',
  'soup',
  'salad',
  'burger',
  'pizza',
  'cake',
  'cookies',*/
  'vegetarian',
  'vegan',
  'breakfast',
  'seafood',
  'mexican',
  'italian',
  'asian',
  'indian'
]

/* =========================
   BUSCAR RECETAS
========================= */

async function fetchRecipes(
  query,
  offset = 0
) {

  try {

    const apiKey =
      getApiKey()

    const url =
      `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=20&offset=${offset}&apiKey=${apiKey}`

    const res =
      await fetch(url)

    if (res.status === 402) {

      console.log(
        '⚠️ Límite alcanzado'
      )

      return []
    }

    const data =
      await res.json()

    return data.results || []

  } catch (error) {

    console.error(
      'Error buscando recetas:',
      error
    )

    return []
  }
}

/* =========================
   DETALLE COMPLETO
========================= */

async function fetchRecipeDetails(id) {

  try {

    const apiKey =
      getApiKey()

    const url =
      `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`

    const res =
      await fetch(url)

    if (res.status === 402) {

      console.log(
        '⚠️ Límite alcanzado detalle'
      )

      return null
    }

    return await res.json()

  } catch (error) {

    console.error(
      'Error detalle receta:',
      id
    )

    return null
  }
}

/* =========================
   FORMATEAR
========================= */

async function formatRecipe(recipe) {

  return {

    spoonacular_id:
      recipe.id,

    source:
      'spoonacular',

    title:
      recipe.title || '',

    instructions:
      recipe.instructions || '',

    summary:
      recipe.summary || '',

    image:
      recipe.image || '',

    ready_in_minutes:
      recipe.readyInMinutes || null,

    servings:
      recipe.servings || null,

    category:
      recipe.dishTypes?.[0]
      || 'Recipe',

    area:
      recipe.cuisines?.[0]
      || 'International',

    cuisines:
      recipe.cuisines || [],

    dish_types:
      recipe.dishTypes || [],

    diets:
      recipe.diets || [],

    occasions:
      recipe.occasions || [],

    ingredients:

      recipe.extendedIngredients?.map(
        item => ({

          id:
            item.id || null,

          name:
            item.name || '',

          original:
            item.original || '',

          amount:
            item.amount || null,

          unit:
            item.unit || ''
        })
      ) || [],

    nutrition:
      recipe.nutrition || null,

    analyzed_instructions:
      recipe.analyzedInstructions || [],

    spoonacular_score:
      recipe.spoonacularScore || null,

    health_score:
      recipe.healthScore || null,

    price_per_serving:
      recipe.pricePerServing || null
  }
}

/* =========================
   GUARDAR
========================= */

async function saveRecipe(recipe) {

  const { error } =
    await supabase
      .from('recipes')
      .upsert(
        recipe,
        {
          onConflict:
            'spoonacular_id'
        }
      )

  if (error) {

    console.error(
      'Error guardando:',
      error
    )
  }
}

/* =========================
   MAIN
========================= */

async function main() {

  for (const query of SEARCHES) {

    console.log(
      `\n🔎 Buscando: ${query}`
    )

    // PAGINACIÓN
    for (
      let offset = 0;
      offset < 40;
      offset += 20
    ) {

      const recipes =
        await fetchRecipes(
          query,
          offset
        )

      // SIN RESULTADOS
      if (recipes.length === 0) {

        console.log(
          'Sin resultados'
        )

        break
      }

      // DETALLE COMPLETO
      for (const recipe of recipes) {

        // EVITAR DUPLICADOS
        if (
          processedIds.has(recipe.id)
        ) {

          continue
        }

        processedIds.add(
          recipe.id
        )

        try {

          const fullRecipe =
            await fetchRecipeDetails(
              recipe.id
            )

          if (!fullRecipe) {

            continue
          }

          const formatted =
            await formatRecipe(
              fullRecipe
            )

          await saveRecipe(
            formatted
          )

          console.log(
            '✅ Guardada:',
            formatted.title
          )

          // EVITAR RATE LIMIT
          await sleep(700)

        } catch (error) {

          console.error(
            'Error receta:',
            recipe.id
          )
        }
      }
    }
  }

  console.log(
    '\n🎉 Proceso terminado'
  )
}

main()