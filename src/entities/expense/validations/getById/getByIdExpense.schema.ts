import { z } from 'zod';

export const GetByIdExpenseSchema = z.object({
  id: z.string().uuid(),
});
