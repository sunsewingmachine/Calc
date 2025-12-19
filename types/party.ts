import { z } from 'zod'

export const partyTypeEnum = z.enum(['supplier', 'customer', 'employee', 'general'])
export const taxTypeEnum = z.enum(['gst', 'vat', 'unregistered', 'composite', 'other'])

export const createPartySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  taxNumber: z.string().optional(),
  taxType: taxTypeEnum.optional(),
  partyTypes: z.array(partyTypeEnum).min(1, 'At least one party type is required'),
})

export const updatePartySchema = createPartySchema.partial()

export type CreatePartyInput = z.infer<typeof createPartySchema>
export type UpdatePartyInput = z.infer<typeof updatePartySchema>






