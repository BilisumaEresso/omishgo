// Backend API endpoints
// Update BASE_URL for your environment:
// - Localhost (iOS Simulator): http://localhost:5000
// - Localhost (Android Emulator): http://10.0.2.2:5000
// - Localhost (Physical Android Device): http://<YOUR_PC_IP>:5000
// - Production: https://api.omishgo.com

export const API_BASE_URL = "https://omishgo.onrender.com";

export const API_ENDPOINTS = {
  // Check
  check: "/",
  // Auth
  auth: {
    register: "/api/v1/auth/register",
    login: "/api/v1/auth/login",
    me: "/api/v1/auth/me",
    logout: "/api/v1/auth/logout",
    // Disabled for MVP — see BackEnd/docs/POST_MVP_BACKLOG.md
    // requestDeviceMove: "/api/v1/auth/request-device-move",
    // confirmDeviceMove: "/api/v1/auth/confirm-device-move",
  },
  // Disabled for MVP — see BackEnd/docs/POST_MVP_BACKLOG.md
  // role: {
  //   myRoles: "/api/v1/roles/my-roles",
  //   requestRole: "/api/v1/roles/request-role",
  //   switchRole: "/api/v1/roles/switch-role",
  // },
  products: {
    list: "/api/v1/products",
    detail: (id) => `/api/v1/products/${id}`,
    create: "/api/v1/products",
    update: (id) => `/api/v1/products/${id}`,
    delete: (id) => `/api/v1/products/${id}`,
    analytics: "/api/v1/products/analytics",
  },
  upload: {
    image: "/api/v1/upload/image",
  },
  messages: {
    thread: (userId) => `/api/v1/messages/thread/${userId}`,
    send: "/api/v1/messages",
    conversations: "/api/v1/messages/conversations",
  },
  notifications: {
    list: "/api/v1/notifications",
    markRead: (id) => `/api/v1/notifications/${id}/read`,
    markAllRead: "/api/v1/notifications/read-all",
  },
  market: {
    price: (cropType) =>
      `/api/v1/products/market-price?cropType=${encodeURIComponent(cropType)}`,
  },
  saved: {
    list: "/api/v1/saved",
    save: (productId) => `/api/v1/saved/${productId}`,
    unsave: (productId) => `/api/v1/saved/${productId}`,
  },
  help: {
    faqs: "/api/v1/help/faqs",
  },
  orders: {
    list: "/api/v1/orders",
    create: "/api/v1/orders",
    detail: (id) => `/api/v1/orders/${id}`,
    updateStatus: (id) => `/api/v1/orders/${id}/status`,
  },
  users: {
    detail: (id) => `/api/v1/users/${id}`,
    activities: "/api/v1/users/me/activities",
  },
};
