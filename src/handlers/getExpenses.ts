import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import {
  createExpenseRepository,
  ExpenseRepository,
} from '@/repositories/expense.repository';
import { BaseHandler } from '@/handlers/baseHandler';

class GetExpensesHandler extends BaseHandler {
  private readonly expenseRepository: ExpenseRepository;

  constructor(expenseRepository: ExpenseRepository) {
    super();
    this.expenseRepository = expenseRepository;
  }

  async processEvent(): Promise<APIGatewayProxyResult> {
    const expenses = await this.expenseRepository.getAll();

    return this.createResponse(200, expenses.length > 0 ? expenses : []);
  }
}

const expenseRepository = createExpenseRepository();

export const handler: APIGatewayProxyHandler = async () => {
  const handlerInstance = new GetExpensesHandler(expenseRepository);
  return handlerInstance.processEvent();
};
