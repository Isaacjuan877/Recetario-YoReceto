import { FaSearch,FaBars } from 'react-icons/fa'
import { Link ,useNavigate, useLocation} from 'react-router-dom'
import { useState,useEffect  } from 'react'

import LoginModal from './LoginModal'
import { supabase } from '../assets/services/supabase'

function Navbar() {
  const [user, setUser] = useState(null)
  
  const [showLogin, setShowLogin] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  
  const [search, setSearch] = useState('')


  useEffect(() => {
    async function getSession() {

      const {
        data: { session }
      } = await supabase.auth.getSession()

      setUser(session?.user || null)
    }

    getSession()

    const {
      data: listener
    } = supabase.auth.onAuthStateChange(
      (_, session) => {

        setUser(session?.user || null)
      }
    )

    return () => {

      listener.subscription.unsubscribe()
    }

  }, [])
  async function handleLogout() {

    await supabase.auth.signOut()

    setShowUserMenu(false)

    navigate('/')
  }
  
  function handleSearch(e) {

    e.preventDefault()

    if (!search.trim()) return

    navigate(
      `/search?q=${search}`
    )

    setMenuOpen(false)

    setSearch('')
  }
  return (
    <>

      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/">
            <div className="text-4xl font-bold text-red-400">
              RECETARIO
            </div>
          </Link>
          <ul className="hidden md:flex items-center gap-7 text-gray-700">

            <Link to="/">
              <li className="hover:text-red-400 cursor-pointer transition-all">
                Inicio
              </li>
            </Link>

            <Link to="/recipes">
              <li className="hover:text-red-400 cursor-pointer transition-all">
                Recetas
              </li>
            </Link>

            {user && (

              <Link to="/favorites">
                <li className="hover:text-red-400 cursor-pointer transition-all">
                  Favoritos
                </li>
              </Link>

            )}

            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2"
            >

              <input
                type="text"
                placeholder="Buscar recetas..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="bg-transparent outline-none w-40"
              />

              <button type="submit">
                <FaSearch className="text-gray-700" />
              </button>

            </form>

          </ul>

          <div className="flex items-center gap-5">
            
            {
              user ? (

                <div className="relative">

                  <img
                    src={
                      user.user_metadata?.avatar_url ||
                      'https://i.pravatar.cc/40'
                    }
                    alt="user"
                    onClick={() =>
                      setShowUserMenu(!showUserMenu)
                    }
                    className="w-11 h-11 rounded-full object-cover cursor-pointer border-2 border-red-300"
                  />

                  {
                    showUserMenu && (

                      <div className="absolute right-0 mt-3 bg-white shadow-xl rounded-2xl p-4 w-52">

                        <p className="font-semibold text-gray-800">
                          {
                            user.user_metadata?.name ||
                            'Usuario'
                          }
                        </p>

                        <p className="text-sm text-gray-400 mb-3">
                          {
                            user.email
                          }
                        </p>

                        <button
                          onClick={() => {

                            navigate('/profile')

                            setShowUserMenu(false)
                          }}
                          className="w-full text-left py-2 hover:text-red-400"
                        >
                          Editar perfil
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full text-left py-2 text-red-500"
                        >
                          Cerrar sesión
                        </button>

                      </div>
                    )
                  }

                </div>

              ) : (

                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-red-400 hover:bg-red-500 text-white px-5 py-2 rounded-full transition-all"
                >
                  Ingresar
                </button>

              )
            }

            
            {/* MOBILE BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl"
          >
            <FaBars />
          </button>

          </div>

        </div>
        {/* MOBILE MENU */}
        {
          menuOpen && (
            <div className="md:hidden bg-white px-6 pb-4">

              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
              >
                <p className="py-2">Inicio</p>
              </Link>

              <Link
                to="/recipes"
                onClick={() => setMenuOpen(false)}
              >
                <p className="py-2">Recetas</p>
              </Link>

              {user && (

                <Link
                  to="/favorites"
                  onClick={() => setMenuOpen(false)}
                >
                  <p className="py-2">
                    Favoritos
                  </p>
                </Link>

              )}

              {/* SEARCH MOBILE */}
              <form
                onSubmit={handleSearch}
                className="flex items-center bg-gray-100 rounded-full px-4 py-3 mt-4"
              >

                <input
                  type="text"
                  placeholder="Buscar recetas..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="bg-transparent outline-none flex-1"
                />

                <button type="submit">

                  <FaSearch className="text-gray-700" />

                </button>

              </form>

            </div>
          )
        }

      </nav>

     

          <LoginModal
          isOpen={showLogin}
          setIsOpen={setShowLogin}
        />

       

    </>
  )
}

export default Navbar