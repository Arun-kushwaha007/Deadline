import Task from '../models/Task.js';
// Notification model import is not directly needed here anymore, as sendNotification handles it.
// import Notification from '../models/Notification.js'; 
import Organization from '../models/Organization.js';
import User from '../models/User.js'; // Import User model
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
          userId: assignedUser.userId, // Use the UUID userId
          type: 'taskAssigned',
          message: `You have been assigned a new task: ${task.title}`,
          entityId: task._id,
          entityModel: 'Task',
        });
      } else {
        console.warn(`[taskController.createTask] User not found or missing UUID for _id: ${task.assignedTo}`);
      }
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
  const redisClient = req.app.get('redis');
  const io = req.app.get('io');
  const { assignedTo: newAssignee } = req.body; // Get the new assignee from the request body

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
    // If you want to notify about other updates (not just assignment), that logic would go here.
    // For example, notifying the previous assignee that the task was reassigned.
    // The current 'taskUpdated' emit is generic. If sendNotification is comprehensive,
    // you might not need the old io.to(targetSocketId).emit('taskUpdated', updatedTask); line,
    // or you might want to make it more specific.

    // For now, let's keep a general update event for other changes if needed,
    // but ensure it doesn't duplicate the assignment notification.
    if (io && redisClient && currentAssignee && currentAssignee !== newAssignee) { // Example: notify if assignee changed
        const targetSocketId = await redisClient.get(currentAssignee);
        if (targetSocketId) {
            // Emitting a generic 'taskUpdated' event to the current assignee if they weren't just newly assigned
            // This might be redundant if sendNotification covers all cases, or could be for other types of updates.
            // Consider the overall notification strategy.
            // For this subtask, the primary goal is the 'taskAssigned' notification via sendNotification.
            // io.to(targetSocketId).emit('taskUpdated', updatedTask);
            // console.log(`Sent generic taskUpdated to ${currentAssignee}`);
        }
    }


    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
