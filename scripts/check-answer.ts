/**
 * Simple check of answer state
 */
import { getClient } from './lib'

async function main() {
  const client = getClient()

  // Directly fetch the answer
  const response = await fetch('https://api.teamtailor.com/v1/answers/647014857', {
    headers: {
      Authorization: `Token token=${process.env.TEAMTAILOR_API_KEY}`,
      'X-Api-Version': '20161108',
      'Content-Type': 'application/vnd.api+json',
    },
  })
  const data = await response.json()
  console.log('Direct fetch - answer:', data.data?.attributes?.answer)
  console.log('Direct fetch - boolean:', data.data?.attributes?.boolean)

  // Also check via client's candidate answers
  const answers = await client.getAnswersForCandidate('166018750')
  const answer = answers.find(a => a.id === '647014857')
  console.log('\nClient fetch - answer:', answer?.attributes?.answer)
  console.log('Client fetch - boolean:', answer?.attributes?.boolean)
}

main().catch(console.error)
