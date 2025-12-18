import { pgTable, uuid, numeric, unique } from 'drizzle-orm/pg-core'
import { branches } from './branches'
import { warehouses } from './warehouses'
import { items } from './items'

export const stockBalances = pgTable('stock_balances', {
  id: uuid('id').primaryKey().defaultRandom(),
  branchId: uuid('branch_id').references(() => branches.id).notNull(),
  warehouseId: uuid('warehouse_id').references(() => warehouses.id).notNull(),
  itemId: uuid('item_id').references(() => items.id).notNull(),
  quantity: numeric('quantity', { precision: 14, scale: 3 }).default('0').notNull(),
}, (table) => ({
  uniqueBranchWarehouseItem: unique().on(table.branchId, table.warehouseId, table.itemId),
}))
