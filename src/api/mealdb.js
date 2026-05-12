const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

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
   BUSCAR POR INGREDIENTES
========================================= */
export async function searchByIngredients(query) {

  try {

    const ingredients = query
      .split(/[, ]+/)
      .filter(item => item.trim() !== '')

    const requests = ingredients.map(ingredient =>

      fetch(
        `${BASE_URL}/filter.php?i=${ingredient}`
      ).then(res => res.json())

    )

    const responses = await Promise.all(requests)

    const meals = responses.flatMap(
      item => item.meals || []
    )

    // eliminar duplicados
    const uniqueMeals = meals.filter(
      (meal, index, self) =>
        index === self.findIndex(
          m => m.idMeal === meal.idMeal
        )
    )

    return uniqueMeals

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
/* =========================================
   BÚSQUEDA INTELIGENTE POR INGREDIENTES
========================================= */
export async function smartIngredientSearch(query) {

  try {

    // ingredientes buscados
    const searchIngredients = query
      .toLowerCase()
      .split(/[, ]+/)
      .filter(item => item.trim() !== '')

    // buscar por cada ingrediente
    const requests = searchIngredients.map(ingredient =>

      fetch(
        `${BASE_URL}/filter.php?i=${ingredient}`
      ).then(res => res.json())

    )

    const responses = await Promise.all(requests)

    // combinar recetas
    const mealsMap = {}

    responses.forEach((response) => {

      const meals = response.meals || []

      meals.forEach(meal => {

        mealsMap[meal.idMeal] = meal
      })
    })

    const candidateMeals = Object.values(mealsMap)

    // obtener detalles completos
    const detailRequests = candidateMeals.map(meal =>

      fetch(
        `${BASE_URL}/lookup.php?i=${meal.idMeal}`
      ).then(res => res.json())

    )

    const detailResponses = await Promise.all(detailRequests)

    const detailedMeals = detailResponses.map(
      item => item.meals[0]
    )

    const exactMatches = []
    const partialMatches = []

    detailedMeals.forEach(meal => {

      // ingredientes reales de receta
      const recipeIngredients = []

      for (let i = 1; i <= 20; i++) {

        const ingredient =
          meal[`strIngredient${i}`]

        if (
          ingredient &&
          ingredient.trim() !== ''
        ) {

          recipeIngredients.push(
            ingredient.toLowerCase()
          )
        }
      }

      // coincidencias
      const matchedIngredients =
        searchIngredients.filter(ingredient =>

          recipeIngredients.includes(ingredient)

        )

      // EXACTA:
      // todos los ingredientes buscados existen
      // y no hay demasiados extras
      const isExact =
        matchedIngredients.length ===
        searchIngredients.length

      if (isExact) {

        exactMatches.push(meal)

      } else {

        partialMatches.push({
          ...meal,
          matchedCount:
            matchedIngredients.length
        })
      }
    })

    // ordenar otras opciones
    partialMatches.sort(
      (a, b) =>
        b.matchedCount -
        a.matchedCount
    )
    // eliminar duplicados exactos
    const uniqueExactMatches = exactMatches.filter(
      (meal, index, self) =>
        index === self.findIndex(
          m => m.idMeal === meal.idMeal
        )
    )

    const uniquePartialMatches = partialMatches.filter(
      (meal, index, self) =>
        index === self.findIndex(
          m => m.idMeal === meal.idMeal
        )
    )

    return {
    exactMatches: uniqueExactMatches,
    partialMatches: uniquePartialMatches
  }

  } catch (error) {

    console.error(error)

    return {
      exactMatches: [],
      partialMatches: []
    }
  }
}