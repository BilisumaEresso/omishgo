import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  // Filter & Search
  const [actionFilter, setActionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/audit-logs");
      setLogs(res.data?.data?.logs || []);
    } catch (err) {
      setError("Failed to fetch audit logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionStyle = (action) => {
    if (!action) return "bg-primary text-white";
    const act = action.toLowerCase();
    if (act.includes("approve")) return "bg-success text-white";
    if (act.includes("reject")) return "bg-danger text-white";
    if (act.includes("broadcast") || act.includes("announce")) return "bg-[#8280FF] text-white";
    return "bg-primary text-white";
  };

  const formatActionName = (action) => {
    if (!action) return "Action";
    return action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Helper to extract clean target ID string
  const getTargetIdString = (targetId) => {
    if (!targetId) return null;
    if (typeof targetId === 'object') {
      return targetId.customId || targetId._id || null;
    }
    return targetId;
  };

  // Helper to get target redirect URL
  const getTargetLink = (log) => {
    const id = getTargetIdString(log.targetId);
    if (!id) return null;
    const type = (log.targetType || "").toLowerCase();

    if (type.includes("product")) return `/products/${id}`;
    if (type.includes("order")) return `/orders/${id}`;
    // Default to user profile for User, UserApproval, Announcement, etc.
    return `/users/${id}`;
  };

  // Filtered logs
  const filteredLogs = logs.filter(log => {
    if (actionFilter !== "all") {
      const act = (log.action || "").toLowerCase();
      if (actionFilter === "approve" && !act.includes("approve")) return false;
      if (actionFilter === "reject" && !act.includes("reject")) return false;
      if (actionFilter === "broadcast" && !act.includes("broadcast") && !act.includes("announce")) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const adminName = (log.adminId?.name || "").toLowerCase();
      const details = (log.details || "").toLowerCase();
      const targetStr = (getTargetIdString(log.targetId) || "").toLowerCase();
      const actionStr = (log.action || "").toLowerCase();
      return adminName.includes(q) || details.includes(q) || targetStr.includes(q) || actionStr.includes(q);
    }
    return true;
  });

  const approveCount = logs.filter(l => (l.action || "").toLowerCase().includes("approve")).length;
  const rejectCount = logs.filter(l => (l.action || "").toLowerCase().includes("reject")).length;
  const broadcastCount = logs.filter(l => (l.action || "").toLowerCase().includes("broadcast") || (l.action || "").toLowerCase().includes("announce")).length;

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[32px] font-bold text-ink tracking-[-0.11px]">Audit Log</h1>
          <p className="text-[14px] text-ink/60 mt-1">Real-time system activity, administrative tracking, and security event logs</p>
        </div>
        <button 
          onClick={fetchLogs}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-[10px] text-[14px] font-semibold text-ink hover:bg-surface-muted hover:border-primary transition-all cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
          Refresh Logs
        </button>
      </div>

      {error && <div className="text-red-500 bg-white p-4 rounded-[14px] shadow">{error}</div>}

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex items-center gap-4">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-primary/15 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" /></svg>
          </div>
          <div>
            <div className="text-[13px] text-ink/50 font-semibold">Total Audit Logs</div>
            <div className="text-[22px] font-bold text-ink">{logs.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex items-center gap-4">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-success/15 flex items-center justify-center">
            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          </div>
          <div>
            <div className="text-[13px] text-ink/50 font-semibold">Approvals</div>
            <div className="text-[22px] font-bold text-success">{approveCount}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex items-center gap-4">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-danger/15 flex items-center justify-center">
            <svg className="w-6 h-6 text-danger" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <div>
            <div className="text-[13px] text-ink/50 font-semibold">Rejections</div>
            <div className="text-[22px] font-bold text-danger">{rejectCount}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex items-center gap-4">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-[#8280FF]/15 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#8280FF]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5A4.5 4.5 0 013 11.25V9.75A4.5 4.5 0 017.5 5.25h.75c.704 0 1.402-.03 2.09-.09m0 10.68c1.785.154 3.58.27 5.39.345a.75.75 0 00.77-.746V8.541a.75.75 0 00-.77-.746c-1.81.075-3.605.191-5.39.345" /></svg>
          </div>
          <div>
            <div className="text-[13px] text-ink/50 font-semibold">Broadcasts</div>
            <div className="text-[22px] font-bold text-[#8280FF]">{broadcastCount}</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-6 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="Search logs by admin, action, target ID, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-muted border-[0.6px] border-border rounded-[10px] h-[44px] pl-11 pr-4 text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4880FF]/20 transition-all"
            />
          </div>

          <div className="relative lg:w-[200px]">
            <select 
              value={actionFilter} 
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full bg-surface-muted border-[0.6px] border-border rounded-[10px] h-[44px] px-4 text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4880FF]/20 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Actions</option>
              <option value="approve">Approvals Only</option>
              <option value="reject">Rejections Only</option>
              <option value="broadcast">Broadcasts Only</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-soft">
                <th className="py-4 px-5 text-[14px] font-bold text-ink rounded-tl-[14px]">Timestamp</th>
                <th className="py-4 px-5 text-[14px] font-bold text-ink">Admin</th>
                <th className="py-4 px-5 text-[14px] font-bold text-ink">Action</th>
                <th className="py-4 px-5 text-[14px] font-bold text-ink">Target Type</th>
                <th className="py-4 px-5 text-[14px] font-bold text-ink">Target Profile / ID</th>
                <th className="py-4 px-5 text-[14px] font-bold text-ink rounded-tr-[14px]">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const targetIdStr = getTargetIdString(log.targetId);
                const targetLink = getTargetLink(log);

                return (
                  <tr 
                    key={log._id} 
                    className="border-b border-[#979797]/15 last:border-0 hover:bg-[#F9FAFB] transition-colors"
                  >
                    <td className="py-4 px-5 text-[13px] text-ink/70 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-5 text-[14px] font-semibold text-ink">
                      {log.adminId?.name || "System Admin"}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`px-4 py-1.5 rounded-[13.5px] text-[13px] font-semibold inline-block ${getActionStyle(log.action)}`}>
                        {formatActionName(log.action)}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-[14px] text-ink/80 font-medium capitalize">
                      {log.targetType || "System"}
                    </td>
                    {/* Target ID Column - Clicking redirects directly to profile/detail! */}
                    <td className="py-4 px-5">
                      {targetLink ? (
                        <Link 
                          to={targetLink} 
                          className="inline-flex items-center gap-1.5 text-[13px] font-mono text-primary font-semibold hover:underline bg-primary/10 px-3 py-1.5 rounded-[8px] transition-colors"
                          title="Click to view full user profile or entity details"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                          {targetIdStr}
                        </Link>
                      ) : (
                        <span className="text-[13px] text-gray-400 font-mono">—</span>
                      )}
                    </td>
                    <td 
                      className="py-4 px-5 text-[14px] text-ink/70 max-w-xs truncate cursor-pointer hover:text-primary"
                      onClick={() => setSelectedLog(log)}
                    >
                      {log.details || "—"}
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" /></svg>
                    <div className="text-gray-400 text-[16px] font-medium">No audit logs matching your query</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[14px] shadow-2xl w-full max-w-lg p-8 relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              onClick={() => setSelectedLog(null)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-[22px] font-bold text-ink mb-6">Audit Log Details</h2>
            
            <div className="space-y-5 text-[14px]">
              <div className="bg-surface-muted p-4 rounded-[10px]">
                <span className="block text-[12px] text-ink/50 font-bold uppercase mb-1">Timestamp</span>
                <span className="text-ink font-medium">{new Date(selectedLog.createdAt).toLocaleString()}</span>
              </div>
              
              <div className="bg-surface-muted p-4 rounded-[10px]">
                <span className="block text-[12px] text-ink/50 font-bold uppercase mb-1">Admin User</span>
                <span className="text-ink font-bold">{selectedLog.adminId?.name || "System Admin"}</span>
                {selectedLog.adminId?.phone && <span className="text-ink/60 ml-2">({selectedLog.adminId.phone})</span>}
              </div>
              
              <div className="flex gap-4">
                <div className="bg-surface-muted p-4 rounded-[10px] flex-1">
                  <span className="block text-[12px] text-ink/50 font-bold uppercase mb-1">Action</span>
                  <span className={`inline-block px-3 py-1 rounded-[13.5px] text-[12px] font-bold ${getActionStyle(selectedLog.action)}`}>
                    {formatActionName(selectedLog.action)}
                  </span>
                </div>

                <div className="bg-surface-muted p-4 rounded-[10px] flex-1">
                  <span className="block text-[12px] text-ink/50 font-bold uppercase mb-1">Target Type</span>
                  <span className="text-ink font-bold capitalize">{selectedLog.targetType}</span>
                </div>
              </div>
              
              <div className="bg-surface-muted p-4 rounded-[10px]">
                <span className="block text-[12px] text-ink/50 font-bold uppercase mb-1">Target Profile / ID</span>
                {getTargetLink(selectedLog) ? (
                  <Link 
                    to={getTargetLink(selectedLog)}
                    className="inline-flex items-center gap-1.5 text-primary font-mono font-bold hover:underline"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    {getTargetIdString(selectedLog.targetId)} (View Profile)
                  </Link>
                ) : (
                  <span className="text-gray-400 font-mono">N/A</span>
                )}
              </div>
              
              <div className="bg-surface-muted p-4 rounded-[10px]">
                <span className="block text-[12px] text-ink/50 font-bold uppercase mb-1">Full Log Details</span>
                <div className="mt-1 text-ink font-medium whitespace-pre-wrap">
                  {selectedLog.details || "No additional details provided."}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3">
              {getTargetLink(selectedLog) && (
                <Link
                  to={getTargetLink(selectedLog)}
                  className="px-5 py-2.5 bg-primary text-white rounded-[10px] font-semibold text-[14px] hover:bg-[#3d6fd4] transition-colors"
                >
                  Go to Target Profile
                </Link>
              )}
              <button 
                onClick={() => setSelectedLog(null)}
                className="px-6 py-2.5 bg-surface-muted text-ink rounded-[10px] font-semibold text-[14px] hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;
