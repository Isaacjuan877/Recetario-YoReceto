import {
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom'

import {
  useEffect,
  useState
} from 'react'

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
// CARGAR LA SESION 
  const [loadingAuth, setLoadingAuth] =
    useState(true)
  const location = useLocation()

  const isResetPage =  location.pathname === '/reset-password'
  const hashParams =
  new URLSearchParams(
    location.hash.substring(1)
  )

  const isRecoveryMode =
    hashParams.get('type') === 'recovery'
  const [isRecovery, setIsRecovery] =  useState(false)

  useEffect(() => {

    async function loadSession() {

      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (isRecoveryMode) {

        setIsRecovery(true)
      }

      setLoadingAuth(false)
    }

    loadSession()

    const {
      data: { subscription }
    } =
      supabase.auth.onAuthStateChange(
        async (event) => {

          if (event === 'PASSWORD_RECOVERY') {

            setIsRecovery(true)
          }

          if (event === 'SIGNED_OUT') {

            setIsRecovery(false)
          }
        }
      )

    return () => {

      subscription.unsubscribe()
    }

  }, [])

  if (loadingAuth) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        Cargando...

      </div>
    )
  }
if (
  (isRecovery || isRecoveryMode) &&
  location.pathname !== '/reset-password'
) {

  return (
    <Navigate to="/reset-password" replace />
  )
}

  return (

    <>
      {
        !isResetPage &&
        <Navbar />
      }

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