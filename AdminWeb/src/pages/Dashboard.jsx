import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../services/api";

// SVG Icon Components
const UsersIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#8280FF" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const OrdersIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#FEC53D" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

const SalesIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#4AD991" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

const PendingIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#FF9066" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrendUpIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#00B69B" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

const TrendDownIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#F93C65" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
  </svg>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-primary text-white px-3 py-2 rounded-md shadow-lg text-sm font-semibold">
        {label}: {payload[0].value.toLocaleString()}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [data, setData] = useState({ users: [], products: [], orders: [], analytics: { registrations: [] } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [usersRes, productsRes, ordersRes, analyticsRes] = await Promise.all([
        api.get("/admin/users").catch(() => ({ data: { data: { users: [] } } })),
        api.get("/admin/products").catch(() => ({ data: { data: { products: [] } } })),
        api.get("/admin/orders").catch(() => ({ data: { data: { orders: [] } } })),
        api.get("/admin/analytics").catch(() => ({ data: { data: {} } })),
      ]);

      setData({
        users: usersRes.data?.data?.users || [],
        products: productsRes.data?.data?.products || [],
        orders: ordersRes.data?.data?.orders || [],
        analytics: analyticsRes.data?.data || { registrations: [] }
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
      case "pending": return "bg-warning text-white";
      case "confirmed": return "bg-primary text-white";
      case "in_transit": return "bg-[#8280FF] text-white";
      case "delivered": return "bg-success text-white";
      case "cancelled": return "bg-danger text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500 text-sm font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const { users, products, orders, analytics } = data;
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const totalSales = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  // Chart data - map backend _id to name for XAxis
  const rawRegistrations = analytics.registrations || [];
  const chartData = rawRegistrations.length > 0
    ? rawRegistrations.map(r => ({ name: r._id || r.name, count: r.count }))
    : [
        { name: 'Jan', count: 22 },  { name: 'Feb', count: 35 },
        { name: 'Mar', count: 28 },  { name: 'Apr', count: 42 },
        { name: 'May', count: 68 },  { name: 'Jun', count: 48 },
        { name: 'Jul', count: 55 },  { name: 'Aug', count: 78 },
        { name: 'Sep', count: 58 },  { name: 'Oct', count: 63 },
        { name: 'Nov', count: 45 },  { name: 'Dec', count: 52 }
      ];

  return (
    <div className="space-y-8">
      <h1 className="text-[32px] font-bold text-ink tracking-[-0.11px]">Dashboard</h1>

      {error && <div className="text-red-500 bg-white p-4 rounded-lg shadow">{error}</div>}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <div className="bg-white p-6 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex flex-col justify-between min-h-[161px]">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[16px] text-ink opacity-70 mb-3">Total User</div>
              <div className="text-[28px] font-bold text-ink tracking-[1px] leading-[38px]">{users.length.toLocaleString()}</div>
            </div>
            <div className="w-[60px] h-[60px] rounded-[23px] bg-[#8280FF]/20 flex items-center justify-center">
              <UsersIcon />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendUpIcon />
            <span className="text-success text-[16px] font-semibold">8.5%</span>
            <span className="text-[16px] text-ink opacity-70">Up from yesterday</span>
          </div>
        </div>

        {/* Total Order */}
        <div className="bg-white p-6 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex flex-col justify-between min-h-[161px]">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[16px] text-ink opacity-70 mb-3">Total Order</div>
              <div className="text-[28px] font-bold text-ink tracking-[1px] leading-[38px]">{orders.length.toLocaleString()}</div>
            </div>
            <div className="w-[60px] h-[60px] rounded-[23px] bg-warning/20 flex items-center justify-center">
              <OrdersIcon />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendUpIcon />
            <span className="text-success text-[16px] font-semibold">1.3%</span>
            <span className="text-[16px] text-ink opacity-70">Up from past week</span>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white p-6 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex flex-col justify-between min-h-[161px]">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[16px] text-ink opacity-70 mb-3">Total Sales</div>
              <div className="text-[28px] font-bold text-ink tracking-[1px] leading-[38px]">ETB {totalSales.toLocaleString()}</div>
            </div>
            <div className="w-[60px] h-[60px] rounded-[23px] bg-success/20 flex items-center justify-center">
              <SalesIcon />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendDownIcon />
            <span className="text-[#F93C65] text-[16px] font-semibold">4.3%</span>
            <span className="text-[16px] text-ink opacity-70">Down from yesterday</span>
          </div>
        </div>

        {/* Total Pending */}
        <div className="bg-white p-6 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex flex-col justify-between min-h-[161px]">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[16px] text-ink opacity-70 mb-3">Total Pending</div>
              <div className="text-[28px] font-bold text-ink tracking-[1px] leading-[38px]">{pendingOrders.length.toLocaleString()}</div>
            </div>
            <div className="w-[60px] h-[60px] rounded-[23px] bg-[#FF9066]/20 flex items-center justify-center">
              <PendingIcon />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendUpIcon />
            <span className="text-success text-[16px] font-semibold">1.8%</span>
            <span className="text-[16px] text-ink opacity-70">Up from yesterday</span>
          </div>
        </div>
      </div>

      {/* Sales Details Chart */}
      <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[24px] font-bold text-ink">Sales Details</h2>
          <div className="border border-border rounded-[4px] px-3 py-1.5 bg-[#FCFDFD] text-[12px] text-[#2B3034]/60 flex items-center gap-2 cursor-pointer hover:border-primary transition-colors">
            October
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4379EE" stopOpacity={0.16} />
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.18} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'rgba(43, 48, 52, 0.4)' }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: 'rgba(43, 48, 52, 0.4)' }} 
                dx={-10} 
                tickFormatter={(val) => `${val}%`} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#4379EE" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorSales)" 
                dot={{ r: 3, fill: '#4379EE', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#4880FF', stroke: '#fff', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[24px] font-bold text-ink">Products</h2>
          <Link to="/products" className="text-[14px] text-primary font-semibold hover:underline">View All</Link>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-soft">
              <th className="py-4 px-5 text-[14px] font-bold text-ink rounded-l-[12px]">Product Name</th>
              <th className="py-4 px-5 text-[14px] font-bold text-ink">Location</th>
              <th className="py-4 px-5 text-[14px] font-bold text-ink">Date - Time</th>
              <th className="py-4 px-5 text-[14px] font-bold text-ink">Quantity</th>
              <th className="py-4 px-5 text-[14px] font-bold text-ink">Amount</th>
              <th className="py-4 px-5 text-[14px] font-bold text-ink rounded-r-[12px]">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 5).map((p) => (
              <tr key={p._id} className="border-b border-[#979797]/20 last:border-0 hover:bg-[#F9FAFB] transition-colors">
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-[44px] h-[44px] rounded-[18px] bg-[#D8D8D8] overflow-hidden flex-shrink-0">
                      {p.images && p.images[0] ? (
                        <img src={p.images[0]} alt={p.cropType} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                      )}
                    </div>
                    <Link to={`/products/${p.customId || p._id}`} className="text-[14px] text-ink/80 hover:text-primary hover:underline font-semibold">
                      {p.cropType}
                    </Link>
                  </div>
                </td>
                <td className="py-4 px-5 text-[14px] text-ink/80">
                  {p.farmerId?.location?.region || "N/A"}
                </td>
                <td className="py-4 px-5 text-[14px] text-ink/80 font-semibold whitespace-nowrap">
                  {new Date(p.createdAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' }).replace(',', ' -')}
                </td>
                <td className="py-4 px-5 text-[14px] text-ink/80">
                  {p.quantity} {p.unit}
                </td>
                <td className="py-4 px-5 text-[14px] text-ink/80 font-semibold whitespace-nowrap">
                  ETB {p.price?.toLocaleString() || "0"}
                </td>
                <td className="py-4 px-5">
                  <span className={`px-4 py-1.5 rounded-[13.5px] text-[14px] font-semibold inline-block ${
                    p.status === 'approved' ? 'bg-success text-white' : p.status === 'rejected' ? 'bg-danger text-white' : 'bg-warning text-white'
                  }`}>
                    {p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="6" className="py-8 text-center text-gray-400">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Users Table */}
      <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[24px] font-bold text-ink">Users</h2>
          <Link to="/users" className="text-[14px] text-primary font-semibold hover:underline">View All</Link>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-soft">
              <th className="py-4 px-5 text-[14px] font-bold text-ink rounded-l-[12px]">User</th>
              <th className="py-4 px-5 text-[14px] font-bold text-ink">Phone</th>
              <th className="py-4 px-5 text-[14px] font-bold text-ink">Role</th>
              <th className="py-4 px-5 text-[14px] font-bold text-ink">Joined</th>
              <th className="py-4 px-5 text-[14px] font-bold text-ink rounded-r-[12px]">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 5).map((u) => (
              <tr key={u._id} className="border-b border-[#979797]/20 last:border-0 hover:bg-[#F9FAFB] transition-colors">
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-[44px] h-[44px] rounded-full bg-[#D8D8D8] overflow-hidden flex-shrink-0">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=random&bold=true`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <Link to={`/users/${u.customId || u._id}`} className="text-[14px] text-ink/80 hover:text-primary hover:underline font-semibold">
                        {u.name || "N/A"}
                      </Link>
                      <span className="text-[12px] text-gray-400 font-mono">{u.customId || `#${u._id.slice(-6)}`}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-5 text-[14px] text-ink/80 whitespace-nowrap">
                  {u.phone || "N/A"}
                </td>
                <td className="py-4 px-5 text-[14px] text-ink/80 font-semibold capitalize">
                  {u.role}
                </td>
                <td className="py-4 px-5 text-[14px] text-ink/80 whitespace-nowrap">
                  {new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </td>
                <td className="py-4 px-5">
                  <span className={`px-4 py-1.5 rounded-[13.5px] text-[14px] font-semibold inline-block ${
                    u.isVerified ? "bg-success text-white" : "bg-warning text-white"
                  }`}>
                    {u.isVerified ? "Approved" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan="5" className="py-8 text-center text-gray-400">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
