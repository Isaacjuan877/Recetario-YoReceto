import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {

  // PRE-FLIGHT
  if (req.method === 'OPTIONS') {

    return new Response('ok', {
      headers: corsHeaders
    })
  }

  try {

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const authHeader =
      req.headers.get('Authorization')

    if (!authHeader) {

      return new Response(
        JSON.stringify({
          error: 'No autorizado'
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // CLIENTE USER
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    )

    const {
      data: { user }
    } = await userClient.auth.getUser()

    if (!user) {

      return new Response(
        JSON.stringify({
          error: 'Usuario no encontrado'
        }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // BORRAR FAVORITOS
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)

    // BORRAR PERFIL
    await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)

    // BORRAR AUTH USER
    const { error } =
      await supabase.auth.admin.deleteUser(
        user.id
      )

    if (error) throw error

    return new Response(
      JSON.stringify({
        success: true
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {

    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})