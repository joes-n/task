# RESTful API Documentation

Details of API endpoints.

## Base URL

```
http://localhost:3000/api
```

## Authentication

API endpoints do not require authentication. The task model includes a `user` field that associates tasks with users, but for API access, you must pass the `userId` in the request body for create operations.

## Endpoints

### 1. Get All Tasks

Retrieve all tasks with optional filtering and sorting.

**Endpoint:** `GET /api/tasks`

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search in title or description | `?search=meeting` |
| `status` | string | Filter by status | `?status=completed` |
| `priority` | string | Filter by priority | `?priority=high` |
| `sort` | string | Sort order | `?sort=oldest` or `?sort=dueDate` |

**Example Request:**
```bash
GET /api/tasks?status=pending&priority=high
```

**Success Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d5ec49f8b2b12a8c8e4567",
      "title": "Important Meeting",
      "description": "Prepare presentation",
      "status": "pending",
      "priority": "high",
      "dueDate": "2024-12-31T23:59:59.000Z",
      "user": "60d5ec31f8b2b12a8c8e4560",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Task

Retrieve a specific task by ID.

**Endpoint:** `GET /api/tasks/:id`

**Example Request:**
```bash
GET /api/tasks/60d5ec49f8b2b12a8c8e4567
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f8b2b12a8c8e4567",
    "title": "Important Meeting",
    "description": "Prepare presentation",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "user": "60d5ec31f8b2b12a8c8e4560",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Task not found"
}
```

---

### 3. Create Task

Create a new task.

**Endpoint:** `POST /api/tasks`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `title` | string | Yes | Task title | `"Complete project"` |
| `description` | string | No | Task description | `"Finish all modules"` |
| `status` | string | No | Task status | `"pending"` |
| `priority` | string | No | Task priority | `"medium"` |
| `dueDate` | string | No | Due date (ISO 8601) | `"2024-12-31T23:59:59.000Z"` |
| `userId` | string | Yes | User ID | `"60d5ec31f8b2b12a8c8e4560"` |

**Example Request:**
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description here",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "userId": "60d5ec31f8b2b12a8c8e4560"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f8b2b12a8c8e4567",
    "title": "New Task",
    "description": "Task description here",
    "status": "pending",
    "priority": "medium",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "user": "60d5ec31f8b2b12a8c8e4560",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Title is required"
}
```

---

### 4. Update Task

Update an existing task.

**Endpoint:** `PUT /api/tasks/:id`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**

All fields are optional:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | string | Task title | `"Updated Title"` |
| `description` | string | Task description | `"Updated description"` |
| `status` | string | Task status | `"in-progress"` |
| `priority` | string | Task priority | `"high"` |
| `dueDate` | string | Due date (ISO 8601) | `"2024-12-31T23:59:59.000Z"` |

**Example Request:**
```bash
PUT /api/tasks/60d5ec49f8b2b12a8c8e4567
Content-Type: application/json

{
  "status": "completed",
  "priority": "low"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f8b2b12a8c8e4567",
    "title": "New Task",
    "description": "Task description here",
    "status": "completed",
    "priority": "low",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "user": "60d5ec31f8b2b12a8c8e4560",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-02T15:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Task not found"
}
```

---

### 5. Delete Task

Delete a task.

**Endpoint:** `DELETE /api/tasks/:id`

**Example Request:**
```bash
DELETE /api/tasks/60d5ec49f8b2b12a8c8e4567
```

**Success Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Task not found"
}
```

---

### 6. Get All Accounts

Retrieve all user accounts with optional filtering and sorting.

**Endpoint:** `GET /api/accounts`

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search in username or email | `?search=john` |
| `email` | string | Filter by exact email | `?email=john@example.com` |
| `username` | string | Filter by exact username | `?username=johndoe` |
| `sort` | string | Sort order | `?sort=newest` or `?sort=oldest` or `?sort=username` or `?sort=email` |

**Example Request:**
```bash
GET /api/accounts?search=john&sort=newest
```

**Success Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d5ec31f8b2b12a8c8e4560",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "__v": 0
    }
  ]
}
```

**Note:** The `password` field is never returned in responses for security reasons.

---

### 7. Get Single Account

Retrieve a specific account by ID.

**Endpoint:** `GET /api/accounts/:id`

**Example Request:**
```bash
GET /api/accounts/60d5ec31f8b2b12a8c8e4560
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec31f8b2b12a8c8e4560",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "__v": 0
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Account not found"
}
```

---

## Status Values

- `pending` - Task has not been started
- `in-progress` - Task is currently being worked on
- `completed` - Task has been completed

## Priority Values

- `low` - Low priority task
- `medium` - Medium priority task (default)
- `high` - High priority task

## Date Format

All dates must be in ISO 8601 format:
```
YYYY-MM-DDTHH:mm:ss.sssZ
```

Example: `2024-12-31T23:59:59.000Z`

## Error Codes

- `400` - Bad Request: Invalid input or missing required fields
- `404` - Not Found: Task with specified ID does not exist
- `500` - Internal Server Error: Server-side error

## cURL Examples

### Get All Tasks
```bash
curl -X GET http://localhost:3000/api/tasks
```

### Create Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "pending",
    "priority": "medium",
    "userId": "60d5ec31f8b2b12a8c8e4560"
  }'
```

### Update Task
```bash
curl -X PUT http://localhost:3000/api/tasks/60d5ec49f8b2b12a8c8e4567 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

### Delete Task
```bash
curl -X DELETE http://localhost:3000/api/tasks/60d5ec49f8b2b12a8c8e4567
```

### Search Tasks
```bash
curl -X GET "http://localhost:3000/api/tasks?search=meeting&status=pending"
```

## Testing with Postman

1. Create a new request
2. Set the request type (GET, POST, PUT, DELETE)
3. Enter the URL: `http://localhost:3000/api/tasks` or `http://localhost:3000/api/tasks/{id}`
4. For POST/PUT requests, go to "Body" tab, select "raw" and "JSON"
5. Enter the JSON data
6. Click "Send"

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider implementing rate limiting to prevent API abuse.

## CORS

Cross-Origin Resource Sharing (CORS) is not configured by default. If you need to access the API from a different domain, you may need to configure CORS middleware.
