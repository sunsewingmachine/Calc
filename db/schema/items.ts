import { pgTable, uuid, text, boolean, timestamp, numeric, integer } from 'drizzle-orm/pg-core'

export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  displayName: text('display_name').notNull(),
  sku: text('sku').unique(),
  unit: text('unit'),
  taxPercent: numeric('tax_percent', { precision: 5, scale: 2 }),
  defaultCostPrice: numeric('default_cost_price', { precision: 12, scale: 2 }),
  sellingPrice: numeric('selling_price', { precision: 12, scale: 2 }),
  wholesalePrice1: numeric('wholesale_price_1', { precision: 12, scale: 2 }),
  wholesalePrice2: numeric('wholesale_price_2', { precision: 12, scale: 2 }),
  warrantyMonths: integer('warranty_months'),
  freightIncluded: boolean('freight_included').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})






