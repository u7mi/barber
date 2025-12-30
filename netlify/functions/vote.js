import { createClient } from '@supabase/supabase-js'

export const handler = async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  const { data, error } = await supabase
    .from('votes')
    .insert([{ voter_id: 'TEST123', barber_id: 1, barber_name: 'TEST' }])

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    }
  }

return {
statusCode: 200,
    body: 'FUNCTION_WORKS'
    body: 'INSERT_OK'
}
}
