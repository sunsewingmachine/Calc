import { z } from 'zod'

export const paymentMethodTypeEnum = z.enum(['cash_drawer', 'bank_account', 'credit', 'other'])

export const createPaymentMethodSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: paymentMethodTypeEnum,
  accountNumber: z.string().optional(),
  bankName: z.string().optional(),
  ifscCode: z.string().optional(),
})

export const updatePaymentMethodSchema = createPaymentMethodSchema.partial()

export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>
export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>
