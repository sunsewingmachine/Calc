import { pgTable, uuid, text, numeric, timestamp, date } from 'drizzle-orm/pg-core'
import { transactions } from './transactions'

export const transportDetails = pgTable('transport_details', {
  id: uuid('id').primaryKey().defaultRandom(),
  transactionId: uuid('transaction_id').references(() => transactions.id).notNull(),
  transportName: text('transport_name'),
  bookedDate: date('booked_date'),
  lrNumber: text('lr_number'),
  freightAmount: numeric('freight_amount', { precision: 12, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})



