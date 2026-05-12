import { useEffect, useState } from 'react'

import { supabase } from '../assets/services/supabase'

function EditProfile() {

    const [user, setUser] = useState(null)

    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [gender, setGender] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
 
    const [loading, setLoading] = useState(false)
    const [avatar, setAvatar] = useState('') 
    
  useEffect(() => {

    async function getUser() {

      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) return

      setUser(user)
      console.log(user)

      setName(
        user.user_metadata?.name || ''
        )

        setLastName(
        user.user_metadata?.last_name || ''
        )

        setGender(
        user.user_metadata?.gender || ''
        )

        setPhone(
        user.user_metadata?.phone || ''
        )

        setEmail(user.email || '')

        setAvatar(
          `https://i.pravatar.cc/150?img=${
            Math.floor(Math.random() * 70) + 1
          }`
        )
    }

    getUser()

  }, [])

  async function handleUpdate(e) {

    e.preventDefault()

    setLoading(true)

    const { error } =
        await supabase.auth.updateUser({

        email,

        data: {
            name,
            last_name: lastName,
            gender,
            phone
        }

        })

    setLoading(false)

    if (error) {

        alert(error.message)
        return
    }

    alert('Perfil actualizado')
  }
  
  return (

    <section className="min-h-screen bg-[#f7f3ed] py-28 px-6">

      <div className="max-w-2xl mx-auto bg-white rounded-[30px] p-10 shadow-xl">

        <h1 className="text-5xl font-light mb-10">
          Editar perfil
        </h1>
        

        <form
          onSubmit={handleUpdate}
          className="space-y-6"
        >

          <div className="flex flex-col items-center gap-4">

            <img
              src={
                avatar ||
                'https://i.pravatar.cc/150'
              }
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-red-300"
            />

          </div> 

        <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) =>
            setName(e.target.value)
            }
            className="w-full border rounded-2xl px-5 py-4"
        />

        <input
            type="text"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) =>
            setLastName(e.target.value)
            }
            className="w-full border rounded-2xl px-5 py-4"
        />

        <select
            value={gender}
            onChange={(e) =>
            setGender(e.target.value)
            }
            className="w-full border rounded-2xl px-5 py-4"
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

        <input
            type="tel"
            placeholder="Teléfono"
            value={phone}
            onChange={(e) =>
            setPhone(e.target.value)
            }
            className="w-full border rounded-2xl px-5 py-4"
        />

        <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) =>
            setEmail(e.target.value)
            }
            className="w-full border rounded-2xl px-5 py-4"
        />

        <button
            type="submit"
            disabled={loading}
            className="bg-red-400 hover:bg-red-500 text-white px-8 py-4 rounded-full"
        >

            {
            loading
                ? 'Guardando...'
                : 'Guardar cambios'
            }

        </button>

          

        </form>

      </div>

    </section>
  )
}

export default EditProfile