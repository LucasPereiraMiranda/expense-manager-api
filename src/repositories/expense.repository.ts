import createDynamoDBClient from '@/clients/createDynamoDbClient';
import { Expense } from '@/entities/expense/expense.type';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';

export class ExpenseRepository {
  private tableName: string;

  constructor(private readonly dbClient: DynamoDBDocumentClient) {
    this.tableName = process.env.EXPENSE_TABLE || 'expense-table-dev';
  }

  async create(expense: Expense): Promise<Expense> {
    const expenseId = uuid();
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        PK: 'Expense',
        SK: `Expense#${expenseId}`,
        id: expenseId,
        ...expense,
      },
    });

    await this.dbClient.send(command);
    return {
      id: expenseId,
      ...expense,
    };
  }

  async getById(id: string): Promise<Expense | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        PK: 'Expense',
        SK: `Expense#${id}`,
      },
    });

    const response = await this.dbClient.send(command);
    return response.Item as Expense | null;
  }

  async getAll(): Promise<Expense[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': 'Expense',
      },
    });

    const response = await this.dbClient.send(command);
    return (response.Items as Expense[]) ?? [];
  }

  async delete(id: string): Promise<Expense | null> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: {
        PK: 'Expense',
        SK: `Expense#${id}`,
      },
      ReturnValues: 'ALL_OLD',
    });

    const response = await this.dbClient.send(command);

    if (!response.Attributes) {
      return null;
    }

    return response.Attributes as Expense;
  }

  async update(id: string, expense: Expense): Promise<Expense | null> {
    const existingItem = await this.getById(id);
    if (!existingItem) {
      return null;
    }

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: {
        PK: 'Expense',
        SK: `Expense#${id}`,
      },
      UpdateExpression:
        'SET amount = :amount, category = :category, #d = :date, notes = :notes',
      ExpressionAttributeNames: {
        '#d': 'date',
      },
      ExpressionAttributeValues: {
        ':amount': expense.amount,
        ':category': expense.category,
        ':date': expense.date,
        ':notes': expense.notes,
      },
      ReturnValues: 'ALL_NEW',
    });

    try {
      const response = await this.dbClient.send(command);

      if (!response.Attributes) {
        return null;
      }

      return response.Attributes as Expense;
    } catch (error) {
      console.error('Error updating item:', error);
      return null;
    }
  }
}

export function createExpenseRepository() {
  const dbClient = createDynamoDBClient();
  return new ExpenseRepository(dbClient);
}
