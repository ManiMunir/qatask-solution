# QA Task - Bug Reports

**Date:** March 11, 2026
**Environment:** Local Docker Desktop, .NET API, React Frontend, Keycloak

---

## Bug 1: API silently ignores requests to uncheck a Todo item (Backend)

**Description:**
When you try to change a completed Todo item back to incomplete (`isComplete: false`), the backend API does not update the database. However, instead of throwing an error, the API returns a `200 OK` success message. This is a silent failure that causes data mismatch.

**Steps to Reproduce:**
1. Create a new Todo item via the API.
2. Send a `PUT` request to `/api/todos/{id}` with `isComplete: true`. (This works).
3. Send a `PUT` request to `/api/todos/{id}` with `isComplete: false`.
4. Send a `GET` request to check the item. The status is still `true`.

**Expected Result:** The database should update to `false` and return the updated item.
**Actual Result:** The API returns `200 OK`, but the item remains `true` in the database.

**Severity:** High (Core functionality is broken and data is not saving correctly).
**Priority:** High (Needs to be fixed immediately so the UI team can rely on the API).

---

## Bug 2: User cannot uncheck a completed Todo item (Frontend)

**Description:**
In the web browser, users cannot uncheck a Todo item once it has been marked as complete. Because the backend API (Bug 1) is failing silently and returning a success message, the Frontend does not know there is a problem. The UI simply refuses to uncheck the box and does not show any error message to the user.

**Steps to Reproduce:**
1. Log into the web application.
2. Add a new Todo item.
3. Click the checkbox to mark it as complete.
4. Click the checkbox again to uncheck it.

**Expected Result:** The checkbox should become unchecked, or the UI should display an error message explaining that the update failed.
**Actual Result:** The checkbox stays checked and no error is shown to the user.

**Severity:** Medium (The user is stuck, but the app does not crash).
**Priority:** Medium (The UI needs better error handling, but the backend fix in Bug 1 will likely resolve the immediate issue).

---

## Bug 3: Logout button breaks and shows "Invalid redirect uri" (Infrastructure / Keycloak)

**Description:**
When a user clicks the "Logout" button, they are not logged out. Instead, they are redirected to a Keycloak error page that says "We are sorry... Invalid redirect uri". This happens because the URL the frontend is trying to send the user back to is not allowed in Keycloak's security settings.

**Steps to Reproduce:**
1. Log into the web application.
2. Click the "Logout" button.
3. Look at the resulting page and the browser console.

**Expected Result:** The user's session ends safely, and they are sent back to the login screen.
**Actual Result:** A Keycloak error page appears, and a `400 Bad Request` error shows in the console for the `openid-connect/logout` endpoint.

**Severity:** High (Security issue: users cannot safely end their session on shared computers).
**Priority:** High (Requires a quick configuration update in the Keycloak Admin Console to whitelist the frontend's URL).

---

## Bug 4: Cross-User Data Leakage / Shared State (Backend)
**Description:** Todo items are not separated by user account. Data created by the "Admin" user is fully visible and editable by the standard "User" account, and vice versa. 
**Steps to Reproduce:**
1. Log in using the Admin account and create a new Todo item.
2. Log out, and log back in using the standard User account.
**Expected Result:** The standard User should see an empty Todo list (or only their own items).
**Actual Result:** The standard User can see, edit, and delete the Admin's Todo items.
**Severity:** Critical (Major data privacy and security flaw).
**Priority:** High 

---

## Bug 5: Protected UI remains accessible via browser Back button after logout (Frontend)
**Description:** After a user attempts to log out and hits the Keycloak error page (Bug 3), clicking the browser's "Back" button returns them to the protected Todo list. The UI appears as if they are fully logged in, but attempting to add or delete items results in a "Failed to fetch" network error.
**Steps to Reproduce:**
1. Log in, then click "Logout" (reaching the Keycloak error screen).
2. Click the browser's native "Back" button.
3. Attempt to add a new Todo item.
**Expected Result:** The frontend should detect that the session is dead and redirect the user back to the login screen.
**Actual Result:** The UI renders the protected page using cached state, but API requests fail.
**Severity:** Medium 
**Priority:** Medium 

---

## UX/UI Suggestion 1: Disable "Add" button for empty inputs
**Description:** Currently, the user can click the "Add" button even if the text field is completely empty. 
**Recommendation:** The "Add" button should be disabled (grayed out) by default, and should only become clickable when the user has typed at least one character into the input field. This prevents empty database entries and improves the overall user experience.