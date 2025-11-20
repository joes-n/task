const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');

// GET /api/tasks - Read all tasks (with optional filters)
router.get('/tasks', async (req, res) => {
  try {
    const { search, status, priority, sort } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    // Build sort
    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    if (sort === 'dueDate') sortObj = { dueDate: 1 };

    const tasks = await Task.find(query).sort(sortObj).lean();

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('API Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
});

// GET /api/tasks/:id - Read single task
router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).lean();

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('API Error fetching task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task'
    });
  }
});

// POST /api/tasks - Create new task
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, userId } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    // For API usage, we'll accept userId in the body (in production, use proper authentication)
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const task = new Task({
      title,
      description: description || '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      user: userId
    });

    await task.save();

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('API Error creating task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/tasks/:id', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate })
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('API Error updating task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update task'
    });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('API Error deleting task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete task'
    });
  }
});

// GET /api/accounts - Read all accounts (with optional filters)
router.get('/accounts', async (req, res) => {
  try {
    const { search, email, username, sort } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (email) {
      query.email = email;
    }

    if (username) {
      query.username = username;
    }

    // Build sort
    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    if (sort === 'username') sortObj = { username: 1 };
    if (sort === 'email') sortObj = { email: 1 };

    const accounts = await User.find(query).sort(sortObj).select('-password').lean();

    res.json({
      success: true,
      count: accounts.length,
      data: accounts
    });
  } catch (error) {
    console.error('API Error fetching accounts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch accounts'
    });
  }
});

// GET /api/accounts/:id - Read single account
router.get('/accounts/:id', async (req, res) => {
  try {
    const account = await User.findById(req.params.id).select('-password').lean();

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    res.json({
      success: true,
      data: account
    });
  } catch (error) {
    console.error('API Error fetching account:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch account'
    });
  }
});

module.exports = router;
