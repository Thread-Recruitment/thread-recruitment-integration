// TeamTailor API Types (JSON:API format)

export interface Candidate {
  id: string
  type: 'candidates'
  attributes: {
    'first-name': string
    'last-name': string
    email: string
    phone?: string
    tags?: string[]
  }
}

export interface CandidateInput {
  firstName: string
  lastName: string
  email: string
  phone?: string
  tags?: string[]
}

export interface JobApplication {
  id: string
  type: 'job-applications'
}

export interface Answer {
  id: string
  type: 'answers'
}

export type AnswerValue =
  | { text: string }
  | { boolean: boolean }
  | { choices: number[] }
  | { range: number }

export interface Question {
  id: string
  type: 'questions'
  attributes: {
    title: string
    'question-type': 'text' | 'boolean' | 'choice' | 'range'
  }
}

export interface CustomField {
  id: string
  type: 'custom-fields'
  attributes: {
    'api-name': string
    name: string
    'field-type': string
  }
}

export interface CustomFieldValue {
  id: string
  type: 'custom-field-values'
}

export interface Note {
  id: string
  type: 'notes'
}

export interface Job {
  id: string
  type: 'jobs'
  attributes: {
    title: string
  }
}

export interface JobWithQuestions extends Job {
  relationships: {
    questions: {
      data: Array<{ id: string; type: 'questions' }>
    }
  }
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T
  included?: unknown[]
}

export interface ApiListResponse<T> {
  data: T[]
  included?: unknown[]
  meta?: {
    'record-count': number
    'page-count': number
  }
  links?: {
    first?: string
    prev?: string
    next?: string
    last?: string
  }
}
