import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'|| 'https://deadline-pobb.onrender.com';
const API = `${backendUrl}/api/organizations`;



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

export const deleteOrganization = createAsyncThunk(
  'organization/deleteOrganization',
  async (orgId, thunkAPI) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return thunkAPI.rejectWithValue('Authentication token not found. Please log in.');
    }
    try {
      await axios.delete(`${API}/${orgId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return orgId; // Return the ID of the deleted organization for reducer logic
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
  async ({ orgId, email, role }, thunkAPI) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return thunkAPI.rejectWithValue('Authentication token not found. Please log in.');
    }
    try {
     
      const { data } = await axios.post(`${API}/${orgId}/members`, { email, role }, { 
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


export const fetchMyOrganizations = createAsyncThunk(
  'organization/fetchMyOrganizations',
  async (_, thunkAPI) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return thunkAPI.rejectWithValue('Authentication token not found. Please log in.');
    }
    try {
      const { data } = await axios.get(`${API}/mine`, {
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
selectOrganization: (state, action) => {
      state.selectedOrganization = action.payload;
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
      })

      // Delete organization
      .addCase(deleteOrganization.pending, (state) => {
        state.loading = true; // Or a specific loading flag like state.deletingLoading
        state.error = null;
      })
      .addCase(deleteOrganization.fulfilled, (state, action) => {
        state.loading = false;
        const deletedOrgId = action.payload;
        // Remove from organizations list
        state.organizations = state.organizations.filter(org => org._id !== deletedOrgId);
        // Remove from current user's organizations list
        state.currentUserOrganizations = state.currentUserOrganizations.filter(org => org._id !== deletedOrgId);
        // Clear selected organization if it was the one deleted
        if (state.selectedOrganization && state.selectedOrganization._id === deletedOrgId) {
          state.selectedOrganization = null;
        }
        // Optionally, clear from members cache too
        if (state.organizationMembers[deletedOrgId]) {
          delete state.organizationMembers[deletedOrgId];
        }
      })
      .addCase(deleteOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message
      });
  },
});

export const { 
  clearSelectedOrganization, 
  clearOrganizationMembers, 
  setMembersLoading ,
  setCurrentUser,
  selectOrganization
} = organizationSlice.actions;

export default organizationSlice.reducer;