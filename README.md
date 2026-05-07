# Portraits of Purposeful Youth Exchange

Static prototype plus Vercel API route for writing exchange activity to Supabase.

## Environment

Set these in Vercel project settings:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_TOKEN`

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

## Admin Review

Open `/admin.html` on the deployed site. Paste the `ADMIN_TOKEN` value to review pending contributions, approve/reject/archive public-facing rows, or export CSV files.

Public rendering rules:

- Discussion posts, comments, sparks, and prompt-bank submissions only appear on the public page after their `status` is `approved`.
- Feature reflections, copy-edit notes, and starter responses are captured for research iteration and can be exported, but they are not rendered publicly.
- Pulse votes are aggregated immediately because they do not contain open text.
- Interaction events are logged for product learning and are not rendered publicly.

## Deployment Notes

Use the production Vercel URL from the project `Deployments` or `Settings -> Domains` screen. If visitors see a login or social-login warning, check Vercel `Settings -> Deployment Protection` and make sure the production deployment is not protected by Vercel Authentication.
