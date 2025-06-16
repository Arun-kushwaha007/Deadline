import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API_BASE_URL = `${backendUrl}/api`;

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

const initialState = {
  tasks: [],
  status: 'idle',
  error: null,
  users: [],
  usersStatus: 'idle',
};

// Async Thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (organizationId, { rejectWithValue }) => {
  try {
    let apiUrl = `${API_BASE_URL}/tasks`;
    if (organizationId) {
      apiUrl += `?organizationId=${organizationId}`;
    }
    const response = await axios.get(apiUrl, getAuthConfig());
    // Ensure the response is always an array
    const data = Array.isArray(response.data) ? response.data : [response.data];
    return data.map(task => ({ ...task, id: task._id }));
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchUsers = createAsyncThunk('tasks/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, getAuthConfig());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const createTask = createAsyncThunk('tasks/createTask', async (taskData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tasks`, taskData, getAuthConfig());
    return { ...response.data, id: response.data._id };
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (taskData, { rejectWithValue }) => {
  try {
    const { id, ...data } = taskData;
    const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, data, getAuthConfig());
    return { ...response.data, id: response.data._id };
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteTaskThunk = createAsyncThunk('tasks/deleteTask', async (taskId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, getAuthConfig());
    return taskId;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    updateTaskStatus: (state, action) => {
      const { id, status } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) task.status = status;
    },
    reorderTasks: (state, action) => {
      const { status, tasks: reorderedTasks } = action.payload;
      const filteredOut = state.tasks.filter(t => t.status !== status);
      state.tasks = [...filteredOut, ...reorderedTasks];
    },
    updateTaskOrganization: (state, action) => {
      const { id, organization } = action.payload;
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        task.organization = organization;
      }
    },
    reorderOrgTasks: (state, action) => {
      const { organization, tasks: reorderedTasks } = action.payload;
      reorderedTasks.forEach((task, index) => {
        const originalTask = state.tasks.find(t => t.id === task.id);
        if (originalTask && originalTask.organization === organization) {
          originalTask.order = index;
        }
      });
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Always set as array
        state.tasks = Array.isArray(action.payload) ? action.payload : [action.payload];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete Task
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTaskThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.usersStatus = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersStatus = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  updateTaskStatus,
  reorderTasks,
  updateTaskOrganization,
  reorderOrgTasks,
  clearTasks, // Export the new action
} = tasksSlice.actions;

export default tasksSlice.reducer;