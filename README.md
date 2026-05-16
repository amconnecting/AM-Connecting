# AM-Connecting Next.js MVP

This project contains the AM-Connecting website built with Next.js, React, Tailwind CSS and Supabase.

## Routes

- `/` public landing page
- `/registration` participant registration
- `/admin` Supabase Auth protected admin dashboard
- `/api/register` public POST registration, protected GET participant list
- `/api/groups` protected group generation

## Local development

```bash
npm install
npm run dev
```

Then open:

- `http://localhost:3000`
- `http://localhost:3000/registration`
- `http://localhost:3000/admin`

## Environment variables

Create a local `.env.local` file based on `.env.example`.

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAILS=admin@amconnecting.com
```

Do not commit `.env.local`.
