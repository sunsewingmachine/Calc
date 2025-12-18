import { pgTable, uuid, text, numeric, boolean, timestamp } from 'drizzle-orm/pg-core'
import { branches } from './branches'
import { parties } from './parties'
import { paymentMethods } from './payment_methods'

export const expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  branchId: uuid('branch_id').references(() => branches.id).notNull(),
  partyId: uuid('party_id').references(() => parties.id),
  employeeId: uuid('employee_id').references(() => parties.id),
  ledger: text('ledger').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  paymentMethodId: uuid('payment_method_id').references(() => paymentMethods.id).notNull(),
  notes: text('notes'),
  isAudited: boolean('is_audited').default(false).notNull(),
  auditedBy: uuid('audited_by').references(() => parties.id),
  auditedAt: timestamp('audited_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})



