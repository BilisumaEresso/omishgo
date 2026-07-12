export const getToken = () => localStorage.getItem("admin_token");

export const isAdmin = () => localStorage.getItem("admin_role") === "admin";

export const logout = () => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_role");
  window.location.href = "/login";
};

export const requireAuth = () => {
  if (!getToken() || !isAdmin()) {
    window.location.href = "/login";
  }
};
