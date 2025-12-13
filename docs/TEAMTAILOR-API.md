# TeamTailor API

## Authentication

API key passed in Authorization header:
```
Authorization: Token token=YOUR_API_KEY
X-Api-Version: 20161108
Content-Type: application/vnd.api+json
```

## Endpoints Used

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Create candidate | POST | `/v1/candidates` |
| Create job application | POST | `/v1/job-applications` |
| Create answer | POST | `/v1/answers` |
| Create custom field value | POST | `/v1/custom-field-values` |
| Create note | POST | `/v1/notes` |
| Delete candidate | DELETE | `/v1/candidates/{id}` |
| Get job | GET | `/v1/jobs/{id}` |
| Get questions | GET | `/v1/questions` |
| Get custom fields | GET | `/v1/custom-fields` |

## Sync Flow

1. Create/merge candidate (with `merge: true`)
2. Create job application linking candidate to job
3. Create answers for each `tt_answer_*` field
4. Create custom field values for each `tt_custom_*` field
5. Create note if `tt_notes` provided

## Rate Limits

TeamTailor allows 50 requests per 10 seconds. The sync process makes multiple requests per candidate, so high-volume imports should be paced.

## Error Handling

Non-critical failures (answers, custom fields, notes) are logged but don't fail the sync. Only candidate creation failure returns an error response.

## References

- [TeamTailor API Docs](https://docs.teamtailor.com/)
- [Self-Import Guide](https://support.teamtailor.com/en/articles/8890189-self-import-via-api)
