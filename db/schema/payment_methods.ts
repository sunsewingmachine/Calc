import { pgTable, uuid, text, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { branches } from './branches'

export const paymentMethodTypeEnum = pgEnum('payment_method_type_enum', [
  'cash_drawer',
  'bank_account',
  'credit',
  'other',
])

export const paymentMethods = pgTable('payment_methods', {
  id: uuid('id').primaryKey().defaultRandom(),
  branchId: uuid('branch_id').references(() => branches.id).notNull(),
  name: text('name').notNull(),
  type: paymentMethodTypeEnum('type').notNull(),
  accountNumber: text('account_number'),
  bankName: text('bank_name'),
  ifscCode: text('ifsc_code'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
