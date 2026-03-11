import { type APIRequestContext, type APIResponse } from '@playwright/test';

export class ApiHelper {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Pings the health endpoint. Does not require authentication.
   * @returns The raw APIResponse object.
   */
  async checkHealth(): Promise<APIResponse> {
    return this.request.get('/health');
  }

  /**
   * Retrieves the list of all todos for the authenticated user.
   * @returns The raw APIResponse object.
   */
  async getTodos(): Promise<APIResponse> {
    return this.request.get('/api/todos');
  }

  /**
   * Retrieves a single todo item by its ID.
   * @param id The numeric ID of the todo.
   * @returns The raw APIResponse object.
   */
  async getTodo(id: number): Promise<APIResponse> {
    return this.request.get(`/api/todos/${id}`);
  }

  /**
   * Creates a new todo item.
   * @param title The title of the new todo.
   * @returns The raw APIResponse object.
   */
  async createTodo(title: string): Promise<APIResponse> {
    return this.request.post('/api/todos', {
      data: {
        title: title,
        isComplete: false
      }
    });
  }

  /**
   * Updates an existing todo item.
   * @param id The numeric ID of the todo to update.
   * @param title The updated title.
   * @param isComplete The updated completion status.
   * @returns The raw APIResponse object.
   */
  async updateTodo(id: number, title: string, isComplete: boolean): Promise<APIResponse> {
    return this.request.put(`/api/todos/${id}`, {
      data: {
        id: id,
        title: title,
        isComplete: isComplete
      }
    });
  }

  /**
   * Deletes a specific todo item by ID.
   * @param id The numeric ID of the todo to delete.
   * @returns The raw APIResponse object.
   */
  async deleteTodo(id: number): Promise<APIResponse> {
    return this.request.delete(`/api/todos/${id}`);
  }
}