# Webhook

## Endpoint

```
POST /api/webhook/[token]?job_id=12345
```

- `[token]` - Must match `WEBHOOK_SECRET` environment variable
- `job_id` - TeamTailor job ID (required query parameter)

## Request

Headers:
```
Content-Type: application/json
```

Body (JSON):
```json
{
  "tt_first_name": "John",
  "tt_last_name": "Doe",
  "tt_email": "john@example.com",
  "tt_phone": "+64211234567",
  "tt_tags": "ManyChat,Summer2025",
  "tt_answer_98765": "Yes",
  "tt_custom_source": "Instagram",
  "tt_notes": "Screening summary here"
}
```

## Response

Success (200):
```json
{
  "success": true,
  "candidate_id": "123456"
}
```

Error (4xx/5xx):
```json
{
  "error": "Error message"
}
```

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad request (missing job_id, invalid JSON, missing email) |
| 401 | Unauthorized (invalid token) |
| 429 | Rate limited (60 requests/minute per IP) |
| 500 | Sync failed |

## Rate Limiting

- 60 requests per minute per IP address
- Returns 429 when exceeded
