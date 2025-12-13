import { log } from './logger'
import { teamtailor } from './teamtailor/client'
import { SyncError } from './errors'
import type { ParsedFields, SyncReport, FieldResult, FieldStatus } from '@/types'
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
): Promise<SyncReport> {
  const report: SyncReport = {
    success: false,
    email: fields.candidate.email,
    jobId,
    candidate: 'failed',
    jobApplication: 'skipped',
    answers: [],
    customFields: [],
    notes: fields.notes ? 'skipped' : null,
  }

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

    report.candidateId = candidate.id
    report.candidate = 'success'
    log.info('Candidate created', { candidate_id: report.candidateId })

    // Step 2: Create job application
    log.info('Creating job application', { candidate_id: report.candidateId, job_id: jobId })

    try {
      await teamtailor.createJobApplication(report.candidateId, jobId)
      report.jobApplication = 'success'
      log.info('Job application created')
    } catch (error) {
      // Job application might already exist if candidate was merged
      report.jobApplication = 'failed'
      log.warn('Job application creation failed (may already exist)', {
        error: error instanceof Error ? error.message : error
      })
    }

    // Step 3: Create answers
    for (const answer of fields.answers) {
      log.info('Creating answer', {
        candidate_id: report.candidateId,
        question_id: answer.questionId,
      })

      const result: FieldResult = {
        field: answer.questionId,
        value: answer.value,
        status: 'failed',
      }

      try {
        const answerValue = parseAnswerValue(answer.value)
        await teamtailor.createAnswer(report.candidateId, answer.questionId, answerValue)
        result.status = 'success'
        log.info('Answer created', { question_id: answer.questionId })
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        result.error = errorMsg
        log.error('Failed to create answer', {
          question_id: answer.questionId,
          error: errorMsg,
        })
      }

      report.answers.push(result)
    }

    // Step 4: Create custom field values
    for (const customField of fields.customFields) {
      log.info('Creating custom field value', {
        candidate_id: report.candidateId,
        api_name: customField.apiName,
      })

      const result: FieldResult = {
        field: customField.apiName,
        value: customField.value,
        status: 'failed',
      }

      try {
        // Look up the custom field ID by api-name
        const field = await teamtailor.getCustomFieldByApiName(customField.apiName)

        if (field) {
          await teamtailor.createCustomFieldValue(
            report.candidateId,
            field.id,
            customField.value
          )
          result.status = 'success'
          log.info('Custom field value created', { api_name: customField.apiName })
        } else {
          result.status = 'not_found'
          result.error = 'Custom field not found'
          log.warn('Custom field not found', { api_name: customField.apiName })
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        result.error = errorMsg
        log.error('Failed to create custom field value', {
          api_name: customField.apiName,
          error: errorMsg,
        })
      }

      report.customFields.push(result)
    }

    // Step 5: Create note if provided
    if (fields.notes) {
      log.info('Creating note', { candidate_id: report.candidateId })

      try {
        await teamtailor.createNote(report.candidateId, DEFAULT_NOTE_USER_ID, fields.notes)
        report.notes = 'success'
        log.info('Note created')
      } catch (error) {
        report.notes = 'failed'
        log.error('Failed to create note', {
          error: error instanceof Error ? error.message : error
        })
      }
    }

    report.success = true
    return report
  } catch (error) {
    const step = report.candidateId ? 'post_candidate' : 'create_candidate'
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'

    log.error('Sync failed', {
      step,
      email: fields.candidate.email,
      candidate_id: report.candidateId,
      error: errorMsg,
    })

    report.error = errorMsg
    return report
  }
}
