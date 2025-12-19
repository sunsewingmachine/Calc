
# 🗄 Database Design Specification
## Accounts & Inventory Management App (v1)

---

## 1. Overview

This document defines the **finalized database schema** for the Accounts & Inventory Management application.

### Key Characteristics
- Single application (serves both web and Android mobile)
- Single business
- Multiple branches (shops)
- NeonDB (PostgreSQL)
- Immutable accounting records
- FIFO-based inventory
- Opening stock handled via system-generated purchase
- Branch-scoped data everywhere
- **API-first design**: Database accessed only through Next.js API routes (no direct DB access from mobile)

---

## 2. Core Design Principles

- UUID primary keys everywhere
- No hard deletes
- No edits after audit or date lock
- Corrections only via adjustment entries
- Stock can never go negative
- One unified transaction engine for purchase & sales

---

## 3. Branches

Each shop/location is a branch.  
Each branch can have its **own tax registration number**.

```sql
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL,
  code TEXT UNIQUE,
  address TEXT,
  phone TEXT,

  tax_number TEXT,

  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Parties

A single party can have **multiple roles** (supplier, customer, employee, general).

```sql
CREATE TYPE party_type_enum AS ENUM (
  'supplier',
  'customer',
  'employee',
  'general'
);

CREATE TYPE tax_type_enum AS ENUM (
  'gst',
  'vat',
  'unregistered',
  'composite',
  'other'
);

CREATE TABLE parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,

  tax_number TEXT,
  tax_type tax_type_enum,

  party_types party_type_enum[] NOT NULL,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. Items

```sql
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL, -- Name for suppliers/internal use
  display_name TEXT NOT NULL, -- Display name for customers
  sku TEXT UNIQUE,
  unit TEXT,

  tax_percent NUMERIC(5,2),

  default_cost_price NUMERIC(12,2),
  selling_price NUMERIC(12,2),
  wholesale_price_1 NUMERIC(12,2),
  wholesale_price_2 NUMERIC(12,2),

  warranty_months INTEGER,
  freight_included BOOLEAN DEFAULT false,

  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 6. Warehouses

```sql
CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 7. Stock Balances

```sql
CREATE TABLE stock_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  warehouse_id UUID REFERENCES warehouses(id),
  item_id UUID REFERENCES items(id),
  quantity NUMERIC(14,3) NOT NULL DEFAULT 0,
  UNIQUE(branch_id, warehouse_id, item_id)
);
```

---

## 7.5. Payment Methods

Payment methods/sources for tracking where money goes (sales) or comes from (expenses).

```sql
CREATE TYPE payment_method_type_enum AS ENUM (
  'cash_drawer',
  'bank_account',
  'credit',
  'other'
);

CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  
  name TEXT NOT NULL,
  type payment_method_type_enum NOT NULL,
  account_number TEXT, -- For bank accounts
  bank_name TEXT, -- For bank accounts
  ifsc_code TEXT, -- For bank accounts (India)
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Note**: Each branch has its own cash drawer (implicit). Bank accounts and credit methods are explicitly defined.

---

## 8. Transactions

```sql
CREATE TYPE transaction_type_enum AS ENUM (
  'purchase',
  'sales',
  'return'
);

CREATE TYPE transaction_status_enum AS ENUM (
  'booked',
  'cancelled',
  'billed',
  'shipped',
  'returned',
  'reached_lorry',
  'delivery_taken',
  'on_hold',
  'all_ok'
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  branch_id UUID REFERENCES branches(id),
  party_id UUID REFERENCES parties(id),
  employee_id UUID REFERENCES parties(id),

  transaction_type transaction_type_enum NOT NULL,
  status transaction_status_enum DEFAULT 'booked',

  bill_number TEXT,
  bill_date DATE,
  shipped_date DATE,

  -- Payment method (for sales: where income goes)
  -- NULL for purchases (purchases don't receive payment)
  payment_method_id UUID REFERENCES payment_methods(id),

  notes TEXT,

  is_system_generated BOOLEAN DEFAULT false,

  is_audited BOOLEAN DEFAULT false,
  audited_by UUID REFERENCES parties(id),
  audited_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 9. Transaction Items

```sql
CREATE TABLE transaction_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  item_id UUID REFERENCES items(id),
  quantity NUMERIC(14,3) NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  tax_percent NUMERIC(5,2),
  discount NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 10. Transport Details

```sql
CREATE TABLE transport_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  transport_name TEXT,
  booked_date DATE,
  lr_number TEXT,
  freight_amount NUMERIC(12,2),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 11. Attachments

```sql
CREATE TABLE transaction_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  file_path TEXT NOT NULL,
  file_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 12. Expenses

```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  party_id UUID REFERENCES parties(id),
  employee_id UUID REFERENCES parties(id),
  ledger TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  
  -- Payment source (where payment comes from)
  payment_method_id UUID REFERENCES payment_methods(id) NOT NULL,
  
  notes TEXT,
  is_audited BOOLEAN DEFAULT false,
  audited_by UUID REFERENCES parties(id),
  audited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 13. Cash Drawer (Daily)

```sql
CREATE TABLE cash_drawer_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  business_date DATE NOT NULL,
  opening_cash NUMERIC(12,2),
  system_cash NUMERIC(12,2),
  closing_cash NUMERIC(12,2),
  difference NUMERIC(12,2),
  adjustment_reason TEXT,
  audited_by UUID REFERENCES parties(id),
  audited_at TIMESTAMPTZ,
  UNIQUE(branch_id, business_date)
);
```

---

## 14. Adjustments

```sql
CREATE TABLE adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_table TEXT NOT NULL,
  reference_id UUID NOT NULL,
  adjustment_type TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  reason TEXT NOT NULL,
  created_by UUID REFERENCES parties(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 15. Notifications

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_party_id UUID REFERENCES parties(id),
  title TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 16. Opening Stock Rule

Opening stock is stored as a **system-generated purchase transaction**:
- `transaction_type = purchase`
- `is_system_generated = true`
- Party = `OPENING_STOCK`
- Included in FIFO naturally
- Never editable

---

## 17. Global Rules

- ❌ Delete: Not allowed
- ❌ Edit: Not allowed after audit or day end
- ✅ Corrections: Adjustments only
- ❌ Sales if stock insufficient
- ✅ Branch isolation mandatory

