import type { ParsedFields } from '@/types'

/**
 * Normalize any ManyChat value to a string.
 * ManyChat can send: Text, Number, Date, DateTime, Boolean, Array
 */
function normalizeValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (Array.isArray(value)) return value.map(v => normalizeValue(v)).join(',')
  return String(value)
}

export function parseManyChatFields(
  body: Record<string, unknown>
): ParsedFields {
  const candidate: ParsedFields['candidate'] = {
    email: '',
  }
  const answers: ParsedFields['answers'] = []
  const customFields: ParsedFields['customFields'] = []
  let notes: string | undefined

  for (const [key, value] of Object.entries(body)) {
    if (!key.startsWith('tt_') || value === undefined || value === null) {
      continue
    }

    const strValue = normalizeValue(value)

    // Standard candidate fields
    if (key === 'tt_first_name') {
      candidate.firstName = strValue
    } else if (key === 'tt_last_name') {
      candidate.lastName = strValue
    } else if (key === 'tt_email') {
      candidate.email = strValue
    } else if (key === 'tt_phone') {
      candidate.phone = strValue
    } else if (key === 'tt_tags') {
      candidate.tags = strValue
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    } else if (key === 'tt_notes') {
      notes = strValue
    }
    // Answer fields: tt_answer_{questionId}
    else if (key.startsWith('tt_answer_')) {
      const questionId = key.replace('tt_answer_', '')
      if (questionId) {
        answers.push({ questionId, value: strValue })
      }
    }
    // Custom field values: tt_custom_{apiName}
    else if (key.startsWith('tt_custom_')) {
      const apiName = key.replace('tt_custom_', '')
      if (apiName) {
        customFields.push({ apiName, value: strValue })
      }
    }
  }

  // Validate required fields
  if (!candidate.email) {
    throw new Error('Missing required field: tt_email')
  }

  return {
    candidate,
    answers,
    customFields,
    notes,
  }
}
