import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import api from "../services/api";
import { getUserAvatarUrl, formatLocation } from "../utils/avatar";

const Analytics = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Featured Product Carousel State
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Full System Report Modal & Build State
  const [showReportModal, setShowReportModal] = useState(false);
  const [isBuildingReport, setIsBuildingReport] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildStatusText, setBuildStatusText] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("pdf"); // 'pdf', 'excel', 'doc'

  const handleGenerateSelectedFormat = () => {
    if (selectedFormat === "pdf") {
      handleExportPDF();
    } else if (selectedFormat === "excel") {
      handleExportExcel();
    } else if (selectedFormat === "doc") {
      handleDownloadDoc();
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [productsRes, usersRes, ordersRes, auditRes] = await Promise.all([
          api.get("/admin/products").catch(() => ({ data: { data: { products: [] } } })),
          api.get("/admin/users").catch(() => ({ data: { data: { users: [] } } })),
          api.get("/admin/orders").catch(() => ({ data: { data: { orders: [] } } })),
          api.get("/admin/audit-logs").catch(() => ({ data: { data: { logs: [] } } })),
        ]);

        setProducts(productsRes.data?.data?.products || []);
        setUsers(usersRes.data?.data?.users || []);
        setOrders(ordersRes.data?.data?.orders || []);
        setAuditLogs(auditRes.data?.data?.logs || []);
      } catch (err) {
        setError("Failed to fetch analytics data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleNextProduct = () => {
    if (products.length === 0) return;
    setFeaturedIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrevProduct = () => {
    if (products.length === 0) return;
    setFeaturedIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  // Step 1: Start building report with dynamic 100% progress simulation
  const startBuildingReport = () => {
    setIsBuildingReport(true);
    setBuildProgress(0);
    setBuildStatusText("Initializing system data compilation...");

    const steps = [
      { p: 20, text: "Fetching user directory & location records..." },
      { p: 45, text: "Aggregating crop listings & varieties..." },
      { p: 70, text: "Compiling order transactions & revenue logs..." },
      { p: 90, text: "Formatting printable PDF & spreadsheet structures..." },
      { p: 100, text: "Executive Report successfully generated!" }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setBuildProgress(steps[stepIdx].p);
        setBuildStatusText(steps[stepIdx].text);
        stepIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsBuildingReport(false);
          setShowReportModal(true);
        }, 400);
      }
    }, 400);
  };

  // 1. Export PDF Document Utility (Opens print window with pre-styled printable HTML template)
  const handleExportPDF = () => {
    const pdfWindow = window.open('', '_blank');
    const totalSales = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>OmishGo System Executive Report</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1c2434; padding: 40px; margin: 0; background: #fff; }
    .header { border-b: 3px solid #4880FF; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 28px; font-weight: 800; color: #4880FF; letter-spacing: -0.5px; }
    .title { font-size: 18px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
    .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; }
    .meta-card { text-align: center; }
    .meta-val { font-size: 22px; font-weight: 700; color: #0f172a; }
    .meta-lbl { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-top: 4px; }
    h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin-top: 30px; margin-bottom: 12px; border-left: 4px solid #4880FF; padding-left: 10px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 12px; }
    th { background: #f1f5f9; color: #475569; font-weight: 700; text-align: left; padding: 10px 12px; border-bottom: 2px solid #cbd5e1; }
    td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #334155; }
    tr:nth-child(even) { background: #fafafa; }
    .badge { padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; display: inline-block; }
    .badge-success { background: #dcfce7; color: #166534; }
    .footer { font-size: 10px; color: #94a3b8; text-align: center; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
    @media print {
      body { padding: 20px; }
      .page-break { page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">OMISHGO</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Agri-Marketplace Official System Report</div>
    </div>
    <div style="text-align: right;">
      <div class="title">Executive Audit</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Generated: ${new Date().toLocaleString()}</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-card">
      <div class="meta-val">${users.length}</div>
      <div class="meta-lbl">Total Users</div>
    </div>
    <div class="meta-card">
      <div class="meta-val">${products.length}</div>
      <div class="meta-lbl">Active Products</div>
    </div>
    <div class="meta-card">
      <div class="meta-val">${orders.length}</div>
      <div class="meta-lbl">Total Orders</div>
    </div>
    <div class="meta-card">
      <div class="meta-val">ETB ${totalSales.toLocaleString()}</div>
      <div class="meta-lbl">Marketplace Revenue</div>
    </div>
  </div>

  <h3>Product Inventory &amp; Varieties (${products.length})</h3>
  <table>
    <thead>
      <tr>
        <th>Custom ID</th>
        <th>Crop Type</th>
        <th>Variety</th>
        <th>Price (ETB)</th>
        <th>Quantity</th>
        <th>Farmer</th>
        <th>Location</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${products.slice(0, 15).map(p => `
        <tr>
          <td><strong>${p.customId || p._id}</strong></td>
          <td>${p.cropType}</td>
          <td>${p.variety ? `<strong>${p.variety}</strong>` : '—'}</td>
          <td>ETB ${p.price?.toLocaleString()}</td>
          <td>${p.quantity} ${p.unit}</td>
          <td>${p.farmerId?.name || 'Unknown'}</td>
          <td>${formatLocation(p.location || p.farmerId?.location)}</td>
          <td><span class="badge badge-success">${p.status}</span></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h3>Recent Orders (${orders.length})</h3>
  <table>
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Crop / Variety</th>
        <th>Quantity</th>
        <th>Total Price</th>
        <th>Buyer</th>
        <th>Farmer</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${orders.slice(0, 15).map(o => `
        <tr>
          <td><strong>${o.customId || o._id}</strong></td>
          <td>${o.cropType || 'Crop'} ${o.variety || o.productId?.variety ? `(${o.variety || o.productId?.variety})` : ''}</td>
          <td>${o.quantity} ${o.unit || 'kg'}</td>
          <td>ETB ${o.totalPrice?.toLocaleString()}</td>
          <td>${o.buyerId?.name || 'Unknown'}</td>
          <td>${o.farmerId?.name || 'Unknown'}</td>
          <td>${o.status}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="page-break"></div>

  <h3>User Accounts Directory (${users.length})</h3>
  <table>
    <thead>
      <tr>
        <th>User ID</th>
        <th>Name</th>
        <th>Phone / Email</th>
        <th>Role</th>
        <th>Rating</th>
        <th>Location</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${users.slice(0, 15).map(u => `
        <tr>
          <td><strong>${u.customId || u._id}</strong></td>
          <td>${u.name || 'N/A'}</td>
          <td>${u.phone} ${u.email ? `<br/><small>${u.email}</small>` : ''}</td>
          <td>${u.role}</td>
          <td>${(u.rating || u.averageRating) > 0 ? `★ ${u.rating || u.averageRating}` : '—'}</td>
          <td>${formatLocation(u.location)}</td>
          <td>${u.isVerified ? 'Approved' : 'Pending'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h3>System Audit Logs</h3>
  <table>
    <thead>
      <tr>
        <th>Timestamp</th>
        <th>Admin</th>
        <th>Action</th>
        <th>Target</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      ${auditLogs.slice(0, 10).map(l => `
        <tr>
          <td>${new Date(l.createdAt).toLocaleString()}</td>
          <td>${l.adminId?.name || 'System Admin'}</td>
          <td><strong>${l.action}</strong></td>
          <td>${l.targetType}</td>
          <td>${l.details || '-'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    End of Official System Executive Report — OmishGo Platform Confidential — Page 2
  </div>

  <script>
    window.onload = function() {
      setTimeout(() => { window.print(); }, 500);
    };
  </script>
</body>
</html>
    `;

    pdfWindow.document.write(htmlContent);
    pdfWindow.document.close();
  };

  // 2. Export Excel (.CSV / Spreadsheet format) Utility
  const handleExportExcel = () => {
    let csv = "=== OMISHGO SYSTEM EXECUTIVE REPORT ===\n";
    csv += `Generated On,${new Date().toLocaleString()}\n\n`;

    // Section 1: Users
    csv += "=== USER DIRECTORY ===\n";
    csv += "User ID,Name,Phone,Email,Role,Rating,Location,Status,Joined Date\n";
    users.forEach(u => {
      csv += `"${u.customId || u._id}","${u.name || ''}","${u.phone}","${u.email || ''}","${u.role}","${u.rating || u.averageRating || ''}","${formatLocation(u.location)}","${u.isVerified ? 'Approved' : 'Pending'}","${new Date(u.createdAt).toLocaleDateString()}"\n`;
    });
    csv += "\n";

    // Section 2: Products
    csv += "=== PRODUCT INVENTORY ===\n";
    csv += "Product ID,Crop Type,Variety,Price (ETB),Unit,Quantity,Farmer Name,Location,Status\n";
    products.forEach(p => {
      csv += `"${p.customId || p._id}","${p.cropType}","${p.variety || ''}",${p.price},"${p.unit}",${p.quantity},"${p.farmerId?.name || ''}","${formatLocation(p.location || p.farmerId?.location)}","${p.status}"\n`;
    });
    csv += "\n";

    // Section 3: Orders
    csv += "=== ORDER TRANSACTIONS ===\n";
    csv += "Order ID,Crop Type,Variety,Quantity,Unit,Total Price (ETB),Status,Date\n";
    orders.forEach(o => {
      csv += `"${o.customId || o._id}","${o.cropType || ''}","${o.variety || o.productId?.variety || ''}",${o.quantity},"${o.unit || 'kg'}",${o.totalPrice},"${o.status}","${new Date(o.createdAt).toLocaleDateString()}"\n`;
    });
    csv += "\n";

    // Section 4: Audit Logs
    csv += "=== AUDIT LOGS ===\n";
    csv += "Timestamp,Admin Name,Action,Target Type,Details\n";
    auditLogs.forEach(l => {
      csv += `"${new Date(l.createdAt).toLocaleString()}","${l.adminId?.name || ''}","${l.action}","${l.targetType}","${l.details || ''}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `OmishGo_Full_System_Data_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Export Word (.DOC) Utility
  const handleDownloadDoc = () => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const approvedUsers = users.filter(u => u.isVerified).length;

    const reportContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>OmishGo System Executive Report</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #202224; padding: 40px; max-width: 900px; margin: 0 auto; }
    h1 { color: #4880FF; border-bottom: 2px solid #4880FF; padding-bottom: 10px; }
    h2 { color: #202224; margin-top: 30px; border-bottom: 1px solid #E0E0E0; padding-bottom: 5px; }
    .kpi-grid { display: flex; gap: 20px; margin: 20px 0; }
    .kpi-card { background: #F5F6FA; padding: 15px 20px; border-radius: 10px; flex: 1; text-align: center; }
    .kpi-num { font-size: 24px; font-weight: bold; color: #4880FF; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th { background: #F1F4F9; text-align: left; padding: 10px; font-size: 13px; }
    td { padding: 10px; border-bottom: 1px solid #E0E0E0; font-size: 13px; }
    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #888; }
  </style>
</head>
<body>
  <h1>OmishGo Platform - Full System Audit & Executive Report</h1>
  <p><strong>Generated On:</strong> ${new Date().toLocaleString()}</p>
  <p><strong>Prepared By:</strong> System Super Admin</p>

  <h2>1. Executive KPI Summary</h2>
  <div class="kpi-grid">
    <div class="kpi-card"><div class="kpi-num">${users.length}</div><div>Total Users</div></div>
    <div class="kpi-card"><div class="kpi-num">${approvedUsers}</div><div>Approved Users</div></div>
    <div class="kpi-card"><div class="kpi-num">${products.length}</div><div>Active Listings</div></div>
    <div class="kpi-card"><div class="kpi-num">${orders.length}</div><div>Total Orders</div></div>
    <div class="kpi-card"><div class="kpi-num">ETB ${totalRevenue.toLocaleString()}</div><div>Total Trade Revenue</div></div>
  </div>

  <h2>2. Registered Users Directory</h2>
  <table>
    <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined Date</th></tr></thead>
    <tbody>
      ${users.map(u => `
        <tr>
          <td>${u.customId || u._id}</td>
          <td>${u.name || 'N/A'}</td>
          <td>${u.phone}</td>
          <td>${u.role}</td>
          <td>${u.isVerified ? 'Approved' : 'Pending'}</td>
          <td>${new Date(u.createdAt).toLocaleDateString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>3. Product Inventory Summary</h2>
  <table>
    <thead><tr><th>ID</th><th>Crop Type</th><th>Price per Unit</th><th>Quantity</th><th>Farmer</th><th>Status</th></tr></thead>
    <tbody>
      ${products.map(p => `
        <tr>
          <td>${p.customId || p._id}</td>
          <td>${p.cropType}</td>
          <td>ETB ${p.price} / ${p.unit}</td>
          <td>${p.quantity} ${p.unit}</td>
          <td>${p.farmerId?.name || 'N/A'}</td>
          <td>${p.status}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>4. Recent Orders Log</h2>
  <table>
    <thead><tr><th>Order ID</th><th>Crop</th><th>Quantity</th><th>Total Price</th><th>Status</th><th>Date</th></tr></thead>
    <tbody>
      ${orders.map(o => `
        <tr>
          <td>${o.customId || o._id}</td>
          <td>${o.cropType || o.productId?.cropType || 'N/A'}</td>
          <td>${o.quantity} ${o.unit || 'kg'}</td>
          <td>ETB ${o.totalPrice}</td>
          <td>${o.status}</td>
          <td>${new Date(o.createdAt).toLocaleDateString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>5. System Audit Trail (Last 10 Events)</h2>
  <table>
    <thead><tr><th>Timestamp</th><th>Admin</th><th>Action</th><th>Target Type</th><th>Details</th></tr></thead>
    <tbody>
      ${auditLogs.slice(0, 10).map(l => `
        <tr>
          <td>${new Date(l.createdAt).toLocaleString()}</td>
          <td>${l.adminId?.name || 'Admin'}</td>
          <td>${l.action}</td>
          <td>${l.targetType}</td>
          <td>${l.details || '-'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    End of Report — Confidential — Generated by OmishGo Admin Portal
  </div>
</body>
</html>
    `;

    const blob = new Blob([reportContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OmishGo_System_Report_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) return <div className="text-red-500 bg-white p-4 rounded-[14px] shadow">{error}</div>;

  // 1. Dual Overlapping Smooth Area Chart Data ("Revenue")
  const revenueChartData = [
    { name: '5k', sales: 20, profit: 20 },
    { name: '10k', sales: 32, profit: 70 },
    { name: '15k', sales: 28, profit: 40 },
    { name: '20k', sales: 27, profit: 42 },
    { name: '25k', sales: 55, profit: 48 },
    { name: '30k', sales: 32, profit: 52 },
    { name: '35k', sales: 90, profit: 30 },
    { name: '40k', sales: 42, profit: 58 },
    { name: '45k', sales: 65, profit: 40 },
    { name: '50k', sales: 48, profit: 55 },
    { name: '55k', sales: 58, profit: 92 },
    { name: '60k', sales: 30, profit: 35 },
  ];

  // 2. Sales Analytics Dual Curved Line Chart Data
  const salesAnalyticsData = [
    { name: '2015', primary: 25, secondary: 0 },
    { name: '2016', primary: 70, secondary: 60 },
    { name: '2017', primary: 45, secondary: 25 },
    { name: '2018', primary: 60, secondary: 40 },
    { name: '2026', primary: 95, secondary: 90 },
  ];

  // Featured Product info
  const currentFeatured = products[featuredIndex] || null;

  // User Stats for Customers Card
  const farmerCount = users.filter(u => u.role === 'farmer').length;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[32px] font-bold text-ink tracking-[-0.11px]">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={startBuildingReport}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-[10px] font-semibold text-[14px] hover:bg-[#3d6fd4] transition-all cursor-pointer shadow-md shadow-[#4880FF]/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            Generate Full System Report
          </button>
        </div>
      </div>

      {/* TOP CHART: Revenue (Dual Overlapping Smooth Area Graph) */}
      <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[24px] font-bold text-ink">Revenue</h2>
          <div className="border border-border rounded-[4px] px-3 py-1.5 bg-[#FCFDFD] text-[12px] text-[#2B3034]/60 flex items-center gap-2 cursor-pointer hover:border-primary transition-colors">
            October
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueChartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSalesSalmon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8E72" stopOpacity={0.85} />
                  <stop offset="95%" stopColor="#FF8E72" stopOpacity={0.25} />
                </linearGradient>
                <linearGradient id="colorProfitPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D09BFF" stopOpacity={0.75} />
                  <stop offset="95%" stopColor="#D09BFF" stopOpacity={0.15} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
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
                ticks={[20, 40, 60, 80, 100]}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                formatter={(val, name) => [`${val}k`, name === 'sales' ? 'Sales' : 'Profit']}
              />
              
              <Area 
                type="monotone" 
                dataKey="profit" 
                name="Profit" 
                stroke="#C084FC" 
                strokeWidth={0}
                fillOpacity={1} 
                fill="url(#colorProfitPurple)" 
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                name="Sales" 
                stroke="#FF8E72" 
                strokeWidth={0}
                fillOpacity={1} 
                fill="url(#colorSalesSalmon)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center items-center gap-8 mt-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF8E72] inline-block"></span>
            <span className="text-[14px] font-semibold text-ink/70">Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#D09BFF] inline-block"></span>
            <span className="text-[14px] font-semibold text-ink/70">Profit</span>
          </div>
        </div>
      </div>

      {/* BOTTOM GRID (3 Cards: Customers, Featured Product, Sales Analytics) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CARD 1: Customers */}
        <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[360px]">
          <h2 className="text-[20px] font-bold text-ink">Customers</h2>

          <div className="flex justify-center items-center relative my-2">
            <div className="w-[150px] h-[150px] relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#EAEFFC" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="42" stroke="#4880FF" strokeWidth="8" fill="none" strokeDasharray="264" strokeDashoffset="60" strokeLinecap="round" />
              </svg>
              <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[#3B82F6] rounded-full border-2 border-white shadow-md"></div>
              <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[#3B82F6] rounded-full border-2 border-white shadow-md"></div>
              <div className="absolute left-[3px] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#3B82F6] rounded-full border-2 border-white shadow-md"></div>
              <div className="absolute right-[3px] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#3B82F6] rounded-full border-2 border-white shadow-md"></div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border/40">
            <div className="text-center flex-1">
              <div className="text-[24px] font-bold text-ink">{users.length > 0 ? (users.length * 850).toLocaleString() : '34,249'}</div>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
                <span className="text-[12px] font-semibold text-ink/50">New Customers</span>
              </div>
            </div>
            <div className="w-[1px] h-10 bg-border"></div>
            <div className="text-center flex-1">
              <div className="text-[24px] font-bold text-ink">{farmerCount > 0 ? (farmerCount * 120).toLocaleString() : '1420'}</div>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#93C5FD]"></span>
                <span className="text-[12px] font-semibold text-ink/50">Repeated</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Featured Product */}
        <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[360px] relative">
          <div className="flex justify-between items-center">
            <h2 className="text-[20px] font-bold text-ink">Featured Product</h2>
            
            <div className="flex gap-2">
              <button 
                onClick={handlePrevProduct}
                className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-ink hover:bg-primary hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </button>
              <button 
                onClick={handleNextProduct}
                className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-ink hover:bg-primary hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center my-auto">
            <div className="w-[120px] h-[120px] rounded-[18px] bg-surface-muted overflow-hidden shadow-sm flex items-center justify-center mb-4 border border-border">
              {currentFeatured && currentFeatured.photos && currentFeatured.photos[0] ? (
                <img src={currentFeatured.photos[0]} alt={currentFeatured.cropType} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
              )}
            </div>

            <div className="text-[18px] font-bold text-ink text-center flex items-center gap-2 flex-wrap justify-center">
              <span>{currentFeatured ? currentFeatured.cropType : "Crop Listing"}</span>
              {currentFeatured?.variety && (
                <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-bold">
                  {currentFeatured.variety}
                </span>
              )}
            </div>
            <div className="text-[16px] font-bold text-primary mt-1">
              {currentFeatured ? `ETB ${currentFeatured.price?.toLocaleString()} / ${currentFeatured.unit}` : "ETB 0"}
            </div>
            {currentFeatured?.location && (
              <div className="text-[12px] text-ink/50 mt-1 font-medium">
                📍 {formatLocation(currentFeatured.location)}
              </div>
            )}
          </div>
        </div>

        {/* CARD 3: Sales Analytics */}
        <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[360px]">
          <h2 className="text-[20px] font-bold text-ink">Sales Analytics</h2>

          <div style={{ width: '100%', height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesAnalyticsData} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(43, 48, 52, 0.4)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(43, 48, 52, 0.4)' }} ticks={[0, 25, 50, 75, 100]} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                
                <Line 
                  type="monotone" 
                  dataKey="primary" 
                  stroke="#3B82F6" 
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#3B82F6', stroke: '#fff', strokeWidth: 3 }}
                />
                
                <Line 
                  type="monotone" 
                  dataKey="secondary" 
                  stroke="#10B981" 
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* BUILDING COMPILER PROGRESS MODAL */}
      {isBuildingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[16px] shadow-2xl p-8 max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-primary/15 text-primary flex items-center justify-center mx-auto relative">
              <svg className="w-8 h-8 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>

            <div>
              <h3 className="text-[20px] font-bold text-ink">Compiling System Executive Report</h3>
              <p className="text-[13px] text-ink/60 mt-1">{buildStatusText}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-surface-muted h-3 rounded-full overflow-hidden border border-border">
                <div 
                  className="bg-gradient-to-r from-[#4880FF] to-[#00B69B] h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${buildProgress}%` }}
                ></div>
              </div>
              <div className="text-[12px] font-bold text-primary text-right">{buildProgress}%</div>
            </div>
          </div>
        </div>
      )}

      {/* FULL SYSTEM REPORT MODAL (PDF / EXCEL / DOC CONTROLS) */}
      {showReportModal && !isBuildingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[14px] shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex justify-between items-center bg-surface-muted">
              <div>
                <h2 className="text-[22px] font-bold text-ink">Full System Executive Report</h2>
                <p className="text-[13px] text-ink/60 mt-0.5">Comprehensive operational documentation &amp; analytics ready</p>
              </div>
              <button 
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors border border-gray-200 cursor-pointer"
                onClick={() => setShowReportModal(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto flex-1 space-y-6 text-[14px]">
              <div className="bg-success/10 p-5 rounded-[12px] border border-success/20 flex items-center justify-between">
                <div>
                  <div className="text-[16px] font-bold text-success flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    System Audit Document Successfully Built
                  </div>
                  <div className="text-[12px] text-ink/60 mt-1">Export formatted PDF documents, Excel spreadsheets, or Word doc files.</div>
                </div>
              </div>

              {/* Summary KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-surface-muted p-4 rounded-[10px]">
                  <div className="text-[22px] font-bold text-primary">{users.length}</div>
                  <div className="text-[12px] text-ink/50 font-semibold uppercase">Total Users</div>
                </div>
                <div className="bg-surface-muted p-4 rounded-[10px]">
                  <div className="text-[22px] font-bold text-success">{products.length}</div>
                  <div className="text-[12px] text-ink/50 font-semibold uppercase">Products</div>
                </div>
                <div className="bg-surface-muted p-4 rounded-[10px]">
                  <div className="text-[22px] font-bold text-warning">{orders.length}</div>
                  <div className="text-[12px] text-ink/50 font-semibold uppercase">Orders</div>
                </div>
                <div className="bg-surface-muted p-4 rounded-[10px]">
                  <div className="text-[22px] font-bold text-[#8280FF]">{auditLogs.length}</div>
                  <div className="text-[12px] text-ink/50 font-semibold uppercase">Audit Logs</div>
                </div>
              </div>

              {/* Format Selectors Cards */}
              <div>
                <h3 className="text-[16px] font-bold text-ink mb-4">Select Export Format:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* PDF Option */}
                  <div 
                    onClick={() => setSelectedFormat('pdf')}
                    className={`p-5 rounded-[12px] border-2 cursor-pointer transition-all flex flex-col justify-between h-[130px] ${
                      selectedFormat === 'pdf'
                        ? 'border-danger bg-red-50/40 shadow-sm'
                        : 'border-border bg-surface-muted hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-[8px] bg-danger text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5-3h7.5M8.25 6H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                      </div>
                      <input 
                        type="radio" 
                        name="exportFormat" 
                        checked={selectedFormat === 'pdf'} 
                        onChange={() => setSelectedFormat('pdf')}
                        className="w-4 h-4 text-danger cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-ink">Formatted PDF</div>
                      <div className="text-[12px] text-ink/50">Printable document with styling</div>
                    </div>
                  </div>

                  {/* Excel Option */}
                  <div 
                    onClick={() => setSelectedFormat('excel')}
                    className={`p-5 rounded-[12px] border-2 cursor-pointer transition-all flex flex-col justify-between h-[130px] ${
                      selectedFormat === 'excel'
                        ? 'border-success bg-emerald-50/40 shadow-sm'
                        : 'border-border bg-surface-muted hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-[8px] bg-success text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25-3h17.25m-17.25-3h17.25m-17.25-3h17.25M6.75 6h10.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25V8.25A2.25 2.25 0 016.75 6z" /></svg>
                      </div>
                      <input 
                        type="radio" 
                        name="exportFormat" 
                        checked={selectedFormat === 'excel'} 
                        onChange={() => setSelectedFormat('excel')}
                        className="w-4 h-4 text-success cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-ink">Excel (.CSV)</div>
                      <div className="text-[12px] text-ink/50">Spreadsheet data for MS Excel</div>
                    </div>
                  </div>

                  {/* Word Option */}
                  <div 
                    onClick={() => setSelectedFormat('doc')}
                    className={`p-5 rounded-[12px] border-2 cursor-pointer transition-all flex flex-col justify-between h-[130px] ${
                      selectedFormat === 'doc'
                        ? 'border-primary bg-blue-50/40 shadow-sm'
                        : 'border-border bg-surface-muted hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-[8px] bg-primary text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                      </div>
                      <input 
                        type="radio" 
                        name="exportFormat" 
                        checked={selectedFormat === 'doc'} 
                        onChange={() => setSelectedFormat('doc')}
                        className="w-4 h-4 text-primary cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-ink">Word (.DOC)</div>
                      <div className="text-[12px] text-ink/50">Editable doc for MS Word</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Single Generate Button */}
            <div className="p-6 border-t border-border bg-surface-muted flex justify-end gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2.5 bg-white border border-border text-ink rounded-[10px] font-semibold text-[14px] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateSelectedFormat}
                className="inline-flex items-center gap-2 px-8 py-2.5 bg-primary text-white rounded-[10px] font-bold text-[14px] hover:bg-[#3d6fd4] transition-all cursor-pointer shadow-md shadow-[#4880FF]/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                Generate {selectedFormat.toUpperCase()} Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
