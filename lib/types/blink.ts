import { z } from "zod"

export const blinkTypeSchema = z.enum([
  "payment",
  "donation",
  "gift",
  "nft",
  "subscription"
])

export type BlinkType = z.infer<typeof blinkTypeSchema>

export const currencySchema = z.enum(["SOL", "USDC", "BARK"])

export type Currency = z.infer<typeof currencySchema>

export const blinkSchema = z.object({
  id: z.string().uuid().optional(),
  type: blinkTypeSchema,
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less"),
  amount: z.number().min(0, "Amount must be non-negative").max(1000000, "Amount must be 1,000,000 or less"),
  currency: currencySchema,
  recipientAddress: z.string().min(1, "Recipient address is required"),
  memo: z.string().max(200, "Memo must be 200 characters or less").optional(),
  expiresAt: z.date().optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type Blink = z.infer<typeof blinkSchema>

export const blinkTemplateSchema = z.object({
  type: blinkTypeSchema,
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less"),
  icon: z.string().url("Invalid icon URL"),
})

export type BlinkTemplate = z.infer<typeof blinkTemplateSchema>

export const createBlinkSchema = blinkSchema.omit({ id: true, createdAt: true, updatedAt: true })

export type CreateBlinkInput = z.infer<typeof createBlinkSchema>

export const updateBlinkSchema = blinkSchema.partial().omit({ id: true, createdAt: true })

export type UpdateBlinkInput = z.infer<typeof updateBlinkSchema>

