export function getYoutubeEmbed(recipeName) {

  const query = encodeURIComponent(
    `${recipeName} receta`
  )

  return `https://www.youtube.com/results?search_query=${query}`
}