import React, { useState, useEffect } from "react";
import api from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      
      const res = await api.get(`/admin/orders?${params.toString()}`);
      setOrders(res.data?.data?.orders || []);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending": return "bg-orange-100 text-orange-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "in_transit": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Orders</h1>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Filters Bar */}
      <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-4 w-full md:w-auto ml-auto">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-secondary">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Order ID</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Crop</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Quantity</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Total Price</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Buyer</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Farmer</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Status</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono text-text-primary">{o._id.slice(-6)}</td>
                    <td className="py-3 px-4 text-sm font-medium text-text-primary">{o.cropType || o.productId?.cropType || "Unknown"}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{o.quantity} {o.unit || o.productId?.unit}</td>
                    <td className="py-3 px-4 text-sm font-medium text-text-primary">ETB {o.totalPrice}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {o.buyerId?.name || "Unknown"}
                      <div className="text-xs text-gray-500">{o.buyerId?.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {o.farmerId?.name || "Unknown"}
                      <div className="text-xs text-gray-500">{o.farmerId?.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-text-secondary">
                      No orders found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
