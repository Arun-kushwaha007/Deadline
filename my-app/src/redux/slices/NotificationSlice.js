import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async Thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get('/notifications');
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (notificationId, { dispatch, rejectWithValue }) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      dispatch(markAsRead({ id: notificationId }));
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark notification as read');
    }
  }
);

export const markNotificationAsUnread = createAsyncThunk(
  'notifications/markNotificationAsUnread',
  async (notificationId, { dispatch, rejectWithValue }) => {
    try {
      await api.put(`/notifications/${notificationId}/unread`);
      dispatch(markAsUnread({ id: notificationId }));
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark notification as unread');
    }
  }
);

// Initial State
const initialState = {
  items: [],
  unreadCount: 0,
};

// Slice
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const newNotification = action.payload;
      state.items.unshift(newNotification);
      if (!newNotification.isRead) {
        state.unreadCount += 1;
      }
    },
    setNotifications: (state, action) => {
      state.items = action.payload;
      state.unreadCount = action.payload.reduce(
        (count, item) => (!item.isRead ? count + 1 : count),
        0
      );
    },
    markAsRead: (state, action) => {
      const { id } = action.payload;
      const notification = state.items.find(
        (item) => item._id === id || item.id === id
      );
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAsUnread: (state, action) => {
      const { id } = action.payload;
      const notification = state.items.find(
        (item) => item._id === id || item.id === id
      );
      if (notification && notification.isRead) {
        notification.isRead = false;
        state.unreadCount += 1;
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((item) => {
        if (!item.isRead) item.isRead = true;
      });
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.unreadCount = action.payload.reduce(
          (count, item) => (!item.isRead ? count + 1 : count),
          0
        );
      });
  },
});

// Actions
export const {
  addNotification,
  setNotifications,
  markAsRead,
  markAsUnread,
  markAllAsRead,
} = notificationsSlice.actions;

// Reducer
export default notificationsSlice.reducer;

// Export all actions and thunks from one place (for cleaner imports)
export const notificationActions = {
  fetchNotifications,
  markNotificationAsRead,
  markNotificationAsUnread,
  addNotification,
  setNotifications,
  markAsRead,
  markAsUnread,
  markAllAsRead,
};
