This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Please refer to the Getting Started, Local Env and Known Issues sections to run the project.

## Features

- Create and manage daily habits with a clean, minimal interface

- Track completion status day by dy

- Persist data locally using SQLite

- Built on Next.js, so you get api routes, server-side rendering and a smooth developer experience

## Tech Stack

- Next.js

- SQLite

- TypeScript

- TailwindCSS and Shadcn

## Getting Started

1. Clone the repository

```
git clone https://github.com/akosszarvak/habit.git
cd habit

```

2. Install the dependencies through a node package manager, for example npm, pnpm.

```
npm install
```

3. Run database migrations or initialize SQLite:

```
npx prisma generate

npx prisma migrate dev --name init

npx tsx prisma/seed.ts

```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open the app in your browser at:

```
http://localhost:3000

```

## Local Env

This project uses auth0 as it's authentication provider. To run it locally, you must create your own `.env.local` file.
See the example in `.example.env` or at `https://auth0.com/docs/quickstart/webapp/nextjs#dashboard` for further examples.

Make sure your Auth0 application is configured with:

- Allowed Callback URLs

- Allowed Logout URLs

- Allowed Web Origins

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Setting up Prisma and Sqlite

This project uses Prisma with SQLite and better-sqlite3.

### Requirements

    - Node.js20 (LTS)
        - Node 24 is currently unsupported by better-sqlite3
    - Prisma 7.3.0 (apply workaround)

### Prisma first steps

```
npx prisma generate

npx prisma migrate dev --name init

npx tsx prisma/seed.ts

```

To see your database, you can use Prisma Studio and navigate to `http://localhost:51212/`

```
npx prisma studio
```

## Known issues

### Prisma 7.3.0 workaround

According to [Issue #29074](https://github.com/prisma/prisma/issues/29074) in prisma, there is an issue with @prisma/adapter-better-sqlite3 package, that doesn't let you run migrations. To fix this, follow the workaround in the ticket, and manually apply the code in the createBetterSQLite3Client function (node_modules/@prisma/adapter-better-sqlite3/dist/index.mjs).

```
 const dbPath = "/path/to/your/db_file/dev.db"
```

```
 const db = new import_better_sqlite3.default(dbPath);
```

You have to hardcode the path to your sqlite db, and remove the `input` property form the Database constructor

## How to Contribute

Contributions are welcome!

- Open an issue first if you want to add a new feature or make a larger change.
- Fork the repo and create a feature branch for your changes.
- Keep pull requests small and focused, and explain what you changed in the PR description.
- Make sure the app builds and tests (if any) pass before opening a PR.

## Prisma cheat sheet

```
# Reset database and migrations (DANGEROUS: deletes all data)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Create a migration
npx prisma migrate dev --name <migration-name>

# Seed database
npx tsx prisma/seed.ts
## Learn More
```

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
