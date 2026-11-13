# CampusConnect

A full-stack campus issue reporting and management application built with React, TypeScript, Supabase Auth, PostgreSQL Row Level Security, and Vercel.

## Features
- Email/password signup and login using Supabase Auth
- Student and administrator roles
- Students can submit and track campus issues
- Administrators can view all issues and update statuses
- PostgreSQL persistence with Row Level Security (RLS)
- Responsive dashboard and mobile layout

## Requirements
- Node.js 20+
- npm
- Supabase account
- GitHub account
- Vercel account

## Local setup
1. Create a Supabase project.
2. In Supabase > SQL Editor, run all SQL in `supabase/schema.sql`.
3. In Supabase > Project Settings > API, copy the Project URL and anon/public key.
4. Copy `.env.example` to `.env` and fill in:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Install and run:

```bash
npm install
npm run dev
```

6. Open the local URL printed by Vite.

## Create an administrator
1. Register your account through the app.
2. In Supabase Dashboard > Authentication > Users, copy your user's UUID.
3. In Supabase > SQL Editor, run the following with your actual UUID:

```sql
update public.profiles
set role = 'admin'
where id = 'PASTE-YOUR-USER-UUID-HERE';
```

Never allow public signup to select an admin role. This project assigns `student` by default and admin promotion is done only through the trusted Supabase SQL editor.

## Deploy to Vercel
1. Push this project to a GitHub repository.
2. In Vercel, import the repository.
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Vercel environment variables.
5. Deploy.
6. In Supabase > Authentication > URL Configuration, set Site URL to your Vercel URL and add the Vercel URL to Redirect URLs.

## Security notes
- The Supabase anon key is intended for browser use when Row Level Security is enabled.
- Never expose the Supabase service-role key in frontend code or GitHub.
- RLS policies enforce student/admin data access in PostgreSQL, not merely in the UI.
- Use verified email addresses and strong passwords.
- Review and test policies before using real student data.

## Demo checklist
- Register a student account and sign in.
- Submit an issue.
- Confirm the issue appears in that student's dashboard.
- Register a second account and confirm it cannot see the first student's issue.
- Promote a test account to admin using the SQL above.
- Sign in as admin and update an issue status.
