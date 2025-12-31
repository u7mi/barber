import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export const handler = async (event) => {
  // Allow CORS for frontend access
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    // Get all votes with barber info
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('barber_id, barber_name')

    if (votesError) {
      console.error('Votes error:', votesError)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to fetch votes' })
      }
    }

    // Get all barbers
    const { data: barbers, error: barbersError } = await supabase
      .from('barbers')
      .select('*')

    if (barbersError) {
      console.error('Barbers error:', barbersError)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to fetch barbers' })
      }
    }

    // Count votes per barber
    const voteCounts = {}
    votes.forEach(vote => {
      voteCounts[vote.barber_id] = (voteCounts[vote.barber_id] || 0) + 1
    })

    // Combine barber info with vote counts
    const results = barbers.map(barber => ({
      id: barber.id,
      name: barber.name,
      image: barber.image,
      votes: voteCounts[barber.id] || 0
    }))

    // Sort by votes (highest first)
    results.sort((a, b) => b.votes - a.votes)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results)
    }

  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}