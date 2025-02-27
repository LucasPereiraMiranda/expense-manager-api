import { validateExpense } from '@/entities/expense/validations/create/createExpense.validation';
import {
  createExpenseRepository,
  ExpenseRepository,
} from '@/repositories/expense.repository';
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { BaseHandler } from '@/handlers/baseHandler';

class CreateExpenseHandler extends BaseHandler {
  private readonly expenseRepository: ExpenseRepository;

  constructor(expenseRepository: ExpenseRepository) {
    super();
    this.expenseRepository = expenseRepository;
  }

  async processEvent(
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> {
    const parsedBody = JSON.parse(event.body);
    const validationResult = validateExpense(parsedBody);

    if (!validationResult.success) {
      return this.createResponse(400, {
        message: 'Validation failed',
        errors: validationResult.error.format(),
      });
    }

    const createdExpense = await this.expenseRepository.create(
      validationResult.data
    );

    return this.createResponse(201, createdExpense);
  }
}

const expenseRepository = createExpenseRepository();

export const handler: APIGatewayProxyHandler = async (event) => {
  const handlerInstance = new CreateExpenseHandler(expenseRepository);
  return handlerInstance.processEvent(event);
};
