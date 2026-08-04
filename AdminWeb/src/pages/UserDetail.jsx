import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import ConfirmModal from "../components/ConfirmModal";

const UserDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState({ user: null, products: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleStatusToggleConfirm = async () => {
    if (!data.user) return;
    const action = data.user.isVerified ? "reject" : "approve";
    setActionLoading(true);
    try {
      await api.put(`/admin/users/${id}/${action}`);
      await fetchDetail();
    } catch (err) {
      console.error(`Failed to ${action} user`, err);
    } finally {
      setActionLoading(false);
      setShowStatusModal(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-danger bg-white p-6 rounded-2xl border border-border shadow-xs flex items-center gap-3">
        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="font-semibold">{error}</span>
      </div>
    );
  }
  
  const { user, products, orders } = data;
  if (!user) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-border text-center shadow-xs">
        <svg className="w-12 h-12 text-ink-muted/40 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        <div className="text-lg font-bold text-ink mb-1">User Not Found</div>
        <p className="text-sm text-ink-muted mb-4">No account exists matching ID "{id}".</p>
        <Link to="/users" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors">
          Back to Users Directory
        </Link>
      </div>
    );
  }

  const isFarmer = user.role === "farmer";

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/users"
            className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center hover:bg-surface-muted transition-colors shadow-xs"
            aria-label="Back to Users"
          >
            <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-ink">User Profile</h1>
            <span className="text-xs font-mono text-primary font-semibold tracking-wide">
              ID: {user.customId || user._id}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowStatusModal(true)}
            disabled={actionLoading}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs cursor-pointer ${
              user.isVerified
                ? "bg-danger hover:bg-danger/90 text-white"
                : "bg-success hover:bg-success/90 text-white"
            }`}
          >
            {user.isVerified ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Revoke Approval
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Approve User
              </>
            )}
          </button>
          
          <Link 
            to={`/announcements?userId=${user.customId || user._id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Send Announcement
          </Link>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <div className="w-22 h-22 rounded-full bg-primary-light ring-4 ring-primary/20 border-2 border-primary overflow-hidden flex-shrink-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=4880FF&color=fff&bold=true`}
                  alt={user.name || "User Avatar"}
                  className="w-full h-full object-cover"
                />
              </div>
              {user.isVerified && (
                <span className="absolute bottom-0 right-0 w-6 h-6 bg-success text-white rounded-full flex items-center justify-center ring-2 ring-white shadow-xs" title="Verified User">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-ink">{user.name || "N/A"}</h2>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${
                    user.isVerified
                      ? "bg-success-light text-success border border-success/30"
                      : "bg-warning-light text-ink border border-warning/40"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    {user.isVerified ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  {user.isVerified ? "Verified Account" : "Pending Verification"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-ink-muted mt-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span className="font-medium text-ink">{user.phone || "N/A"}</span>
                </div>

                <div className="flex items-center gap-2 capitalize">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span>Role: <strong className="text-ink font-semibold">{user.role}</strong></span>
                </div>

                {user.location && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span className="font-medium text-ink">{user.location.region} / {user.location.zone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8 pt-8 border-t border-border/60">
          <div className="bg-surface-muted/60 p-5 rounded-2xl border border-border/80 border-l-4 border-l-primary flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-ink-muted mb-1">Active Listings</div>
              <div className="text-3xl font-extrabold text-primary">{products.length}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>

          <div className="bg-surface-muted/60 p-5 rounded-2xl border border-border/80 border-l-4 border-l-success flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-ink-muted mb-1">Total Orders</div>
              <div className="text-3xl font-extrabold text-success">{orders.length}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success-light text-success flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>

          <div className="bg-surface-muted/60 p-5 rounded-2xl border border-border/80 border-l-4 border-l-warning flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-ink-muted mb-1">Joined Date</div>
              <div className="text-lg font-bold text-ink mt-1">
                {new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-warning-light text-warning flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stacked Tables */}
      <div className="space-y-8">
        
        {/* Recent Listings Table */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-ink flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-success-light text-success flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </span>
              Recent Listings ({products.length})
            </h3>
          </div>
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-surface-soft text-ink border-b border-border">
                    <th className="py-3.5 px-5 text-sm font-bold rounded-l-xl">Product ID</th>
                    <th className="py-3.5 px-5 text-sm font-bold">Crop Type</th>
                    <th className="py-3.5 px-5 text-sm font-bold">Quantity</th>
                    <th className="py-3.5 px-5 text-sm font-bold">Price</th>
                    <th className="py-3.5 px-5 text-sm font-bold rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {products.slice(0, 5).map((p) => (
                    <tr key={p._id} className="hover:bg-surface-muted/60 transition-colors">
                      <td className="py-4 px-5">
                        <Link to={`/products/${p.customId || p._id}`} className="text-xs font-mono text-primary hover:underline font-bold">
                          {p.customId || `#${p._id.slice(-6)}`}
                        </Link>
                      </td>
                      <td className="py-4 px-5 text-sm text-ink font-semibold">{p.cropType}</td>
                      <td className="py-4 px-5 text-sm text-ink-muted whitespace-nowrap">{p.quantity} {p.unit}</td>
                      <td className="py-4 px-5 text-sm text-ink font-bold whitespace-nowrap">ETB {p.price?.toLocaleString()}</td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize inline-flex items-center gap-1 ${
                            p.status === "active" || p.status === "approved"
                              ? "bg-success-light text-success border border-success/30"
                              : "bg-warning-light text-ink border border-warning/40"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${p.status === "active" || p.status === "approved" ? "bg-success" : "bg-warning"}`} />
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-ink-muted bg-surface-muted/30 rounded-xl border border-dashed border-border">
              <svg className="w-10 h-10 mx-auto text-ink-muted/40 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <div className="text-sm font-semibold">No listings created yet</div>
              <p className="text-xs text-ink-muted/80 mt-1">This user hasn't posted any crop listings on the marketplace.</p>
            </div>
          )}
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-ink flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" />
                </svg>
              </span>
              Recent Orders ({orders.length})
            </h3>
          </div>
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-surface-soft text-ink border-b border-border">
                    <th className="py-3.5 px-5 text-sm font-bold rounded-l-xl">Order ID</th>
                    <th className="py-3.5 px-5 text-sm font-bold">Crop</th>
                    <th className="py-3.5 px-5 text-sm font-bold">Type</th>
                    <th className="py-3.5 px-5 text-sm font-bold">Total Price</th>
                    <th className="py-3.5 px-5 text-sm font-bold rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o._id} className="hover:bg-surface-muted/60 transition-colors">
                      <td className="py-4 px-5">
                        <Link to={`/orders/${o.customId || o._id}`} className="text-xs font-mono text-primary hover:underline font-bold">
                          {o.customId || `#${o._id.slice(-6)}`}
                        </Link>
                      </td>
                      <td className="py-4 px-5 text-sm text-ink font-semibold">{o.cropType || o.productId?.cropType || "—"}</td>
                      <td className="py-4 px-5 text-sm font-medium capitalize">
                        {isFarmer ? (
                          <span className="text-success font-semibold">Sale</span>
                        ) : (
                          <span className="text-primary font-semibold">Purchase</span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-sm text-ink font-bold whitespace-nowrap">ETB {o.totalPrice?.toLocaleString()}</td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize inline-flex items-center gap-1 ${
                            o.status === "delivered"
                              ? "bg-success-light text-success border border-success/30"
                              : o.status === "cancelled"
                              ? "bg-danger-light text-danger border border-danger/30"
                              : "bg-warning-light text-ink border border-warning/40"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              o.status === "delivered"
                                ? "bg-success"
                                : o.status === "cancelled"
                                ? "bg-danger"
                                : "bg-warning"
                            }`}
                          />
                          {o.status?.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-ink-muted bg-surface-muted/30 rounded-xl border border-dashed border-border">
              <svg className="w-10 h-10 mx-auto text-ink-muted/40 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div className="text-sm font-semibold">No orders recorded yet</div>
              <p className="text-xs text-ink-muted/80 mt-1">This user has no transaction history recorded on the platform.</p>
            </div>
          )}
        </div>

      </div>

      {/* User Status Confirmation Modal */}
      <ConfirmModal
        isOpen={showStatusModal}
        title={user.isVerified ? "Revoke User Approval" : "Approve User Account"}
        message={
          user.isVerified
            ? `Are you sure you want to revoke approval for ${user.name || "this user"}? They will lose verified access.`
            : `Are you sure you want to approve ${user.name || "this user"}? They will receive full marketplace access.`
        }
        confirmText={user.isVerified ? "Revoke Approval" : "Approve User"}
        cancelText="Cancel"
        variant={user.isVerified ? "danger" : "primary"}
        onConfirm={handleStatusToggleConfirm}
        onCancel={() => setShowStatusModal(false)}
      />
    </div>
  );
};

export default UserDetail;
