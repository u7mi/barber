const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

exports.handler = async function (event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch (err) {
    return { statusCode: 400, body: 'INVALID_JSON' }
  }

  const voter_id = body.voter_id
  const barber_id = body.barber_id
  const barber_name = body.barber_name || 'UNKNOWN'

  if (!voter_id || !barber_id) {
    return { statusCode: 400, body: 'INVALID_DATA' }
  }

  try {
    // Insert vote (DB should enforce one vote per voter_id if needed)
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

  } catch (err) {
    return {
      statusCode: 500,
      body: 'SERVER_ERROR'
    }
  }
}
