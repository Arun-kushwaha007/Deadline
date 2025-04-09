import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
// import teamReducer from './slices/teamSlice';
// import assistantReducer from './slices/assistantSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    // team: teamReducer,
    // assistant: assistantReducer,
  },
});