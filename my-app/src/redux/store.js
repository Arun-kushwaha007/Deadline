import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import organizationReducer from './organizationSlice';
// import teamReducer from './slices/teamSlice';
// import assistantReducer from './slices/assistantSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    organization: organizationReducer, // ✅ Correct key for useSelector(state => state.organization)
    // team: teamReducer,
    // assistant: assistantReducer,
  },
});
