# Task Management System

A full-stack web application built with Express.js and MongoDB featuring user authentication and CRUD operations.

## Features

- **User Authentication**: Secure login/logout with session management
- **Protected Routes**: Only authenticated users can access CRUD operations
- **CRUD Web Interface**: Create, read, update, and delete tasks through a user-friendly web UI
- **RESTful APIs**: Programmatic access to task data via API endpoints
- **Advanced Search**: Filter tasks by title, description, status, and priority
- **Responsive Design**: Mobile-friendly UI with modern styling

## Technology Stack

- **Backend**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Views**: EJS templating engine
- **Authentication**: express-session
- **Password Hashing**: bcrypt
- **Styling**: Custom CSS

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
└── server.js            # Main server file
```

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

### Option 1: Railway (Recommended)

1. Push your code to GitHub
2. Create account at [Railway](https://railway.app)
3. Create a new project from GitHub repo
4. Add MongoDB Atlas as a database service
5. Set environment variables in Railway dashboard
6. Deploy automatically

### Option 2: Heroku

1. Create account at [Heroku](https://heroku.com)
2. Create a new app
3. Add MongoDB Atlas add-on or use Atlas connection string
4. Set config vars for environment variables
5. Deploy via Git or GitHub integration

### Option 3: Render

1. Create account at [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Add environment variables
5. Use MongoDB Atlas for database

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
