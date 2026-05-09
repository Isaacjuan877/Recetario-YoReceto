import {
  Routes,
  Route
} from 'react-router-dom'

import Navbar from './components/Navbar'

import Home from './pages/Home'
import RecipesPage from './pages/RecipesPage'
import RecipeDetails from './pages/RecipeDetails'

function App() {

  return (

    <>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/recipes"
          element={<RecipesPage />}
        />

        <Route
          path="/recipe/:id"
          element={<RecipeDetails />}
        />

      </Routes>

    </>

  )
}

export default App