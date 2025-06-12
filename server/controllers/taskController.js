import Task from '../models/Task.js';
import Notification from '../models/Notification.js'; // Import Notification model
import Organization from '../models/Organization.js'; // Import Organization model

// Create Task
export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    const redisClient = req.app.get('redis');
    const io = req.app.get('io');

    if (redisClient) {
      try {
        await redisClient.del("tasks:all");
        await redisClient.setEx(`task:${task._id}`, 3600, JSON.stringify(task));
      } catch (error) {
        console.error('Redis DEL/SETEX error:', error);
        // Proceed even if Redis operations fail
      }
    }

    // Save notification to DB
    if (task.assignedTo) {
      try {
        const messageContent = `You have been assigned a new task: ${task.title}`;
        await Notification.create({
          userId: task.assignedTo,
          message: messageContent,
          taskId: task._id,
        });

        // Real-time notification for task assignment (Socket.io)
        if (io && redisClient) {
          const targetSocketId = await redisClient.get(task.assignedTo.toString());
          if (targetSocketId) {
            io.to(targetSocketId).emit('taskAssigned', {
              message: messageContent, // Use the same message
              task,
            });
          }
        }
      } catch (error) {
        console.error('Error creating notification or emitting taskAssigned event:', error);
        // Decide if the main operation should fail if notification fails.
        // For now, we log the error and proceed with sending the response.
      }
    }

    res.status(201).json(task);
  } catch (error) {
    // If task creation itself failed (e.g., DB error for Task.create)
    res.status(400).json({ error: error.message });
  }
};

// Get All Tasks
export const getAllTasks = async (req, res) => {
  const cacheKey = "tasks:all";
  const redisClient = req.app.get('redis');

  try {
    if (redisClient) {
      const cachedTasks = await redisClient.get(cacheKey);
      if (cachedTasks) {
        return res.status(200).json(JSON.parse(cachedTasks));
      }
    }
  } catch (error) {
    console.error('Redis GET error:', error);
    // Proceed to fetch from DB if Redis fails
  }

  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    if (redisClient) {
      try {
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(tasks));
      } catch (error) {
        console.error('Redis SETEX error:', error);
        // Proceed to return tasks even if Redis SETEX fails
      }
    }
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Task By ID
export const getTaskById = async (req, res) => {
  const taskId = req.params.id;
  const cacheKey = `task:${taskId}`;
  const redisClient = req.app.get('redis');

  try {
    if (redisClient) {
      const cachedTask = await redisClient.get(cacheKey);
      if (cachedTask) {
        return res.status(200).json(JSON.parse(cachedTask));
      }
    }
  } catch (error) {
    console.error('Redis GET error:', error);
    // Proceed to fetch from DB if Redis fails
  }

  try {
    const task = await Task.findById(taskId).populate('organization', 'name members'); // Populate organization details for the check
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Organization Membership Check
    const userUuid = req.user.userId; // Logged-in user's string UUID
    const taskOrganizationId = task.organization ? task.organization._id : null; // ObjectId of the task's organization

    if (!taskOrganizationId) {
        // If the task for some reason doesn't have an organization, deny access.
        // This case should ideally not happen if 'organization' is required in Task schema.
        return res.status(403).json({ error: 'Task has no associated organization, access denied.' });
    }
    
    // Check if the user is a member of the task's organization
    // No need for another DB call if task.organization is populated with members
    let isMember = false;
    if (task.organization && task.organization.members) {
        isMember = task.organization.members.some(member => member.userId === userUuid);
    } else {
        // Fallback to DB check if members were not populated (should not happen with the populate above)
        const orgMembership = await Organization.findOne({ 
          _id: taskOrganizationId,
          'members.userId': userUuid 
        });
        if (orgMembership) isMember = true;
    }

    if (!isMember) {
      // If user is not a member of the task's organization, deny access.
      return res.status(404).json({ error: 'Task not found or access denied' }); 
    }

    // If check passes, then proceed to cache and return
    if (redisClient) {
      try {
        // We might not want to cache the populated version if it's too large or contains sensitive info not always needed.
        // For now, caching the task as fetched (potentially populated).
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(task));
      } catch (error) {
        console.error('Redis SETEX error:', error);
      }
    }
    // Strip populated fields if they were only for the check and not for client response
    // Or ensure client expects/handles populated fields
    // For now, returning the (potentially) populated task.
    res.status(200).json(task);
  } catch (error) {
    console.error('Error in getTaskById:', error); // Added console.error for better logging
    res.status(500).json({ error: error.message });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const redisClient = req.app.get('redis');
  const io = req.app.get('io');

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      req.body,
      { new: true, runValidators: true } // Ensure runValidators is present
    );
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });

    if (redisClient) {
      try {
        await redisClient.del("tasks:all");
        await redisClient.del(`task:${taskId}`);
        await redisClient.setEx(`task:${updatedTask._id}`, 3600, JSON.stringify(updatedTask));
      } catch (error) {
        console.error('Redis DEL/SETEX error:', error);
        // Proceed even if Redis operations fail
      }
    }

    // Real-time notification for task update
    if (updatedTask.assignedTo && io && redisClient) {
      try {
        const targetSocketId = await redisClient.get(updatedTask.assignedTo.toString());
        if (targetSocketId) {
          io.to(targetSocketId).emit('taskUpdated', updatedTask);
        }
      } catch (error) {
        console.error('Error emitting taskUpdated event:', error);
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
  let deletedTaskInstance = null; // To store the task instance before deletion

  try {
    // Fetch the task before deleting to get its details, especially assignedTo
    deletedTaskInstance = await Task.findById(taskId);
    if (!deletedTaskInstance) {
      return res.status(404).json({ error: 'Task not found for deletion' });
    }

    const task = await Task.findByIdAndDelete(taskId);
    // task here is the same as deletedTaskInstance if deletion was successful.
    // If findByIdAndDelete returns null (though we checked above), something went wrong.
    if (!task) return res.status(404).json({ error: 'Task not found or already deleted' });


    if (redisClient) {
      try {
        await redisClient.del("tasks:all");
        await redisClient.del(`task:${taskId}`);
      } catch (error) {
        console.error('Redis DEL error:', error);
        // Proceed even if Redis operations fail
      }
    }

    // Real-time notification for task deletion
    if (deletedTaskInstance.assignedTo && io && redisClient) {
      try {
        const targetSocketId = await redisClient.get(deletedTaskInstance.assignedTo.toString());
        if (targetSocketId) {
          io.to(targetSocketId).emit('taskDeleted', { id: taskId });
        }
      } catch (error) {
        console.error('Error emitting taskDeleted event:', error);
      }
    }

    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
