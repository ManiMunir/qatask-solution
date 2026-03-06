# QA Task - Requirements Document

## Overview

A simple Todo application that allows authenticated users to create, view, update, and delete todo items.

## Authentication

### Login
- Users must authenticate via Keycloak (OpenID Connect) before accessing the application
- Unauthenticated users should see a login prompt with a "Log In with Keycloak" link
- Clicking the login link should redirect the user to the Keycloak login page
- After successful authentication, the user should be redirected back to the application
- The logged-in user's name should be displayed in the header

### Logout
- A "Log out" link should be visible when the user is authenticated
- Clicking "Log out" should end the session and redirect the user back to the login prompt

### User Roles
- **Regular User**: Can perform all todo CRUD operations
- **Admin User**: Same permissions as regular user

## Todo Management

### Viewing Todos
- Authenticated users should see a list of all todo items
- Each todo item should display its title and completion status
- Completed todos should be visually distinct from incomplete todos
- If no todos exist, an empty state message should be displayed: "No todos yet. Add one above!"
- Todos should be ordered by their ID (creation order)

### Creating a Todo
- A text input and "Add" button should be available above the todo list
- Entering a title and submitting should create a new todo item
- The new todo should appear in the list immediately after creation
- The input field should be cleared after successful creation
- Submitting an empty or whitespace-only title should not create a todo
- New todos should default to incomplete status
- The `createdAt` and `updatedAt` timestamps should be set to the current time

### Updating a Todo (Toggle Completion)
- Each todo should have a checkbox to toggle its completion status
- Checking an incomplete todo should mark it as complete
- Unchecking a complete todo should mark it as incomplete
- The `updatedAt` timestamp should be updated when a todo is modified
- The title should be preserved when toggling completion

### Deleting a Todo
- Each todo should have a "Delete" button
- Clicking "Delete" should remove the todo from the list
- The deleted todo should no longer appear in the list

## API Endpoints

### Health Check
- `GET /health` should return a successful response (no authentication required)

### User Info
- `GET /auth/user` should return the current user's authentication status (no authentication required)
- When authenticated: returns `isAuthenticated: true`, user name, email, and roles
- When not authenticated: returns `isAuthenticated: false`

### Todo CRUD
All todo endpoints require authentication and are prefixed with `/api/todos`.

#### List Todos
- `GET /api/todos` should return all todo items ordered by ID
- Response should be a JSON array of todo objects

#### Get Single Todo
- `GET /api/todos/{id}` should return a single todo item by ID
- Should return 404 if the todo does not exist

#### Create Todo
- `POST /api/todos` should create a new todo item
- Request body should include `title` and `isComplete` fields
- Should return 201 with the created todo (including generated `id` and timestamps)

#### Update Todo
- `PUT /api/todos/{id}` should update an existing todo item
- Request body should include `title` and `isComplete` fields
- Should update the `updatedAt` timestamp
- Should return the updated todo
- Should return 404 if the todo does not exist

#### Delete Todo
- `DELETE /api/todos/{id}` should remove a todo item
- Should return 204 (No Content) on success
- Should return 404 if the todo does not exist

## Todo Item Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Auto-generated unique identifier |
| `title` | string | The todo item text |
| `isComplete` | boolean | Completion status (default: false) |
| `createdAt` | datetime | Timestamp when the todo was created (UTC) |
| `updatedAt` | datetime | Timestamp when the todo was last modified (UTC) |
