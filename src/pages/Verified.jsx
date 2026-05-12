import { useEffect } from 'react'
import { supabase } from '../assets/services/supabase'
import { useNavigate } from 'react-router-dom'

function Verified() {

  const navigate = useNavigate()

  useEffect(() => {

    async function verifyUser() {

      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) return

      await supabase.auth.updateUser({

        data: {

          ...user.user_metadata,
          manual_verified: true

        }

      })

      alert('Correo verificado correctamente')

      navigate('/profile')
    }

    verifyUser()

  }, [])

  return (

    <div className="min-h-screen flex items-center justify-center">

      <h1 className="text-3xl">
        Verificando correo...
      </h1>

    </div>
  )
}

export default Verified