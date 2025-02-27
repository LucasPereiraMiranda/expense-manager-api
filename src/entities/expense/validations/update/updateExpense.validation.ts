import {
  UpdateExpenseBodySchema,
  UpdateExpenseParamSchema,
} from './updateExpense.schema';

export const validateExpenseBody = (body) => {
  return UpdateExpenseBodySchema.safeParse(body);
};

export const validateExpenseParam = (params) => {
  return UpdateExpenseParamSchema.safeParse(params);
};
