import { GetByIdExpenseSchema } from '@/entities/expense/validations/getById/getByIdExpense.schema';

export const validateExpense = (params) => {
  return GetByIdExpenseSchema.safeParse(params);
};
