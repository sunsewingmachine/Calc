
# 📘 Module-wise Functional Specification
## Accounts & Inventory Management App (v1)

---

## 0. Platform Support

This specification applies to both **Web** and **Android Mobile** platforms.

### Key Platform Requirements
- **No offline support**: All operations require active internet connection
- **Real-time sync**: Data changes are immediately reflected across all platforms
- **Consistent UX**: Same functionality available on web and mobile (with platform-appropriate UI)
- **API-driven**: Mobile app uses same REST API as web application
- **Network awareness**: Mobile app must handle network failures gracefully

---

## 1. Parties Module

### Purpose
Central master for **suppliers, customers, employees, and general persons**.

### Key Features
- Single party can have multiple roles
- Tax number & tax type supported
- Active / inactive control

### Create / Edit Fields
- Name (mandatory)
- Phone, Email
- Address
- Tax Number
- Tax Type (GST / VAT / Unregistered / Other)
- Party Roles (Supplier, Customer, Employee, General)

### Rules
- Parties cannot be deleted once used
- Inactive parties hidden from new entries
- Employees stored here (salary/payroll handled later)

---

## 2. Items Module

### Purpose
Item master with pricing, warranty, and tax defaults.

### Fields
- Name (for suppliers/internal use)
- Display name (for customers)
- SKU
- Unit (pcs, kg, box)
- Tax percentage
- Default cost price
- Selling price
- Wholesale price 1
- Wholesale price 2
- Warranty (months)
- Freight included flag

### Rules
- Items cannot be deleted if used
- Cost price here is reference only
- Actual landed cost calculated at purchase level

---

## 2.5. Payment Methods Module

### Purpose
Manage payment methods/sources for tracking money flow.

### Payment Method Types
- **Cash Drawer** - Implicit for each branch (no need to create)
- **Bank Account** - Multiple bank accounts per branch
- **Credit** - Credit/deferred payment method
- **Other** - Custom payment methods

### Fields (for Bank Accounts)
- Name (e.g., "HDFC Current Account")
- Account number
- Bank name
- IFSC code (for India)
- Branch association

### Rules
- Cash drawer is automatic (one per branch)
- Bank accounts must be explicitly created
- Payment methods cannot be deleted if used in transactions
- Inactive methods hidden from new entries

---

## 3. Purchase & Sales Module (Unified)

### Design
Single module with behavior controlled by `transaction_type`.

### Supported Types
- Purchase
- Sales
- Return

---

### Common Sections

#### Header
- Branch (mandatory)
- Transaction type
- Party (Supplier / Customer)
- Bill number
- Bill date
- Shipped date
- Payment method (for sales only - where income goes: cash drawer, bank account, credit)

#### Item Grid
- Item
- Quantity
- Price
- Tax % (per item)
- Discount (sales only)

#### Transport
- Transport name
- Booked date
- LR number
- Freight amount

#### Other
- Notes
- Attachments (max 5, auto-compressed)
- Entry made by (employee)

---

### Stock Rules
- Purchase increases stock
- Sales decreases stock
- Sales blocked if stock insufficient
- FIFO logic applied automatically

---

### Audit Flow
- Employee saves → status = booked
- Admin/Owner audits → record locked
- Rejection requires reason + notification

---

## 4. Stock Module

### Stock Report
- Branch
- Warehouse
- Item
- Available quantity
- FIFO stock value

### Adjustments
- Only via adjustment entry
- Reason mandatory
- Creates immutable audit trail

---

## 5. Expense Module

### Fields
- Branch
- Party
- Ledger
- Amount
- Payment source (mandatory - where payment comes from: cash drawer, bank account, credit)
- Notes
- Attachments (max 5)

### Rules
- Payment source is mandatory
- Editable same day before audit
- Included in cash calculations (only if payment source is cash drawer)
- Locked after audit

---

## 6. Cash Drawer & Day-End

### Daily Flow
1. Opening cash entry
2. System calculates:
   - Cash sales (sales with payment method = cash drawer)
   - Cash expenses (expenses with payment source = cash drawer)
3. User enters physical cash
4. Difference calculated
5. Adjustment allowed with reason

### Rules
- One record per branch per day
- Only includes transactions where payment method/source is cash drawer
- Audited by admin/owner

---

## 7. Locking Rules (Global)

| Condition | Editable |
|---------|----------|
|Same day & not audited | Yes |
|Audited | No |
|Past date | No |

---

## 8. Opening Stock Handling

- Entered as system-generated purchase
- FIFO treats it as first stock layer
- Never editable

---

## 9. Notifications

### Triggers
- Audit rejection
- Correction request
- Admin broadcast

### Behavior
- In-app only
- Read/unread tracking
- Cannot be deleted

---

## 10. Mobile-Specific Considerations

### Android App Requirements
- **Network dependency**: All operations require active internet connection
- **Error handling**: Graceful handling of network failures with user-friendly messages
- **Loading states**: Clear loading indicators during API calls
- **Offline detection**: Show connection status to user
- **Data refresh**: Pull-to-refresh for list views
- **Form validation**: Client-side validation before API calls
- **Camera integration**: For attachment uploads (expenses, transactions)

### Platform Parity
- All modules available on both web and mobile
- Same business rules apply across platforms
- Consistent data validation
- Unified authentication system

---

## 11. Summary

This specification defines **all functional behavior** for v1 modules and serves as the base for UI and API development across **Web** and **Android Mobile** platforms.

