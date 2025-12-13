import { config } from 'dotenv'
config({ path: '.env.local' })

const candidateId = process.argv[2]

if (!candidateId) {
  console.error('Usage: npx tsx scripts/test-get-candidate.ts <candidate_id>')
  process.exit(1)
}

async function main() {
  const res = await fetch(`https://api.teamtailor.com/v1/candidates/${candidateId}`, {
    headers: {
      Authorization: `Token token=${process.env.TEAMTAILOR_API_KEY}`,
      'X-Api-Version': '20161108',
    },
  })

  if (!res.ok) {
    console.error(`Error: ${res.status} ${res.statusText}`)
    process.exit(1)
  }

  const data = await res.json()
  const c = data.data

  console.log('\n=== Candidate ===\n')
  console.log(`ID: ${c.id}`)
  console.log(`Name: ${c.attributes['first-name']} ${c.attributes['last-name']}`)
  console.log(`Email: ${c.attributes.email}`)
  console.log(`Phone: ${c.attributes.phone}`)
  console.log(`Tags: ${c.attributes.tags?.join(', ') || 'none'}`)
  console.log(`Created: ${c.attributes['created-at']}`)
  console.log('')
}

main().catch(console.error)
