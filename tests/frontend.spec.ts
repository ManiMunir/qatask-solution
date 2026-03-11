import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage';
import { ApiHelper } from './utils/ApiHelper';
import { Helper } from './utils/Helper';

test.describe('Todo Application Frontend Tests @frontend', () => {
  let todoPage: TodoPage;
  let apiHelper: ApiHelper;
  let createdTodoIds: number[] = [];

  test.beforeEach(async ({ page, request }) => {
    todoPage = new TodoPage(page);
    apiHelper = new ApiHelper(request);
    createdTodoIds = [];

    // Intercept network responses. When UI posts a new Todo, grab its ID for cleanup later.
    page.on('response', async (response) => {
      if (response.url().includes('/api/todos') && response.request().method() === 'POST' && response.ok()) {
        const body = await response.json();
        if (body && body.id) {
          createdTodoIds.push(body.id);
        }
      }
    });

    await todoPage.goto();
  });

  // Delete all UI-created Todos via the API to maintain test isolation
  test.afterEach(async () => {
    for (const id of createdTodoIds) {
      await apiHelper.deleteTodo(id);
    }
  });

  test('should load the homepage, display app title, and verify logged-in user @smoke', async () => {
    // Verifies that the application homepage loads successfully and displays the correct username.
    await expect(todoPage.appTitle).toBeVisible();
    await expect(todoPage.appTitle).toHaveText('QA Task - Todo App');

    await expect(todoPage.userName).toBeVisible();
    await expect(todoPage.userName).toHaveText('Test User');
  });

  test('should add a new todo item and verify it appears in the list @smoke', async () => {
    const todoTitle = `E2E Test Todo - ${Helper.getFormattedTimestamp()}`;

    // Creates a new todo item and verifies that it is displayed in the todo list.
    await todoPage.addTodo(todoTitle);

    const newItem = todoPage.getTodoItem(todoTitle);
    await expect(newItem).toBeVisible();
  });

  test('should mark a todo as complete and verify it shows as completed @regression', async () => {
    const todoTitle = `Complete Me - ${Helper.getFormattedTimestamp()}`;
    await todoPage.addTodo(todoTitle);

    // Updates the todo item to the completed state and verifies the checkbox status.
    await todoPage.setTodoCompletion(todoTitle, true);

    const checkbox = todoPage.getTodoCheckbox(todoTitle);
    await expect(checkbox).toBeChecked();
  });

  test('should mark a completed todo as incomplete and verify it updates correctly @regression', async () => {
    const todoTitle = `Uncheck Me - ${Helper.getFormattedTimestamp()}`;
    await todoPage.addTodo(todoTitle);

    // Sets the todo item to completed before validating the transition back to incomplete.
    await todoPage.setTodoCompletion(todoTitle, true);
    const checkbox = todoPage.getTodoCheckbox(todoTitle);
    await expect(checkbox).toBeChecked();

    // Reverts the todo item to incomplete and verifies the updated checkbox state.
    await todoPage.setTodoCompletion(todoTitle, false);
    await expect(checkbox).not.toBeChecked();
  });

  test('should delete a todo and verify it is removed from the list @regression', async () => {
    const todoTitle = `Delete Me - ${Helper.getFormattedTimestamp()}`;
    await todoPage.addTodo(todoTitle);

    // Confirms that the todo item exists before deletion.
    const todoItem = todoPage.getTodoItem(todoTitle);
    await expect(todoItem).toBeVisible();

    // Deletes the todo item and verifies that it is no longer visible.
    await todoPage.deleteTodo(todoTitle);
    await expect(todoItem).toBeHidden();
  });
});