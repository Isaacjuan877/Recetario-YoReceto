import { useEffect, useState } from 'react'
import { supabase } from '../assets/services/supabase'
import RecipeResults from '../components/RecipeResults'

function Favorites() {

  const [recipes, setRecipes] =
    useState([])

  useEffect(() => {

    async function fetchFavorites() {

      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!session) return

      const { data } =
        await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', session.user.id)

      const formattedRecipes =
        (data || []).map(item => ({

          id: item.recipe_id,

          title: item.title,

          image: item.image,

          source: item.source

        }))

      setRecipes(formattedRecipes)
    }

    fetchFavorites()

  }, [])
  async function handleRemoveFavorite(recipe) {

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) return

  const { error } =
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', session.user.id)
      .eq('recipe_id', recipe.id)
      .eq('source', recipe.source)

  if (error) {

    console.log(error)

    return
  }

  setRecipes(prev =>
    prev.filter(item =>

      !(
        item.id === recipe.id &&
        item.source === recipe.source
      )

    )
  )
}

  return (

    <RecipeResults
        recipes={recipes}
        title="Tus favoritos"
        isFavoritesPage={true}
        onRemove={handleRemoveFavorite}
        />

  )
}

export default Favorites