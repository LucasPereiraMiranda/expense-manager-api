import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { validateExpense } from '@/entities/expense/validations/delete/deleteExpense.validation';
import {
  createExpenseRepository,
  ExpenseRepository,
} from '@/repositories/expense.repository';
import { BaseHandler } from '@/handlers/baseHandler';

class DeleteExpenseHandler extends BaseHandler {
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

    const deletedExpense = await this.expenseRepository.delete(
      validationResult.data.id
    );

    if (!deletedExpense) {
      return this.createResponse(404, {
        message: `Expense with ID ${validationResult.data.id} not found.`,
      });
    }

    return this.createResponse(200, deletedExpense);
  }
}

const expenseRepository = createExpenseRepository();

export const handler: APIGatewayProxyHandler = async (event) => {
  const handlerInstance = new DeleteExpenseHandler(expenseRepository);
  return handlerInstance.processEvent(event);
};
