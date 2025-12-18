import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { parties } from './parties'

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  toPartyId: uuid('to_party_id').references(() => parties.id),
  title: text('title'),
  message: text('message'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})



