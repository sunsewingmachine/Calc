import { pgTable, uuid, text, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const partyTypeEnum = pgEnum('party_type_enum', [
  'supplier',
  'customer',
  'employee',
  'general',
])

export const taxTypeEnum = pgEnum('tax_type_enum', [
  'gst',
  'vat',
  'unregistered',
  'composite',
  'other',
])

export const parties = pgTable('parties', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  taxNumber: text('tax_number'),
  taxType: taxTypeEnum('tax_type'),
  partyTypes: partyTypeEnum('party_types').array().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})


