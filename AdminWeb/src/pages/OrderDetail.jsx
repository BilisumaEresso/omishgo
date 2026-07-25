import  { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";


const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/admin/orders/${id}`);
        setOrder(res.data?.data?.order || null);
      } catch (err) {
        setError("Failed to fetch order details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const getStatusStyle = (status) => {
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
  if (!order) return <div className="text-gray-400 text-center py-20">Order not found</div>;

  const statuses = ['pending', 'confirmed', 'in_transit', 'delivered'];
  const currentIndex = statuses.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/orders" className="w-10 h-10 rounded-[10px] bg-white border border-[#E0E0E0] flex items-center justify-center hover:bg-[#F5F6FA] transition-colors">
            <svg className="w-5 h-5 text-[#202224]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </Link>
          <div>
            <h1 className="text-[28px] font-bold text-[#202224]">Order Detail</h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[13px] font-mono text-[#4880FF] font-semibold">{order.customId || `#${order._id.slice(-6)}`}</span>
              <span className="text-[13px] text-[#202224]/40">·</span>
              <span className="text-[13px] text-[#202224]/50">
                {new Date(order.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
        <span className={`px-5 py-2 rounded-[13.5px] text-[14px] font-semibold capitalize ${getStatusStyle(order.status)}`}>
          {order.status?.replace('_', ' ')}
        </span>
      </div>

      {/* Order Progress Timeline */}
      <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        <h3 className="text-[18px] font-bold text-[#202224] mb-8 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#4880FF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>
          Order Progress
        </h3>
        <div className="relative px-4">
          {/* Track line */}
          <div className="absolute left-[calc(12.5%)] right-[calc(12.5%)] top-[20px] h-[3px] bg-[#E0E0E0] rounded-full"></div>
          {/* Active track */}
          {!isCancelled && currentIndex >= 0 && (
            <div
              className="absolute left-[calc(12.5%)] top-[20px] h-[3px] bg-[#4880FF] rounded-full transition-all duration-500"
              style={{ width: `${(currentIndex / (statuses.length - 1)) * 75}%` }}
            ></div>
          )}

          <div className="relative flex justify-between">
            {statuses.map((step, index) => {
              const isCompleted = !isCancelled && index <= currentIndex;
              const isCurrent = !isCancelled && index === currentIndex;

              return (
                <div key={step} className="flex flex-col items-center relative z-10" style={{ width: '25%' }}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-[3px] transition-all duration-300 ${
                    isCancelled
                      ? 'bg-white border-[#E0E0E0]'
                      : isCompleted
                        ? 'bg-[#4880FF] border-[#4880FF] shadow-lg shadow-[#4880FF]/30'
                        : 'bg-white border-[#E0E0E0]'
                  }`}>
                    {isCompleted ? (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    ) : (
                      <div className={`w-2.5 h-2.5 rounded-full ${isCancelled ? 'bg-[#E0E0E0]' : 'bg-[#D5D5D5]'}`}></div>
                    )}
                  </div>
                  <span className={`mt-3 text-[13px] font-semibold capitalize ${
                    isCurrent ? 'text-[#4880FF]' : isCompleted ? 'text-[#202224]' : 'text-[#202224]/30'
                  }`}>
                    {step.replace('_', ' ')}
                  </span>
                  {isCurrent && (
                    <span className="mt-1 text-[11px] text-[#4880FF] font-medium">Current</span>
                  )}
                </div>
              );
            })}
          </div>

          {isCancelled && (
            <div className="mt-6 flex items-center justify-center gap-2 py-3 bg-[#FD5454]/10 rounded-[10px]">
              <svg className="w-5 h-5 text-[#FD5454]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              <span className="text-[#FD5454] font-bold text-[14px]">This order has been cancelled</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Order Summary */}
        <div className="lg:col-span-2 space-y-8">

          {/* Product & Pricing */}
          <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
            <h3 className="text-[18px] font-bold text-[#202224] mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#4AD991]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              Product &amp; Pricing
            </h3>

            <div className="flex items-start gap-5 mb-6 pb-6 border-b border-[#E0E0E0]/50">
              {/* Product image */}
              <div className="w-[80px] h-[80px] rounded-[14px] bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {order.productId?.photos && order.productId.photos.length > 0 ? (
                  <img src={order.productId.photos[0]} alt={order.cropType} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[18px] font-bold text-[#202224]">{order.cropType || order.productId?.cropType || "Unknown"}</h4>
                    {order.productId?.customId && (
                      <Link to={`/products/${order.productId.customId}`} className="text-[12px] font-mono text-[#4880FF] hover:underline">
                        {order.productId.customId}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#202224]/60 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  Quantity
                </span>
                <span className="text-[14px] font-semibold text-[#202224]">{order.quantity} {order.unit || order.productId?.unit || "kg"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#202224]/60 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Price per Unit
                </span>
                <span className="text-[14px] font-semibold text-[#202224]">ETB {(order.pricePerUnit || order.productId?.price || 0).toLocaleString()}</span>
              </div>
              <div className="border-t border-[#E0E0E0]/50 pt-4 flex justify-between items-center">
                <span className="text-[16px] font-bold text-[#202224]">Total Price</span>
                <span className="text-[24px] font-bold text-[#4880FF]">ETB {order.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Note */}
          {order.note && (
            <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
              <h3 className="text-[18px] font-bold text-[#202224] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#FCBE2D]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                Order Note
              </h3>
              <p className="text-[14px] text-[#202224]/70 leading-relaxed bg-[#F5F6FA] p-5 rounded-[10px] whitespace-pre-wrap">{order.note}</p>
            </div>
          )}
        </div>

        {/* Right Column: Participants */}
        <div className="space-y-8">

          {/* Buyer Card */}
          <div className="bg-white p-6 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
            <h3 className="text-[14px] font-bold text-[#202224]/50 uppercase tracking-wider mb-5 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#4880FF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
              Buyer
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-[50px] h-[50px] rounded-full bg-[#4880FF]/15 overflow-hidden flex-shrink-0">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(order.buyerId?.name || 'B')}&background=4880FF&color=fff&bold=true`} alt="Buyer" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/users/${order.buyerId?.customId || order.buyerId?._id}`} className="text-[16px] font-bold text-[#202224] hover:text-[#4880FF] hover:underline block truncate">
                  {order.buyerId?.name || "Unknown"}
                </Link>
                <span className="text-[12px] font-mono text-[#4880FF]">{order.buyerId?.customId || ""}</span>
              </div>
            </div>
            <div className="space-y-2.5 text-[13px] text-[#202224]/60">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                {order.buyerId?.phone || "N/A"}
              </div>
            </div>
            <Link to={`/users/${order.buyerId?.customId || order.buyerId?._id}`}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F5F6FA] text-[#4880FF] rounded-[10px] font-semibold text-[13px] hover:bg-[#4880FF] hover:text-white transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              View Profile
            </Link>
          </div>

          {/* Farmer Card */}
          <div className="bg-white p-6 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
            <h3 className="text-[14px] font-bold text-[#202224]/50 uppercase tracking-wider mb-5 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#4AD991]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              Farmer
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-[50px] h-[50px] rounded-full bg-[#4AD991]/15 overflow-hidden flex-shrink-0">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(order.farmerId?.name || 'F')}&background=4AD991&color=fff&bold=true`} alt="Farmer" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/users/${order.farmerId?.customId || order.farmerId?._id}`} className="text-[16px] font-bold text-[#202224] hover:text-[#4880FF] hover:underline block truncate">
                  {order.farmerId?.name || "Unknown"}
                </Link>
                <span className="text-[12px] font-mono text-[#4880FF]">{order.farmerId?.customId || ""}</span>
              </div>
            </div>
            <div className="space-y-2.5 text-[13px] text-[#202224]/60">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                {order.farmerId?.phone || "N/A"}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                {order.farmerId?.location?.region || "Unknown"} / {order.farmerId?.location?.zone || "Unknown"}
              </div>
            </div>
            <Link to={`/users/${order.farmerId?.customId || order.farmerId?._id}`}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F5F6FA] text-[#4880FF] rounded-[10px] font-semibold text-[13px] hover:bg-[#4880FF] hover:text-white transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              View Profile
            </Link>
          </div>

          {/* Order Meta */}
          <div className="bg-white p-6 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
            <h3 className="text-[14px] font-bold text-[#202224]/50 uppercase tracking-wider mb-5 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#8280FF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
              Order Info
            </h3>
            <div className="space-y-4 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#202224]/50">Order ID</span>
                <span className="font-mono font-semibold text-[#202224]">{order.customId || order._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#202224]/50">Created</span>
                <span className="font-semibold text-[#202224]">{new Date(order.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#202224]/50">Last Updated</span>
                <span className="font-semibold text-[#202224]">{new Date(order.updatedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
