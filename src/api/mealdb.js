const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'
import { translateText } from '../services/translate'
let cachedMeals = null
/* =========================================
   BUSCAR RECETAS POR CATEGORIA
========================================= */
export async function getMealsByCategory(category) {

  const response = await fetch(
    `${BASE_URL}/filter.php?c=${category}`
  )

  const data = await response.json()

  return data.meals || []
}

/* =========================================
   BUSCAR RECETAS POR NOMBRE
========================================= */
export async function searchMeals(query) {

  try {

    const response = await fetch(
      `${BASE_URL}/search.php?s=${query}`
    )

    const data = await response.json()

    return data.meals || []

  } catch (error) {

    console.error(error)

    return []

  }
}

/* =========================================
   NORMALIZAR TEXTO
========================================= */
function normalize(text) {

  return text
    ?.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .trim()
}

/* =========================================
   COMPARAR INGREDIENTES
========================================= */
function ingredientMatches(
  searchIng,
  mealIng
) {

  const search =
    normalize(searchIng)

  const meal =
    normalize(mealIng)

  // coincidencia flexible
  return (

    meal.includes(search) ||

    search.includes(meal) ||

    // palabras individuales
    meal.split(' ').some(word =>
      word.includes(search)
    )
  )
}

/* =========================================
   BUSCAR POR INGREDIENTES
========================================= */
export async function searchByIngredients(query) {

  try {

    /* =========================
       INGREDIENTES DEL USUARIO
    ========================= */
    const rawIngredients =
      query
        .split(',')
        .map(i => i.trim())
        .filter(Boolean)

    /* =========================
       TRADUCIR A INGLÉS
    ========================= */
    const translatedIngredients =
      await Promise.all(

        rawIngredients.map(async ingredient => {

          const translated =
            await translateText(
              ingredient,
              'es',
              'en'
            )

          return normalize(translated)
        })
      )

    console.log(
      'Ingredientes traducidos:',
      translatedIngredients
    )

    /* =========================
   CACHE DE RECETAS
========================= */

if (!cachedMeals) {

  const alphabet =
    'abcdefghijklmnopqrstuvwxyz'

  const responses =
    await Promise.all(

      alphabet.split('').map(
        async letter => {

          const res = await fetch(

            `${BASE_URL}/search.php?f=${letter}`
          )

          return res.json()
        }
      )
    )

  cachedMeals =
    responses.flatMap(
      r => r.meals || []
    )

  console.log(
    'Recetas cacheadas:',
    cachedMeals.length
  )
}

/* =========================
   USAR CACHE
========================= */

const detailedMeals =
  cachedMeals

    /* =========================
       FILTRAR RECETAS
    ========================= */
    const filteredMeals =
      detailedMeals.filter(meal => {

        const mealIngredients = []

        for (let i = 1; i <= 20; i++) {

          const ingredient =
            meal[`strIngredient${i}`]

          if (
            ingredient &&
            ingredient.trim() !== ''
          ) {

            mealIngredients.push(
              normalize(ingredient)
            )
          }
        }

        /* =========================
          TODOS LOS INGREDIENTES
          BUSCADOS DEBEN EXISTIR
        ========================= */

        const hasAllSearchIngredients =

          translatedIngredients.every(

            searchIng =>

              mealIngredients.some(

                mealIng =>

                  ingredientMatches(
                    searchIng,
                    mealIng
                  )
              )
          )

        /* =========================
          LA RECETA NO DEBE
          TENER INGREDIENTES EXTRA
        ========================= */

        const hasOnlyRequestedIngredients =

          mealIngredients.every(

            mealIng =>

              translatedIngredients.some(

                searchIng =>

                  ingredientMatches(
                    searchIng,
                    mealIng
                  )
              )
          )

        return (

          hasAllSearchIngredients &&
          hasOnlyRequestedIngredients
        )
      })

    console.log(
      'Recetas encontradas:',
      filteredMeals
    )

    return filteredMeals.map(meal => ({

      ...meal,

      source: 'mealdb'
    }))

  } catch (error) {

    console.error(error)

    return []
  }
}
/* =========================================
   OBTENER RECETAS ALEATORIAS
========================================= */
export async function getRandomMeals(count = 3) {

  try {

    const requests = Array.from(
      { length: count },
      () => fetch(`${BASE_URL}/random.php`)
    )

    const responses = await Promise.all(requests)

    const data = await Promise.all(
      responses.map(res => res.json())
    )

    return data.map(
      item => item.meals[0]
    )

  } catch (error) {

    console.error(error)

    return []

  }
}

/* =========================================
   OBTENER CATEGORÍAS
========================================= */
export async function getCategories() {

  try {

    const response = await fetch(
      `${BASE_URL}/categories.php`
    )

    const data = await response.json()

    return data.categories || []

  } catch (error) {

    console.error(error)

    return []

  }
}
/* =========================================
   OBTENER RECETA POR ID
========================================= */
export async function getMealById(id) {

  try {

    const response = await fetch(
      `${BASE_URL}/lookup.php?i=${id}`
    )

    const data = await response.json()

    return data.meals[0]

  } catch (error) {

    console.error(error)

    return null

  }
}
