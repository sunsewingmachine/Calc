import { z } from 'zod'

export const createItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  sku: z.string().optional(),
  unit: z.string().optional(),
  taxPercent: z.number().min(0).max(100).optional(),
  defaultCostPrice: z.number().min(0).optional(),
  sellingPrice: z.number().min(0).optional(),
  wholesalePrice1: z.number().min(0).optional(),
  wholesalePrice2: z.number().min(0).optional(),
  warrantyMonths: z.number().int().min(0).optional(),
  freightIncluded: z.boolean().optional().default(false),
})

export const updateItemSchema = createItemSchema.partial()

export type CreateItemInput = z.infer<typeof createItemSchema>
export type UpdateItemInput = z.infer<typeof updateItemSchema>
