# Testing

## Unit Tests

Run with vitest:

```bash
npm run test        # Watch mode
npm run test:run    # Single run
```

Tests cover:
- `parseManyChatFields()` - Field extraction and validation
- `parseAnswerValue()` - Answer type detection (boolean, text, choices)
- `rateLimit()` - Rate limiting logic

## Integration Scripts

Standalone scripts to test TeamTailor API integration. Edit `scripts/lib.ts` to set your `TEST_JOB_ID`.

```bash
# Read-only tests
npx tsx scripts/test-get-job.ts
npx tsx scripts/test-get-questions.ts
npx tsx scripts/test-get-custom-fields.ts

# CRUD tests (creates then deletes test data)
npx tsx scripts/test-candidate-crud.ts
npx tsx scripts/test-full-sync.ts
```

## Local Webhook Test

Start the dev server:

```bash
npm run dev
```

Send a test request:

```bash
curl -X POST "http://localhost:3000/api/webhook?job_id=YOUR_JOB_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET" \
  -d '{
    "tt_first_name": "Test",
    "tt_last_name": "User",
    "tt_email": "test@example.com",
    "tt_phone": "+64211234567"
  }'
```

Expected response:

```json
{ "success": true, "candidate_id": "123456" }
```
