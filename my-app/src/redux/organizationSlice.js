import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Backend base URL
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API = `${backendUrl}/api/organizations`;

// Async Thunks

export const fetchOrganizations = createAsyncThunk(
  'organization/fetchOrganizations',
  async (_, thunkAPI) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return thunkAPI.rejectWithValue('Authentication token not found. Please log in.');
    }
    try {
      const { data } = await axios.get(`${API}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createOrganization = createAsyncThunk(
  'organization/createOrganization',
  async (orgName, thunkAPI) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return thunkAPI.rejectWithValue('Authentication token not found. Please log in.');
    }
    try {
      // orgName should be a string, not an object
      const { data } = await axios.post(`${API}/create`, { name: orgName }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchOrganizationDetails = createAsyncThunk(
  'organization/fetchOrganizationDetails',
  async (orgId, thunkAPI) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return thunkAPI.rejectWithValue('Authentication token not found. Please log in.');
    }
    try {
      const { data } = await axios.get(`${API}/${orgId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addMemberToOrganization = createAsyncThunk(
  'organization/addMemberToOrganization',
  async ({ orgId, email }, thunkAPI) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return thunkAPI.rejectWithValue('Authentication token not found. Please log in.');
    }
    try {
      // Corrected URL from /add-member to /members
      const { data } = await axios.post(`${API}/${orgId}/members`, { email }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const assignTaskToMember = createAsyncThunk(
  'organization/assignTaskToMember',
  async ({ orgId, title, assignedTo }, thunkAPI) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return thunkAPI.rejectWithValue('Authentication token not found. Please log in.');
    }
    try {
      // Corrected URL from /assign-task to /tasks
      const { data } = await axios.post(`${API}/${orgId}/tasks`, {
        title,
        assignedTo,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Define and Export fetchMyOrganizations Async Thunk first
export const fetchMyOrganizations = createAsyncThunk(
  'organization/fetchMyOrganizations', // Action type prefix consistent with the slice name 'organization'
  async (_, thunkAPI) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return thunkAPI.rejectWithValue('Authentication token not found. Please log in.');
    }
    try {
      const { data } = await axios.get(`${API}/mine`, { // Uses the API constant from the existing slice
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// New thunk to fetch organization members specifically for task assignment
export const fetchOrganizationMembers = createAsyncThunk(
  'organization/fetchOrganizationMembers',
  async (orgId, thunkAPI) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return thunkAPI.rejectWithValue('Authentication token not found. Please log in.');
    }
    try {
      const { data } = await axios.get(`${API}/${orgId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { orgId, members: data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
const organizationSlice = createSlice({
  name: 'organization',
  initialState: {
    organizations: [], 
    selectedOrganization: null,
    loading: false, 
    error: null,    
    currentUser: null,

    // Current user's organizations
    currentUserOrganizations: [],
    currentUserOrganizationsStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    currentUserOrganizationsError: null,

    // Organization members cache for task assignment
    organizationMembers: {}, // { orgId: { members: [], status: 'idle', error: null } }
    
    // Loading states for different operations
    detailsLoading: false,
    membersLoading: false,
  },
  reducers: {
    clearSelectedOrganization: (state) => {
      state.selectedOrganization = null;
    },
    clearOrganizationMembers: (state, action) => {
      if (action.payload) {
        // Clear specific organization's members
        delete state.organizationMembers[action.payload];
      } else {
        // Clear all cached members
        state.organizationMembers = {};
      }
    },
    // Helper to set organization members loading state
    setMembersLoading: (state, action) => {
      const { orgId, loading } = action.payload;
      if (!state.organizationMembers[orgId]) {
        state.organizationMembers[orgId] = { members: [], status: 'idle', error: null };
      }
      state.organizationMembers[orgId].status = loading ? 'loading' : 'idle';
    },
    setCurrentUser: (state, action) => {
  state.currentUser = action.payload;
},

  },
  extraReducers: (builder) => {
    builder
      // Fetch all organizations
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create organization
      .addCase(createOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.organizations.push(action.payload);
        // Also add to current user's organizations if it exists
        if (state.currentUserOrganizations) {
          state.currentUserOrganizations.push(action.payload);
        }
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single org details
      .addCase(fetchOrganizationDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedOrganization = action.payload;
        state.error = null;
        
        // Update the cache with members data if available
        if (action.payload._id && action.payload.members) {
          state.organizationMembers[action.payload._id] = {
            members: action.payload.members,
            status: 'succeeded',
            error: null
          };
        }
      })
      .addCase(fetchOrganizationDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })

      // Add member
      .addCase(addMemberToOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMemberToOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrganization = action.payload;
        
        // Update the members cache if it exists
        if (action.payload._id && state.organizationMembers[action.payload._id]) {
          state.organizationMembers[action.payload._id].members = action.payload.members;
        }
      })
      .addCase(addMemberToOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Assign task
      .addCase(assignTaskToMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTaskToMember.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrganization = action.payload;
      })
      .addCase(assignTaskToMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Current User's Organizations
      .addCase(fetchMyOrganizations.pending, (state) => {
        state.currentUserOrganizationsStatus = 'loading';
        state.currentUserOrganizationsError = null; 
      })
      .addCase(fetchMyOrganizations.fulfilled, (state, action) => {
        state.currentUserOrganizationsStatus = 'succeeded';
        state.currentUserOrganizations = action.payload;
      })
      .addCase(fetchMyOrganizations.rejected, (state, action) => {
        state.currentUserOrganizationsStatus = 'failed';
        state.currentUserOrganizationsError = action.payload;
      })

      // Fetch Organization Members
      .addCase(fetchOrganizationMembers.pending, (state, action) => {
        const orgId = action.meta.arg;
        if (!state.organizationMembers[orgId]) {
          state.organizationMembers[orgId] = { members: [], status: 'idle', error: null };
        }
        state.organizationMembers[orgId].status = 'loading';
        state.organizationMembers[orgId].error = null;
        state.membersLoading = true;
      })
      .addCase(fetchOrganizationMembers.fulfilled, (state, action) => {
        const { orgId, members } = action.payload;
        state.organizationMembers[orgId] = {
          members,
          status: 'succeeded',
          error: null
        };
        state.membersLoading = false;
      })
      .addCase(fetchOrganizationMembers.rejected, (state, action) => {
        const orgId = action.meta.arg;
        if (state.organizationMembers[orgId]) {
          state.organizationMembers[orgId].status = 'failed';
          state.organizationMembers[orgId].error = action.payload;
        }
        state.membersLoading = false;
      });
  },
});

export const { 
  clearSelectedOrganization, 
  clearOrganizationMembers, 
  setMembersLoading ,
  setCurrentUser
} = organizationSlice.actions;

export default organizationSlice.reducer;