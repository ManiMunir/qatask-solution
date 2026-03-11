import { type Locator, type Page } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly appTitle: Locator;
  readonly userName: Locator;
  readonly todoInput: Locator;
  readonly addButton: Locator;
  readonly todoList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appTitle = page.locator('h1');
    this.userName = page.getByTestId('user-name');
    this.todoInput = page.getByTestId('todo-input');
    this.addButton = page.getByTestId('add-button');
    this.todoList = page.getByTestId('todo-list');
  }

  /**
   * Navigates to the application root URL.
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Adds a new todo item using the input field and add button.
   * @param title The text of the todo item to add.
   */
  async addTodo(title: string): Promise<void> {
    await this.todoInput.fill(title);
    await this.addButton.click();
  }

  /**
   * Retrieves a specific todo item locator based on its text content.
   * @param title The exact text of the todo item.
   * @returns The Locator for the specific todo item list element.
   */
  getTodoItem(title: string): Locator {
    return this.page.getByTestId('todo-item').filter({ hasText: title });
  }

  /**
   * Toggles the completion checkbox of a specific todo item.
   * @param title The exact text of the todo item.
   * @param complete True to mark as complete, false to mark as incomplete.
   */
  async setTodoCompletion(title: string, complete: boolean): Promise<void> {
    const todoItem = this.getTodoItem(title);
    const checkbox = todoItem.locator('input[type="checkbox"]');
    
    if (complete) {
      await checkbox.check();
    } else {
      await checkbox.uncheck();
    }
  }

  /**
   * Deletes a specific todo item.
   * @param title The exact text of the todo item.
   */
  async deleteTodo(title: string): Promise<void> {
    const todoItem = this.getTodoItem(title);
    const deleteButton = todoItem.locator('button', { hasText: 'Delete' });
    
    await deleteButton.click();
  }
}