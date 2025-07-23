import cron from 'node-cron';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { sendNotification } from '../utils/notificationUtils.js';
import { admin } from '../config/firebaseAdmin.js'; 

let io_instance = null;
let redis_client_instance = null;


const checkIdleTasks = async () => {
  if (!io_instance || !redis_client_instance) {
    console.error('[SchedulerService-IdleTasks] IO or Redis client not initialized.');
    return;
  }
  console.log('[SchedulerService-IdleTasks] Checking for idle tasks...');
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  try {
    const idleTasks = await Task.find({
      status: { $ne: 'done' }, // Task is not completed
      updatedAt: { $lte: sevenDaysAgo }, // Last updated more than 7 days ago
      assignedTo: { $ne: null } // Task is assigned
    }).populate('assignedTo', 'userId'); // Populate assignedTo to get user's UUID

    if (idleTasks.length > 0) {
      console.log(`[SchedulerService-IdleTasks] Found ${idleTasks.length} idle tasks.`);
      for (const task of idleTasks) {
        if (task.assignedTo && task.assignedTo.userId) {
  
          // console.log(`[SchedulerService-IdleTasks] Sending idle notification for task "${task.title}" to user ${task.assignedTo.userId}`);
          await sendNotification({
            io: io_instance,
            redisClient: redis_client_instance,
            userId: task.assignedTo.userId, // User's UUID
            type: 'idleTask',
            message: `The task "${task.title}" has been untouched for 7 days.`,
            entityId: task._id,
            entityModel: 'Task',
          });
        } else {
          console.warn(`[SchedulerService-IdleTasks] Task ${task._id} is idle but has no valid assignee or assignee UUID.`);
        }
      }
    } else {
      console.log('[SchedulerService-IdleTasks] No idle tasks found.');
    }
  } catch (error) {
    console.error('[SchedulerService-IdleTasks] Error checking for idle tasks:', error);
  }
};

const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_DAY = 24 * MS_PER_HOUR;

const deadlineNotificationWindows = [
  { id: 'overdue', threshold: 0, frequency: 6 * MS_PER_HOUR, message: "Overdue: Task \"{taskTitle}\" was due on {dueDate}. Please update its status." }, // Notify every 6 hours if overdue
  { id: 'due_1h', threshold: 1 * MS_PER_HOUR, frequency: 15 * 60 * 1000, message: "Urgent: Task \"{taskTitle}\" is due in ~{timeLeft}!" }, // Notify every 15 mins in the last hour
  { id: 'due_6h', threshold: 6 * MS_PER_HOUR, frequency: 1 * MS_PER_HOUR, message: "High Alert: Task \"{taskTitle}\" is due in ~{timeLeft} today!" }, // Notify hourly in the last 6 hours
  { id: 'due_24h', threshold: 1 * MS_PER_DAY, frequency: 4 * MS_PER_HOUR, message: "Alert: Task \"{taskTitle}\" is due in ~{timeLeft} (on {dueDate})." }, // Notify every 4 hours within 24 hours
  { id: 'due_3d', threshold: 3 * MS_PER_DAY, frequency: null, message: "Reminder: Task \"{taskTitle}\" is due in ~{timeLeft} (on {dueDate})." }, // Notify once when 3 days away
  { id: 'due_7d', threshold: 7 * MS_PER_DAY, frequency: null, message: "FYI: Task \"{taskTitle}\" is due in ~{timeLeft} (on {dueDate})." } // Notify once when 7 days away
];

const formatTimeLeft = (ms) => {
  if (ms <= 0) return "now";
  const days = Math.floor(ms / MS_PER_DAY);
  const hours = Math.floor((ms % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((ms % MS_PER_HOUR) / (60 * 1000));

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}${hours > 0 ? ` ${hours} hour${hours > 1 ? 's' : ''}` : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} min${minutes > 1 ? 's' : ''}`: ''}`;
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
};

const checkDeadlineAlerts = async () => {
  if (!io_instance || !redis_client_instance) {
    console.error('[SchedulerService-Deadlines] IO or Redis client not initialized.');
    return;
  }
  console.log(`[SchedulerService-Deadlines] Running deadline check at ${new Date().toISOString()}`);

  const now = new Date();
  const currentTime = now.getTime();

  try {
    // Fetch all tasks that are not done and are assigned
    const tasks = await Task.find({
      status: { $ne: 'done' },
      assignedTo: { $ne: null },
      dueDate: { $ne: null }
    }).populate('assignedTo', 'userId');

    if (tasks.length === 0) {
      console.log('[SchedulerService-Deadlines] No relevant tasks found to check.');
      return;
    }

    for (const task of tasks) {
      if (!task.assignedTo || !task.assignedTo.userId) continue;

      const dueDate = task.dueDate.getTime();
      const timeLeftMs = dueDate - currentTime;

      for (const window of deadlineNotificationWindows) {
        const isOverdueTask = timeLeftMs <= 0;
        
        // Special handling for overdue tasks: they only match the 'overdue' window
        if (window.id === 'overdue' && !isOverdueTask) {
            continue; 
        }
        if (window.id !== 'overdue' && isOverdueTask) {
            continue; 
        }

        const matchesWindow = (isOverdueTask && window.id === 'overdue') || 
                              (!isOverdueTask && timeLeftMs <= window.threshold);

        if (matchesWindow) {
          const lastNotifiedForWindow = task.deadlineNotifiedAt?.get(window.id);

          // Determine if notification should be sent
          let shouldNotify = false;
          if (!lastNotifiedForWindow) {
            // Never notified for this window before
            shouldNotify = true;
          } else if (window.frequency !== null) {
         
            if (currentTime - lastNotifiedForWindow.getTime() >= window.frequency) {
              shouldNotify = true;
            }
          }
   
          if (shouldNotify) {
            const message = window.message
              .replace('{taskTitle}', task.title)
              .replace('{dueDate}', task.dueDate.toLocaleDateString())
              .replace('{timeLeft}', formatTimeLeft(Math.max(0, timeLeftMs))); // Use Math.max for timeLeft in message

            console.log(`[SchedulerService-Deadlines] Sending (${window.id}) notification for task "${task.title}" to user ${task.assignedTo.userId}`);
            
            await sendNotification({
              io: io_instance,
              redisClient: redis_client_instance,
              userId: task.assignedTo.userId,
              type: 'deadline',
              message: message,
              entityId: task._id,
              entityModel: 'Task',
            });

            // Update the last notification timestamp for this window
            if (!task.deadlineNotifiedAt) {
              task.deadlineNotifiedAt = new Map();
            }
            task.deadlineNotifiedAt.set(window.id, now);
            await task.save(); 
            
 
            break; 
          }
        }
      }
    }
  } catch (error) {
    console.error('[SchedulerService-Deadlines] Error checking for deadline alerts:', error);
  }
};

// Schedule jobs
const scheduleJobs = () => {
  // Schedule checkIdleTasks to run daily at 9:00 AM UTC
  cron.schedule('0 9 * * *', checkIdleTasks, {
    timezone: "UTC"
  });
  console.log('[SchedulerService] Scheduled job: checkIdleTasks (daily at 9:00 UTC)');

 
  cron.schedule('*/15 * * * *', checkDeadlineAlerts); // Runs every 15 minutes
  console.log('[SchedulerService] Scheduled job: checkDeadlineAlerts (every 15 minutes)');
};

// Main scheduler initialization function
const initializeScheduler = (io, redisClient) => {
  console.log('[SchedulerService] Initializing scheduler...');
  io_instance = io;
  redis_client_instance = redisClient;

  scheduleJobs(); // Call to schedule the defined jobs

  console.log('[SchedulerService] Scheduler initialized and jobs scheduled.');
};

// Export the initializeScheduler function as default
export default initializeScheduler;

// Optional: Export other functions if needed elsewhere
export {
  checkIdleTasks,
  checkDeadlineAlerts,
  scheduleJobs
};