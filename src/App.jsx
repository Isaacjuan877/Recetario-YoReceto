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

  const [loadingAuth, setLoadingAuth] =
    useState(true)

  const location = useLocation()

  const isResetPage =
    location.pathname === '/reset-password'
  const [isRecovery, setIsRecovery] =
  useState(
    localStorage.getItem('recoveryMode') === 'true'
  )

  

  /* =========================
     CARGAR SESIÓN
  ========================= */

  useEffect(() => {

    async function loadSession() {

      const {
        data: { session }
      } = await supabase.auth.getSession()

      const isRecoverySession =
        session?.user &&
        localStorage.getItem(
          'recoveryMode'
        ) === 'true'

      if (!isRecoverySession) {

        localStorage.removeItem(
          'recoveryMode'
        )

        setIsRecovery(false)
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

            localStorage.setItem(
              'recoveryMode',
              'true'
            )

            setIsRecovery(true)
          }

          if (event === 'SIGNED_OUT') {

            localStorage.removeItem(
              'recoveryMode'
            )

            setIsRecovery(false)
          }
        }
      )

    return () => {

      subscription.unsubscribe()
    }

  }, [])
  useEffect(() => {

    function syncRecovery(event) {

      if (
        event.key === 'recoveryMode' &&
        event.newValue === null
      ) {

        setIsRecovery(false)

        window.location.href = '/'
      }
    }

    window.addEventListener(
      'storage',
      syncRecovery
    )

    return () => {

      window.removeEventListener(
        'storage',
        syncRecovery
      )
    }

  }, [])
  

  if (
  isRecovery &&
  location.pathname !== '/reset-password'
) {

  return (
    <Navigate
      to="/reset-password"
      replace
    />
  )
}

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