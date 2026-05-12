const API_KEY =import.meta.env.VITE_SPOONACULAR_KEY

const BASE_URL =
  'https://api.spoonacular.com/recipes/complexSearch'

export async function getRecipes(query = '') {

  try {

    const response = await fetch(
      `${BASE_URL}?query=${query}&number=5&addRecipeInformation=true&apiKey=${API_KEY}`
    )

    const data = await response.json()

    console.log(data)

    return data.results || []

  } catch (error) {

    console.error(error)

    return []
  }
}
export async function getRecipeById(id) {

  try {

    const response = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${API_KEY}`
    )

    const data = await response.json()

    return data

  } catch (error) {

    console.error(error)

    return null
  }
}