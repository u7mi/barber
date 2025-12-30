const { createClient } = require('@supabase/supabase-js')

exports.handler = async function (event, context) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  try {
    // Parse request body if sent via POST
    let body = {}
    if (event.body) {
      body = JSON.parse(event.body)
    }

    const voter_id = body.voter_id || 'TEST123'
    const barber_id = body.barber_id || 1
    const barber_name = body.barber_name || 'TEST'

    // Insert vote (no created_at column anymore)
    const { data, error } = await supabase
      .from('votes')
      .insert([{
        voter_id,
        barber_id,
        barber_name
      }])

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'INSERT_OK', data })
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    }
  }
}
