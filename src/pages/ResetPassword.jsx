import { useState } from 'react'
import { supabase } from '../assets/services/supabase'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword() {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')

  const handleReset = async (e) => {

    e.preventDefault()

    const { error } =
      await supabase.auth.updateUser({
        password
      })

    if (error) {

      alert(error.message)

      return
    }

    alert('Contraseña actualizada')
    await supabase.auth.signOut()

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

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-4 rounded-xl mb-6"
        />

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

