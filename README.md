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
RESEND_API_KEY=...
CONTACT_TO_EMAIL=hello@am-connecting.com
CONTACT_FROM_EMAIL=AM-Connecting <noreply@am-connecting.com>
```

Do not commit `.env.local`.

## Contact form email

The contact form posts to `/api/contact`. That API route sends email through Resend.

Set up Resend, verify the sending domain, then add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` in Vercel.
