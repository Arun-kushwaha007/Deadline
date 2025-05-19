import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Backend base URL
const API = 'http://localhost:5000/api/organizations';

// Async Thunks

export const fetchOrganizations = createAsyncThunk(
  'organization/fetchOrganizations',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API}/`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createOrganization = createAsyncThunk(
  'organization/createOrganization',
  async (orgName, thunkAPI) => {
    try {
      // orgName should be a string, not an object
      const { data } = await axios.post(`${API}/create`, { name: orgName });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchOrganizationDetails = createAsyncThunk(
  'organization/fetchOrganizationDetails',
  async (orgId, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API}/${orgId}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addMemberToOrganization = createAsyncThunk(
  'organization/addMemberToOrganization',
  async ({ orgId, email }, thunkAPI) => {
    try {
      const { data } = await axios.post(`${API}/${orgId}/add-member`, { email });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const assignTaskToMember = createAsyncThunk(
  'organization/assignTaskToMember',
  async ({ orgId, title, assignedTo }, thunkAPI) => {
    try {
      const { data } = await axios.post(`${API}/${orgId}/assign-task`, {
        title,
        assignedTo,
      });
      return data;
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
  },
  reducers: {
    clearSelectedOrganization: (state) => {
      state.selectedOrganization = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all organizations
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
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
      .addCase(createOrganization.fulfilled, (state, action) => {
        state.organizations.push(action.payload);
      })

      // Fetch single org
      .addCase(fetchOrganizationDetails.fulfilled, (state, action) => {
        state.selectedOrganization = action.payload;
      })

      // Add member
      .addCase(addMemberToOrganization.fulfilled, (state, action) => {
        state.selectedOrganization = action.payload;
      })

      // Assign task
      .addCase(assignTaskToMember.fulfilled, (state, action) => {
        state.selectedOrganization = action.payload;
      });
  },
});

export const { clearSelectedOrganization } = organizationSlice.actions;

export default organizationSlice.reducer;