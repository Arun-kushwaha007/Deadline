// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
// const API_BASE_URL = `${backendUrl}/api`;

// const getAuthConfig = () => {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     // This case should ideally be handled by routing/UI,
//     // but as a safeguard for API calls:
//     console.error("Authentication token not found.");
//     // Depending on the app's error handling strategy,
//     // you might throw an error here or return headers that will lead to a 401.
//     // For now, returning potentially incomplete headers.
//     return { headers: { 'Content-Type': 'application/json' } };
//   }
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },
//   };
// };

// const initialState = {
//   myOrganizations: [],
//   myOrganizationsStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
//   error: null,
// };

// // Async Thunks
// export const fetchMyOrganizations = createAsyncThunk(
//   'organizations/fetchMyOrganizations',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/organizations/mine`, getAuthConfig());
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: error.message });
//     }
//   }
// );

// const organizationSlice = createSlice({
//   name: 'organizations',
//   initialState,
//   reducers: {
//     // Can add reducers here for specific actions like clearing errors or resetting state
//     resetOrganizationStatus: (state) => {
//       state.myOrganizationsStatus = 'idle';
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchMyOrganizations.pending, (state) => {
//         state.myOrganizationsStatus = 'loading';
//         state.error = null; // Clear previous errors
//       })
//       .addCase(fetchMyOrganizations.fulfilled, (state, action) => {
//         state.myOrganizationsStatus = 'succeeded';
//         state.myOrganizations = action.payload;
//       })
//       .addCase(fetchMyOrganizations.rejected, (state, action) => {
//         state.myOrganizationsStatus = 'failed';
//         state.error = action.payload;
//       });
//   },
// });

// export const { resetOrganizationStatus } = organizationSlice.actions;
// export default organizationSlice.reducer;
