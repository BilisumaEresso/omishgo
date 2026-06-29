import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuthStore } from "../store/auth.store";

const Dashboard = () => {
  const { logout, user } = useAuthStore();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, productsRes] = await Promise.all([
        api.get("/api/v1/admin/users?isVerified=false"),
        api.get("/api/v1/admin/products"),
      ]);
      setPendingUsers(usersRes.data.data.users || []);
      setPendingProducts(productsRes.data.data.products || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUserAction = async (id, action) => {
    try {
      await api.put(`/api/v1/admin/users/${id}/${action}`);
      setPendingUsers(pendingUsers.filter((u) => u._id !== id));
    } catch (error) {
      alert(`Failed to ${action} user`);
    }
  };

  const handleProductAction = async (id, action) => {
    try {
      await api.put(`/api/v1/admin/products/${id}/${action}`);
      setPendingProducts(pendingProducts.filter((p) => p._id !== id));
    } catch (error) {
      alert(`Failed to ${action} product`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">OmishGo Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Admin: {user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Pending Users Table */}
        <section className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Pending User Approvals</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingUsers.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No pending users.</td></tr>
                ) : (
                  pendingUsers.map((u) => (
                    <tr key={u._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{u.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.location?.kebele}, {u.location?.zone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleUserAction(u._id, "approve")} className="text-green-600 hover:text-green-900 mr-4">Approve</button>
                        <button onClick={() => handleUserAction(u._id, "reject")} className="text-red-600 hover:text-red-900">Reject</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pending Products Table */}
        <section className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Pending Product Listings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingProducts.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No pending products.</td></tr>
                ) : (
                  pendingProducts.map((p) => (
                    <tr key={p._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.farmerId?.name} <br/><span className="text-xs">{p.farmerId?.phone}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.price} ETB / {p.unit} <br/><span className="text-xs">Qty: {p.quantity}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.region}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleProductAction(p._id, "approve")} className="text-green-600 hover:text-green-900 mr-4">Approve</button>
                        <button onClick={() => handleProductAction(p._id, "reject")} className="text-red-600 hover:text-red-900">Reject</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;
