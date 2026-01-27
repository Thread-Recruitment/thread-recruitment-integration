import { describe, it, expect } from 'vitest'
import { parseManyChatFields } from '@/lib/parse'

describe('parseManyChatFields', () => {
  it('extracts all standard candidate fields', () => {
    const result = parseManyChatFields({
      tt_first_name: 'John',
      tt_last_name: 'Doe',
      tt_email: 'john@example.com',
      tt_phone: '+64211234567',
    })

    expect(result.candidate).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+64211234567',
    })
  })

  it('handles comma-separated tags', () => {
    const result = parseManyChatFields({
      tt_email: 'test@example.com',
      tt_tags: 'ManyChat, Summer2025, Test',
    })

    expect(result.candidate.tags).toEqual(['ManyChat', 'Summer2025', 'Test'])
  })

  it('extracts answer fields', () => {
    const result = parseManyChatFields({
      tt_email: 'test@example.com',
      tt_answer_123: 'Yes',
      tt_answer_456: 'Queenstown',
    })

    expect(result.answers).toEqual([
      { questionId: '123', value: 'Yes' },
      { questionId: '456', value: 'Queenstown' },
    ])
  })

  it('extracts custom field values', () => {
    const result = parseManyChatFields({
      tt_email: 'test@example.com',
      tt_custom_source: 'Instagram',
      tt_custom_region: 'Auckland',
    })

    expect(result.customFields).toEqual([
      { apiName: 'source', value: 'Instagram' },
      { apiName: 'region', value: 'Auckland' },
    ])
  })

  it('extracts notes', () => {
    const result = parseManyChatFields({
      tt_email: 'test@example.com',
      tt_notes: 'Screening summary here',
    })

    expect(result.notes).toBe('Screening summary here')
  })

  it('ignores non-tt_ prefixed fields', () => {
    const result = parseManyChatFields({
      tt_email: 'test@example.com',
      random_field: 'ignored',
      first_name: 'also ignored',
    })

    expect(result.candidate.firstName).toBeUndefined()
    expect(result.answers).toEqual([])
    expect(result.customFields).toEqual([])
  })

  it('throws on missing email', () => {
    expect(() =>
      parseManyChatFields({
        tt_first_name: 'John',
        tt_last_name: 'Doe',
      })
    ).toThrow('Missing required field: tt_email')
  })

  it('handles empty optional fields gracefully', () => {
    const result = parseManyChatFields({
      tt_email: 'test@example.com',
    })

    expect(result.candidate.firstName).toBeUndefined()
    expect(result.candidate.lastName).toBeUndefined()
    expect(result.candidate.phone).toBeUndefined()
    expect(result.candidate.tags).toBeUndefined()
    expect(result.notes).toBeUndefined()
  })

  it('sanitizes email by trimming whitespace and trailing periods', () => {
    expect(
      parseManyChatFields({ tt_email: 'test@example.com.' }).candidate.email
    ).toBe('test@example.com')

    expect(
      parseManyChatFields({ tt_email: 'test@example.com..' }).candidate.email
    ).toBe('test@example.com')

    expect(
      parseManyChatFields({ tt_email: '  test@example.com  ' }).candidate.email
    ).toBe('test@example.com')

    expect(
      parseManyChatFields({ tt_email: '  test@example.com. ' }).candidate.email
    ).toBe('test@example.com')
  })
})
