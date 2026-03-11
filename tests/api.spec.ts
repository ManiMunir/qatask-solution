import { test, expect } from '@playwright/test';
import { ApiHelper } from './utils/ApiHelper';
import { Helper } from './utils/Helper';

test.describe('Todo Application API Tests @api', () => {
  let apiHelper: ApiHelper;
  let createdTodoIds: number[] = []; // Array to track created items for teardown

  test.beforeEach(async ({ request }) => {
    apiHelper = new ApiHelper(request);
    createdTodoIds = []; // Reset the array before each test
  });

  // Teardown: Clean up any data created during the test
  test.afterEach(async () => {
    for (const id of createdTodoIds) {
      await apiHelper.deleteTodo(id);
    }
  });

  test('should verify the health endpoint returns a successful response @smoke', async () => {
    const response = await apiHelper.checkHealth();
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test('should authenticate and call the /api/todos endpoint to list todos @smoke', async () => {
    const response = await apiHelper.getTodos();
    expect(response.ok()).toBeTruthy();
    
    const todos = await response.json();
    expect(Array.isArray(todos)).toBeTruthy();
  });

  test('should create a new todo via the API and verify it is returned @regression', async () => {
    const title = `API Create - ${Helper.getFormattedTimestamp()}`;
    const response = await apiHelper.createTodo(title);
    
    expect(response.status() === 200 || response.status() === 201).toBeTruthy();
    
    const todo = await response.json();
    createdTodoIds.push(todo.id); // Track for cleanup
    
    expect(todo.title).toBe(title);
    expect(todo.isComplete).toBe(false);
    expect(todo.id).toBeDefined();
  });

  test('should update a todo via the API and verify the changes persist @regression', async () => {
    // 1. Create a todo
    const title = `API Setup Update - ${Helper.getFormattedTimestamp()}`;
    const createRes = await apiHelper.createTodo(title);
    const todo = await createRes.json();
    createdTodoIds.push(todo.id); // Track for cleanup
    
    // 2. Update it
    const updatedTitle = `Updated Title - ${Helper.getFormattedTimestamp()}`;
    const updateRes = await apiHelper.updateTodo(todo.id, updatedTitle, false);
    expect(updateRes.ok()).toBeTruthy();
    
    // 3. Fetch it again to verify persistence
    const fetchRes = await apiHelper.getTodo(todo.id);
    const fetchedTodo = await fetchRes.json();
    expect(fetchedTodo.title).toBe(updatedTitle);
  });

  test('should toggle a todo completion status (both directions) and verify the state is correct @regression', async () => {
    // 1. Create an incomplete todo
    const createRes = await apiHelper.createTodo(`API Toggle - ${Helper.getFormattedTimestamp()}`);
    const todo = await createRes.json();
    createdTodoIds.push(todo.id); // Track for cleanup
    
    // 2. Toggle to Complete and verify
    const completeRes = await apiHelper.updateTodo(todo.id, todo.title, true);
    expect(completeRes.ok()).toBeTruthy();
    
    let fetchRes = await apiHelper.getTodo(todo.id);
    let fetchedTodo = await fetchRes.json();
    expect(fetchedTodo.isComplete).toBe(true);
    
    // 3. Toggle to Incomplete and verify
    const incompleteRes = await apiHelper.updateTodo(todo.id, todo.title, false);
    expect(incompleteRes.ok()).toBeTruthy();
    
    fetchRes = await apiHelper.getTodo(todo.id);
    fetchedTodo = await fetchRes.json();
    expect(fetchedTodo.isComplete).toBe(false);
  });

  test('should delete a todo via the API and verify it is gone @regression', async () => {
    // 1. Create a todo to delete
    const createRes = await apiHelper.createTodo(`API Delete - ${Helper.getFormattedTimestamp()}`);
    const todo = await createRes.json();
    createdTodoIds.push(todo.id); // Track for cleanup
    
    // 2. Delete it
    const deleteRes = await apiHelper.deleteTodo(todo.id);
    expect(deleteRes.ok()).toBeTruthy();
    
    // 3. Verify it is gone (expecting a 404 Not Found)
    const fetchRes = await apiHelper.getTodo(todo.id);
    expect(fetchRes.status()).toBe(404);
  });
});