import z from 'zod';
import { ExpenseSchema } from '@/entities/expense/expense.schema';

export type Expense = z.infer<typeof ExpenseSchema>;
