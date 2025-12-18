import { pgTable, uuid, text, numeric, timestamp } from 'drizzle-orm/pg-core'
import { transactions } from './transactions'
import { items } from './items'

export const transactionItems = pgTable('transaction_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  transactionId: uuid('transaction_id').references(() => transactions.id).notNull(),
  itemId: uuid('item_id').references(() => items.id).notNull(),
  quantity: numeric('quantity', { precision: 14, scale: 3 }).notNull(),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  taxPercent: numeric('tax_percent', { precision: 5, scale: 2 }),
  discount: numeric('discount', { precision: 12, scale: 2 }).default('0').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})



