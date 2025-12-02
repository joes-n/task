# Task Management System

**Course:** COMP3810SEF
**Group:** 39

**Group Members:**
* [Name 1] - [Student ID]
* [Name 2] - [Student ID]
* [Name 3] - [Student ID]

## Cloud-Based Server URL
**Live Demo:** [INSERT YOUR RENDER/RAILWAY URL HERE]

## server.js functionalities

The main server.js file handles:

- **Database Connection**: Connects to MongoDB using the connectDB() function from config/database.js
- **Express.js Setup**: Initializes Express app with view engine (EJS) and static file serving
- **Middleware Configuration**: Sets up body parsing, method override, session management, and static assets
- **Route Registration**: Registers three main route modules:
  - `/` - Authentication routes (login, register, logout)
  - `/tasks` - Task management routes (CRUD operations with authentication)
  - `/api` - RESTful API endpoints (public access)
- **Home Route**: Redirects authenticated users to `/tasks` and unauthenticated users to `/login`
- **Error Handling**: Provides 404 page for undefined routes and global error handler for server errors
- **Server Startup**: Listens on PORT (from environment variable or defaults to 3000)

## Package Dependencies

The application uses the following dependencies:

### Dependencies (Production)
- **bcrypt** (^6.0.0) - Password hashing library for secure user authentication
- **dotenv** (^17.2.3) - Loads environment variables from .env file into process.env
- **ejs** (^3.1.10) - Embedded JavaScript templating engine for rendering HTML views
- **express** (^5.1.0) - Web framework for Node.js for building RESTful APIs and web applications
- **express-session** (^1.18.2) - Session middleware for Express.js to manage user sessions
- **method-override** (^3.0.0) - Allows use of HTTP verbs like PUT and DELETE in places where the client doesn't support it
- **mongoose** (^8.19.3) - MongoDB object modeling library for Node.js

### DevDependencies (Development)
- **nodemon** (^3.1.11) - Development tool that auto-restarts the server when files change

## Project Structure

```
.
├── config/
│   └── database.js      # MongoDB connection configuration
├── models/
│   ├── User.js          # User model
│   └── Task.js          # Task model
├── routes/
│   ├── api.js           # RESTful API routes
│   ├── auth.js          # Authentication routes
│   └── tasks.js         # Task CRUD routes
├── views/
│   ├── partials/
│   │   ├── header.ejs   # Header partial
│   │   └── footer.ejs   # Footer partial
│   ├── 404.ejs          # 404 page
│   ├── dashboard.ejs    # Tasks dashboard
│   ├── error.ejs        # Error page
│   ├── login.ejs        # Login page
│   ├── register.ejs     # Registration page
│   ├── task-edit.ejs    # Edit task page
│   ├── task-new.ejs     # Create task page
│   └── task-view.ejs    # View task page
├── public/
│   └── css/
│       └── style.css    # Stylesheet
├── middleware/
│   └── auth.js          # Authentication middleware
├── .env                 # Environment variables
├── .env.example         # Environment variables template
├── package.json         # Node.js dependencies
├── railway.json         # Railway deployment configuration (optional)
└── server.js            # Main server file
```

> **Note:** `railway.json` is optional and only needed if deploying to Railway platform.


## Operation Guide
1. Register an account. (Doesn't need a real account.)
2. Log in.
3. Add task by clicking "ADD TASK".
4. Fill in the form.
5. Click "ADD TASK".
6. Click on task to edit task.
7. Click "MARK AS DONE" to mark as done.
8. Click "DELETE" to delete.
9. Click "PROCRASTINATE" to postpone all tasks by 1 day.
10. Select status and priority filters and sort to filter and sort.
11. Input in Search box and click "SEARCH TASKS" to search task.
12. Click "LOG OUT" to log out.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` and set your MongoDB connection string:

**For local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/taskmanager
```

**For MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
```

### 3. Start MongoDB

**Option A: Local MongoDB**
Make sure MongoDB is running on your system:
```bash
# On Linux/macOS
mongod

# On Windows
"C:\Program Files\MongoDB\Server\[version]\bin\mongod.exe"
```

**Option B: MongoDB Atlas (Recommended)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and add it to `.env`

### 4. Run the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Tasks API (No Authentication Required)

Details in API.md.

- **GET /api/tasks** - Get all tasks (with optional query params: `search`, `status`, `priority`, `sort`)
- **GET /api/tasks/:id** - Get a specific task
- **POST /api/tasks** - Create a new task
  - Body: `{ title, description, status, priority, dueDate, userId }`
- **PUT /api/tasks/:id** - Update a task
  - Body: `{ title, description, status, priority, dueDate }`
- **DELETE /api/tasks/:id** - Delete a task

### Accounts API (No Authentication Required)

- **GET /api/accounts** - Get all accounts (with optional query params: `search`, `email`, `username`, `sort`)
- **GET /api/accounts/:id** - Get a specific account
- **POST /api/accounts** - Create a new account
  - Body: `{ username, email, password, confirmPassword }`
- **DELETE /api/accounts/:id** - Delete an account (also deletes all associated tasks)

### Web Routes

- **GET /** - Redirect to dashboard (if logged in) or login
- **GET /login** - Login page
- **POST /login** - Login user
- **GET /register** - Registration page
- **POST /register** - Register new user
- **GET /logout** - Logout page (with countdown)
- **POST /logout** - Logout user
- **GET /tasks** - Dashboard (requires authentication)
- **GET /tasks/new** - Create task form (requires authentication)
- **POST /tasks** - Create task (requires authentication)
- **GET /tasks/:id** - View task (requires authentication)
- **GET /tasks/:id/edit** - Edit task form (requires authentication)
- **PUT /tasks/:id** - Update task (requires authentication)
- **DELETE /tasks/:id** - Delete task (requires authentication)
- **POST /tasks/procrastinate** - Postpone all tasks by one day (requires authentication)

## Testing the Application

### 1. Web Interface Testing

1. Open browser to `http://localhost:3000`
2. Register a new account
3. Create, edit, delete, and search for tasks
4. Test all CRUD operations

### 2. API Testing

Use cURL to test the API:

**Create a task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "status": "pending",
    "priority": "medium",
    "userId": "your-user-id-here"
  }'
```

**Get all tasks:**
```bash
curl http://localhost:3000/api/tasks
```

**Update a task:**
```bash
curl -X PUT http://localhost:3000/api/tasks/:id \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

**Delete a task:**
```bash
curl -X DELETE http://localhost:3000/api/tasks/:id
```

## Cloud Deployment

Check DEPLOYMENT.md.

## Troubleshooting

**MongoDB Connection Error:**
- Verify MongoDB is running (for local)
- Check connection string in `.env`
- For MongoDB Atlas, ensure IP is whitelisted

**Session Issues:**
- Clear browser cookies
- Check SESSION_SECRET is set in `.env`

**Port Already in Use:**
- Change `PORT` in `.env`
- Kill process using port 3000: `lsof -ti:3000 | xargs kill`
