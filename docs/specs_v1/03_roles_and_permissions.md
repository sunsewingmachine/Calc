
# 🔐 Roles & Permissions Specification
## Accounts & Inventory Management App (v1)

---

## 1. Overview

This document defines **role-based access control (RBAC)** for the application.

### Platform Coverage
- RBAC applies to both **Web** and **Android Mobile** platforms
- Permissions enforced at API level (shared backend)
- Consistent access control across all platforms

### Roles Covered
- Viewer
- Employee
- Admin
- Owner

Permissions are enforced at:
- Branch level
- Action level
- Audit level
- **API level** (applies to both web and mobile requests)

---

## 2. Role Definitions

### 👁 Viewer

**Purpose**
Read-only access for monitoring and reporting purposes.

**Allowed Actions**
- View parties (read-only)
- View items (read-only)
- View transactions (read-only)
- View expenses (read-only)
- View reports (assigned branches only)
- View stock balances
- View cash drawer entries (read-only)

**Edit Rules**
- Cannot edit any data
- Cannot create any entries
- Cannot delete any data

**Not Allowed**
- Create parties
- Create items
- Create purchase/sales entries
- Create expenses
- Audit entries
- Create adjustments
- Edit any data
- Access other branches (unless assigned)
- Upload attachments

---

### 👷 Employee

**Purpose**
Daily operational data entry.

**Allowed Actions**
- Create parties
- Create items
- Create purchase/sales entries
- Create expenses
- Upload attachments (max 5)
- View reports (assigned branches only)

**Edit Rules**
- Can edit own entries
- Same day only
- Only if not audited

**Not Allowed**
- Audit entries
- Create adjustments
- Delete any data
- Access other branches

---

### 🛠 Admin

**Purpose**
Supervision and verification.

**Allowed Actions**
- All employee actions
- Audit purchases, sales, expenses
- Reject entries with reason
- Create adjustment entries
- View reports (all branches)

**Edit Rules**
- Same-day edits before audit
- Cannot edit audited records directly

**Not Allowed**
- Delete data
- Create/delete branches

---

### 👑 Owner

**Purpose**
Full business control.

**Allowed Actions**
- All admin actions
- Create / edit branches
- Final audit authority
- Cash drawer adjustments
- View all reports (all branches)
- Override branch locks (via adjustment only)

**Edit Rules**
- Direct edit not allowed after audit
- Corrections only via adjustments

---

## 3. Permission Matrix

| Action | Viewer | Employee | Admin | Owner |
|------|--------|----------|-------|-------|
|View parties | Yes | Yes | Yes | Yes |
|Create party | No | Yes | Yes | Yes |
|Edit party | No | Same day | Same day | Yes |
|View items | Yes | Yes | Yes | Yes |
|Create item | No | Yes | Yes | Yes |
|Edit item | No | Same day | Same day | Yes |
|View transactions | Yes | Yes | Yes | Yes |
|Create purchase/sales | No | Yes | Yes | Yes |
|Edit purchase/sales | No | Same day | Same day | No |
|View expenses | Yes | Yes | Yes | Yes |
|Create expenses | No | Yes | Yes | Yes |
|Audit entries | No | No | Yes | Yes |
|Create adjustments | No | No | Yes | Yes |
|View reports | Own branch | Own branch | All | All |
|Manage branches | No | No | No | Yes |
|Delete data | No | No | No | No |

---

## 4. Branch Access Rules

- Viewer → Assigned branches only (read-only access)
- Employee → Assigned branches only
- Admin → All branches
- Owner → All branches

Branch context is mandatory for all entries.

---

## 5. Audit Rules

- Audited records are **fully locked**
- No direct edits allowed post-audit
- Rejection requires mandatory reason
- Rejection triggers in-app notification

---

## 6. Adjustment Rules

- Adjustments are immutable
- Must reference original record
- Reason is mandatory
- Only Admin / Owner can create
- Reflected in reports automatically

---

## 7. Cash Drawer Permissions

| Action | Viewer | Employee | Admin | Owner |
|------|--------|----------|-------|-------|
|View cash drawer | Yes | Yes | Yes | Yes |
|Enter opening cash | No | Yes | Yes | Yes |
|Enter closing cash | No | Yes | Yes | Yes |
|Audit cash day | No | No | Yes | Yes |
|Adjust difference | No | No | No | Yes |

---

## 8. Security Notes

- No hard deletes anywhere
- All sensitive actions logged
- Role escalation not allowed
- Role changes require Owner approval

---

## 9. Summary

This RBAC model ensures:
- Clear separation of duties
- Strong audit control
- Safe correction mechanism
- Branch-level isolation
