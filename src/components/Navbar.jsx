import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useState } from 'react'

import LoginModal from './LoginModal'

function Navbar() {

  const [showLogin, setShowLogin] =
    useState(false)

  return (
    <>

      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div className="text-3xl font-bold text-red-400">
            RECETARIO
          </div>

          <ul className="hidden md:flex gap-10 text-gray-700">
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

            <li className="hover:text-red-400 cursor-pointer transition-all">
              Favoritos
            </li>

          </ul>

          <div className="flex items-center gap-5">

            <button
              onClick={() => setShowLogin(true)}
              className="bg-red-400 hover:bg-red-500 text-white px-5 py-2 rounded-full transition-all"
            >
              Ingresar
            </button>

            <FaSearch className="text-gray-700" />

          </div>

        </div>

      </nav>

      {
        showLogin && (

          <LoginModal
            onClose={() => setShowLogin(false)}
          />

        )
      }

    </>
  )
}

export default Navbar