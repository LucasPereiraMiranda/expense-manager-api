import { z } from 'zod';

export const CreateExpenseSchema = z.object({
  amount: z.number().positive(),
  category: z.string().min(1),
  date: z.string().datetime(),
  notes: z.string().optional(),
});
