const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { ensureAuthenticated } = require('../middleware/auth');

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

// Get all tasks (dashboard)
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const { search, status, priority, sort } = req.query;

    // Build query
    const query = { user: req.session.userId };

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
    let sortObj = { createdAt: -1 }; // default: newest first
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    if (sort === 'dueDate') sortObj = { dueDate: 1 };

    const tasks = await Task.find(query).sort(sortObj).lean();

    res.render('dashboard', {
      title: 'Dashboard',
      tasks,
      filters: { search, status, priority, sort }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).render('error', { title: 'Error', error });
  }
});

// Create new task form
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('task-new', { title: 'New Task' });
});

// Create new task
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      user: req.session.userId
    });

    await task.save();
    res.redirect('/tasks?success=Task created successfully');
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).render('task-new', {
      title: 'Create New Task',
      error: 'Failed to create task. Please try again.',
      task: req.body
    });
  }
});

// Get single task
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.session.userId
    });

    if (!task) {
      return res.status(404).render('error', {
        title: 'Error',
        error: { message: 'Task not found' }
      });
    }

    res.render('task-view', { title: 'View Task', task });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).render('error', { title: 'Error', error });
  }
});

// Edit task form
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.session.userId
    });

    if (!task) {
      return res.status(404).render('error', {
        title: 'Error',
        error: { message: 'Task not found' }
      });
    }

    res.render('task-edit', { title: 'Edit Task', task });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).render('error', { title: 'Error', error });
  }
});

// Update task
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      {
        title,
        description,
        status,
        priority,
        dueDate: dueDate || null
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).render('error', {
        title: 'Error',
        error: { message: 'Task not found' }
      });
    }

    res.redirect('/tasks?success=Task updated successfully');
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).render('task-edit', {
      title: 'Edit Task',
      task: { ...req.body, _id: req.params.id },
      error: 'Failed to update task. Please try again.'
    });
  }
});

// Delete task
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.session.userId
    });

    if (!task) {
      return res.status(404).render('error', {
        title: 'Error',
        error: { message: 'Task not found' }
      });
    }

    res.redirect('/tasks?success=Task deleted successfully');
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).render('error', { title: 'Error', error });
  }
});

// Procrastinate - push all tasks out by one day
router.post('/procrastinate', ensureAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.session.userId }).select('_id dueDate');

    if (!tasks.length) {
      return res.status(404).json({
        success: false,
        error: 'No tasks found to procrastinate.'
      });
    }

    const postponedTaskIds = tasks.map(task => task._id.toString());

    const bulkOps = tasks.map(task => {
      const currentDueDate = task.dueDate ? new Date(task.dueDate) : new Date();
      const postponedDueDate = new Date(currentDueDate.getTime() + ONE_DAY_IN_MS);

      return {
        updateOne: {
          filter: { _id: task._id },
          update: { $set: { dueDate: postponedDueDate } }
        }
      };
    });

    await Task.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: `Postponed ${bulkOps.length} task${bulkOps.length === 1 ? '' : 's'} by one day.`,
      updatedCount: bulkOps.length,
      taskIds: postponedTaskIds
    });
  } catch (error) {
    console.error('Error postponing tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to procrastinate tasks. Please try again.'
    });
  }
});

module.exports = router;
