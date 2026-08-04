import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import api from "../services/api";
import ConfirmModal from "../components/ConfirmModal";

const AdminLayout = ({ children }) => {
  const { logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    try {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        api.get("/admin/users").catch(() => ({ data: { data: { users: [] } } })),
        api.get("/admin/products").catch(() => ({ data: { data: { products: [] } } })),
        api.get("/admin/orders").catch(() => ({ data: { data: { orders: [] } } })),
      ]);
      const users = usersRes.data?.data?.users || [];
      const products = productsRes.data?.data?.products || [];
      const orders = ordersRes.data?.data?.orders || [];
      const q = query.toLowerCase();

      const matchedUsers = users.filter(u =>
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.customId && u.customId.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q))
      ).slice(0, 3).map(u => ({ type: "user", id: u.customId || u._id, name: u.name || "User", sub: u.role }));

      const matchedProducts = products.filter(p =>
        (p.cropType && p.cropType.toLowerCase().includes(q)) ||
        (p.customId && p.customId.toLowerCase().includes(q))
      ).slice(0, 3).map(p => ({ type: "product", id: p.customId || p._id, name: p.cropType, sub: `ETB ${p.price}` }));

      const matchedOrders = orders.filter(o =>
        (o.customId && o.customId.toLowerCase().includes(q)) ||
        (o.cropType && o.cropType.toLowerCase().includes(q)) ||
        (o.productId?.cropType && o.productId.cropType.toLowerCase().includes(q))
      ).slice(0, 3).map(o => ({ type: "order", id: o.customId || o._id, name: o.cropType || o.productId?.cropType || "Order", sub: `ETB ${o.totalPrice}` }));

      const combined = [...matchedUsers, ...matchedProducts, ...matchedOrders];
      setSearchResults(combined);
      setShowResults(combined.length > 0);
    } catch { /* ignore */ }
  };

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchQuery("");
    if (result.type === "user") navigate(`/users/${result.id}`);
    else if (result.type === "product") navigate(`/products/${result.id}`);
    else if (result.type === "order") navigate(`/orders/${result.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      e.preventDefault();
      handleResultClick(searchResults[0]);
    }
  };

  const navItems = [
    {
      name: "Dashboard", path: "/",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm-10 9a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1v-5zm10-2a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" /></svg>
    },
    {
      name: "Products", path: "/products",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    },
    {
      name: "Orders", path: "/orders",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
    },
    {
      name: "Users", path: "/users",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    },
    {
      name: "Announcements", path: "/announcements",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
    },
    {
      name: "Analytics", path: "/analytics",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
    {
      name: "Audit Log", path: "/audit-logs",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
  ];

  return (
    <div className="flex min-h-screen bg-surface-muted font-sans text-ink">
      {/* Sidebar - fixed, never scrolls */}
      <aside className="w-[240px] bg-white border-r border-border flex flex-col fixed top-0 left-0 bottom-0 z-30">
        <div className="text-2xl font-bold py-6 text-center flex-shrink-0">
          <span className="text-ink">Omish</span>
          <span className="text-primary">Go</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[10px] cursor-pointer transition-all duration-200 text-[14px] font-semibold tracking-[0.3px] ${
                      isActive
                        ? "bg-primary text-white shadow-md"
                        : "text-ink hover:bg-surface-muted"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex-shrink-0 p-4 border-t border-border">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 text-left px-4 py-3 text-danger hover:bg-danger-light rounded-[10px] cursor-pointer transition-colors font-semibold text-[14px]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area - offset by sidebar width */}
      <div className="flex-1 flex flex-col ml-[240px]">
        {/* Top Bar */}
        <header className="h-[70px] bg-white flex items-center justify-between px-8 sticky top-0 z-20 border-b border-border">
          <div className="flex items-center relative">
            {/* Search Input */}
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink opacity-50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input 
                type="text" 
                placeholder="Search users, products, or orders..." 
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => setTimeout(() => setShowResults(false), 250)}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                className="bg-surface-muted border-[0.6px] border-border rounded-[19px] h-[38px] pl-10 pr-4 text-[14px] w-[340px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-[400px] bg-white rounded-xl shadow-2xl border border-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {searchResults.map((r, i) => (
                    <div
                      key={i}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleResultClick(r);
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-muted cursor-pointer transition-colors border-b border-border/50 last:border-0"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        r.type === 'user' ? 'bg-primary-light text-primary' :
                        r.type === 'product' ? 'bg-success-light text-success' :
                        'bg-warning-light text-warning'
                      }`}>
                        {r.type === 'user' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        )}
                        {r.type === 'product' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        )}
                        {r.type === 'order' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-semibold text-ink truncate">{r.name}</div>
                        <div className="text-[12px] text-ink-muted capitalize">{r.type} · {r.sub}</div>
                      </div>
                      <span className="text-[11px] text-primary font-mono font-semibold">{r.id}</span>
                    </div>
                  ))}
                </div>
              )}
              {showResults && searchResults.length === 0 && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 mt-2 w-[400px] bg-white rounded-xl shadow-xl border border-border p-6 text-center text-ink-muted text-sm z-50">
                  No matching users, products, or orders found
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Notification */}
            <button className="relative p-2 text-ink-muted hover:text-primary transition-colors cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
              <span className="absolute top-1 right-1 w-4 h-4 bg-danger rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                6
              </span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 cursor-pointer pl-6 border-l border-border">
              <div className="w-10 h-10 rounded-full bg-surface-muted overflow-hidden border border-border">
                <img src="https://ui-avatars.com/api/?name=Admin&background=F5F6FA&color=4880FF&bold=true" alt="Admin" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <div className="text-[14px] font-bold text-ink leading-tight">Admin</div>
                <div className="text-[12px] font-semibold text-ink-muted">Super Admin</div>
              </div>
              <svg className="w-4 h-4 text-ink-muted ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>

      {/* Logout In-App Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Logout of Dashboard"
        message="Are you sure you want to log out of your OmishGo admin session?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
};

export default AdminLayout;
