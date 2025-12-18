import { pgTable, uuid, text, numeric, timestamp, date, unique } from 'drizzle-orm/pg-core'
import { branches } from './branches'
import { parties } from './parties'

export const cashDrawerDaily = pgTable('cash_drawer_daily', {
  id: uuid('id').primaryKey().defaultRandom(),
  branchId: uuid('branch_id').references(() => branches.id).notNull(),
  businessDate: date('business_date').notNull(),
  openingCash: numeric('opening_cash', { precision: 12, scale: 2 }),
  systemCash: numeric('system_cash', { precision: 12, scale: 2 }),
  closingCash: numeric('closing_cash', { precision: 12, scale: 2 }),
  difference: numeric('difference', { precision: 12, scale: 2 }),
  adjustmentReason: text('adjustment_reason'),
  auditedBy: uuid('audited_by').references(() => parties.id),
  auditedAt: timestamp('audited_at', { withTimezone: true }),
}, (table) => ({
  uniqueBranchDate: unique().on(table.branchId, table.businessDate),
}))


