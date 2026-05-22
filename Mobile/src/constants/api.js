// Backend API endpoints
// Update BASE_URL for your environment:
// - Localhost (iOS Simulator): http://localhost:5000
// - Localhost (Android Emulator): http://10.0.2.2:5000
// - Localhost (Physical Android Device): http://<YOUR_PC_IP>:5000
// - Production: https://api.omishgo.com

export const API_BASE_URL = "http://10.4.111.174:5000";

export const API_ENDPOINTS = {
  // Check
  check: "/",
  // Auth
  auth: {
    register: "/api/v1/auth/register",
    login: "/api/v1/auth/login",
    me: "/api/v1/auth/me",
    logout: "/api/v1/auth/logout",
    requestDeviceMove: "/api/v1/auth/request-device-move",
    confirmDeviceMove: "/api/v1/auth/confirm-device-move",
  },
};
