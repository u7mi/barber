const { createClient } = require('@supabase/supabase-js')

exports.handler = async function (event, context) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  try {
    const { data, error } = await supabase
      .from('votes')
      .insert([{ voter_id: 'TEST123', barber_id: 1, barber_name: 'TEST' }])

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
