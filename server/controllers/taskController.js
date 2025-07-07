import Task from '../models/Task.js';

import Organization from '../models/Organization.js';
import User from '../models/User.js';
import { sendNotification } from '../utils/notificationUtils.js';

// Helper Redis keys
const taskKey = (id) => `task:${id}`;
const allTasksKey = 'tasks:all';

// Create Task
export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    const redisClient = req.app.get('redis');
    const io = req.app.get('io');

    if (redisClient) {
      try {
        console.log('🚀 Caching task in Redis with key:', taskKey(task._id));

        await redisClient.multi()
          .del(allTasksKey)
          .setEx(taskKey(task._id), 3600, JSON.stringify(task))
          .exec();
      } catch (error) {
        console.error('Redis DEL/SETEX error:', error);
      }
    }

    // Send notification if task is assigned upon creation
    if (task.assignedTo) {
      const assignedUser = await User.findById(task.assignedTo);
      if (assignedUser && assignedUser.userId) {
        await sendNotification({
          io,
          redisClient,
          userId: assignedUser.userId, 
          type: 'taskAssigned',
          message: `You have been assigned a new task: ${task.title}`,
          entityId: task._id,
          entityModel: 'Task',
        });
      } else {
        console.warn(`[taskController.createTask] User not found or missing UUID for _id: ${task.assignedTo}`);
      }
    }

    // Emit task_created_in_organization event to the organization room
    if (task.organization && io) {
      const orgId = task.organization._id || task.organization;
      const roomName = `org:${orgId}`;
      const taskObject = { ...task.toObject(), id: task._id };
      io.to(roomName).emit('task_created_in_organization', taskObject);
      console.log(`[Task Create] Emitted 'task_created_in_organization' to room ${roomName} for new task ${task._id}`);
    }

    res.status(201).json({ ...task.toObject(), id: task._id });
  } catch (error) {
    console.error(`[Task Create Controller] Error creating task:`, error);
    res.status(400).json({ error: error.message, details: error.errors });
  }
};

// Get All Tasks
// Get All Tasks for a User's Organizations
export const getAllTasks = async (req, res) => {
  const redisClient = req.app.get('redis');
  const userId = req.user.userId;

  try {
    // Check cache first
    if (redisClient) {
      const cached = await redisClient.get(`${allTasksKey}:${userId}`);
      if (cached) return res.status(200).json(JSON.parse(cached));
    }

    // Find organizations user belongs to
    const organizations = await Organization.find({ 'members.userId': userId });

    const orgIds = organizations.map(org => org._id);

    // Fetch tasks for those organizations
    const tasks = await Task.find({ organization: { $in: orgIds } }).sort({ createdAt: -1 });

    // Cache the result
    if (redisClient) {
      await redisClient.setEx(`${allTasksKey}:${userId}`, 3600, JSON.stringify(tasks));
    }

    return res.status(200).json(tasks);
  } catch (error) {
    console.error('getAllTasks error:', error);
    return res.status(500).json({ error: error.message });
  }
};


// Get Task By ID
export const getTaskById = async (req, res) => {
  const { id: taskId } = req.params;
  const redisClient = req.app.get('redis');

  try {
    if (redisClient) {
      const cachedTask = await redisClient.get(taskKey(taskId));
      if (cachedTask) return res.status(200).json(JSON.parse(cachedTask));
    }
  } catch (error) {
    console.error('Redis GET error:', error);
  }

  try {
    const task = await Task.findById(taskId).populate('organization', 'name members');
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const userUuid = req.user.userId;
    const orgId = task.organization?._id;

    if (!orgId) {
      return res.status(403).json({ error: 'Task has no associated organization, access denied.' });
    }

    let isMember = task.organization?.members?.some(member => member.userId === userUuid);
    if (!isMember) {
      const org = await Organization.findOne({ _id: orgId, 'members.userId': userUuid });
      if (!org) return res.status(404).json({ error: 'Task not found or access denied' });
    }

    if (redisClient) {
      try {
        await redisClient.setEx(taskKey(taskId), 3600, JSON.stringify(task));
      } catch (error) {
        console.error('Redis SETEX error:', error);
      }
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('getTaskById error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  const taskId = req.params.id;
  console.log(`[Task Update Controller] Received PUT request for task ${taskId} with body:`, JSON.stringify(req.body, null, 2));
  const redisClient = req.app.get('redis');
  const io = req.app.get('io');
  const { assignedTo: newAssignee } = req.body;

  try {
    // Fetch the task before updating to check the old assignee
    const taskBeforeUpdate = await Task.findById(taskId);
    if (!taskBeforeUpdate) return res.status(404).json({ error: 'Task not found' });

    const oldAssignee = taskBeforeUpdate.assignedTo ? taskBeforeUpdate.assignedTo.toString() : null;

    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });

    if (redisClient) {
      try {
        await redisClient.multi()
          .del(allTasksKey)
          .del(taskKey(taskId))
          .setEx(taskKey(updatedTask._id), 3600, JSON.stringify(updatedTask))
          .exec();
      } catch (error) {
        console.error('Redis update cache error:', error);
      }
    }

    // Check if 'assignedTo' field was updated and is different from the old assignee
    const finalAssigneeMongoId = updatedTask.assignedTo ? updatedTask.assignedTo.toString() : null;

    // If the assignee has changed and there is a new assignee
    if (finalAssigneeMongoId && finalAssigneeMongoId !== oldAssignee) {
      const userToNotify = await User.findById(finalAssigneeMongoId);
      if (userToNotify && userToNotify.userId) {
        await sendNotification({
          io,
          redisClient,
          userId: userToNotify.userId, // Use UUID
          type: 'taskAssigned',
          message: `You have been assigned a task: ${updatedTask.title}`,
          entityId: updatedTask._id,
          entityModel: 'Task',
        });
      } else {
        console.warn(`[taskController.updateTask] User to notify (final assignee) not found or missing UUID for _id: ${finalAssigneeMongoId}`);
      }
    }


    // Emit a general task update event to the organization room
    if (updatedTask.organization && io) {
      const orgId = updatedTask.organization._id || updatedTask.organization; 
      const roomName = `org:${orgId}`;
  
      io.to(roomName).emit('task_updated_in_organization', { ...updatedTask.toObject(), id: updatedTask._id });
      console.log(`[Task Update] Emitted 'task_updated_in_organization' to room ${roomName} for task ${updatedTask._id}`);
    }


    res.status(200).json({ ...updatedTask.toObject(), id: updatedTask._id });
  } catch (error) {
    console.error(`[Task Update Controller] Error updating task ${taskId}:`, error);
    // Check if it's a Mongoose validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors,
        message: error.message // General message
      });
    }
    res.status(400).json({ error: error.message, details: error.toString() });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  const redisClient = req.app.get('redis');
  const io = req.app.get('io');

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found for deletion' });

    await Task.findByIdAndDelete(taskId);

    if (redisClient) {
      try {
        await redisClient.del(allTasksKey);
        await redisClient.del(taskKey(taskId));
      } catch (error) {
        console.error('Redis DEL error:', error);
      }
    }

    if (task.assignedTo && io && redisClient) {
      try {
        const targetSocketId = await redisClient.get(task.assignedTo.toString());
        if (targetSocketId) {
          io.to(targetSocketId).emit('taskDeleted', { id: taskId });
        }
      } catch (error) {
        console.error('Socket emit error:', error);
      }
    }

    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
