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
    const checkbox = this.getTodoCheckbox(title);
    const isChecked = await checkbox.isChecked();

    // Determine the current checkbox state before performing any action.
    // Click is used instead of check/uncheck to avoid issues with controlled UI components.
    if (complete !== isChecked) {
      await checkbox.click();
    }
  }

  /**
   * Deletes a specific todo item.
   * @param title The exact text of the todo item.
   */
  async deleteTodo(title: string): Promise<void> {
    await this.getTodoDeleteButton(title).click();
  }

  /**
   * Retrieves the checkbox locator for a specific todo item.
   * @param title The exact text of the todo item.
   * @returns The Locator for the checkbox.
   */
  getTodoCheckbox(title: string): Locator {
    // Role-based locators provide better resilience and accessibility alignment.
    return this.getTodoItem(title).getByRole('checkbox');
  }

  /**
   * Retrieves the delete button locator for a specific todo item.
   * @param title The exact text of the todo item.
   * @returns The Locator for the delete button.
   */
  getTodoDeleteButton(title: string): Locator {
    return this.getTodoItem(title).getByRole('button', { name: 'Delete' });
  }
}