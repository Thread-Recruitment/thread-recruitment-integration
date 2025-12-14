# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js webhook service that receives candidate data from ManyChat chatbots and syncs it to TeamTailor (an ATS/recruitment platform). It's deployed on Vercel.

## Commands

```bash
npm run dev        # Start Next.js dev server
npm run build      # Production build
npm run lint       # ESLint
npm run test       # Vitest in watch mode
npm run test:run   # Vitest single run
```

### Running scripts against TeamTailor API

Scripts in `scripts/` require environment variables from `.env.local`. They use `tsx`:

```bash
npx tsx scripts/test-full-sync.ts    # Test complete webhook flow
npx tsx scripts/test-webhook.ts      # Simulate webhook locally
npx tsx scripts/explore.ts           # Ad-hoc API exploration
```

Scripts import `getClient()` from `scripts/lib.ts` which handles dotenv loading and lazy client initialization.

## Architecture

### Webhook Flow

1. **Endpoint**: `POST /api/webhook/[token]?job_id=12345` - token validated against `WEBHOOK_SECRET`
2. **Parse**: `lib/parse.ts` extracts `tt_` prefixed fields from ManyChat JSON
3. **Sync**: `lib/sync.ts` orchestrates TeamTailor API calls in order:
   - Create/merge candidate (by email)
   - Create job application
   - Create answers for each `tt_answer_{questionId}` field
   - Create custom field values for each `tt_custom_{apiName}` field
   - Create note if `tt_notes` provided

### Key Modules

- `lib/teamtailor/client.ts` - TeamTailor API client (JSON:API format). Uses lazy singleton via Proxy to defer env reading.
- `lib/teamtailor/types.ts` - TeamTailor entity types
- `types/index.ts` - App types (`ParsedFields`, `SyncReport`, etc.)
- `lib/logger.ts` - Axiom logging wrapper
- `lib/rate-limit.ts` - In-memory IP rate limiting
- `lib/report.ts` - Sync report formatting

### Field Mapping Convention

ManyChat fields use `tt_` prefix:
- `tt_first_name`, `tt_last_name`, `tt_email`, `tt_phone`, `tt_tags` → Candidate fields
- `tt_answer_{questionId}` → Answer for TeamTailor question ID
- `tt_custom_{apiName}` → Custom field by API name (not ID)
- `tt_notes` → Note on candidate

### TeamTailor API

Uses JSON:API format with kebab-case attributes. API version header: `X-Api-Version: 20161108`. The client handles pagination for list endpoints.

## Environment Variables

Required in `.env.local`:
- `TEAMTAILOR_API_KEY` - TeamTailor API key
- `WEBHOOK_SECRET` - Token for webhook URL path
- `AXIOM_TOKEN`, `AXIOM_DATASET` - Logging
