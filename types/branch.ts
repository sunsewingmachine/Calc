import { z } from 'zod'

export const createBranchSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  taxNumber: z.string().optional(),
})

export const updateBranchSchema = createBranchSchema.partial()

export type CreateBranchInput = z.infer<typeof createBranchSchema>
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>
