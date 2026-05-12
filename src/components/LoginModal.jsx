import { FaBars } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { useState, useEffect } from 'react'
import { supabase } from '../assets/services/supabase'
function LoginModal({ isOpen, setIsOpen }) {

  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('')

  const handleRegister = async (e) => {

    e.preventDefault()

    if (password !== confirmPassword) {

      alert('Las contraseñas no coinciden')

      return
    }

    const { error } =
      await supabase.auth.signUp({

        email,
        password,

        options: {

          data: {

            name,
            last_name: lastName,
            gender,
            phone

          }
        }
      })

    if (error) {

      alert(error.message)

      return
    }

    alert('Cuenta creada')

    setName('')
    setLastName('')
    setGender('')
    setPhone('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  const handleLogin = async (e) => {

    e.preventDefault()

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })

    if (error) {
      alert(error.message)
      return
    }

    alert('Login exitoso')
    setName('')
    setEmail('')
    setPassword('')
    setIsOpen(false)
    
  }
  const handleForgotPassword = async () => {

    if (!email) {

      alert('Escribe tu correo')

      return
    }

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            `${window.location.origin}/reset-password`
        }
      )

    if (error) {

      alert(error.message)

      return
    }

    alert(
      'Te enviamos un correo para recuperar tu contraseña'
    )
  }
  
  useEffect(() => {

    const { data: authListener } =
      supabase.auth.onAuthStateChange(
        (event) => {

          console.log(event)

        }
      )

    return () => {
      authListener.subscription.unsubscribe()
    }

  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">

      <div className="relative bg-white rounded-2xl overflow-y-auto max-h-[95vh] max-w-3xl w-full shadow-2xl grid md:grid-cols-2">

        {/* BOTÓN CERRAR */}
        <button
        type='button'
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-3xl"
        >
          <IoClose />
        </button>

        {/* IZQUIERDA */}
        <div className="bg-[#ef8d84] p-6 md:p-10 text-white flex flex-col justify-center">

          <h2 className="text-3xl font-semibold mb-8">
            {
              isRegister
                ? 'Crear Cuenta'
                : 'Iniciar Sesión'
            }
          </h2>

          <form className="space-y-5"  
          onSubmit={
            isRegister
              ? handleRegister
              : handleLogin
          }>
            {
              isRegister && (

                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg outline-none bg-white text-black"
                />
                

              )
            }
            {
              isRegister && (

                <input
                  type="text"
                  placeholder="Apellido"
                  value={lastName}
                  onChange={(e) =>
                    setLastName(e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg outline-none bg-white text-black"
                />

              )
            }

            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg outline-none bg-white text-black"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg outline-none bg-white text-black"
            />
            {
              isRegister && (

                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg outline-none bg-white text-black"
                />

              )
            }

            {
              isRegister && (

                <select
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg outline-none bg-white text-black"
                >

                  <option value="">
                    Género
                  </option>

                  <option value="Masculino">
                    Masculino
                  </option>

                  <option value="Femenino">
                    Femenino
                  </option>

                  <option value="Otro">
                    Otro
                  </option>

                </select>

              )
            }
            {
              isRegister && (

                <input
                  type="tel"
                  placeholder="Teléfono"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg outline-none bg-white text-black"
                />

              )
            }

            <div className="text-right">
              <button
                type="button"
                className="text-sm hover:underline"
                onClick={handleForgotPassword}
              >
                {
                  isRegister
                    ? ''
                    : 'Olvide mi contraseña'
                }
              </button>
            </div>

            <button
              type="submit"
              
              
              className="w-full bg-white text-[#ef8d84] py-3 rounded-full font-semibold hover:bg-gray-100 transition-all"
            >
              {
                isRegister
                  ? 'Crear Cuenta' 
                  : 'Ingresar'

                  
              }
            </button>

          </form>

          <div className="mt-8 text-center">
            <p className="mb-4">
              o
            </p>

            <button
            type='button'
              onClick={() =>
                setIsRegister(!isRegister)
              }
              className="hover:underline"
            >

              {
                isRegister
                  ? 'Ya tengo cuenta'
                  : 'Crear una cuenta'
              }

            </button>
          </div>

        </div>

        {/* DERECHA */}
        <div className="hidden md:flex p-10 flex-col justify-center items-center">

          <div className="text-center mb-10">

            <div className="w-24 h-24 rounded-full bg-[#ef8d84] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              LOGO
            </div>

            <p className="text-gray-500">
              Bienvenido al recetario Yo Receto
            </p>

          </div>

          

        </div>

      </div>

    </div>
  )
}

export default LoginModal