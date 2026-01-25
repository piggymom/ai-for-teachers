# AI for Teachers

Practical, classroom-safe guidance for using AI with clarity and no hype.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Auth**: NextAuth.js v4 with Google OAuth
- **Database**: PostgreSQL (Supabase) with Prisma ORM
- **Styling**: Tailwind CSS 4

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_URL` | Your app URL (e.g., `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Random secret for session encryption. Generate with: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `DATABASE_URL` | PostgreSQL connection string (Supabase) |

### 3. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
4. Choose "Web application"
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Client Secret to your `.env.local`

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates tables in Supabase)
npx prisma migrate deploy

# Or for development with auto-migration:
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Features

- **Google SSO**: Sign in with Google to save progress
- **Progress tracking**: Mark weeks as complete, synced across devices
- **Offline fallback**: Unauthenticated users can still use localStorage
- **6-week curriculum**: Practical AI guidance for educators

## Project Structure

```
app/
├── api/
│   ├── auth/[...nextauth]/  # NextAuth API routes
│   └── progress/            # Progress API (read/write)
├── auth/signin/             # Custom sign-in page
├── components/              # Shared components
├── week-0/ to week-6/       # Course content pages
└── page.tsx                 # Course index

lib/
├── auth.ts                  # NextAuth configuration
├── prisma.ts                # Prisma client singleton
└── useCompletionState.ts    # Progress tracking hook

prisma/
└── schema.prisma            # Database schema
```

## Troubleshooting

### "OAuth redirect_uri_mismatch" error
- Ensure your redirect URI in Google Console matches exactly:
  `http://localhost:3000/api/auth/callback/google`
- Check that `NEXTAUTH_URL` matches your actual URL

### "NEXTAUTH_SECRET must be set" error
- Generate a secret: `openssl rand -base64 32`
- Add it to `.env.local` as `NEXTAUTH_SECRET`

### Prisma migration errors
- Ensure `DATABASE_URL` is correct in `.env.local`
- For Supabase, use the "Connection string" from Settings → Database
- Try `npx prisma db push` for development instead of migrations

### "Cannot find module '@prisma/client'"
- Run `npx prisma generate` to generate the client

## Deployment

Deploy to Vercel:

1. Connect your GitHub repo to Vercel
2. Add all environment variables in Vercel dashboard
3. Vercel will auto-run `prisma generate` during build

For the database, use Supabase's connection pooler URL for serverless:
- Settings → Database → Connection string → "Transaction" mode
