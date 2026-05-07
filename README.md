# Portraits of Purposeful Youth Exchange

Static prototype plus Vercel API route for writing exchange activity to Supabase.

## Environment

Set these in Vercel project settings:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Keep the service role key server-side only. The browser talks to `/api/ppy`; it never receives the Supabase key.

## Supabase

Run `supabase/schema.sql` in the Supabase SQL editor before deploying the API. Tables use RLS with no public policies; the Vercel API route writes with the service role key.

## Data Captured

- Discussion posts
- Comments and interaction events
- Sparks
- Prompt-bank submissions and use events
- Community pulse votes
- Feature-prioritization reflections
- Copy-edit notes
- Lens reaction events

Most public-facing contributions default to `pending` so they can be reviewed before being shown in future versions.
