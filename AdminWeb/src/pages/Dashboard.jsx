import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuthStore } from "../store/auth.store";

const styles = {
  container: { display: "flex", minHeight: "100vh", fontFamily: "sans-serif", backgroundColor: "#f4f7f6" },
  sidebar: { width: "250px", backgroundColor: "#fff", borderRight: "1px solid #e0e0e0", padding: "20px" },
  logo: { fontSize: "24px", fontWeight: "bold", marginBottom: "40px" },
  logoWhite: { color: "#333" },
  logoGreen: { color: "#2E7D32" },
  nav: { listStyle: "none", padding: 0 },
  navItem: { padding: "12px 16px", cursor: "pointer", borderRadius: "8px", color: "#555", marginBottom: "8px" },
  navItemActive: { backgroundColor: "#E8F5E9", color: "#2E7D32", fontWeight: "bold" },
  main: { flex: 1, padding: "30px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  title: { fontSize: "28px", margin: 0, color: "#333" },
  logoutBtn: { padding: "8px 16px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer" },
  metricRow: { display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap" },
  metricCard: { flex: 1, minWidth: "200px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  metricNumber: { fontSize: "32px", fontWeight: "bold", color: "#2E7D32", marginBottom: "8px" },
  metricLabel: { color: "#666", fontSize: "14px" },
  twoCols: { display: "flex", gap: "20px", flexWrap: "wrap" },
  tableCard: { flex: 1, minWidth: "300px", backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
  tableTitle: { fontSize: "18px", fontWeight: "bold", marginBottom: "16px", color: "#333" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "12px 8px", borderBottom: "2px solid #eee", color: "#666", fontSize: "14px" },
  td: { padding: "12px 8px", borderBottom: "1px solid #eee", fontSize: "14px", color: "#333" },
  loading: { fontSize: "18px", color: "#666" },
  error: { color: "red", marginBottom: "20px" },
  btnApprove: { padding: "6px 12px", backgroundColor: "#2E7D32", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  badge: { padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" },
};

const Dashboard = () => {
  const [data, setData] = useState({ users: [], products: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useAuthStore();

  const fetchData = async () => {
    try {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        api.get("/admin/users").catch(() => ({ data: { data: { users: [] } } })),
        api.get("/products").catch(() => ({ data: { data: { products: [] } } })),
        api.get("/orders/admin/all").catch(() => ({ data: { data: { orders: [] } } })),
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

  const handleApprove = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/approve`, { approved: true });
      fetchData();
    } catch (err) {
      alert("Could not approve user.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return { bg: "#FFF3E0", text: "#E65100" };
      case "confirmed": return { bg: "#E3F2FD", text: "#1565C0" };
      case "delivered": return { bg: "#E8F5E9", text: "#2E7D32" };
      default: return { bg: "#F5F5F5", text: "#616161" };
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.main}>
          <div style={styles.loading}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const { users, products, orders } = data;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <span style={styles.logoWhite}>Omish</span>
          <span style={styles.logoGreen}>Go</span>
        </div>
        <ul style={styles.nav}>
          <li style={{ ...styles.navItem, ...styles.navItemActive }}>Dashboard</li>
          <li style={styles.navItem}>Users</li>
          <li style={styles.navItem}>Orders</li>
          <li style={styles.navItem}>Products</li>
        </ul>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>Dashboard</h1>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.metricRow}>
          <div style={styles.metricCard}>
            <div style={styles.metricNumber}>{users.length}</div>
            <div style={styles.metricLabel}>Total Users</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricNumber}>{products.length}</div>
            <div style={styles.metricLabel}>Total Products</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricNumber}>{orders.length}</div>
            <div style={styles.metricLabel}>Total Orders</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricNumber}>{pendingOrders}</div>
            <div style={styles.metricLabel}>Pending Orders</div>
          </div>
        </div>

        <div style={styles.twoCols}>
          <div style={styles.tableCard}>
            <div style={styles.tableTitle}>Recent Users</div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((u) => (
                  <tr key={u._id}>
                    <td style={styles.td}>{u.name || "N/A"}</td>
                    <td style={styles.td}>{u.role}</td>
                    <td style={styles.td}>
                      {u.isApproved ? "Approved" : "Pending"}
                    </td>
                    <td style={styles.td}>
                      {!u.isApproved && (
                        <button style={styles.btnApprove} onClick={() => handleApprove(u._id)}>
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan="4" style={styles.td}>No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={styles.tableCard}>
            <div style={styles.tableTitle}>Recent Orders</div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => {
                  const sColor = getStatusColor(o.status);
                  return (
                    <tr key={o._id}>
                      <td style={styles.td}>{o._id.slice(-6)}</td>
                      <td style={styles.td}>ETB {o.totalPrice}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, backgroundColor: sColor.bg, color: sColor.text }}>
                          {o.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr><td colSpan="3" style={styles.td}>No orders found.</td></tr>
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
