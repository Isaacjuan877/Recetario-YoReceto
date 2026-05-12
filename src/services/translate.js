/* export async function translateText(text) {

  if (!text) return ''

  try {

    const response = await fetch(
      '/api/translate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text
        })
      }
    )

    const data = await response.json()

    return data.translatedText

  } catch (error) {

    console.error(error)

    return text
  }
} */
export async function translateText(
  text,
  from = 'en',
  to = 'es'
) {

  if (!text) return ''

  try {

    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
    )

    const data = await response.json()

    return data[0]
      .map(item => item[0])
      .join('')

  } catch (error) {

    console.error(error)

    return text
  }
}