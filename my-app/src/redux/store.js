import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
// import teamReducer from './slices/teamSlice';
// import assistantReducer from './slices/assistantSlice';
// import  organizationReducer from './slices/organizationSlice';
import  organizationReducer from './organizationSlice';
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    organization: organizationReducer,
    // team: teamReducer,
    // assistant: assistantReducer,
  },
});