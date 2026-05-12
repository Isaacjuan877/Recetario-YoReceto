import { useState, useEffect } from 'react'
import { supabase } from '../assets/services/supabase'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
 useEffect(() => {

    supabase.auth.getSession()
      .then(({ data }) => {

        console.log(data.session)

      })

  }, [])

  const handleReset = async (e) => {

    e.preventDefault()

    setErrorMessage('')

    if (password.length < 6) {

      setErrorMessage(
        'La contraseña debe tener mínimo 6 caracteres'
      )

      return
    }
    if (password !== confirmPassword) {

      setErrorMessage(
        'Las contraseñas no coinciden'
      )

      return
    }
    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session) {

      setErrorMessage(
        'El enlace expiró o es inválido'
      )

      return
    }

    const { error } =
      await supabase.auth.updateUser({
        password
      })

    if (error) {

      setErrorMessage(error.message)

      return
    }

    alert('Contraseña actualizada')

    setPassword('')
    setConfirmPassword('')

    

    navigate('/')
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#f7f3ed] px-6">

      <form
        onSubmit={handleReset}
        className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md"
      >

        <h1 className="text-3xl mb-8">
          Nueva contraseña
        </h1>

        <div className="relative mb-2">

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className={`
              w-full border p-4 rounded-xl pr-12
              ${errorMessage ? 'border-red-500 border-2' : ''}
            `}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {
              showPassword
                ? <FaEyeSlash />
                : <FaEye />
            }
          </button>

        </div>
        <div className="relative mb-2">

          <input
            type={
              showConfirmPassword
                ? 'text'
                : 'password'
            }
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className={`
              w-full border p-4 rounded-xl pr-12
              ${errorMessage ? 'border-red-500 border-2' : ''}
            `}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {
              showConfirmPassword
                ? <FaEyeSlash />
                : <FaEye />
            }
          </button>

        </div>
        {
          errorMessage && (
            <p className="text-red-500 text-sm mb-4">
              {errorMessage}
            </p>
          )
        }

        <button
          type="submit"
          className="w-full bg-red-400 hover:bg-red-500 text-white py-4 rounded-xl"
        >
          Guardar contraseña
        </button>

      </form>

    </div>
  )
}

