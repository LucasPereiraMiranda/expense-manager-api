import { z } from 'zod';

export const ExpenseSchema = z.object({
  id: z.string().optional(),
  amount: z.number().positive(),
  category: z.string().min(1),
  date: z.string().datetime(),
  notes: z.string().optional(),
});
