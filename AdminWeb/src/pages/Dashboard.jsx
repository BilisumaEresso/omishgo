import React, { useState, useEffect } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [data, setData] = useState({ users: [], products: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        api.get("/admin/users").catch(() => ({ data: { data: { users: [] } } })),
        api.get("/admin/products").catch(() => ({ data: { data: { products: [] } } })),
        api.get("/admin/orders").catch(() => ({ data: { data: { orders: [] } } })),
      ]);

      setData({
        users: usersRes.data?.data?.users || [],
        products: productsRes.data?.data?.products || [],
        orders: ordersRes.data?.data?.orders || [],
      });
    } catch (err) {
      setError("Failed to load dashboard data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending": return "bg-orange-100 text-orange-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="text-lg text-text-secondary">Loading dashboard...</div>;
  }

  const { users, products, orders } = data;
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const pendingUsers = users.filter((u) => !u.isVerified);
  
  // Identify stuck orders (pending for more than 48 hours)
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const stuckOrders = pendingOrders.filter(o => new Date(o.createdAt) < twoDaysAgo);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      {/* Alerts */}
      {(pendingUsers.length > 0 || stuckOrders.length > 0) && (
        <div className="flex flex-col gap-3 mb-6">
          {pendingUsers.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <span className="font-bold">{pendingUsers.length}</span> users pending approval.
                  </p>
                </div>
              </div>
            </div>
          )}
          {stuckOrders.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    <span className="font-bold">{stuckOrders.length}</span> orders stuck in pending for over 48 hours.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
          <div className="text-4xl font-bold text-primary mb-2">{users.length}</div>
          <div className="text-sm text-text-secondary uppercase tracking-wider font-semibold">Total Users</div>
        </div>
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
          <div className="text-4xl font-bold text-primary mb-2">{products.length}</div>
          <div className="text-sm text-text-secondary uppercase tracking-wider font-semibold">Total Products</div>
        </div>
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
          <div className="text-4xl font-bold text-primary mb-2">{orders.length}</div>
          <div className="text-sm text-text-secondary uppercase tracking-wider font-semibold">Total Orders</div>
        </div>
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
          <div className="text-4xl font-bold text-orange-600 mb-2">{pendingOrders.length}</div>
          <div className="text-sm text-text-secondary uppercase tracking-wider font-semibold">Pending Orders</div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-xl font-bold text-text-primary mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b-2 border-gray-100 text-sm font-semibold text-text-secondary">Name</th>
                  <th className="py-3 px-4 border-b-2 border-gray-100 text-sm font-semibold text-text-secondary">Role</th>
                  <th className="py-3 px-4 border-b-2 border-gray-100 text-sm font-semibold text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b border-gray-100 text-sm text-text-primary">{u.name || "N/A"}</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-sm text-text-primary capitalize">{u.role}</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        u.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {u.isVerified ? "Approved" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan="3" className="py-4 text-center text-text-secondary text-sm">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-xl font-bold text-text-primary mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b-2 border-gray-100 text-sm font-semibold text-text-secondary">ID</th>
                  <th className="py-3 px-4 border-b-2 border-gray-100 text-sm font-semibold text-text-secondary">Total</th>
                  <th className="py-3 px-4 border-b-2 border-gray-100 text-sm font-semibold text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b border-gray-100 text-sm font-mono text-text-primary">{o._id.slice(-6)}</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-sm font-medium text-text-primary">ETB {o.totalPrice}</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan="3" className="py-4 text-center text-text-secondary text-sm">No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
