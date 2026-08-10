import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getUserAvatarUrl, formatLocation } from "../utils/avatar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Bulk selection
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter !== "all") params.append("isVerified", statusFilter === "approved" ? "true" : "false");
      
      const res = await api.get(`/admin/users?${params.toString()}`);
      setUsers(res.data?.data?.users || []);
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(new Set(filteredUsers.map(u => u._id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (id) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedUsers(newSelected);
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.size === 0) return;
    
    if (!window.confirm(`Are you sure you want to ${action} ${selectedUsers.size} users?`)) return;

    try {
      const promises = Array.from(selectedUsers).map(id => 
        api.put(`/admin/users/${id}/${action}`)
      );
      
      await Promise.all(promises);
      setSelectedUsers(new Set());
      fetchUsers();
    } catch (err) {
      alert(`Failed to ${action} some users. Please try again.`);
      fetchUsers();
    }
  };

  // Client-side search & sort
  let filteredUsers = users.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const locStr = formatLocation(u.location).toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.customId && u.customId.toLowerCase().includes(q)) ||
      locStr.includes(q)
    );
  });

  if (sortBy === "newest") filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  else if (sortBy === "oldest") filteredUsers.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  else if (sortBy === "name_asc") filteredUsers.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  const farmersCount = users.filter(u => u.role === "farmer").length;
  const buyersCount = users.filter(u => u.role === "buyer").length;
  const pendingCount = users.filter(u => !u.isVerified).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-ink tracking-[-0.11px]">Users</h1>
          <div className="text-[14px] text-ink/60">{filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found</div>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => handleBulkAction("approve")}
            disabled={selectedUsers.size === 0}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] font-semibold transition-all ${
              selectedUsers.size > 0 
                ? "bg-success text-white hover:bg-[#00a08a] shadow-sm cursor-pointer" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            Approve Selected ({selectedUsers.size})
          </button>
          <button 
            onClick={() => handleBulkAction("reject")}
            disabled={selectedUsers.size === 0}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] font-semibold transition-all ${
              selectedUsers.size > 0 
                ? "bg-danger text-white hover:bg-[#e04848] shadow-sm cursor-pointer" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            Reject Selected ({selectedUsers.size})
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 bg-white p-4 rounded-[14px] shadow">{error}</div>}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex items-center gap-4">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-[#8280FF]/15 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#8280FF]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
          </div>
          <div>
            <div className="text-[13px] text-ink/50 font-semibold">Total Users</div>
            <div className="text-[22px] font-bold text-ink">{users.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex items-center gap-4">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-success/15 flex items-center justify-center">
            <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5" /></svg>
          </div>
          <div>
            <div className="text-[13px] text-ink/50 font-semibold">Farmers</div>
            <div className="text-[22px] font-bold text-ink">{farmersCount}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex items-center gap-4">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-primary/15 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
          </div>
          <div>
            <div className="text-[13px] text-ink/50 font-semibold">Buyers</div>
            <div className="text-[22px] font-bold text-ink">{buyersCount}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex items-center gap-4">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-warning/15 flex items-center justify-center">
            <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <div className="text-[13px] text-ink/50 font-semibold">Pending Approval</div>
            <div className="text-[22px] font-bold text-warning">{pendingCount}</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="Search by name, phone, email, location, or User ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-muted border-[0.6px] border-border rounded-[10px] h-[44px] pl-11 pr-4 text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4880FF]/20 transition-all"
            />
          </div>

          <div className="relative lg:w-[160px]">
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-surface-muted border-[0.6px] border-border rounded-[10px] h-[44px] px-4 text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4880FF]/20 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="farmer">Farmers</option>
              <option value="buyer">Buyers</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
          
          <div className="relative lg:w-[160px]">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface-muted border-[0.6px] border-border rounded-[10px] h-[44px] px-4 text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4880FF]/20 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>

          <div className="relative lg:w-[160px]">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-surface-muted border-[0.6px] border-border rounded-[10px] h-[44px] px-4 text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4880FF]/20 transition-all appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name_asc">Name: A → Z</option>
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
            <table className="w-full text-left border-collapse min-w-[650px] sm:min-w-0">
              <thead>
                <tr className="bg-surface-soft text-[13px] text-ink/70">
                  <th className="py-3.5 px-3 w-10 text-center rounded-tl-[14px]">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={filteredUsers.length > 0 && selectedUsers.size === filteredUsers.length}
                      className="w-4 h-4 text-primary rounded focus:ring-[#4880FF]/20 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4 font-bold">User Profile</th>
                  <th className="py-3.5 px-4 font-bold">Contact Info</th>
                  <th className="py-3.5 px-4 font-bold">Role &amp; Location</th>
                  <th className="py-3.5 px-4 font-bold rounded-tr-[14px] text-right">Status &amp; Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#979797]/15 text-[14px]">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-[#F9FAFB] transition-colors">
                    {/* Checkbox */}
                    <td className="py-3.5 px-3 text-center">
                      <input 
                        type="checkbox"
                        checked={selectedUsers.has(u._id)}
                        onChange={() => handleSelectUser(u._id)}
                        className="w-4 h-4 text-primary rounded focus:ring-[#4880FF]/20 cursor-pointer"
                      />
                    </td>

                    {/* 1. User Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-[40px] h-[40px] rounded-full bg-[#D8D8D8] overflow-hidden flex-shrink-0 border border-border">
                          <img src={getUserAvatarUrl(u)} alt={u.name || "User Avatar"} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Link to={`/users/${u.customId || u._id}`} className="text-[14px] text-ink font-bold hover:text-primary hover:underline block truncate">
                              {u.name || "N/A"}
                            </Link>
                            <span className="text-[10px] font-mono text-primary font-bold">{u.customId || `#${u._id.slice(-6)}`}</span>
                          </div>
                          {u.preferredLang && (
                            <span className="text-[10px] text-ink/40 uppercase font-bold block">
                              {u.preferredLang === 'am' ? 'Amharic' : u.preferredLang === 'om' ? 'Afaan Oromo' : 'English'}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 2. Contact Info */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-[13px] font-semibold text-ink">{u.phone}</div>
                      {u.email && <div className="text-[11px] text-ink/50">{u.email}</div>}
                    </td>

                    {/* 3. Role & Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[12px] font-bold capitalize px-2.5 py-0.5 rounded-full bg-surface-muted border border-border text-ink">
                          {u.role}
                        </span>
                        {(u.rating || u.averageRating) > 0 && (
                          <span className="text-[11px] font-bold text-amber-500">
                            ★ {u.rating || u.averageRating}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-ink/50 block truncate mt-0.5">
                        {formatLocation(u.location)}
                      </span>
                    </td>

                    {/* 4. Status & Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold inline-block ${
                          u.isVerified ? "bg-success text-white" : "bg-warning text-white"
                        }`}>
                          {u.isVerified ? "Approved" : "Pending"}
                        </span>
                        <Link 
                          to={`/users/${u.customId || u._id}`}
                          className="inline-flex items-center px-3 py-1 bg-surface-muted text-primary rounded-[8px] font-bold text-[12px] hover:bg-primary hover:text-white transition-all"
                        >
                          Profile
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-400 text-sm">
                      No users found.
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

export default Users;
