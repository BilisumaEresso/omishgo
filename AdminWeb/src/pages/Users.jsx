import React, { useState, useEffect } from "react";
import api from "../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Bulk selection
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Build query string
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
    
    const isApprove = action === "approve";
    if (!window.confirm(`Are you sure you want to ${action} ${selectedUsers.size} users?`)) return;

    try {
      // Execute all requests in parallel
      const promises = Array.from(selectedUsers).map(id => 
        api.put(`/admin/users/${id}/${action}`)
      );
      
      await Promise.all(promises);
      setSelectedUsers(new Set());
      fetchUsers();
    } catch (err) {
      alert(`Failed to ${action} some users. Please try again.`);
      fetchUsers(); // Refresh to get current state
    }
  };

  // Client-side search (since backend doesn't support search yet)
  const filteredUsers = users.filter(u => {
    if (!searchQuery) return true;
    return (
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.phone && u.phone.includes(searchQuery))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Users</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => handleBulkAction("approve")}
            disabled={selectedUsers.size === 0}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedUsers.size > 0 ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Approve Selected
          </button>
          <button 
            onClick={() => handleBulkAction("reject")}
            disabled={selectedUsers.size === 0}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedUsers.size > 0 ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Reject Selected
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Filters Bar */}
      <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light bg-white"
          >
            <option value="all">All Roles</option>
            <option value="farmer">Farmers</option>
            <option value="buyer">Buyers</option>
          </select>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-secondary">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="py-3 px-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={filteredUsers.length > 0 && selectedUsers.size === filteredUsers.length}
                      className="w-4 h-4 text-primary rounded focus:ring-primary-light"
                    />
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Name</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Phone</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Role</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Status</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 text-center">
                      <input 
                        type="checkbox"
                        checked={selectedUsers.has(u._id)}
                        onChange={() => handleSelectUser(u._id)}
                        className="w-4 h-4 text-primary rounded focus:ring-primary-light"
                      />
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-text-primary">{u.name || "N/A"}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">{u.phone}</td>
                    <td className="py-3 px-4 text-sm text-text-primary capitalize">{u.role}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        u.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {u.isVerified ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-text-secondary">
                      No users found matching your filters.
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
