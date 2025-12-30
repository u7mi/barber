import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const body = JSON.parse(event.body)
  const voter_id = body.voter_id
  const barber_id = body.barber_id
  const barber_name = body.barber_name

  if (!voter_id || !barber_id) {
    return { statusCode: 400, body: 'INVALID_DATA' }
  }

  // one vote only (DB enforces this)
  const { error } = await supabase
    .from('votes')
    .insert([{ voter_id, barber_id, barber_name }])

  if (error) {
    return {
      statusCode: 403,
      body: 'ALREADY_VOTED'
    }
  }

  return {
    statusCode: 200,
    body: 'VOTE_OK'
  }
}
