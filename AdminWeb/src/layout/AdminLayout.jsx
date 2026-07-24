import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const AdminLayout = ({ children }) => {
  const { logout } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Users", path: "/users" },
    { name: "Orders", path: "/orders" },
    { name: "Products", path: "/products" },
  ];

  return (
    <div className="flex min-h-screen bg-background font-sans text-text-primary">
      {/* Sidebar */}
      <div className="w-64 bg-surface border-r border-border p-5 flex flex-col">
        <div className="text-2xl font-bold mb-10">
          <span className="text-text-primary">Omish</span>
          <span className="text-primary">Go</span>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`block px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary-light text-primary font-bold"
                      : "text-text-secondary hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto">
          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
