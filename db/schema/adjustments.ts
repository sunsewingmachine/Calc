import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core'
import { parties } from './parties'

export const adjustments = pgTable('adjustments', {
  id: uuid('id').primaryKey().defaultRandom(),
  referenceTable: text('reference_table').notNull(),
  referenceId: uuid('reference_id').notNull(),
  adjustmentType: text('adjustment_type').notNull(),
  oldValue: jsonb('old_value'),
  newValue: jsonb('new_value'),
  reason: text('reason').notNull(),
  createdBy: uuid('created_by').references(() => parties.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})






