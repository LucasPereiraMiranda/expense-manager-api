import { z } from 'zod';

export const DeleteExpenseSchema = z.object({
  id: z.string().uuid(),
});
