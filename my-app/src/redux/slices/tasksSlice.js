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
    addTask: (state, action) => {
      const newTask = {
        ...action.payload,
        id: Date.now(),
        status: 'todo',
        labels: action.payload.labels || [],
        dueDate: action.payload.dueDate || '',
        subtasks: action.payload.subtasks || [],
      };
      state.tasks.push(newTask);
    },
    
    editTask: (state, action) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          ...action.payload,
        };
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
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
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

export const { addTask, updateTaskStatus, editTask,updateTaskOrganization, reorderTasks,reorderOrgTasks, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
