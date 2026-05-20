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