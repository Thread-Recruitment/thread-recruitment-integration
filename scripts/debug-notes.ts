import { getClient } from './lib'

async function main() {
  const client = getClient()
  
  // Candidate ID from the test
  const candidateId = '163897097'
  
  console.log('Fetching notes for candidate:', candidateId)
  const notes = await client.getNotesForCandidate(candidateId)
  
  console.log('\nNotes count:', notes.length)
  console.log('\nRaw notes data:')
  console.log(JSON.stringify(notes, null, 2))
}

main().catch(console.error)
