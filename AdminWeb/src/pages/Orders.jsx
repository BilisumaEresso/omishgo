import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getUserAvatarUrl } from "../utils/avatar";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      
      const res = await api.get(`/admin/orders?${params.toString()}`);
      const fetched = res.data?.data?.orders || [];
      setAllOrders(fetched);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  // Client-side search + sort
  useEffect(() => {
    let filtered = [...allOrders];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        (o.customId && o.customId.toLowerCase().includes(q)) ||
        (o.cropType && o.cropType.toLowerCase().includes(q)) ||
        (o.variety && o.variety.toLowerCase().includes(q)) ||
        (o.productId?.variety && o.productId.variety.toLowerCase().includes(q)) ||
        (o.buyerId?.name && o.buyerId.name.toLowerCase().includes(q)) ||
        (o.farmerId?.name && o.farmerId.name.toLowerCase().includes(q))
      );
    }
    if (sortBy === "newest") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === "oldest") filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === "price_high") filtered.sort((a, b) => b.totalPrice - a.totalPrice);
    else if (sortBy === "price_low") filtered.sort((a, b) => a.totalPrice - b.totalPrice);
    setOrders(filtered);
  }, [allOrders, searchQuery, sortBy]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending": return "bg-warning text-white";
      case "confirmed": return "bg-primary text-white";
      case "in_transit": return "bg-[#8280FF] text-white";
      case "delivered": return "bg-success text-white";
      case "cancelled": return "bg-danger text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  // KPI summary
  const totalRevenue = allOrders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const pendingCount = allOrders.filter(o => o.status === "pending").length;
  const deliveredCount = allOrders.filter(o => o.status === "delivered").length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-[32px] font-bold text-ink tracking-[-0.11px]">Orders</h1>
        <div className="text-[14px] text-ink/60">{orders.length} order{orders.length !== 1 ? "s" : ""}</div>
      </div>

      {error && <div className="text-red-500 bg-white p-4 rounded-[14px] shadow">{error}</div>}

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex items-center gap-4">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-primary/15 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" /></svg>
          </div>
          <div>
            <div className="text-[13px] text-ink/50 font-semibold">Total Orders</div>
            <div className="text-[22px] font-bold text-ink">{allOrders.length}</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex items-center gap-4">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-success/15 flex items-center justify-center">
            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <div className="text-[13px] text-ink/50 font-semibold">Revenue</div>
            <div className="text-[22px] font-bold text-ink">ETB {totalRevenue.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex items-center gap-4">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-warning/15 flex items-center justify-center">
            <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <div className="text-[13px] text-ink/50 font-semibold">Pending</div>
            <div className="text-[22px] font-bold text-warning">{pendingCount}</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex items-center gap-4">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-success/15 flex items-center justify-center">
            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <div className="text-[13px] text-ink/50 font-semibold">Delivered</div>
            <div className="text-[22px] font-bold text-success">{deliveredCount}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="Search by order ID, crop, variety, buyer, or farmer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-muted border-[0.6px] border-border rounded-[10px] h-[44px] pl-11 pr-4 text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4880FF]/20 transition-all"
            />
          </div>
          <div className="relative lg:w-[180px]">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface-muted border-[0.6px] border-border rounded-[10px] h-[44px] px-4 text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4880FF]/20 transition-all appearance-none cursor-pointer">
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
          <div className="relative lg:w-[180px]">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-surface-muted border-[0.6px] border-border rounded-[10px] h-[44px] px-4 text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4880FF]/20 transition-all appearance-none cursor-pointer">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_high">Price: High → Low</option>
              <option value="price_low">Price: Low → High</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* Minimal Sleek Table */}
      <div className="bg-white rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden w-full">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px] sm:min-w-0">
              <thead>
                <tr className="bg-surface-soft text-[13px] text-ink/70">
                  <th className="py-3.5 px-4 font-bold rounded-tl-[14px]">Order ID &amp; Date</th>
                  <th className="py-3.5 px-4 font-bold">Crop &amp; Variety</th>
                  <th className="py-3.5 px-4 font-bold">Buyer</th>
                  <th className="py-3.5 px-4 font-bold">Farmer</th>
                  <th className="py-3.5 px-4 font-bold">Total &amp; Qty</th>
                  <th className="py-3.5 px-4 font-bold rounded-tr-[14px] text-right">Status &amp; Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#979797]/15 text-[14px]">
                {orders.map((o) => {
                  const varietyStr = o.variety || o.productId?.variety;
                  return (
                    <tr key={o._id} className="hover:bg-[#F9FAFB] transition-colors">
                      {/* 1. Order ID & Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Link to={`/orders/${o.customId || o._id}`} className="text-[13px] font-mono text-primary hover:underline font-bold block">
                          {o.customId || `#${o._id.slice(-6)}`}
                        </Link>
                        <span className="text-[11px] text-ink/50 block">
                          {new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </span>
                      </td>

                      {/* 2. Crop & Variety */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[14px] text-ink font-bold">{o.cropType || o.productId?.cropType || "—"}</span>
                          {varietyStr && (
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                              {varietyStr}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3. Buyer */}
                      <td className="py-3.5 px-4">
                        {o.buyerId ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={getUserAvatarUrl(o.buyerId, { bg: "4880FF" })}
                              alt={o.buyerId.name || "Buyer"}
                              className="w-7 h-7 rounded-full object-cover border border-border flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <Link to={`/users/${o.buyerId.customId || o.buyerId._id}`} className="text-[13px] text-ink hover:text-primary hover:underline font-semibold block truncate">
                                {o.buyerId.name}
                              </Link>
                            </div>
                          </div>
                        ) : <span className="text-gray-400 text-[13px]">Unknown</span>}
                      </td>

                      {/* 4. Farmer */}
                      <td className="py-3.5 px-4">
                        {o.farmerId ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={getUserAvatarUrl(o.farmerId, { bg: "4AD991" })}
                              alt={o.farmerId.name || "Farmer"}
                              className="w-7 h-7 rounded-full object-cover border border-border flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <Link to={`/users/${o.farmerId.customId || o.farmerId._id}`} className="text-[13px] text-ink hover:text-primary hover:underline font-semibold block truncate">
                                {o.farmerId.name}
                              </Link>
                            </div>
                          </div>
                        ) : <span className="text-gray-400 text-[13px]">Unknown</span>}
                      </td>

                      {/* 5. Total & Qty */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-[14px] text-ink font-bold">ETB {o.totalPrice?.toLocaleString()}</div>
                        <div className="text-[11px] text-ink/50">{o.quantity} {o.unit || o.productId?.unit}</div>
                      </td>

                      {/* 6. Status & Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize inline-block ${getStatusStyle(o.status)}`}>
                            {o.status?.replace('_', ' ')}
                          </span>
                          <Link to={`/orders/${o.customId || o._id}`}
                            className="inline-flex items-center px-3 py-1 bg-surface-muted text-primary rounded-[8px] font-bold text-[12px] hover:bg-primary hover:text-white transition-all">
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-400 text-sm">
                      No orders found.
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
