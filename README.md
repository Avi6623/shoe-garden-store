# Shoe Garden

Production-ready Next.js 16 ecommerce storefront with:
- Customer shopping flow (browse, cart, checkout, profile)
- Inventory reservation system
- Admin dashboard (products, orders, settings)
- Credentials-based authentication via NextAuth

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create env file:
```bash
cp .env.example .env
```

3. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate deploy
```

4. (Optional) Seed sample products:
```bash
npx ts-node prisma/seed.ts
```

5. Start dev server:
```bash
npm run dev
```

## Production Environment Variables

Use strong secrets and real production values:

- `DATABASE_URL` (production database connection string)
- `NEXTAUTH_SECRET` (minimum 32+ random chars)
- `NEXTAUTH_URL` (your public app URL, e.g. `https://shoegarden.com`)
- `ALLOW_OPEN_SIGNUP` (`false` for client deployments unless explicitly needed)
- `ENABLE_ADMIN_BOOTSTRAP` (`false` after initial setup)
- `ADMIN_BOOTSTRAP_EMAIL` (only used when bootstrap is enabled)
- `ADMIN_BOOTSTRAP_PASSWORD` (only used when bootstrap is enabled)

## Deployment Checklist

Run before handing to client:

```bash
npm run lint
npm run build
```

Then confirm:
- Env values are set for production domain and database
- `ALLOW_OPEN_SIGNUP=false` unless requested by client
- `ENABLE_ADMIN_BOOTSTRAP=false` after admin account creation
- Admin credentials are not hardcoded in codebase
- Backups configured for production database
- HTTPS enabled at hosting layer

