import z from "zod"

const articleSchema = z.object({
  name: z.string({
    invalid_type_error: 'Article name must be a string',
    required_error: 'Article name is required'
  }),
  price: z.number({
    invalid_type_error: 'Article price must be a number',
    required_error: 'Article price is required'
  }).positive({
    message: 'Article price must be a positive',
  }),
  category_id: z.number({
    invalid_type_error: 'Article category must be a number',
    required_error: 'Article category is required'
  }),
  description: z.string(),
  brand_id: z.number().optional(),
  availability: z.boolean({
    invalid_type_error: 'Article availability must be a boolean',
    required_error: 'Article availability is required'
  }),
  images: z.array(z.string()).optional()
})

export function validateArticle (object) {
  return articleSchema.safeParse(object)
}

export function validatePartialArticle (object) {
  return articleSchema.partial().safeParse(object)
}