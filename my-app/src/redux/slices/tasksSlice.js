// redux/slices/tasksSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [
    {
      id: '1',
      title: 'Finish UI',
      description: 'Create Kanban UI using Tailwind & DnD Kit.',
      status: 'todo',
      dueDate: '2025-04-15',
    },
    {
      id: '2',
      title: 'Set up Redux',
      description: 'Configure store and slices for task management.',
      status: 'inprogress',
      dueDate: '2025-04-18',
    },
  ],
};



// import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
  },
  reducers: {
    addTask: (state, action) => {
      state.tasks.push({
        ...action.payload,
        id: Date.now().toString(), // simple unique ID
        status: 'todo', // default status
        createdAt: new Date().toISOString()
      });
    },
    updateTaskStatus: (state, action) => {
      const { id, status } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) task.status = status;
    },
   editTask: (state, action) => {
     const { id, updatedTask } = action.payload;
     const index = state.tasks.findIndex(task => task.id === id);
     if (index !== -1) {
       state.tasks[index] = { ...state.tasks[index], ...updatedTask };
     }
   },
   reorderTasks: (state, action) => {
     const { status, tasks: reorderedTasks } = action.payload;
     const filteredOut = state.tasks.filter((t) => t.status !== status);
     state.tasks = [...filteredOut, ...reorderedTasks];
   },

   deleteTask: (state, action) => {
     const id = action.payload;
     state.tasks = state.tasks.filter(task => task.id !== id);
   },
   
   
  },
});

export const { addTask, updateTaskStatus, editTask, reorderTasks, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;

