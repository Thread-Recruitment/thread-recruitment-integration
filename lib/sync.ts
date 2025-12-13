import { log } from './logger'
import { teamtailor } from './teamtailor/client'
import { SyncError } from './errors'
import type { ParsedFields, SyncResult } from '@/types'
import type { AnswerValue } from './teamtailor/types'

// Default user ID for notes - should be configured per deployment
const DEFAULT_NOTE_USER_ID = process.env.TEAMTAILOR_NOTE_USER_ID || '1'

export function parseAnswerValue(value: string): AnswerValue {
  // Try to detect the answer type from the value
  const lowerValue = value.toLowerCase()

  // Boolean detection
  if (lowerValue === 'yes' || lowerValue === 'true') {
    return { boolean: true }
  }
  if (lowerValue === 'no' || lowerValue === 'false') {
    return { boolean: false }
  }

  // Choice IDs (comma-separated numbers)
  if (/^\d+(,\d+)*$/.test(value)) {
    const choices = value.split(',').map((n) => parseInt(n.trim(), 10))
    if (choices.length === 1) {
      // Could be range or single choice - default to text for safety
      return { text: value }
    }
    return { choices }
  }

  // Range detection (single number that looks like a rating)
  const numValue = parseInt(value, 10)
  if (!isNaN(numValue) && numValue >= 1 && numValue <= 10 && value === String(numValue)) {
    // Ambiguous - could be range or text. Default to text for safety
    return { text: value }
  }

  // Default to text
  return { text: value }
}

export async function syncCandidate(
  fields: ParsedFields,
  jobId: string
): Promise<SyncResult> {
  let candidateId: string | undefined

  try {
    // Step 1: Create/merge candidate
    log.info('Creating candidate', { email: fields.candidate.email })

    const candidate = await teamtailor.createCandidate({
      firstName: fields.candidate.firstName || '',
      lastName: fields.candidate.lastName || '',
      email: fields.candidate.email,
      phone: fields.candidate.phone,
      tags: fields.candidate.tags,
    })

    candidateId = candidate.id
    log.info('Candidate created', { candidate_id: candidateId })

    // Step 2: Create job application
    log.info('Creating job application', { candidate_id: candidateId, job_id: jobId })

    try {
      await teamtailor.createJobApplication(candidateId, jobId)
      log.info('Job application created')
    } catch (error) {
      // Job application might already exist if candidate was merged
      log.warn('Job application creation failed (may already exist)', {
        error: error instanceof Error ? error.message : error
      })
    }

    // Step 3: Create answers
    for (const answer of fields.answers) {
      log.info('Creating answer', {
        candidate_id: candidateId,
        question_id: answer.questionId,
      })

      try {
        const answerValue = parseAnswerValue(answer.value)
        await teamtailor.createAnswer(candidateId, answer.questionId, answerValue)
        log.info('Answer created', { question_id: answer.questionId })
      } catch (error) {
        log.error('Failed to create answer', {
          question_id: answer.questionId,
          error: error instanceof Error ? error.message : error,
        })
        // Continue with other answers
      }
    }

    // Step 4: Create custom field values
    for (const customField of fields.customFields) {
      log.info('Creating custom field value', {
        candidate_id: candidateId,
        api_name: customField.apiName,
      })

      try {
        // Look up the custom field ID by api-name
        const field = await teamtailor.getCustomFieldByApiName(customField.apiName)

        if (field) {
          await teamtailor.createCustomFieldValue(
            candidateId,
            field.id,
            customField.value
          )
          log.info('Custom field value created', { api_name: customField.apiName })
        } else {
          log.warn('Custom field not found', { api_name: customField.apiName })
        }
      } catch (error) {
        log.error('Failed to create custom field value', {
          api_name: customField.apiName,
          error: error instanceof Error ? error.message : error,
        })
        // Continue with other custom fields
      }
    }

    // Step 5: Create note if provided
    if (fields.notes) {
      log.info('Creating note', { candidate_id: candidateId })

      try {
        await teamtailor.createNote(candidateId, DEFAULT_NOTE_USER_ID, fields.notes)
        log.info('Note created')
      } catch (error) {
        log.error('Failed to create note', {
          error: error instanceof Error ? error.message : error
        })
        // Non-critical, continue
      }
    }

    return {
      success: true,
      candidateId,
    }
  } catch (error) {
    const step = candidateId ? 'post_candidate' : 'create_candidate'

    log.error('Sync failed', {
      step,
      email: fields.candidate.email,
      candidate_id: candidateId,
      error: error instanceof Error ? error.message : error,
    })

    if (error instanceof SyncError) {
      return {
        success: false,
        candidateId,
        error: error.message,
      }
    }

    return {
      success: false,
      candidateId,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
