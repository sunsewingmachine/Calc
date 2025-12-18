import { z } from 'zod'

export const createWarehouseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export const updateWarehouseSchema = createWarehouseSchema.partial()

export type CreateWarehouseInput = z.infer<typeof createWarehouseSchema>
export type UpdateWarehouseInput = z.infer<typeof updateWarehouseSchema>


