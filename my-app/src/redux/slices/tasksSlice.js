// redux/slices/tasksSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [
    {
      id: '1',
      title: 'Finish UI',
      description: 'Create Kanban UI using Tailwind & DnD Kit.',
      status: 'todo',
      priority: 'medium',
      dueDate: '2025-04-15',
    },
    {
      id: '2',
      title: 'Set up Redux',
      description: 'Configure store and slices for task management.',
      status: 'inprogress',
      priority: 'high',
      dueDate: '2025-04-18',
    },
  ],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Assumes action.payload is a complete task object from the backend
    // The backend uses _id, so we map it to id for frontend consistency
    addTask: (state, action) => {
      const newTask = { ...action.payload, id: action.payload._id || action.payload.id };
      // Prevent duplicates if event is received multiple times or task already exists
      if (!state.tasks.find(task => task.id === newTask.id)) {
        state.tasks.push(newTask);
      }
    },
    
    // Renamed from editTask for consistency. Assumes action.payload is the updated task object.
    updateTask: (state, action) => {
      const updatedTask = { ...action.payload, id: action.payload._id || action.payload.id };
      const index = state.tasks.findIndex((task) => task.id === updatedTask.id);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      } else {
        // Optionally, if the task doesn't exist, add it
        // This could happen if the update event arrives before the add event
        state.tasks.push(updatedTask);
      }
    },
    
    updateTaskStatus: (state, action) => {
      const { id, status } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) task.status = status;
    },
     reorderOrgTasks: (state, action) => {
          const { organization, tasks: reorderedTasks } = action.payload;
          reorderedTasks.forEach((task, index) => {
            const originalTask = state.tasks.find((t) => t.id === task.id);
            if (originalTask && originalTask.organization === organization) {
              originalTask.order = index;
            }
          });
        },
    
    reorderTasks: (state, action) => {
      const { status, tasks: reorderedTasks } = action.payload;
      const filteredOut = state.tasks.filter((t) => t.status !== status);
      state.tasks = [...filteredOut, ...reorderedTasks];
    },
    // Expects action.payload to be { id: 'taskId' }
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload.id);
    },
      updateTaskOrganization: (state, action) => {
          const { id, organization } = action.payload;
          const task = state.tasks.find((t) => t.id === id);
          if (task) {
            task.organization = organization;
          }
        },
  },
});

export const { addTask, updateTask, updateTaskStatus, editTask, updateTaskOrganization, reorderTasks, reorderOrgTasks, deleteTask } = tasksSlice.actions; // Ensure updateTask is exported
export default tasksSlice.reducer;
