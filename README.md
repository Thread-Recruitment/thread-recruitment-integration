# Thread Recruitment Integration

Webhook service that receives candidate data from ManyChat and syncs to TeamTailor.

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your API keys
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `TEAMTAILOR_API_KEY` | TeamTailor API key |
| `WEBHOOK_SECRET` | Secret token for webhook URL |
| `TEAMTAILOR_NOTE_USER_ID` | User ID for notes (optional, defaults to "1") |

## Webhook Endpoint

```
POST /api/webhook/[token]?job_id=12345
```

ManyChat sends JSON with `tt_` prefixed fields:

```json
{
  "tt_first_name": "John",
  "tt_last_name": "Doe",
  "tt_email": "john@example.com",
  "tt_phone": "+64211234567",
  "tt_answer_98765": "Yes",
  "tt_custom_source": "Instagram",
  "tt_notes": "Screening summary",
  "tt_tags": "ManyChat,Summer2025"
}
```

## Field Mapping

| ManyChat Field | TeamTailor Destination |
|----------------|----------------------|
| `tt_first_name` | Candidate first name |
| `tt_last_name` | Candidate last name |
| `tt_email` | Candidate email |
| `tt_phone` | Candidate phone |
| `tt_tags` | Candidate tags (comma-separated) |
| `tt_answer_{id}` | Answer to question ID |
| `tt_custom_{api-name}` | Custom field value |
| `tt_notes` | Note on candidate |

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run test     # Run unit tests
```

## Deployment

Deploy to Vercel and set environment variables in the dashboard.

## Documentation

- [Webhook](docs/WEBHOOK.md)
- [Field Mapping](docs/FIELD-MAPPING.md)
- [TeamTailor API](docs/TEAMTAILOR-API.md)
- [ManyChat Setup](docs/MANYCHAT-SETUP.md)
- [Testing](docs/TESTING.md)
