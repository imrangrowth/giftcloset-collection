# Gift Closet

A React-based storefront for browsing products, placing orders, and managing a small online retail operation.

## Overview

Gift Closet brings the customer-facing shopping experience and back-office tools into one web application. The source includes a product catalogue, an order-tracking route, a payment-success screen, and an admin area.

### Customer experience
- Home page with featured products, reviews, and contact options
- Product browsing and brand information
- Order tracking and payment-success pages
- WhatsApp contact entry point

### Administration
- Dashboard
- Product management
- Orders
- Analytics

These are routes and interfaces present in the codebase; this README does not imply that a production payment integration or deployment has been independently verified.

## Stack

TypeScript · React · Vite · Tailwind CSS · shadcn/ui · React Router · TanStack Query · Supabase client

## Run locally

**Requirements:** Node.js and npm.

```bash
npm install
npm run dev
```

Other available scripts:

```bash
npm run build
npm run preview
npm run lint
```

Some features may require environment configuration or external services. Check the relevant source modules before enabling live payments or deploying.

## Project structure

- `src/pages/` — storefront and customer pages
- `src/pages/admin/` — administration screens
- `src/components/` — reusable interface components
- `src/App.tsx` — application routes and providers

---

**Status:** Project repository. Features and integrations should be tested before production use.
