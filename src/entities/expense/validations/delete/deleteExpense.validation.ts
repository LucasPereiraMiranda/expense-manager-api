import { DeleteExpenseSchema } from '@/entities/expense/validations/delete/deleteExpense.schema';

export const validateExpense = (params) => {
  return DeleteExpenseSchema.safeParse(params);
};
