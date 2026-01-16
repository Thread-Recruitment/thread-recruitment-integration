/**
 * Debug script to test the full sync flow for answers
 */
import { getClient } from './lib'

async function main() {
  const client = getClient()
  const candidateId = '166018750'
  const questionId = '3165763' // "Do you have permanent work rights?"

  console.log('\n=== Testing upsert flow for answers ===\n')

  // Step 1: Fetch existing answers
  console.log('Step 1: Fetching existing answers...')
  const existingAnswers = await client.getAnswersForCandidate(candidateId)
  console.log(`Found ${existingAnswers.length} existing answers`)

  // Step 2: Check if answer exists for this question
  console.log(`\nStep 2: Checking for existing answer to question ${questionId}...`)
  const existingAnswer = existingAnswers.find(
    (a) => a.relationships?.question?.data?.id === questionId
  )

  if (existingAnswer) {
    console.log(`Found existing answer: ${existingAnswer.id}`)
    console.log(`Current value:`, JSON.stringify(existingAnswer.attributes))

    // Step 3: Update the answer
    console.log('\nStep 3: Updating the answer to "Yes"...')
    const updatedAnswer = await client.updateAnswer(existingAnswer.id, { boolean: true })
    console.log(`Updated answer:`, JSON.stringify(updatedAnswer.attributes))
  } else {
    console.log('No existing answer found - this would create a new one')

    // Step 3: Create new answer
    console.log('\nStep 3: Creating new answer with value "Yes"...')
    const newAnswer = await client.createAnswer(candidateId, questionId, { boolean: true })
    console.log(`Created answer: ${newAnswer.id}`)
    console.log(`Attributes:`, JSON.stringify(newAnswer.attributes))
  }

  // Step 4: Verify
  console.log('\n=== Verification ===')
  const finalAnswers = await client.getAnswersForCandidate(candidateId)
  const finalAnswer = finalAnswers.find(
    (a) => a.relationships?.question?.data?.id === questionId
  )
  if (finalAnswer) {
    console.log(`Final answer ${finalAnswer.id}:`, JSON.stringify(finalAnswer.attributes))
  }
}

main().catch(console.error)
