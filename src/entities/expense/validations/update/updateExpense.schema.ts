import { z } from 'zod';

export const UpdateExpenseBodySchema = z.object({
  amount: z.number().positive(),
  category: z.string().min(1),
  date: z.string().datetime(),
  notes: z.string(),
});

export const UpdateExpenseParamSchema = z.object({
  id: z.string().uuid(),
});
