import { useEffect, useState } from 'react'
import { translateText } from '../services/translate'
import { useParams } from 'react-router-dom'
import { getMealById } from '../api/mealdb'
import { supabase } from '../assets/services/supabase'
import LoginModal from '../components/LoginModal'

function RecipeDetails() {

  const { source, id } = useParams()

  const [recipe, setRecipe] =
    useState(null)

  const [translatedInstructions, setTranslatedInstructions] =
    useState('')

  

  const [isFavorite, setIsFavorite] =
    useState(false)

  const [showLogin, setShowLogin] =
    useState(false)

  const [showAllNutrition, setShowAllNutrition] =
    useState(false)
  const [errorLoading, setErrorLoading] =
  useState(false)
   /* =========================
     VERIFICAR FAVORITO
  ========================= */

  async function checkFavorite(userId) {

    const { data, error } =
      await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('recipe_id', id)
        .maybeSingle()

    if (error) {

      console.error(
        'Error verificando favorito:',
        error
      )

      return false
    }

    return !!data
  }

  /* =========================
     ESCUCHAR LOGIN / LOGOUT
  ========================= */

  useEffect(() => {

    const {
      data: listener
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {

        if (
          event === 'SIGNED_IN' &&
          session
        ) {

          const exists =
            await checkFavorite(
              session.user.id
            )

          setIsFavorite(exists)
        }

        if (event === 'SIGNED_OUT') {

          setIsFavorite(false)
        }
      }
    )

    return () => {

      listener.subscription.unsubscribe()
    }

  }, [id])

  /* =========================
     CARGAR RECETA
  ========================= */

  useEffect(() => {

    async function fetchRecipe() {

       setRecipe(null)

     

      setErrorLoading(false)

      let data = null

      try {

        /* =========================
           RECETARIO LOCAL
        ========================= */

        if (source === 'recetario') {

          const {
            data: localData,
            error
          } = await supabase
            .from('recipes')
            .select('*')
            .eq('spoonacular_id', id)

          if (error) throw error

          if (
            !localData ||
            localData.length === 0
          ) {

            console.error(
              'No se encontró la receta'
            )
              setErrorLoading(true)
              return
          }

          data = localData[0]
        }

        /* =========================
           MEALDB
        ========================= */

        else if (source === 'mealdb') {

          
          
          data =
            await getMealById(id)

        }
        

        if (!data) {

          setErrorLoading(true)
          return
        }
        setRecipe(data)
        /* =========================
          TRADUCCIONES ASYNC
        ========================= */

        const rawTitle =
          data.title ||
          data.strMeal ||
          ''

        const rawCat =
          data.category ||
          data.strCategory ||
          'Receta'

        const rawArea =
          data.area ||
          data.strArea ||
          'Internacional'

        const rawInstructions =
          data.instructions ||
          data.strInstructions ||
          ''

        /* instrucciones inmediatas */
        setTranslatedInstructions(
          rawInstructions
        )

        /* traducciones en paralelo */
        Promise.all([

          translateText(rawTitle, 'en', 'es'),

          translateText(rawCat, 'en', 'es'),

          translateText(rawArea, 'en', 'es'),

          translateText(rawInstructions, 'en', 'es')

        ])
        .then(async ([title, cat, area, instructions]) => {

          /* =========================
            TRADUCIR INGREDIENTES
          ========================= */

          if (
            source === 'recetario' &&
            data.ingredients
          ) {

            for (const item of data.ingredients) {

              const rawIngredient =
                item.name ||
                item.original ||
                ''

              item.name =
                await translateText(
                  rawIngredient,
                  'en',
                  'es'
                )
            }
          }

          else if (source === 'mealdb') {

            for (let i = 1; i <= 20; i++) {

              const ing =
                data[`strIngredient${i}`]

              if (
                ing &&
                ing.trim() !== ''
              ) {

                data[`strIngredient${i}`] =
                  await translateText(
                    ing,
                    'en',
                    'es'
                  )
              }
            }
          }

          /* =========================
            ACTUALIZAR RECETA
          ========================= */

          setRecipe(prev => ({

            ...(prev || {}),

            ...data,

            translatedTitle: title,

            translatedCategory: cat,

            translatedArea: area
          }))

          setTranslatedInstructions(
            instructions
          )

        })
        .catch(error => {

          console.error(
            'Error traduciendo:',
            error
          )
        })
        .catch(error => {

          console.error(
            'Error traduciendo:',
            error
          )
        })

        /* =========================
           FAVORITOS
        ========================= */

        const {
          data: { session }
        } =
          await supabase.auth.getSession()

        if (session) {

          const exists =
            await checkFavorite(
              session.user.id
            )

          setIsFavorite(exists)
        }

        

      } catch (err) {

        console.error(
          'Error cargando receta:',
          err
        )
         setErrorLoading(true)

      } finally {

      
      }
    }

    fetchRecipe()

  }, [id, source])

  

  /* =========================
     INGREDIENTES
  ========================= */

  let ingredientsToRender = []

  if (recipe) {

    if (
      source === 'recetario' &&
      recipe.ingredients
    ) {

      ingredientsToRender =
        recipe.ingredients.map(item =>

          `${item.amount || ''}
           ${item.unit || ''}
           ${item.name || item.original}`
        )
    }

    else if (recipe.strIngredient1) {

      for (
        let i = 1;
        i <= 20;
        i++
      ) {

        const ing =
          recipe[`strIngredient${i}`]

        const measure =
          recipe[`strMeasure${i}`]

        if (
          ing &&
          ing.trim() !== ''
        ) {

          ingredientsToRender.push(
            `${measure} ${ing}`
          )
        }
      }
    }
  }

  /* =========================
     NUTRICIÓN
  ========================= */

  const nutrients =
    recipe?.nutrition?.nutrients || []

  const importantNutrients = [

    'Calories',
    'Protein',
    'Fat',
    'Carbohydrates',
    'Fiber',
    'Sugar',
    'Sodium'
  ]

  const mainNutrition =
    nutrients.filter(item =>
      importantNutrients.includes(
        item.name
      )
    )

  const extraNutrition =
    nutrients.filter(item =>
      !importantNutrients.includes(
        item.name
      )
    )

  /* =========================
     FAVORITOS
  ========================= */

  async function handleFavorite() {

    const {
      data: { session }
    } =
      await supabase.auth.getSession()

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

    try {

      if (isFavorite) {

        await supabase
          .from('favorites')
          .delete()
          .eq(
            'user_id',
            session.user.id
          )
          .eq(
            'recipe_id',
            id
          )

        setIsFavorite(false)
      }

      else {

        const favTitle =
          recipe.translatedTitle ||
          recipe.title ||
          recipe.strMeal

        const favImage =
          recipe.image ||
          recipe.strMealThumb

        const { error } =
          await supabase
            .from('favorites')
            .insert({

              user_id:
                session.user.id,

              recipe_id:
                id,

              source:
                source,

              title:
                favTitle,

              image:
                favImage,

              category:
                recipe.translatedCategory ||
                'Receta',

              area:
                recipe.translatedArea ||
                'Internacional'
            })

        if (error) throw error

        setIsFavorite(true)
      }

    } catch (error) {

      console.error(
        'Error favoritos:',
        error
      )
    }
  }
  if (errorLoading) {

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      text-xl
    ">

      No se pudo cargar la receta

    </div>
  )
}

  if (!recipe) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        Cargando receta...

      </div>
    )
  }

  return (

    <section className="
      bg-[#f7f3ed]
      min-h-screen
      py-20
    ">

      <LoginModal
        isOpen={showLogin}
        setIsOpen={setShowLogin}
      />

      <div className="
        max-w-6xl
        mx-auto
        px-6
      ">

        <div className="
          grid
          lg:grid-cols-[1fr_1.1fr]
          gap-12
          items-start
        ">

          {/* IMAGEN */}

          <img
            src={
              recipe.image ||
              recipe.strMealThumb
            }

            alt={
              recipe.translatedTitle ||
              recipe.title ||
              recipe.strMeal
            }

            className="
              w-full
              h-[420px]
              object-cover
              rounded-[30px]
              shadow-xl
            "
          />

          {/* INFO */}

          <div>

            <p className="
              uppercase
              tracking-[3px]
              text-red-400
              mb-4
            ">

              {recipe.translatedCategory ||
                recipe.category ||
                recipe.strCategory}

            </p>

            <h1 className="
              text-4xl
              md:text-5xl
              font-semibold
              text-gray-900
            ">

              {recipe.translatedTitle ||
                recipe.title ||
                recipe.strMeal}

            </h1>

            <div className="
              flex
              gap-6
              mt-5
              text-gray-500
              flex-wrap
              items-center
            ">

              <span>
                🌍 {recipe.translatedArea ||
                    recipe.area ||
                    recipe.strArea}
              </span>

              <span>
                🍽️ {recipe.translatedCategory ||
                      recipe.category ||
                      recipe.strCategory}
              </span>

              <button
                onClick={handleFavorite}
                className={`
                  flex items-center gap-3
                  px-5 py-3 rounded-full
                  transition-all duration-300
                  shadow-sm hover:scale-105
                  whitespace-nowrap

                  ${
                    isFavorite
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
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
                      ? 'Guardada'
                      : 'Guardar receta'
                  }

                </span>

              </button>
            </div>

            {/* INGREDIENTES */}

            <div className="mt-12">

              <h2 className="
                text-3xl
                mb-6
              ">

                Ingredientes

              </h2>

              <div className="
                flex
                flex-wrap
                gap-3
              ">

                {
                  ingredientsToRender.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="
                          bg-white
                          px-4
                          py-2
                          rounded-full
                          shadow-sm
                          border
                          border-gray-100
                        "
                      >

                        {item}

                      </div>
                    )
                  )
                }

              </div>
            </div>

            {/* NUTRICIÓN */}

            {
              source === 'recetario' &&
              nutrients.length > 0 && (

                <div className="mt-14">

                  <div className="
                    flex
                    items-center
                    justify-between
                    mb-6
                  ">

                    <h2 className="
                      text-3xl
                    ">

                      Información nutricional

                    </h2>

                    <button
                      onClick={() =>
                        setShowAllNutrition(
                          !showAllNutrition
                        )
                      }
                      className="
                        text-red-400
                        hover:text-red-500
                        transition-all
                      "
                    >

                      {
                        showAllNutrition
                          ? 'Ver menos'
                          : 'Ver todo'
                      }

                    </button>
                  </div>

                  {/* PRINCIPALES */}

                  <div className="
                    grid
                    grid-cols-2
                    md:grid-cols-4
                    gap-4
                  ">

                    {
                      mainNutrition.map(
                        nutrient => (

                          <div
                            key={nutrient.name}
                            className="
                              bg-white
                              rounded-3xl
                              p-5
                              shadow-md
                            "
                          >

                            <p className="
                              text-sm
                              text-gray-400
                              mb-2
                            ">

                              {nutrient.name}

                            </p>

                            <p className="
                              text-2xl
                              font-semibold
                              text-gray-900
                            ">

                              {
                                Math.round(
                                  nutrient.amount
                                )
                              }

                              <span className="
                                text-sm
                                text-gray-400
                                ml-1
                              ">

                                {nutrient.unit}

                              </span>

                            </p>

                          </div>
                        )
                      )
                    }

                  </div>

                  {/* EXTRA */}

                  {
                    showAllNutrition && (

                      <div className="
                        mt-8
                        bg-white
                        rounded-[30px]
                        p-8
                        shadow-xl
                      ">

                        <div className="
                          grid
                          md:grid-cols-2
                          gap-4
                        ">

                          {
                            extraNutrition.map(
                              nutrient => (

                                <div
                                  key={nutrient.name}
                                  className="
                                    flex
                                    items-center
                                    justify-between
                                    border-b
                                    border-gray-100
                                    py-3
                                  "
                                >

                                  <span className="
                                    text-gray-600
                                  ">

                                    {nutrient.name}

                                  </span>

                                  <span className="
                                    font-medium
                                  ">

                                    {
                                      Math.round(
                                        nutrient.amount
                                      )
                                    }

                                    {' '}

                                    {nutrient.unit}

                                  </span>

                                </div>
                              )
                            )
                          }

                        </div>

                      </div>
                    )
                  }

                </div>
              )
            }

          </div>
        </div>

        {/* PREPARACIÓN */}

        <div className="mt-20">

          <h2 className="
            text-4xl
            mb-8
          ">

            Preparación

          </h2>

          <div
            className="
              bg-white/80
              p-10
              rounded-[35px]
              shadow-xl
              leading-8
              text-gray-700
              text-justify
            "

            dangerouslySetInnerHTML={{
              __html:
                translatedInstructions ||
                recipe.instructions ||
                recipe.strInstructions ||
                'Sin instrucciones'
            }}
          />

        </div>

        {/* VIDEO */}

        {
          recipe.strYoutube && (

            <div className="mt-20">

              <h2 className="
                text-4xl
                mb-8
                font-light
              ">

                Video Tutorial

              </h2>

              <div className="
                aspect-video
                rounded-[30px]
                overflow-hidden
                shadow-xl
                border-8
                border-white
              ">

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
                    recipe.translatedTitle
                  }
                  frameBorder="0"
                  allow="
                    accelerometer;
                    autoplay;
                    clipboard-write;
                    encrypted-media;
                    gyroscope;
                    picture-in-picture
                  "
                  allowFullScreen
                />

              </div>

            </div>
          )
        }

        {
          !recipe.strYoutube && (

            <div className="
              mt-10
              text-center
            ">

              <a
                href={`https://www.youtube.com/results?search_query=como+preparar+${recipe.translatedTitle}`}
                target="_blank"
                rel="noreferrer"
                className="
                  text-red-400
                  hover:underline
                "
              >

                🔍 Buscar video tutorial en YouTube

              </a>

            </div>
          )
        }

      </div>

    </section>
  )
}

export default RecipeDetails