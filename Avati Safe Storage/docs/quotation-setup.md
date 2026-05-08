# Quotation System Setup

This project now uses Next.js App Router for the website shell. The quotation backend still uses Vercel serverless functions in `api/` so it can share the existing quotation service utilities.

## Environment Variables

Add these in Vercel Project Settings and in local `.env` if you run Vercel dev:

```bash
RESEND_API_KEY=
QUOTE_FROM_EMAIL="Avati Safe Storage <quotes@avatisafestorage.com>"
QUOTE_ADMIN_EMAIL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Supabase

Run `supabase/quotation-schema.sql` in the Supabase SQL editor. The API stores each generated quotation in `quotation_requests` with customer details, request fields, pricing breakdown, total estimate, and validity date.

## API Routes

- `POST /api/quotation-generate`: validates the request, calculates pricing, generates the PDF, stores the quotation, and emails the customer with an admin copy.
- `POST /api/quotation-email`: generates and emails a quotation PDF.
- `POST /api/quotation-store`: stores a validated quotation request and pricing breakdown.

## Local Development

Install dependencies after pulling these changes:

```bash
npm install
npm run dev
```

For local API testing, run with Vercel's dev server so `/api/*` functions are available, or deploy to Vercel with the environment variables above.
