# Accounts & Inventory Management App

## Overview

A multi-platform accounts and inventory management application with:
- **Web**: Next.js (App Router) with Tailwind CSS + shadcn/ui
- **Mobile**: Android native application (to be implemented)
- **Backend**: Shared Next.js API routes
- **Database**: NeonDB (PostgreSQL)
- **ORM**: Drizzle ORM

## Project Status

### ✅ Completed
- Project structure setup
- Database schema definitions (all 14 tables)
- Drizzle ORM configuration
- Database connection setup
- Database migrations generated and pushed to NeonDB
- Tailwind CSS configuration
- shadcn/ui setup (components.json configured)
- Basic Next.js app structure (layout, page)
- Auth placeholder/stub

### 📋 Next Steps
1. Create API routes (branches, parties, items, etc.)
2. Build UI components using shadcn/ui
3. Implement business logic (FIFO, permissions, etc.)
4. Create dashboard and module pages

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
1. Create a `.env` file in the root directory
2. Add your NeonDB connection string:
   ```
   DATABASE_URL=your_neondb_connection_string_here
   ```

### 3. Development
```bash
npm run dev
```

## Database Schema

All schema files are located in `/db/schema/`:
- `branches.ts` - Branch/location management
- `parties.ts` - Suppliers, customers, employees
- `items.ts` - Product/item master
- `warehouses.ts` - Warehouse locations
- `payment_methods.ts` - Payment tracking
- `stock_balances.ts` - Current stock levels
- `transactions.ts` - Purchase/sales/returns
- `transaction_items.ts` - Transaction line items
- `transport_details.ts` - Shipping information
- `transaction_attachments.ts` - File attachments
- `expenses.ts` - Expense tracking
- `cash_drawer_daily.ts` - Daily cash reconciliation
- `adjustments.ts` - Audit adjustments
- `notifications.ts` - In-app notifications

## Tech Stack Decisions

- **ORM**: Drizzle ORM
- **UI**: Tailwind CSS + shadcn/ui
- **Auth**: Placeholder/stub (to be implemented)
- **Branch Selection**: Session-based
- **Development**: Node.js 20+, TypeScript strict mode

## Project Structure

```
/accounts-inventory/
 ├── app/                    # Next.js web app
 ├── lib/                    # Shared business logic
 ├── db/                     # Database schema & migrations
 │   ├── schema/             # Drizzle schema files
 │   └── index.ts            # Database connection
 ├── types/                  # Shared TypeScript types
 ├── docs/                   # Documentation
 └── drizzle/               # Generated migrations
```

## Important Notes

- All dates stored in UTC
- Branch ID mandatory in all queries
- No delete operations (soft deletes via is_active)
- All mutations should be audited
- Session-based branch selection






