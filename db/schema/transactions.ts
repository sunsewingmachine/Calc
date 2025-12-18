import { pgTable, uuid, text, boolean, timestamp, date, pgEnum } from 'drizzle-orm/pg-core'
import { branches } from './branches'
import { parties } from './parties'
import { paymentMethods } from './payment_methods'

export const transactionTypeEnum = pgEnum('transaction_type_enum', [
  'purchase',
  'sales',
  'return',
])

export const transactionStatusEnum = pgEnum('transaction_status_enum', [
  'booked',
  'cancelled',
  'billed',
  'shipped',
  'returned',
  'reached_lorry',
  'delivery_taken',
  'on_hold',
  'all_ok',
])

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  branchId: uuid('branch_id').references(() => branches.id).notNull(),
  partyId: uuid('party_id').references(() => parties.id).notNull(),
  employeeId: uuid('employee_id').references(() => parties.id),
  transactionType: transactionTypeEnum('transaction_type').notNull(),
  status: transactionStatusEnum('status').default('booked').notNull(),
  billNumber: text('bill_number'),
  billDate: date('bill_date'),
  shippedDate: date('shipped_date'),
  paymentMethodId: uuid('payment_method_id').references(() => paymentMethods.id),
  notes: text('notes'),
  isSystemGenerated: boolean('is_system_generated').default(false).notNull(),
  isAudited: boolean('is_audited').default(false).notNull(),
  auditedBy: uuid('audited_by').references(() => parties.id),
  auditedAt: timestamp('audited_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})



