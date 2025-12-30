import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export const handler = async (event) => {
  // simple admin protection
  const adminKey = event.headers['x-admin-key']
  if (adminKey !== process.env.ADMIN_SECRET) {
    return { statusCode: 401, body: 'UNAUTHORIZED' }
  }

  // get grouped results
  const { data, error } = await supabase
    .from('votes')
    .select('barber_name, barber_id')

  if (error) {
    return { statusCode: 500, body: 'DB_ERROR' }
  }

  // count votes
  const results = {}
  data.forEach(v => {
    results[v.barber_name] = (results[v.barber_name] || 0) + 1
  })

  return {
    statusCode: 200,
    body: JSON.stringify(results)
  }
}
