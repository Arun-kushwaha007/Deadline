import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import organizationReducer from './organizationSlice';
import authReducer from './authSlice'; // Ensure this import matches your file structure
// import notificationsReducer from './slices/notificationsSlice'; // Added import
// import teamReducer from './slices/teamSlice';
// import assistantReducer from './slices/assistantSlice';
// import notificationsReducer from './slices/notificationsSlice';
// import notificationsSlice from './slices/NotificationsSlice'; // Ensure this import matches your file structure
 // Ensure this import matches your file structure
 import notificationsSlice from './slices/notificationSlice'; // Ensure this import matches your file structure

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    organization: organizationReducer, // ✅ Correct key for useSelector(state => state.organization)
    notifications: notificationsSlice, // Added notifications reducer
    // team: teamReducer,
    // assistant: assistantReducer,
  },
});
