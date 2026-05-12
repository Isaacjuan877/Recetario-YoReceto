import { useEffect, useState } from 'react'
import { translateText } from '../services/translate'
import { useParams} from 'react-router-dom'
import { getMealById } from '../api/mealdb'

import {  getRecipeById} from '../api/spoonacular'
import {  getYoutubeEmbed} from '../services/youtube'
import { supabase } from '../assets/services/supabase'
import LoginModal from '../components/LoginModal'
function RecipeDetails() {

  const { source, id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [translatedInstructions, setTranslatedInstructions] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  useEffect(() => {

    async function fetchRecipe() {

      setIsTranslating(true)

      let data = null

      // SPOONACULAR
      if (source === 'spoonacular') {

        data = await getRecipeById(id)

      } else {

        // MEALDB
        data = await getMealById(id)
      }

      if (!data) return

      // TÍTULO
      const title =
        data.strMeal || data.title

      data.translatedTitle =
        await translateText(title)

      // CATEGORÍA
      const category =
        data.strCategory ||
        data.dishTypes?.[0] ||
        'Receta'

      data.translatedCategory =
        await translateText(category)

      // PAÍS
      const area =
        data.strArea ||
        data.cuisines?.[0] ||
        'Internacional'

      data.translatedArea =
        await translateText(area)

      // INSTRUCCIONES
      const instructions =
        data.strInstructions ||
        data.instructions ||
        ''

      const translated =
        await translateText(instructions)

      setTranslatedInstructions(translated)

      // INGREDIENTES THEMEALDB
      if (data.strIngredient1) {

        for (let i = 1; i <= 20; i++) {

          const ingredient =
            data[`strIngredient${i}`]

          if (
            ingredient &&
            ingredient.trim() !== ''
          ) {

            data[`strIngredient${i}`] =
              await translateText(ingredient)
          }
        }
      }

      // INGREDIENTES SPOONACULAR
      if (data.extendedIngredients) {

        for (const item of data.extendedIngredients) {

          item.name =
            await translateText(item.name)
        }
      }
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (session) {

        const { data: favorite } =
          await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('recipe_id', id)
            .single()

        setIsFavorite(!!favorite)
      }
      async function autoSaveFavorite() {

        const pending =
          localStorage.getItem(
            'pendingFavorite'
          )

        if (!pending) return

        const parsed =
          JSON.parse(pending)

        if (

          parsed.id === id &&
          parsed.source === source

        ) {

          const {
            data: { session }
          } = await supabase.auth.getSession()

          if (!session) return

          // GUARDAR FAVORITO
          await supabase
            .from('favorites')
            .insert({

              user_id: session.user.id,

              recipe_id: id,

              source,

              title:
                data.translatedTitle,

              image:
                data.strMealThumb ||
                data.image,

              category:
                data.translatedCategory,

              area:
                data.translatedArea
            })

          // ACTUALIZAR BOTÓN
          setIsFavorite(true)

          localStorage.removeItem(
            'pendingFavorite'
          )
        }
      }
      setRecipe(data)

      setIsTranslating(false)
    }

    fetchRecipe()
    

  }, [id, source])

  if (!recipe) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando receta...
      </div>
    )
  }

  // INGREDIENTES
  let ingredients = []

  // THEMEALDB
  if (recipe.strIngredient1) {

    for (let i = 1; i <= 20; i++) {

      const ingredient =
        recipe[`strIngredient${i}`]

      const measure =
        recipe[`strMeasure${i}`]

      if (
        ingredient &&
        ingredient.trim() !== ''
      ) {

        ingredients.push(
          `${measure} ${ingredient}`
        )
      }
    }
  }

  // SPOONACULAR
  else if (recipe.extendedIngredients) {

    ingredients =
      recipe.extendedIngredients.map(
        item =>

          `${item.amount || ''} ${item.unit || ''} ${item.name}`
      )
  }
  async function handleFavorite() {

    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session) {

      localStorage.setItem(
        'pendingFavorite',
        JSON.stringify({
          id,
          source
        })
      )

      setShowLogin(true)

      return
    }

    // ELIMINAR SI YA EXISTE
    if (isFavorite) {

      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', session.user.id)
        .eq('recipe_id', id)

      setIsFavorite(false)

      return
    }

    // GUARDAR
    const recipeTitle =
      recipe.translatedTitle ||
      recipe.strMeal ||
      recipe.title

    const recipeImage =
      recipe.strMealThumb ||
      recipe.image

    await supabase
    .from('favorites')
    .insert({
      user_id: session.user.id,
      recipe_id: id,
      source: source,
      title:
        recipe.strMeal || recipe.title,
      image:
        recipe.strMealThumb || recipe.image
    })

    setIsFavorite(true)
  }
  

  return (
    
    <section className="bg-[#f7f3ed] min-h-screen py-20">
      
      <LoginModal
        isOpen={showLogin}
        setIsOpen={setShowLogin}
      />

      <div className="max-w-6xl mx-auto px-6">

        <div className="grid md:grid-cols-2 gap-14">

          {/* IMAGEN */}
          <div>

            <img
              src={
                recipe.strMealThumb ||
                recipe.image
              }

              alt={
                recipe.translatedTitle ||
                recipe.strMeal ||
                recipe.title
              }
              className="w-full rounded-[30px] shadow-xl"
            />
            

          </div>

          {/* INFO */}
          <div>

            <p className="uppercase tracking-[3px] text-red-400 mb-4">
              {recipe.translatedCategory}
            </p>
            

            <h1 className="text-5xl font-light mb-8">
             {recipe.translatedTitle}
             
            </h1>
            
            

            <div className="flex gap-6 mb-10 text-gray-500">

              <span>
                🌍 {recipe.translatedArea}
              </span>

              <span>
                🍽️ {recipe.translatedCategory}
              </span>

            </div>
            <button
  onClick={handleFavorite}
  className={`
    flex items-center gap-3
    px-7 py-4 mt-6
    rounded-full
    transition-all duration-300
    shadow-sm
    hover:scale-105

    ${
      isFavorite

        ? 'bg-red-400 text-white'

        : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
    }
  `}
>

  <span className="text-xl">

    {
      isFavorite
        ? '❤️'
        : '🤍'
    }

  </span>

  <span className="font-medium">

    {
      isFavorite
        ? 'Guardada en favoritos'
        : 'Guardar receta'
    }

  </span>

</button>
            
            {recipe.readyInMinutes && (

  <span>
    ⏱️ {recipe.readyInMinutes} min
  </span>

)}

{recipe.servings && (

  <span>
    🍽️ {recipe.servings} porciones
  </span>

)}

            {/* INGREDIENTES */}
            <div className="mb-12">

              <h2 className="text-3xl mb-6">
                Ingredientes
              </h2>

              <ul className="space-y-3">

                {ingredients.map((item, index) => (

                  <li
                    key={index}
                    className="bg-white p-4 rounded-xl shadow-sm"
                  >
                    {item}
                  </li>

                ))}

              </ul>

            </div>

          </div>

        </div>
        {
          recipe.nutrition?.nutrients && (

            <div className="mt-16">

              <h2 className="text-4xl mb-8">
                Información nutricional
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                {
                  recipe.nutrition.nutrients
                    .filter(item =>

                      [
                        'Calories',
                        'Protein',
                        'Fat',
                        'Carbohydrates',
                        'Sugar',
                        'Fiber'
                      ].includes(item.name)

                    )
                    .map((item, index) => (

                      <div
                        key={index}
                        className="bg-white p-6 rounded-2xl shadow-sm"
                      >

                        <p className="text-gray-400 text-sm mb-2">
                          {item.name}
                        </p>

                        <p className="text-3xl font-light">
                          {Math.round(item.amount)}
                          {item.unit}
                        </p>

                      </div>
                    ))
                }

              </div>

            </div>
          )
        }

        {/* INSTRUCCIONES */}
        <div className="mt-20">

          <h2 className="text-4xl mb-8">
            Preparación
          </h2>

          <div
            className="bg-white p-8 rounded-[30px] shadow-lg leading-relaxed text-gray-700 text-justify"
            dangerouslySetInnerHTML={{
              __html:
                isTranslating
                  ? 'Traduciendo receta...'
                  : translatedInstructions
            }}
          />

        </div>

        {/* VIDEO */}
        {recipe.strYoutube && (

          <div className="mt-20">

            <h2 className="text-4xl mb-8">
              Video
            </h2>

            {recipe.strYoutube ? (

              <div className="aspect-video rounded-[30px] overflow-hidden shadow-xl">

                <iframe
                  width="100%"
                  height="100%"
                  src={
                    recipe.strYoutube.replace(
                      'watch?v=',
                      'embed/'
                    )
                  }
                  title={
                    recipe.title ||
                    recipe.strMeal
                  }
                  allowFullScreen
                />

              </div>

            ) : (

              <a
                href={getYoutubeEmbed(
                  recipe.title ||
                  recipe.strMeal
                )}
                target="_blank"
                rel="noreferrer"
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full inline-block"
              >
                Ver videos de esta receta
              </a>

            )}

          </div>

        )}
        

      </div>

    </section>
  )
}

export default RecipeDetails