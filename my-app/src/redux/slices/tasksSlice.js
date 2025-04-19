// redux/slices/tasksSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

// Async thunk for fetching tasks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:5000/api/tasks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

// Async thunk for creating a task
export const createTask = createAsyncThunk('tasks/createTask', async (taskData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post('http://localhost:5000/api/tasks', taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

// Async thunk for updating a task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, ...taskData } ) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

// Async thunk for deleting a task
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId) => {
  const token = localStorage.getItem('token');
  await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return taskId; // Return the id for reducer
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {}, // No synchronous reducers needed now
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default tasksSlice.reducer;
