import {
  Routes,
  Route
} from 'react-router-dom'

import { useEffect } from 'react'

import { supabase } from './assets/services/supabase'

import Navbar from './components/Navbar'

import Home from './pages/Home'
import RecipesPage from './pages/RecipesPage'
import RecipeDetails from './pages/RecipeDetails'
import EditProfile from './pages/EditProfile'
import ResetPassword from './pages/ResetPassword'
import SearchPage from './pages/SearchPage'
import Favorites from './pages/Favorites'
import ScrollToTop from './components/ScrollToTop'
function App() {

  useEffect(() => {

  const {
    data: { subscription }
  } = supabase.auth.onAuthStateChange(
    (event, session) => {

      console.log(event)
    

    }
  )

  return () => {
    subscription.unsubscribe()
  }

}, [])

  return (

    <>
      <Navbar />
      <ScrollToTop />
      <main className="pt-24">

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/search"
            element={<SearchPage />}
          />

          <Route
            path="/recipes"
            element={<RecipesPage />}
          />

          <Route
            path="/recipe/:source/:id"
            element={<RecipeDetails />}
          />

          <Route
            path="/profile"
            element={<EditProfile />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          <Route
            path="/favorites"
            element={<Favorites />}
          />

          

        </Routes>

      </main>
    </>

  )
}

export default App