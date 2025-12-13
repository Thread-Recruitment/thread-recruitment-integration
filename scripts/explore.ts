import { config } from 'dotenv'
config({ path: '.env.local' })

import { TeamTailorClient } from '../lib/teamtailor/client'

const client = new TeamTailorClient(process.env.TEAMTAILOR_API_KEY || '')

async function explore() {
  console.log('=== Exploring TeamTailor ===\n')

  // Fetch jobs
  console.log('--- Jobs ---')
  const jobsRes = await fetch('https://api.teamtailor.com/v1/jobs?page[size]=20', {
    headers: {
      Authorization: `Token token=${process.env.TEAMTAILOR_API_KEY}`,
      'X-Api-Version': '20161108',
    },
  })
  const jobsData = await jobsRes.json()

  for (const job of jobsData.data) {
    console.log(`\nJob ID: ${job.id}`)
    console.log(`  Title: ${job.attributes.title}`)
    console.log(`  Status: ${job.attributes.status}`)
    console.log(`  Created: ${job.attributes['created-at']}`)
  }

  // Pick first job to explore candidates
  if (jobsData.data.length > 0) {
    const jobId = jobsData.data[0].id
    console.log(`\n--- Candidates for Job ${jobId} ---`)

    const candidatesRes = await fetch(
      `https://api.teamtailor.com/v1/jobs/${jobId}/candidates?page[size]=10`,
      {
        headers: {
          Authorization: `Token token=${process.env.TEAMTAILOR_API_KEY}`,
          'X-Api-Version': '20161108',
        },
      }
    )
    const candidatesData = await candidatesRes.json()

    for (const candidate of candidatesData.data) {
      console.log(`\nCandidate ID: ${candidate.id}`)
      console.log(`  Name: ${candidate.attributes['first-name']} ${candidate.attributes['last-name']}`)
      console.log(`  Email: ${candidate.attributes.email}`)
    }
  }

  // Fetch users (for note creation)
  console.log('\n--- Users ---')
  const usersRes = await fetch('https://api.teamtailor.com/v1/users?page[size]=10', {
    headers: {
      Authorization: `Token token=${process.env.TEAMTAILOR_API_KEY}`,
      'X-Api-Version': '20161108',
    },
  })
  const usersData = await usersRes.json()

  for (const user of usersData.data) {
    console.log(`\nUser ID: ${user.id}`)
    console.log(`  Name: ${user.attributes.name}`)
    console.log(`  Email: ${user.attributes.email}`)
  }

  // Fetch custom fields
  console.log('\n--- Custom Fields ---')
  const fields = await client.getCustomFields()
  for (const field of fields.slice(0, 10)) {
    console.log(`\nField ID: ${field.id}`)
    console.log(`  Name: ${field.attributes.name}`)
    console.log(`  API Name: ${field.attributes['api-name']}`)
    console.log(`  Type: ${field.attributes['field-type']}`)
  }
  if (fields.length > 10) {
    console.log(`\n... and ${fields.length - 10} more custom fields`)
  }

  // Fetch interview kits
  console.log('\n--- Interview Kits ---')
  const kitsRes = await fetch('https://api.teamtailor.com/v1/interview-kits?page[size]=10', {
    headers: {
      Authorization: `Token token=${process.env.TEAMTAILOR_API_KEY}`,
      'X-Api-Version': '20161108',
    },
  })
  const kitsData = await kitsRes.json()

  for (const kit of kitsData.data) {
    console.log(`\nKit ID: ${kit.id}`)
    console.log(`  Name: ${kit.attributes.name}`)
  }
}

explore().catch(console.error)
