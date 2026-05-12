
function RecipeCards() {
  return (
    <section className="py-20 bg-[#f7f3ed]">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-light mb-12 text-center">
          Recetario
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {recipes.map((recipe, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:-translate-y-2 transition-all"
            >
              <img
                src={recipe.image}
                alt=""
                className="h-64 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl mb-3">
                  {recipe.title}
                </h3>

                <div className="flex justify-between text-gray-500 mb-4">
                  <span>{recipe.time}</span>
                  <span>{recipe.difficulty}</span>
                </div>

                <button className="bg-red-400 hover:bg-red-500 text-white px-5 py-3 rounded-full w-full">
                  Ver receta
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}

export default RecipeCards