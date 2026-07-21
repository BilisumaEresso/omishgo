import { create } from "zustand";
import api from "../config/api";
import { API_ENDPOINTS } from "../constants/api";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  lastFetched: null,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await api.get(API_ENDPOINTS.notifications.list);
      const list = res.data?.data?.notifications || [];
      const unreadCount = list.filter((n) => !n.isRead).length;
      
      set({ 
        notifications: list,
        unreadCount,
        loading: false,
        lastFetched: Date.now()
      });
    } catch (err) {
      console.warn("Notifications fetch error:", err.message);
      set({ loading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await api.patch(API_ENDPOINTS.notifications.markRead(id));
      set((state) => {
        const updatedList = state.notifications.map((n) => 
          (n._id === id || n.id === id) ? { ...n, isRead: true } : n
        );
        return {
          notifications: updatedList,
          unreadCount: Math.max(0, state.unreadCount - 1)
        };
      });
    } catch (err) {
      console.warn("Failed to mark notification as read", err.message);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.patch(API_ENDPOINTS.notifications.markAllRead);
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0
      }));
    } catch (err) {
      console.warn("Failed to mark all as read", err.message);
    }
  },
}));
