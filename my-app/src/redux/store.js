import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import organizationReducer from './organizationSlice';
import authReducer from './authSlice';
// import notificationsReducer from './slices/notificationsSlice'; 
// import teamReducer from './slices/teamSlice';
// import assistantReducer from './slices/assistantSlice';
// import notificationsReducer from './slices/notificationsSlice';
// import notificationsSlice from './slices/NotificationsSlice';
 import notificationsSlice from './slices/notificationSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    organization: organizationReducer, 
    notifications: notificationsSlice,
    // team: teamReducer,
    // assistant: assistantReducer,
  },
});
