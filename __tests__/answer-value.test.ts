import { describe, it, expect } from 'vitest'
import { parseAnswerValue } from '@/lib/sync'

describe('parseAnswerValue', () => {
  it('detects boolean true from "yes"', () => {
    expect(parseAnswerValue('yes')).toEqual({ boolean: true })
    expect(parseAnswerValue('Yes')).toEqual({ boolean: true })
    expect(parseAnswerValue('YES')).toEqual({ boolean: true })
  })

  it('detects boolean true from "true"', () => {
    expect(parseAnswerValue('true')).toEqual({ boolean: true })
    expect(parseAnswerValue('True')).toEqual({ boolean: true })
  })

  it('detects boolean false from "no"', () => {
    expect(parseAnswerValue('no')).toEqual({ boolean: false })
    expect(parseAnswerValue('No')).toEqual({ boolean: false })
    expect(parseAnswerValue('NO')).toEqual({ boolean: false })
  })

  it('detects boolean false from "false"', () => {
    expect(parseAnswerValue('false')).toEqual({ boolean: false })
    expect(parseAnswerValue('False')).toEqual({ boolean: false })
  })

  it('detects multiple choice IDs', () => {
    expect(parseAnswerValue('1,2,3')).toEqual({ choices: [1, 2, 3] })
    expect(parseAnswerValue('42,99')).toEqual({ choices: [42, 99] })
  })

  it('defaults single numbers to text (ambiguous)', () => {
    expect(parseAnswerValue('5')).toEqual({ text: '5' })
    expect(parseAnswerValue('1')).toEqual({ text: '1' })
  })

  it('returns text for regular strings', () => {
    expect(parseAnswerValue('Queenstown')).toEqual({ text: 'Queenstown' })
    expect(parseAnswerValue('3 years experience')).toEqual({ text: '3 years experience' })
  })

  it('returns text for mixed content', () => {
    expect(parseAnswerValue('yes please')).toEqual({ text: 'yes please' })
    expect(parseAnswerValue('no thanks')).toEqual({ text: 'no thanks' })
  })
})
