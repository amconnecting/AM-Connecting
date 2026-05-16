# AM-Connecting Vercel Deployment

## Vercel settings

- Framework Preset: Next.js
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: leave empty

## Environment variables

Add these in Vercel Project Settings > Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAILS=admin@amconnecting.com
RESEND_API_KEY=...
CONTACT_TO_EMAIL=hello@am-connecting.com
CONTACT_FROM_EMAIL=AM-Connecting <noreply@am-connecting.com>
```

## Supabase setup

1. Open Supabase SQL Editor.
2. Run `supabase/migrations/001_create_participants.sql`.
3. Create an admin user in Supabase Auth.
4. Add that admin email to `ADMIN_EMAILS`, or set the user's metadata role to `admin`.

## Cloudflare DNS

For `am-connecting.com`:

```text
Type: A
Name: @
Content: 76.76.21.21
Proxy status: DNS only
TTL: Auto
```

For `www.am-connecting.com`:

```text
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy status: DNS only
TTL: Auto
```

If Vercel shows a different CNAME target, use the exact value Vercel gives you.

## Contact email setup

1. Create a Resend account.
2. Add and verify `am-connecting.com` as a sending domain.
3. Copy the Resend API key.
4. Add `RESEND_API_KEY` in Vercel.
5. Set `CONTACT_TO_EMAIL` to `hello@am-connecting.com`.
6. Set `CONTACT_FROM_EMAIL` to a verified sender such as `AM-Connecting <noreply@am-connecting.com>`.
