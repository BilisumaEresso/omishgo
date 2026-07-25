import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const UserDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState({ user: null, products: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setData(res.data?.data || { user: null, products: [], orders: [] });
    } catch (err) {
      setError("Failed to fetch user details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleStatusToggle = async () => {
    if (!data.user) return;
    const action = data.user.isVerified ? "reject" : "approve";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      await api.put(`/admin/users/${id}/${action}`);
      fetchDetail();
    } catch (err) {
      alert(`Failed to ${action} user`);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#4880FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) return <div className="text-red-500 bg-white p-6 rounded-[14px] shadow">{error}</div>;
  
  const { user, products, orders } = data;
  if (!user) return <div className="text-gray-400 text-center py-20">User not found</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/users" className="w-10 h-10 rounded-[10px] bg-white border border-[#E0E0E0] flex items-center justify-center hover:bg-[#F5F6FA] transition-colors">
            <svg className="w-5 h-5 text-[#202224]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </Link>
          <div>
            <h1 className="text-[28px] font-bold text-[#202224]">User Profile</h1>
            <span className="text-[13px] font-mono text-[#4880FF] font-semibold">{user.customId || user._id}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStatusToggle}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] font-semibold transition-all shadow-sm ${
              user.isVerified
                ? "bg-[#FD5454] text-white hover:bg-[#e04848]"
                : "bg-[#00B69B] text-white hover:bg-[#00a08a]"
            }`}
          >
            {user.isVerified ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                Revoke Approval
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                Approve User
              </>
            )}
          </button>
          
          <Link 
            to={`/announcements?userId=${user.customId || user._id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4880FF] text-white rounded-[10px] font-semibold text-[14px] hover:bg-[#3d6fd4] transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            Send Announcement
          </Link>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-[80px] h-[80px] rounded-full bg-[#4880FF]/15 overflow-hidden flex-shrink-0">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=4880FF&color=fff&bold=true`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[24px] font-bold text-[#202224]">{user.name || "N/A"}</h2>
                <span className={`px-4 py-1 rounded-[13.5px] text-[13px] font-semibold capitalize ${
                  user.isVerified ? "bg-[#00B69B] text-white" : "bg-[#FCBE2D] text-white"
                }`}>
                  {user.isVerified ? "Approved" : "Pending Approval"}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-[14px] text-[#202224]/60 mt-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  {user.phone || "N/A"}
                </div>
                <div className="flex items-center gap-2 capitalize">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                  Role: <strong className="text-[#202224]">{user.role}</strong>
                </div>
                {user.location && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    {user.location.region} / {user.location.zone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Metric Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-[#E0E0E0]/50">
          <div className="bg-[#F5F6FA] p-5 rounded-[10px] text-center">
            <div className="text-[28px] font-bold text-[#4880FF] mb-1">{products.length}</div>
            <div className="text-[12px] text-[#202224]/50 uppercase tracking-wider font-semibold">Active Listings</div>
          </div>
          <div className="bg-[#F5F6FA] p-5 rounded-[10px] text-center">
            <div className="text-[28px] font-bold text-[#4AD991] mb-1">{orders.length}</div>
            <div className="text-[12px] text-[#202224]/50 uppercase tracking-wider font-semibold">Total Orders</div>
          </div>
          <div className="bg-[#F5F6FA] p-5 rounded-[10px] text-center">
            <div className="text-[18px] font-bold text-[#202224] mb-1 leading-[36px]">
              {new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <div className="text-[12px] text-[#202224]/50 uppercase tracking-wider font-semibold">Joined Date</div>
          </div>
        </div>
      </div>

      {/* Stacked Tables */}
      <div className="space-y-8">
        
        {/* Recent Listings */}
        <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[20px] font-bold text-[#202224] flex items-center gap-2">
              <svg className="w-5 h-5 text-[#4AD991]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Recent Listings ({products.length})
            </h3>
          </div>
          {products.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F1F4F9]">
                  <th className="py-4 px-5 text-[14px] font-bold text-[#202224] rounded-l-[12px]">Product ID</th>
                  <th className="py-4 px-5 text-[14px] font-bold text-[#202224]">Crop Type</th>
                  <th className="py-4 px-5 text-[14px] font-bold text-[#202224]">Quantity</th>
                  <th className="py-4 px-5 text-[14px] font-bold text-[#202224]">Price</th>
                  <th className="py-4 px-5 text-[14px] font-bold text-[#202224] rounded-r-[12px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map(p => (
                  <tr key={p._id} className="border-b border-[#979797]/15 last:border-0 hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-4 px-5">
                      <Link to={`/products/${p.customId || p._id}`} className="text-[13px] font-mono text-[#4880FF] hover:underline font-semibold">
                        {p.customId || `#${p._id.slice(-6)}`}
                      </Link>
                    </td>
                    <td className="py-4 px-5 text-[14px] text-[#202224] font-medium">{p.cropType}</td>
                    <td className="py-4 px-5 text-[14px] text-[#202224]/80 whitespace-nowrap">{p.quantity} {p.unit}</td>
                    <td className="py-4 px-5 text-[14px] text-[#202224] font-semibold whitespace-nowrap">ETB {p.price?.toLocaleString()}</td>
                    <td className="py-4 px-5">
                      <span className={`px-4 py-1.5 rounded-[13.5px] text-[13px] font-semibold capitalize inline-block ${
                        p.status === 'active' || p.status === 'approved' ? 'bg-[#00B69B] text-white' : 'bg-[#FCBE2D] text-white'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-10 text-center text-gray-400 text-sm">No listings created by this user yet.</div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[20px] font-bold text-[#202224] flex items-center gap-2">
              <svg className="w-5 h-5 text-[#4880FF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" /></svg>
              Recent Orders ({orders.length})
            </h3>
          </div>
          {orders.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F1F4F9]">
                  <th className="py-4 px-5 text-[14px] font-bold text-[#202224] rounded-l-[12px]">Order ID</th>
                  <th className="py-4 px-5 text-[14px] font-bold text-[#202224]">Crop</th>
                  <th className="py-4 px-5 text-[14px] font-bold text-[#202224]">Type</th>
                  <th className="py-4 px-5 text-[14px] font-bold text-[#202224]">Total Price</th>
                  <th className="py-4 px-5 text-[14px] font-bold text-[#202224] rounded-r-[12px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o._id} className="border-b border-[#979797]/15 last:border-0 hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-4 px-5">
                      <Link to={`/orders/${o.customId || o._id}`} className="text-[13px] font-mono text-[#4880FF] hover:underline font-semibold">
                        {o.customId || `#${o._id.slice(-6)}`}
                      </Link>
                    </td>
                    <td className="py-4 px-5 text-[14px] text-[#202224] font-medium">{o.cropType || o.productId?.cropType || "—"}</td>
                    <td className="py-4 px-5 text-[14px] text-[#202224]/80 capitalize font-medium">
                      {user.role === 'farmer' ? <span className="text-[#00B69B]">Sale</span> : <span className="text-[#4880FF]">Purchase</span>}
                    </td>
                    <td className="py-4 px-5 text-[14px] text-[#202224] font-semibold whitespace-nowrap">ETB {o.totalPrice?.toLocaleString()}</td>
                    <td className="py-4 px-5">
                      <span className={`px-4 py-1.5 rounded-[13.5px] text-[13px] font-semibold capitalize inline-block ${
                        o.status === 'delivered' ? 'bg-[#00B69B] text-white' : o.status === 'cancelled' ? 'bg-[#FD5454] text-white' : 'bg-[#FCBE2D] text-white'
                      }`}>
                        {o.status?.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-10 text-center text-gray-400 text-sm">No orders recorded for this user yet.</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserDetail;
