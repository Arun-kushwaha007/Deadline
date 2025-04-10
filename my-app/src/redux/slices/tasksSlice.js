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


const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        id: Date.now().toString(),
        title: action.payload.title,
        description: action.payload.description || '',
        dueDate: action.payload.dueDate || '',
        status: 'todo',
      };
      state.tasks.push(newTask);
    },
    
    updateTaskStatus(state, action) {
      const { id, status } = action.payload;
      const task = state.tasks.find((t) => t.id === id);
      if (task) task.status = status;
    },
  },
});

export const { addTask, updateTaskStatus } = tasksSlice.actions;
export default tasksSlice.reducer;
