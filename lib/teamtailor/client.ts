import type {
  Candidate,
  CandidateInput,
  JobApplication,
  Answer,
  AnswerValue,
  CustomFieldValue,
  Note,
  Job,
  JobWithQuestions,
  Question,
  CustomField,
  ApiResponse,
  ApiListResponse,
} from './types'

class TeamTailorClient {
  private baseUrl = 'https://api.teamtailor.com/v1'
  private headers: HeadersInit

  constructor(apiKey: string) {
    this.headers = {
      Authorization: `Token token=${apiKey}`,
      'X-Api-Version': '20161108',
      'Content-Type': 'application/vnd.api+json',
    }
  }

  private async request<T>(
    method: string,
    path: string,
    body?: object
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`

    console.log('TeamTailor API request', { method, path })

    const response = await fetch(url, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('TeamTailor API error', {
        status: response.status,
        path,
        body: errorBody,
      })
      throw new Error(
        `TeamTailor API error: ${response.status} ${response.statusText}`
      )
    }

    return response.json()
  }

  async createCandidate(data: CandidateInput): Promise<Candidate> {
    const payload = {
      data: {
        type: 'candidates',
        attributes: {
          'first-name': data.firstName,
          'last-name': data.lastName,
          email: data.email,
          phone: data.phone,
          tags: data.tags,
          merge: true,
        },
      },
    }

    const response = await this.request<ApiResponse<Candidate>>(
      'POST',
      '/candidates',
      payload
    )
    return response.data
  }

  async createJobApplication(
    candidateId: string,
    jobId: string
  ): Promise<JobApplication> {
    const payload = {
      data: {
        type: 'job-applications',
        relationships: {
          candidate: { data: { type: 'candidates', id: candidateId } },
          job: { data: { type: 'jobs', id: jobId } },
        },
      },
    }

    const response = await this.request<ApiResponse<JobApplication>>(
      'POST',
      '/job-applications',
      payload
    )
    return response.data
  }

  async createAnswer(
    candidateId: string,
    questionId: string,
    value: AnswerValue
  ): Promise<Answer> {
    const payload = {
      data: {
        type: 'answers',
        attributes: value,
        relationships: {
          candidate: { data: { type: 'candidates', id: candidateId } },
          question: { data: { type: 'questions', id: questionId } },
        },
      },
    }

    const response = await this.request<ApiResponse<Answer>>(
      'POST',
      '/answers',
      payload
    )
    return response.data
  }

  async createCustomFieldValue(
    candidateId: string,
    fieldId: string,
    value: string
  ): Promise<CustomFieldValue> {
    const payload = {
      data: {
        type: 'custom-field-values',
        attributes: {
          value,
        },
        relationships: {
          'custom-field': { data: { type: 'custom-fields', id: fieldId } },
          owner: { data: { type: 'candidates', id: candidateId } },
        },
      },
    }

    const response = await this.request<ApiResponse<CustomFieldValue>>(
      'POST',
      '/custom-field-values',
      payload
    )
    return response.data
  }

  async createNote(
    candidateId: string,
    userId: string,
    content: string
  ): Promise<Note> {
    const payload = {
      data: {
        type: 'notes',
        attributes: {
          note: content,
        },
        relationships: {
          candidate: { data: { type: 'candidates', id: candidateId } },
          user: { data: { type: 'users', id: userId } },
        },
      },
    }

    const response = await this.request<ApiResponse<Note>>(
      'POST',
      '/notes',
      payload
    )
    return response.data
  }

  async getJob(jobId: string): Promise<Job> {
    const response = await this.request<ApiResponse<Job>>(
      'GET',
      `/jobs/${jobId}`
    )
    return response.data
  }

  async getJobWithQuestions(jobId: string): Promise<JobWithQuestions> {
    const response = await this.request<ApiResponse<JobWithQuestions>>(
      'GET',
      `/jobs/${jobId}?include=questions`
    )
    return response.data
  }

  async getQuestions(): Promise<Question[]> {
    const response = await this.request<ApiListResponse<Question>>(
      'GET',
      '/questions'
    )
    return response.data
  }

  async getCustomFields(): Promise<CustomField[]> {
    const response = await this.request<ApiListResponse<CustomField>>(
      'GET',
      '/custom-fields'
    )
    return response.data
  }

  async getCustomFieldByApiName(apiName: string): Promise<CustomField | null> {
    const fields = await this.getCustomFields()
    return (
      fields.find((f) => f.attributes['api-name'] === apiName) || null
    )
  }

  async deleteCandidate(candidateId: string): Promise<void> {
    await this.request<void>('DELETE', `/candidates/${candidateId}`)
  }
}

// Single instance export
const apiKey = process.env.TEAMTAILOR_API_KEY
if (!apiKey) {
  console.warn('TEAMTAILOR_API_KEY not set - API calls will fail')
}

export const teamtailor = new TeamTailorClient(apiKey || '')
