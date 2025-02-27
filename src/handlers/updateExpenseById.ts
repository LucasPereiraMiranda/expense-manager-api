import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import {
  validateExpenseBody,
  validateExpenseParam,
} from '@/entities/expense/validations/update/updateExpense.validation';
import {
  createExpenseRepository,
  ExpenseRepository,
} from '@/repositories/expense.repository';
import { BaseHandler } from '@/handlers/baseHandler';

class UpdateExpenseHandler extends BaseHandler {
  private readonly expenseRepository: ExpenseRepository;

  constructor(expenseRepository: ExpenseRepository) {
    super();
    this.expenseRepository = expenseRepository;
  }

  async processEvent(
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> {
    const body = JSON.parse(event.body);
    const validationBodyResult = validateExpenseBody(body);
    if (!validationBodyResult.success) {
      return this.createResponse(400, {
        message: 'Validation failed',
        errors: validationBodyResult.error.format(),
      });
    }

    const validationParamsResult = validateExpenseParam(event.pathParameters);
    if (!validationParamsResult.success) {
      return this.createResponse(400, {
        message: 'Validation failed',
        errors: validationParamsResult.error.format(),
      });
    }

    const updatedExpense = await this.expenseRepository.update(
      validationParamsResult.data.id,
      validationBodyResult.data
    );

    if (!updatedExpense) {
      return this.createResponse(404, {
        message: `Expense with ID ${validationParamsResult.data.id} not found.`,
      });
    }

    return this.createResponse(200, {
      message: 'Expense updated successfully',
      data: updatedExpense,
    });
  }
}

const expenseRepository = createExpenseRepository();

export const handler: APIGatewayProxyHandler = async (event) => {
  const handlerInstance = new UpdateExpenseHandler(expenseRepository);
  return handlerInstance.processEvent(event);
};
