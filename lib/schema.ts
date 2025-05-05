import { z } from 'zod'

export const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  message: z.string().min(1, 'Message is required'),
})
