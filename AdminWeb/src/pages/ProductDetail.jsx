import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const ProductDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState({ product: null, orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePhoto, setActivePhoto] = useState(0);

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/admin/products/${id}`);
      setData(res.data?.data || { product: null, orders: [] });
    } catch (err) {
      setError("Failed to fetch product details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAction = async (action) => {
    if (!window.confirm(`Are you sure you want to ${action} this product?`)) return;
    try {
      await api.put(`/admin/products/${id}/${action}`);
      fetchDetail();
    } catch (err) {
      alert(`Failed to ${action} product`);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "active": return "bg-[#00B69B] text-white";
      case "approved": return "bg-[#00B69B] text-white";
      case "pending": return "bg-[#FCBE2D] text-white";
      case "sold": return "bg-[#FD5454] text-white";
      case "rejected": return "bg-[#FD5454] text-white";
      case "draft": return "bg-[#979797] text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  const getOrderStatusStyle = (status) => {
    switch (status) {
      case "pending": return "bg-[#FCBE2D] text-white";
      case "confirmed": return "bg-[#4880FF] text-white";
      case "in_transit": return "bg-[#8280FF] text-white";
      case "delivered": return "bg-[#00B69B] text-white";
      case "cancelled": return "bg-[#FD5454] text-white";
      default: return "bg-gray-400 text-white";
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
  
  const { product, orders } = data;
  if (!product) return <div className="text-gray-400 text-center py-20">Product not found</div>;

  const photos = product.photos && product.photos.length > 0 ? product.photos : [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/products" className="w-10 h-10 rounded-[10px] bg-white border border-[#E0E0E0] flex items-center justify-center hover:bg-[#F5F6FA] transition-colors">
            <svg className="w-5 h-5 text-[#202224]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </Link>
          <div>
            <h1 className="text-[28px] font-bold text-[#202224]">Product Detail</h1>
            <span className="text-[13px] font-mono text-[#4880FF]">{product.customId || product._id}</span>
          </div>
        </div>
        
        {product.status === "pending" && (
          <div className="flex gap-3">
            <button 
              onClick={() => handleAction("approve")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00B69B] text-white rounded-[10px] font-semibold text-[14px] hover:bg-[#00a08a] transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              Approve
            </button>
            <button 
              onClick={() => handleAction("reject")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FD5454] text-white rounded-[10px] font-semibold text-[14px] hover:bg-[#e04848] transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Photos */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Main Photo */}
            <div className="aspect-square bg-[#F5F6FA] relative overflow-hidden">
              {photos.length > 0 ? (
                <img 
                  src={photos[activePhoto]} 
                  alt={`${product.cropType} photo ${activePhoto + 1}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                  <svg className="w-20 h-20 mb-3" fill="none" stroke="currentColor" strokeWidth={0.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                  <span className="text-[14px] font-medium">No photos uploaded</span>
                </div>
              )}
              {/* Status Badge */}
              <span className={`absolute top-4 left-4 px-4 py-1.5 rounded-[13.5px] text-[13px] font-semibold capitalize ${getStatusStyle(product.status)}`}>
                {product.status}
              </span>
            </div>

            {/* Thumbnail Strip */}
            {photos.length > 0 && (
              <div className="flex gap-3 p-4">
                {photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`w-[72px] h-[72px] rounded-[10px] overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activePhoto === i ? 'border-[#4880FF] shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                {/* Show placeholder slots for remaining (max 2) */}
                {Array.from({ length: Math.max(0, 2 - photos.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-[72px] h-[72px] rounded-[10px] border-2 border-dashed border-gray-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  </div>
                ))}
              </div>
            )}
            {photos.length === 0 && (
              <div className="flex gap-3 p-4">
                <div className="w-[72px] h-[72px] rounded-[10px] border-2 border-dashed border-gray-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </div>
                <div className="w-[72px] h-[72px] rounded-[10px] border-2 border-dashed border-gray-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Product Info Card */}
          <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-[24px] font-bold text-[#202224] mb-1">{product.cropType}</h2>
                <span className="text-[14px] text-[#202224]/50 uppercase tracking-wider font-semibold">{product.category || "General"}</span>
              </div>
              <div className="text-right">
                <div className="text-[28px] font-bold text-[#4880FF]">ETB {product.price?.toLocaleString()}</div>
                <div className="text-[13px] text-[#202224]/50">per {product.unit || "kg"}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#F5F6FA] p-4 rounded-[10px]">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-[#8280FF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <span className="text-[12px] text-[#202224]/50 font-semibold uppercase">Quantity</span>
                </div>
                <div className="text-[18px] font-bold text-[#202224]">{product.quantity} <span className="text-[14px] font-normal text-[#202224]/50">{product.unit}</span></div>
              </div>
              <div className="bg-[#F5F6FA] p-4 rounded-[10px]">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-[#FEC53D]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                  <span className="text-[12px] text-[#202224]/50 font-semibold uppercase">Listed</span>
                </div>
                <div className="text-[14px] font-bold text-[#202224]">{new Date(product.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
              <div className="bg-[#F5F6FA] p-4 rounded-[10px]">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-[#4AD991]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  <span className="text-[12px] text-[#202224]/50 font-semibold uppercase">Region</span>
                </div>
                <div className="text-[14px] font-bold text-[#202224]">{product.location?.region || product.farmerId?.location?.region || "N/A"}</div>
              </div>
              <div className="bg-[#F5F6FA] p-4 rounded-[10px]">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-[#FF9066]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" /></svg>
                  <span className="text-[12px] text-[#202224]/50 font-semibold uppercase">Orders</span>
                </div>
                <div className="text-[18px] font-bold text-[#202224]">{orders.length}</div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h4 className="text-[14px] font-bold text-[#202224] mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#4880FF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                  Description
                </h4>
                <p className="text-[14px] text-[#202224]/70 leading-relaxed bg-[#F5F6FA] p-5 rounded-[10px]">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* Farmer Info Card */}
          <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
            <h3 className="text-[18px] font-bold text-[#202224] mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#8280FF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              Farmer Information
            </h3>
            <div className="flex items-start gap-5">
              <div className="w-[60px] h-[60px] rounded-full bg-[#8280FF]/15 overflow-hidden flex-shrink-0">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(product.farmerId?.name || 'F')}&background=8280FF&color=fff&bold=true`} alt="Farmer" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <Link to={`/users/${product.farmerId?.customId || product.farmerId?._id}`} className="text-[18px] font-bold text-[#202224] hover:text-[#4880FF] hover:underline">
                  {product.farmerId?.name || "Unknown Farmer"}
                </Link>
                <div className="text-[13px] font-mono text-[#4880FF] mb-3">{product.farmerId?.customId || ""}</div>
                <div className="flex flex-wrap gap-4 text-[14px] text-[#202224]/60">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                    {product.farmerId?.phone || "N/A"}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    {product.farmerId?.location?.region || "Unknown"} / {product.farmerId?.location?.zone || "Unknown"}
                  </div>
                </div>
              </div>
              <Link
                to={`/users/${product.farmerId?.customId || product.farmerId?._id}`}
                className="px-4 py-2 bg-[#F5F6FA] text-[#4880FF] rounded-[10px] font-semibold text-[13px] hover:bg-[#4880FF] hover:text-white transition-all flex-shrink-0"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[20px] font-bold text-[#202224] flex items-center gap-2">
            <svg className="w-5 h-5 text-[#FEC53D]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" /></svg>
            Recent Orders
            <span className="text-[14px] font-normal text-[#202224]/40 ml-1">({orders.length})</span>
          </h3>
        </div>
        
        {orders.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F1F4F9]">
                <th className="py-4 px-5 text-[14px] font-bold text-[#202224] rounded-l-[12px]">Order ID</th>
                <th className="py-4 px-5 text-[14px] font-bold text-[#202224]">Buyer</th>
                <th className="py-4 px-5 text-[14px] font-bold text-[#202224]">Date</th>
                <th className="py-4 px-5 text-[14px] font-bold text-[#202224]">Amount</th>
                <th className="py-4 px-5 text-[14px] font-bold text-[#202224] rounded-r-[12px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} className="border-b border-[#979797]/15 last:border-0 hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-4 px-5">
                    <Link to={`/orders/${o.customId || o._id}`} className="text-[13px] font-mono text-[#4880FF] hover:underline">
                      {o.customId || `#${o._id.slice(-6)}`}
                    </Link>
                  </td>
                  <td className="py-4 px-5">
                    {o.buyerId ? (
                      <Link to={`/users/${o.buyerId.customId || o.buyerId._id}`} className="text-[14px] text-[#202224] hover:text-[#4880FF] hover:underline font-medium">
                        {o.buyerId.name || "Unknown"}
                      </Link>
                    ) : (
                      <span className="text-gray-400">Unknown</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-[14px] text-[#202224]/70 whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-5 text-[14px] text-[#202224] font-semibold whitespace-nowrap">
                    ETB {o.totalPrice?.toLocaleString()}
                  </td>
                  <td className="py-4 px-5">
                    <span className={`px-4 py-1.5 rounded-[13.5px] text-[13px] font-semibold capitalize inline-block ${getOrderStatusStyle(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" /></svg>
            <div className="text-gray-400 text-[16px] font-medium">No orders yet</div>
            <div className="text-gray-300 text-[13px] mt-1">This product hasn't received any orders</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
