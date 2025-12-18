import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { transactions } from './transactions'

export const transactionAttachments = pgTable('transaction_attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  transactionId: uuid('transaction_id').references(() => transactions.id).notNull(),
  filePath: text('file_path').notNull(),
  fileType: text('file_type'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
