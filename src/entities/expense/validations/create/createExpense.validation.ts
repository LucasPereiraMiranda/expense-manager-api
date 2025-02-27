import { CreateExpenseSchema } from '@/entities/expense/validations/create/createExpense.schema';

export const validateExpense = (body) => {
  return CreateExpenseSchema.safeParse(body);
};
