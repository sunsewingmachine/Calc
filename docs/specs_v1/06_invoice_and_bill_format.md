
# 🧾 Invoice & Bill Format Specification
## Accounts & Inventory Management App (v1)

---

## 1. Purpose

This document defines **standard invoice and bill formats** for:
- Purchase bills
- Sales invoices
- Returns

Designed to be **GST / VAT ready**, printable, and compliant with audit needs.

---

## 2. Common Header (All Documents)

### Company / Branch Info
- Branch name
- Branch address
- Branch phone
- Branch tax number

### Document Info
- Document type (Purchase / Sales / Return)
- Invoice / Bill number
- Invoice date
- Reference number (optional)

---

## 3. Party Section

### Supplier / Customer Details
- Name
- Address
- Phone
- Tax number
- Tax type (GST / VAT / Unregistered)

---

## 4. Item Table Structure

| Column | Description |
|------|------------|
Item name | Item description (display_name for sales invoices, name for purchase bills) |
SKU | Item SKU |
Qty | Quantity |
Unit | Unit of measure |
Rate | Price per unit |
Discount | Item-level discount |
Tax % | Tax percentage |
Tax amount | Calculated tax |
Amount | Line total |

---

## 5. Tax Calculation Rules

- Tax calculated **per item**
- Tax amount = `(rate × qty - discount) × tax %`
- Total tax = sum of item tax amounts

Supports:
- GST
- VAT
- Future tax systems

---

## 6. Summary Section

### Totals
- Subtotal (before tax)
- Total discount
- Total tax
- Freight amount (if any)
- Round-off (optional)
- Grand total

---

## 7. Transport Section (Optional)

Shown if freight is present:
- Transport name
- LR number
- Booked date
- Freight amount

---

## 8. Footer Section

### Notes
- User-entered notes

### Terms
- Warranty details (from items)
- Payment terms (static text)

### Signatures
- Authorized signatory
- Customer acknowledgment

---

## 9. Purchase Bill Specifics

- Shows **supplier** details
- Uses item **name** (supplier/internal name)
- No selling price fields
- Cost-focused layout
- Freight highlighted clearly

---

## 10. Sales Invoice Specifics

- Shows **customer** details
- Uses item **display_name** (customer-facing name)
- Displays:
  - Selling price
  - Discount
  - Warranty period per item
  - Payment method (cash drawer, bank account, credit) - from transaction record

---

## 11. Return Document

- References original invoice number
- Shows negative quantities
- Clearly marked as RETURN

---

## 12. Print & PDF Rules

- A4 size
- Black & white compatible
- Logo optional
- Page break safe
- Footer repeats on every page

---

## 13. Audit & Locking

- Printed documents reflect **audited data only**
- Reprints allowed
- No content change after audit

---

## 14. Future Enhancements

- QR code (invoice verification)
- E-invoice integration
- Multi-language templates

---

## 15. Summary

This specification ensures:
- Professional invoice output
- Tax compliance readiness
- Consistent billing across branches
- Audit-safe document generation
