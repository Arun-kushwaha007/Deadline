import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api'; // Assuming api utility is in src/utils

// Thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/notifications');
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

const initialState = {
  items: [],
  unreadCount: 0,
  currentFilterType: 'all',
  snoozedItems: [],
};

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
      state.unreadCount = action.payload.reduce((count, item) => item.isRead ? count : count + 1, 0);
      state.snoozedItems = [];
    },
    markAsRead: (state, action) => {
      const { id } = action.payload;
      const notification = state.items.find(item => item._id === id || item.id === id);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAsUnread: (state, action) => {
      const { id } = action.payload;
      const notification = state.items.find(item => item._id === id || item.id === id);
      if (notification && notification.isRead) {
        notification.isRead = false;
        state.unreadCount += 1;
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach(item => { item.isRead = true; });
      state.unreadCount = 0;
    },
    setNotificationFilter: (state, action) => {
      state.currentFilterType = action.payload;
    },
    snoozeNotification: (state, action) => {
      const { id, snoozeDuration } = action.payload;
      const index = state.items.findIndex(item => (item._id || item.id) === id);
      if (index !== -1) {
        const item = state.items.splice(index, 1)[0];
        state.snoozedItems.push({
          notification: item,
          reShowAt: Date.now() + snoozeDuration,
        });
        if (!item.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },
    unSnoozeNotification: (state, action) => {
      const { notification } = action.payload;
      const index = state.snoozedItems.findIndex(item => (item.notification._id || item.notification.id) === (notification._id || notification.id));
      if (index !== -1) {
        const snoozedItem = state.snoozedItems.splice(index, 1)[0];
        state.items.unshift(snoozedItem.notification);
        if (!snoozedItem.notification.isRead) {
          state.unreadCount += 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.unreadCount = action.payload.reduce((count, item) => item.isRead ? count : count + 1, 0);
        state.snoozedItems = [];
      });
  }
});

export const {
  addNotification,
  setNotifications,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  setNotificationFilter,
  snoozeNotification,
  unSnoozeNotification,
} = notificationsSlice.actions;

export const selectFilteredNotifications = (state) => {
  const { items, currentFilterType } = state.notifications;
  return currentFilterType === 'all' ? items : items.filter(item => item.type === currentFilterType);
};

export default notificationsSlice.reducer;
