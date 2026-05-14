import { supabase }
from '../assets/services/supabase'
import { translateText }
from '../services/translate'

/* =========================
   NORMALIZAR TEXTO
========================= */

function normalize(text = '') {

  return text

    .toLowerCase()

    .normalize('NFD')

    .replace(/[\u0300-\u036f]/g, '')

    .replace(/[^a-zA-Z\s]/g, '')

    .trim()
}
export async function searchRecipes(query) {
  const normalizedQuery = normalize(query);
  
  // 1. Lista bilingüe de palabras que NO aportan significado
  const stopWords = [
    'con', 'de', 'la', 'el', 'y', 'para', 'en', 'un', 'una', 'del', 'al', // Español
    'with', 'and', 'for', 'the', 'in', 'at', 'on', 'a', 'an', 'of', 'by'  // Inglés
  ];

  // 2. Extraemos las palabras clave
  const queryWords = normalizedQuery
    .split(' ')
    .filter(word => 
      word.length > 1 && 
      !stopWords.includes(word)
    );

  // LOG DE CONTROL: Mira en tu consola si aquí todavía aparece "with"
  console.log("Palabras clave filtradas:", queryWords);

  if (queryWords.length === 0) return [];

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .limit(500);

  if (error) return [];

  return data.filter(recipe => {
    const title = normalize(recipe.title || '');
    
    // 3. Verificamos que TODAS las palabras clave del usuario estén en el título
    return queryWords.every(qWord => {
      // Coincidencia directa o difusa
      const hasMatch = title.includes(qWord) || 
                       title.split(' ').some(tWord => 
                         tWord.startsWith(qWord.slice(0, 3)) && 
                         Math.abs(tWord.length - qWord.length) <= 2
                       );
      return hasMatch;
    });
  }).sort((a, b) => {
    // Prioridad a los que empiezan por la primera palabra (ej. Rice)
    const firstWord = queryWords[0];
    const titleA = normalize(a.title);
    const titleB = normalize(b.title);
    
    const aStarts = titleA.startsWith(firstWord);
    const bStarts = titleB.startsWith(firstWord);

    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return 0;
  });
}


/* =========================
   EXTRAER PALABRAS
========================= */

function words(text = '') {

  return normalize(text)
    .split(' ')
    .filter(Boolean)
}

/* =========================
   BUSCAR POR INGREDIENTES
========================= */

export async function searchRecipesByIngredients(translatedIngredientsArray) {
  try {
    const { data, error } = await supabase.from('recipes').select('*');
    if (error) throw error;

    const filtered = data.filter(recipe => {
      if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) return false;

      // 1. Obtenemos todos los nombres de ingredientes de la receta
      const recipeIngredientsNames = recipe.ingredients.map(ing => 
        normalize(ing.name || ing.original || '')
      );

      // 2. LÓGICA: ¿Cada ingrediente de la RECETA está cubierto por lo que tengo?
      return recipeIngredientsNames.every(neededIng => {
        // Descomponemos el ingrediente necesario en palabras (ej: "purple", "onion")
        const neededWords = words(neededIng);

        // Buscamos si alguna de nuestras existencias (ej: "onion") coincide
        return translatedIngredientsArray.some(userHas => {
          const userHasWords = words(userHas);

          // Si alguna palabra clave coincide, damos el ingrediente por cubierto
          return neededWords.some(nW => 
            userHasWords.some(uW => nW.includes(uW) || uW.includes(nW))
          );
        });
      });
    });

    return filtered;
  } catch (error) {
    console.error("Error en búsqueda local:", error);
    return [];
  }
}