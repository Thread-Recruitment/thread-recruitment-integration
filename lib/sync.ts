import { log } from './logger'
import { teamtailor } from './teamtailor/client'
import { SyncError } from './errors'
import type { ParsedFields, SyncReport, FieldResult, FieldStatus } from '@/types'
import type { AnswerValue, QuestionType, CustomFieldType } from './teamtailor/types'

// Default user ID for notes - should be configured per deployment
const DEFAULT_NOTE_USER_ID = process.env.TEAMTAILOR_NOTE_USER_ID || '1'

/**
 * Convert a string value to boolean based on common truthy values
 */
function parseBoolean(value: string): boolean {
  const lower = value.toLowerCase().trim()
  return ['yes', 'true', '1', 'on'].includes(lower)
}

/**
 * Convert a string value to AnswerValue based on the question type from TeamTailor
 */
export function convertAnswerValue(value: string, questionType: QuestionType): AnswerValue {
  switch (questionType) {
    case 'Boolean':
      return { boolean: parseBoolean(value) }

    case 'Number':
    case 'Range': {
      const num = parseFloat(value)
      if (!isNaN(num)) {
        return { range: num }
      }
      // Fallback to text if not a valid number
      log.warn('Could not parse number for Range question, using text', { value })
      return { text: value }
    }

    case 'Choice': {
      // Choice expects array of choice IDs (numbers)
      if (/^\d+(,\d+)*$/.test(value.trim())) {
        const choices = value.split(',').map((n) => parseInt(n.trim(), 10))
        return { choices }
      }
      // Single number could be a choice ID
      const singleChoice = parseInt(value, 10)
      if (!isNaN(singleChoice)) {
        return { choices: [singleChoice] }
      }
      // Fallback to text
      return { text: value }
    }

    case 'Text':
    case 'Video':
    default:
      return { text: value }
  }
}

/**
 * Legacy function for backward compatibility - guesses type from value
 * @deprecated Use convertAnswerValue with question type instead
 */
export function parseAnswerValue(value: string): AnswerValue {
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
      return { text: value }
    }
    return { choices }
  }

  // Default to text
  return { text: value }
}

/**
 * Convert a string value to the appropriate format for a custom field
 */
export function convertCustomFieldValue(value: string, fieldType: CustomFieldType): string {
  switch (fieldType) {
    case 'CustomField::Checkbox':
      return parseBoolean(value) ? 'true' : 'false'

    case 'CustomField::Number': {
      const num = parseFloat(value)
      return isNaN(num) ? value : String(num)
    }

    case 'CustomField::Text':
    case 'CustomField::Url':
    case 'CustomField::Date':
    case 'CustomField::Select':
    case 'CustomField::MultiSelect':
    default:
      return value
  }
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

    // Step 2: Create or find existing job application
    log.info('Creating job application', { candidate_id: report.candidateId, job_id: jobId })

    try {
      // Check if job application already exists
      const existingApplications = await teamtailor.getJobApplicationsForCandidate(report.candidateId)
      const existingApplication = existingApplications.find(
        (app) => app.relationships?.job?.data?.id === jobId
      )

      if (existingApplication) {
        report.jobApplication = 'already_exists'
        log.info('Job application already exists', { application_id: existingApplication.id })
      } else {
        await teamtailor.createJobApplication(report.candidateId, jobId)
        report.jobApplication = 'success'
        log.info('Job application created')
      }
    } catch (error) {
      report.jobApplication = 'failed'
      log.warn('Job application creation failed', {
        error: error instanceof Error ? error.message : error
      })
    }

    // Step 3: Create or update answers
    // Fetch existing answers once to avoid multiple API calls
    const existingAnswers = await teamtailor.getAnswersForCandidate(report.candidateId)

    for (const answer of fields.answers) {
      log.info('Processing answer', {
        candidate_id: report.candidateId,
        question_id: answer.questionId,
      })

      const result: FieldResult = {
        field: answer.questionId,
        value: answer.value,
        status: 'failed',
      }

      try {
        // Fetch question to get its type for proper conversion
        const question = await teamtailor.getQuestionById(answer.questionId)

        let answerValue: AnswerValue
        if (question) {
          answerValue = convertAnswerValue(answer.value, question.attributes['question-type'])
          log.info('Converting answer', {
            question_id: answer.questionId,
            question_type: question.attributes['question-type'],
            raw_value: answer.value,
          })
        } else {
          // Fallback to legacy parsing if question not found
          answerValue = parseAnswerValue(answer.value)
          log.warn('Question not found, using legacy parsing', { question_id: answer.questionId })
        }

        // Check if an answer already exists for this question
        const existingAnswer = existingAnswers.find(
          (a) => a.relationships?.question?.data?.id === answer.questionId
        )

        if (existingAnswer) {
          // Update existing answer
          await teamtailor.updateAnswer(existingAnswer.id, answerValue)
          result.status = 'updated'
          log.info('Answer updated', { question_id: answer.questionId, answer_id: existingAnswer.id })
        } else {
          // Create new answer
          await teamtailor.createAnswer(report.candidateId, answer.questionId, answerValue)
          result.status = 'success'
          log.info('Answer created', { question_id: answer.questionId })
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        result.error = errorMsg
        log.error('Failed to process answer', {
          question_id: answer.questionId,
          error: errorMsg,
        })
      }

      report.answers.push(result)
    }

    // Step 4: Create or update custom field values
    // Fetch existing custom field values once to avoid multiple API calls
    const existingCustomFieldValues = await teamtailor.getCustomFieldValuesForCandidate(report.candidateId)

    for (const customField of fields.customFields) {
      log.info('Processing custom field value', {
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
          // Convert value based on field type
          const convertedValue = convertCustomFieldValue(
            customField.value,
            field.attributes['field-type']
          )
          log.info('Converting custom field', {
            api_name: customField.apiName,
            field_type: field.attributes['field-type'],
            raw_value: customField.value,
            converted_value: convertedValue,
          })

          // Check if a value already exists for this custom field
          const existingValue = existingCustomFieldValues.find(
            (v) => v.relationships?.['custom-field']?.data?.id === field.id
          )

          if (existingValue) {
            // Update existing value
            await teamtailor.updateCustomFieldValue(existingValue.id, convertedValue)
            result.status = 'updated'
            log.info('Custom field value updated', { api_name: customField.apiName, value_id: existingValue.id })
          } else {
            // Create new value
            await teamtailor.createCustomFieldValue(
              report.candidateId,
              field.id,
              convertedValue
            )
            result.status = 'success'
            log.info('Custom field value created', { api_name: customField.apiName })
          }
        } else {
          result.status = 'not_found'
          result.error = 'Custom field not found'
          log.warn('Custom field not found', { api_name: customField.apiName })
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        result.error = errorMsg
        log.error('Failed to process custom field value', {
          api_name: customField.apiName,
          error: errorMsg,
        })
      }

      report.customFields.push(result)
    }

    // Step 5: Create note if provided (notes are a timeline, always add new entry)
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
