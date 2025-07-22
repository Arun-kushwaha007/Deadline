// redux/slices/notificationSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Storage keys
const STORAGE_KEYS = {
  NOTIFICATIONS: 'collabnest_notifications',
  SNOOZED_ITEMS: 'collabnest_snoozed_notifications',
  FILTER_TYPE: 'collabnest_notification_filter'
};

// Helper functions for localStorage
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Error parsing localStorage item ${key}:`, error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage item ${key}:`, error);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing localStorage item ${key}:`, error);
    }
  }
};

// Async thunk for fetching notifications from server
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      return data.notifications || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for marking notification as read on server
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      return notificationId;
    } catch (error) {
      // Still update local state even if server call fails
      return notificationId;
    }
  }
);

// Async thunk for marking all notifications as read
export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { notifications } = getState().notifications;
      const unreadIds = notifications
        .filter(notif => !notif.isRead)
        .map(notif => notif._id || notif.id);
      
      if (unreadIds.length === 0) return [];
      
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationIds: unreadIds })
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
      
      return unreadIds;
    } catch (error) {
      // Still update local state even if server call fails
      const { notifications } = getState().notifications;
      return notifications
        .filter(notif => !notif.isRead)
        .map(notif => notif._id || notif.id);
    }
  }
);

const initialState = {
  notifications: [],
  snoozedItems: [],
  currentFilterType: 'all',
  unreadCount: 0,
  loading: false,
  error: null,
  lastFetchTime: null
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Load persisted notifications from localStorage
    loadPersistedNotifications: (state) => {
      const persistedNotifications = storage.get(STORAGE_KEYS.NOTIFICATIONS);
      const persistedSnoozed = storage.get(STORAGE_KEYS.SNOOZED_ITEMS);
      const persistedFilter = storage.get(STORAGE_KEYS.FILTER_TYPE);
      
      if (persistedNotifications) {
        state.notifications = persistedNotifications;
        state.unreadCount = persistedNotifications.filter(notif => !notif.isRead).length;
      }
      
      if (persistedSnoozed) {
        // Filter out expired snooze items
        const now = Date.now();
        state.snoozedItems = persistedSnoozed.filter(item => item.reShowAt > now);
      }
      
      if (persistedFilter) {
        state.currentFilterType = persistedFilter;
      }
    },
    
    // Persist notifications to localStorage
    persistNotifications: (state) => {
      storage.set(STORAGE_KEYS.NOTIFICATIONS, state.notifications);
      storage.set(STORAGE_KEYS.SNOOZED_ITEMS, state.snoozedItems);
      storage.set(STORAGE_KEYS.FILTER_TYPE, state.currentFilterType);
    },
    
    // Add a new notification
    addNotification: (state, action) => {
      const newNotification = {
        id: action.payload.id || Date.now().toString(),
        ...action.payload,
        createdAt: action.payload.createdAt || new Date().toISOString(),
        isRead: false
      };
      

      const existingIndex = state.notifications.findIndex(
        notif => (notif._id || notif.id) === (newNotification._id || newNotification.id)
      );
      
      if (existingIndex === -1) {
        state.notifications.unshift(newNotification);
        state.unreadCount += 1;
      }
    },
    
    // Set notification filter
    setNotificationFilter: (state, action) => {
      state.currentFilterType = action.payload;
    },
    
    // Snooze notification
    snoozeNotification: (state, action) => {
      const { id, snoozeDuration } = action.payload;
      const notificationIndex = state.notifications.findIndex(
        notif => (notif._id || notif.id) === id
      );
      
      if (notificationIndex !== -1) {
        const notification = state.notifications[notificationIndex];
        const snoozedItem = {
          notification,
          snoozedAt: Date.now(),
          reShowAt: Date.now() + snoozeDuration
        };
        
        // Add to snoozed items
        state.snoozedItems.push(snoozedItem);
        
        // Remove from main notifications
        state.notifications.splice(notificationIndex, 1);
        
        // Update unread count if it was unread
        if (!notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },
    
    // Unsnooze notification
    unSnoozeNotification: (state, action) => {
      const notification = action.payload.notification;
      const notificationId = notification._id || notification.id;
      
      // Remove from snoozed items
      state.snoozedItems = state.snoozedItems.filter(
        item => (item.notification._id || item.notification.id) !== notificationId
      );
      
      // Add back to notifications if not already there
      const existingIndex = state.notifications.findIndex(
        notif => (notif._id || notif.id) === notificationId
      );
      
      if (existingIndex === -1) {
        state.notifications.unshift(notification);
        if (!notification.isRead) {
          state.unreadCount += 1;
        }
      }
    },
    
    // Remove notification completely
    removeNotification: (state, action) => {
      const id = action.payload;
      const notificationIndex = state.notifications.findIndex(
        notif => (notif._id || notif.id) === id
      );
      
      if (notificationIndex !== -1) {
        const notification = state.notifications[notificationIndex];
        if (!notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(notificationIndex, 1);
      }
      
      // Also remove from snoozed items
      state.snoozedItems = state.snoozedItems.filter(
        item => (item.notification._id || item.notification.id) !== id
      );
    },
    
    // Clean up old notifications (older than 30 days)
    cleanupOldNotifications: (state) => {
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const beforeCount = state.notifications.length;
      
      state.notifications = state.notifications.filter(notif => {
        const createdAt = new Date(notif.createdAt).getTime();
        return createdAt > thirtyDaysAgo;
      });
      
      // Recalculate unread count
      state.unreadCount = state.notifications.filter(notif => !notif.isRead).length;
      
      // console.log(`Cleaned up ${beforeCount - state.notifications.length} old notifications`);
    },
    
    // Clear all notifications
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.snoozedItems = [];
      state.unreadCount = 0;
      storage.remove(STORAGE_KEYS.NOTIFICATIONS);
      storage.remove(STORAGE_KEYS.SNOOZED_ITEMS);
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        
        // Merge new notifications with existing ones, avoiding duplicates
        const existingIds = new Set(state.notifications.map(notif => notif._id || notif.id));
        const newNotifications = action.payload.filter(
          notif => !existingIds.has(notif._id || notif.id)
        );
        
        state.notifications = [...newNotifications, ...state.notifications];
        state.unreadCount = state.notifications.filter(notif => !notif.isRead).length;
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(
          notif => (notif._id || notif.id) === notificationId
        );
        
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state, action) => {
        const markedIds = action.payload;
        markedIds.forEach(id => {
          const notification = state.notifications.find(
            notif => (notif._id || notif.id) === id
          );
          if (notification) {
            notification.isRead = true;
          }
        });
        state.unreadCount = 0;
      });
  }
});

// Selectors
export const selectFilteredNotifications = (state) => {
  const { notifications, currentFilterType, snoozedItems } = state.notifications;
  
  // Filter out snoozed notifications
  const snoozedIds = new Set(snoozedItems.map(item => item.notification._id || item.notification.id));
  const activeNotifications = notifications.filter(
    notif => !snoozedIds.has(notif._id || notif.id)
  );
  
  if (currentFilterType === 'all') {
    return activeNotifications;
  }
  
  return activeNotifications.filter(notif => notif.type === currentFilterType);
};

export const selectUnreadNotifications = (state) => {
  const { notifications, snoozedItems } = state.notifications;
  const snoozedIds = new Set(snoozedItems.map(item => item.notification._id || item.notification.id));
  
  return notifications.filter(
    notif => !notif.isRead && !snoozedIds.has(notif._id || notif.id)
  );
};

export const {
  loadPersistedNotifications,
  persistNotifications,
  addNotification,
  setNotificationFilter,
  snoozeNotification,
  unSnoozeNotification,
  removeNotification,
  cleanupOldNotifications,
  clearAllNotifications
} = notificationSlice.actions;

export default notificationSlice.reducer;