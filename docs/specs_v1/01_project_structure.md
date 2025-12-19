
# 📦 Project Structure Specification
## Accounts & Inventory Management App (v1)

---

## 1. Overview

This document defines the **final project folder structure** for the Accounts & Inventory Management application.

### Platforms
- **Web**: Next.js (App Router) - Responsive web application
- **Mobile**: Android native application
- **Backend**: Shared Next.js API routes (serves both web and mobile)

### Stack
- **Web Frontend**: Next.js (App Router) with Tailwind CSS + shadcn/ui
- **Mobile Frontend**: Android (Kotlin/Java)
- **Backend**: Next.js API routes (shared)
- **Database**: NeonDB (PostgreSQL)
- **ORM**: Drizzle ORM
- **Auth**: Placeholder/stub (to be implemented later)
- **Branch Selection**: Session-based
- **Development**: Node.js 20+, TypeScript, focus on implementation first

### Important Constraints
- **No offline support**: All operations require active internet connection to prevent data inconsistencies
- **API-first design**: Mobile app consumes the same REST API as web application
- **Real-time sync**: All data changes are immediately reflected across platforms

---

## 2. Repository Root Structure

```
/accounts-inventory/
 ├── app/                    # Next.js web app
 ├── lib/                    # Shared business logic
 ├── db/                     # Database schema & migrations
 ├── types/                  # Shared TypeScript types
 ├── docs/                   # Documentation
 ├── public/                 # Web static assets
 ├── scripts/                # Utility scripts
 ├── android/                # Android mobile app
 ├── package.json
 └── next.config.ts
```

---

## 3. App Router Structure

```
/app/
 ├── (auth)/
 │   └── login/
 ├── dashboard/
 ├── branches/
 ├── parties/
 ├── items/
 ├── payment-methods/
 ├── transactions/
 ├── expenses/
 ├── stock/
 ├── cash/
 ├── reports/
 └── api/
```

---

## 4. API Route Structure

**Shared API layer** - Used by both web and Android mobile app.

```
/app/api/
 ├── branches/
 │   └── route.ts
 ├── parties/
 │   └── route.ts
 ├── items/
 │   └── route.ts
 ├── payment-methods/
 │   └── route.ts
 ├── transactions/
 │   └── route.ts
 ├── expenses/
 │   └── route.ts
 ├── stock/
 │   └── route.ts
 ├── cash/
 │   └── route.ts
 └── notifications/
     └── route.ts
```

Each API route:
- Validates input
- Enforces branch scope
- Applies role permissions
- Returns standard JSON response format
- **Mobile-friendly**: RESTful API compatible with Android HTTP clients

---

## 5. Database Layer

```
/db/
 ├── schema/
 │   ├── branches.ts
 │   ├── parties.ts
 │   ├── items.ts
 │   ├── warehouses.ts
 │   ├── payment_methods.ts
 │   ├── transactions.ts
 │   ├── expenses.ts
 │   ├── adjustments.ts
 │   └── notifications.ts
 ├── migrations/
 └── index.ts
```

---

## 6. Business Logic Layer

```
/lib/
 ├── auth.ts
 ├── permissions.ts
 ├── fifo.ts
 ├── stock.ts
 ├── cash.ts
 ├── notifications.ts
 └── validators.ts
```

---

## 7. Types & Contracts

```
/types/
 ├── branch.ts
 ├── party.ts
 ├── item.ts
 ├── payment_method.ts
 ├── transaction.ts
 ├── expense.ts
 └── report.ts
```

---

## 8. Documentation

```
/docs/
 └── specs_v1/
     ├── 01_project_structure.md
     ├── 02_database_design_spec.md
     ├── 03_roles_and_permissions.md
     ├── 04_modules_functional_spec.md
     ├── 05_fifo_stock_logic.md
     └── 06_invoice_and_bill_format.md
```

---

## 9. Coding Rules

- No direct SQL outside ORM (Drizzle ORM)
- Branch ID mandatory in all queries
- Branch context stored in session
- No delete operations
- All mutations audited
- All dates stored in UTC
- TypeScript strict mode
- Focus on implementation first (testing to be added later)

## 10. Reusable Components Rule

**All common UI elements MUST be created as reusable components** to ensure consistency, maintainability, and faster development.

### Required Reusable Components

All components should be placed in `/components/ui/` directory:

1. **ActionButton** - Icon buttons with text label below
   - Used for: Add, Update, Delete, Edit, View actions
   - Props: icon, label, onClick, variant, size, disabled

2. **FormInput** - Enhanced input with label, error, helper text
   - Used for: All text/number inputs in forms
   - Props: label, error, helperText, required, and all standard input props

3. **FormSelect** - Enhanced dropdown with label, error, helper text
   - Used for: All dropdown selections in forms
   - Props: label, options, value, onValueChange, error, helperText, required

4. **FormDatePicker** - Date input with calendar icon
   - Used for: All date selections
   - Props: label, value, onChange, error, helperText, required

5. **ImageUpload** - File upload with drag & drop, preview
   - Used for: Image/file uploads (attachments, avatars, etc.)
   - Props: label, value, onChange, maxSize, accept, preview

6. **TaskCard** - Card component for displaying tasks/items
   - Used for: Lists of items, tasks, notifications
   - Props: title, description, icon, status, priority, dueDate, onClick, actions

### Component Guidelines

- **Consistency**: All form components should follow the same pattern (label, input, error, helper text)
- **Accessibility**: All components must be accessible (proper labels, ARIA attributes)
- **TypeScript**: All components must have proper TypeScript types
- **Reusability**: Components should be generic enough to be used across different contexts
- **Composition**: Prefer composition over configuration
- **Documentation**: Each component should have clear prop documentation

### Usage Example

```tsx
// ❌ Bad - Inline form elements
<Label>Name</Label>
<Input value={name} onChange={...} />

// ✅ Good - Using reusable components
<FormInput
  label="Name"
  value={name}
  onChange={...}
  required
  error={errors.name}
/>
```

### When to Create New Components

- When the same UI pattern is used 3+ times across the application
- When a component needs specific styling/behavior that's not available in base shadcn/ui components
- When a component encapsulates complex logic (e.g., ImageUpload with preview, drag & drop)

---

## 11. Android Mobile App Structure

```
/android/
 ├── app/
 │   ├── src/
 │   │   ├── main/
 │   │   │   ├── java/com/accounts/inventory/
 │   │   │   │   ├── MainActivity.kt
 │   │   │   │   ├── api/              # API client
 │   │   │   │   ├── models/           # Data models
 │   │   │   │   ├── ui/               # Activities & Fragments
 │   │   │   │   ├── utils/            # Utilities
 │   │   │   │   └── auth/             # Authentication
 │   │   │   ├── res/                   # Resources
 │   │   │   └── AndroidManifest.xml
 │   │   └── test/
 │   ├── build.gradle
 │   └── proguard-rules.pro
 ├── gradle/
 └── build.gradle
```

### Android App Key Features
- **No offline mode**: Requires active internet connection
- **API integration**: Consumes Next.js API routes
- **Material Design**: Modern Android UI/UX
- **Real-time updates**: All data fetched from server
- **Shared authentication**: Same auth system as web

---

## 12. Platform-Specific Considerations

### Web (Next.js)
- Server-side rendering (SSR) for better performance
- Tailwind CSS for styling
- shadcn/ui components for consistent UI
- Progressive Web App (PWA) capabilities (optional)
- Responsive design for tablets/desktops
- Session-based branch selection

### Android
- Native Android app (not webview)
- Material Design 3 components
- Network-aware: Shows connection status
- Error handling for network failures
- No local database: All data from API

### Shared Backend
- Single source of truth (PostgreSQL)
- Consistent business logic
- Same authentication & authorization
- API versioning support (future)

---

## 13. Summary

This structure ensures:
- Clear separation of concerns
- Scalable module growth
- Clean NeonDB integration
- **Multi-platform support** (Web + Android)
- **API-first architecture** for consistency
- **No offline complexity** - simpler data management
- Cursor IDE friendly development

