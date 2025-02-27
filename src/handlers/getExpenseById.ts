import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { validateExpense } from '@/entities/expense/validations/getById/getByIdExpense.validation';
import {
  createExpenseRepository,
  ExpenseRepository,
} from '@/repositories/expense.repository';
import { BaseHandler } from '@/handlers/baseHandler';

class GetExpenseByIdHandler extends BaseHandler {
  private readonly expenseRepository: ExpenseRepository;

  constructor(expenseRepository: ExpenseRepository) {
    super();
    this.expenseRepository = expenseRepository;
  }

  async processEvent(
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> {
    const { pathParameters } = event;

    const validationResult = validateExpense(pathParameters);

    if (!validationResult.success) {
      return this.createResponse(400, {
        message: 'Validation failed',
        errors: validationResult.error.format(),
      });
    }

    const foundExpense = await this.expenseRepository.getById(
      validationResult.data.id
    );

    if (!foundExpense) {
      return this.createResponse(404, {
        message: 'Expense not found.',
      });
    }

    return this.createResponse(200, foundExpense);
  }
}

const expenseRepository = createExpenseRepository();

export const handler: APIGatewayProxyHandler = async (event) => {
  const handlerInstance = new GetExpenseByIdHandler(expenseRepository);
  return handlerInstance.processEvent(event);
};
