
# 🔄 FIFO Stock Logic Specification
## Accounts & Inventory Management App (v1)

---

## 1. Purpose

This document defines the **First-In-First-Out (FIFO)** inventory valuation and stock movement logic.

FIFO ensures:
- Accurate cost valuation
- Chronological stock consumption
- Audit-friendly inventory accounting

---

## 2. Stock Sources (FIFO Layers)

Stock is added in the following order:

1. **Opening Stock**
   - Stored as system-generated purchase
   - `transaction_type = purchase`
   - `is_system_generated = true`

2. **Purchase Transactions**
   - Normal purchase entries
   - Includes freight allocation

3. **Purchase Returns**
   - Reverses latest available FIFO layer

Each source creates a **FIFO layer**.

---

## 3. FIFO Layer Structure (Logical)

Each FIFO layer contains:
- Item ID
- Branch ID
- Warehouse ID
- Quantity available
- Cost per unit
- Source transaction reference
- Created timestamp

(FIFO layers may be stored logically or via movement table)

---

## 4. Freight Allocation Logic

Freight is allocated proportionally across items.

Formula:
```
item_freight =
(total_freight × item_value) / total_bill_value
```

Final FIFO unit cost:
```
fifo_unit_cost = item_price + allocated_freight_per_unit
```

---

## 5. Sales Consumption Logic

When a sales transaction is saved:

1. Fetch FIFO layers ordered by oldest first
2. Deduct quantity sequentially
3. Allow partial consumption from a layer
4. Continue until required quantity satisfied

Example:
- Sale qty = 15
- FIFO layers: 10 + 8
- Consume 10 from layer 1
- Consume 5 from layer 2

---

## 6. Stock Availability Rule

Before saving sales:
```
IF available_stock < sale_quantity
THEN block transaction
```

No negative stock allowed.

---

## 7. Return Handling

### Sales Return
- Adds stock back
- Uses original sale cost reference if available
- Otherwise creates new FIFO layer

### Purchase Return
- Reduces latest FIFO layer
- Cannot exceed available quantity

---

## 8. Stock Adjustments

- Adjustments do NOT modify FIFO layers directly
- Adjustment entries generate compensating FIFO movements
- Reason mandatory
- Admin / Owner only

---

## 9. Audit Impact

- Audited transactions cannot be recalculated
- FIFO layers are immutable after audit
- Adjustments are the only correction mechanism

---

## 10. Reporting Impact

FIFO drives:
- Stock valuation report
- Cost of goods sold (COGS)
- Profit & loss calculations

---

## 11. Error Scenarios

| Scenario | Action |
|-------|--------|
|Insufficient stock | Block sales |
|Freight mismatch | Validation error |
|Layer corruption | Admin review |
|Audit conflict | Adjustment only |

---

## 12. Summary

This FIFO logic ensures:
- Consistent inventory valuation
- Strong audit compliance
- Simple opening stock handling
- Zero stock inconsistencies

