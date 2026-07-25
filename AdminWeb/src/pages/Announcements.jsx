import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

const Announcements = () => {
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [targetRole, setTargetRole] = useState("all");
  const [targetUser, setTargetUser] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get("userId");
    if (userId) {
      setTargetRole("specific");
      setTargetUser(userId);
    }

    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data?.data?.users || []);
      } catch (err) {
        console.error("Failed to fetch users for autocomplete", err);
      }
    };
    fetchUsers();
  }, [location.search]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!window.confirm(`Are you sure you want to send this broadcast message?`)) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/admin/broadcast", {
        message,
        targetRole,
        targetUser: targetRole === 'specific' ? targetUser : undefined
      });
      setSuccess(`Announcement sent successfully!`);
      setMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send broadcast.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const audienceOptions = [
    {
      id: "all",
      label: "Everyone",
      desc: "All active users",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.97 5.97 0 00-.943 3.197m12 0a9.094 9.094 0 01-3.741-.479 3 3 0 01-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666" />
        </svg>
      )
    },
    {
      id: "farmer",
      label: "Farmers Only",
      desc: "Agricultural producers",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5" />
        </svg>
      )
    },
    {
      id: "buyer",
      label: "Buyers Only",
      desc: "Traders & wholesalers",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      )
    },
    {
      id: "specific",
      label: "Specific User",
      desc: "Target single account",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-[32px] font-bold text-[#202224] tracking-[-0.11px]">Announcements</h1>
        <p className="text-[14px] text-[#202224]/60 mt-1">Broadcast system messages, alerts, and market updates to mobile app users</p>
      </div>

      <div className="bg-white p-8 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        {error && (
          <div className="bg-[#FD5454]/10 border border-[#FD5454]/20 text-[#FD5454] p-4 rounded-[10px] mb-6 text-[14px] font-medium flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-[#00B69B]/10 border border-[#00B69B]/20 text-[#00B69B] p-4 rounded-[10px] mb-6 text-[14px] font-medium flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {success}
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-8">
          {/* Target Audience Options */}
          <div>
            <label className="block text-[14px] font-bold text-[#202224] mb-3">Select Target Audience</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {audienceOptions.map((opt) => {
                const isSelected = targetRole === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setTargetRole(opt.id)}
                    className={`p-5 rounded-[12px] border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between h-[130px] ${
                      isSelected
                        ? "border-[#4880FF] bg-[#4880FF]/5 shadow-sm"
                        : "border-[#E0E0E0] bg-[#F5F6FA] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-[8px] ${isSelected ? 'bg-[#4880FF] text-white' : 'bg-white text-gray-500'}`}>
                        {opt.icon}
                      </div>
                      <input 
                        type="radio" 
                        name="targetRole" 
                        value={opt.id} 
                        checked={isSelected} 
                        onChange={() => setTargetRole(opt.id)}
                        className="w-4 h-4 text-[#4880FF] focus:ring-[#4880FF]/20 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className={`text-[15px] font-bold ${isSelected ? 'text-[#4880FF]' : 'text-[#202224]'}`}>
                        {opt.label}
                      </div>
                      <div className="text-[12px] text-[#202224]/50">{opt.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Specific User Autocomplete Field */}
            {targetRole === "specific" && (
              <div className="mt-6 bg-[#F5F6FA] p-5 rounded-[12px] border border-[#E0E0E0]">
                <label className="block text-[14px] font-bold text-[#202224] mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#4880FF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                  Target User ID (Short ID or Mongo ID)
                </label>
                <input
                  type="text"
                  list="user-datalist"
                  placeholder="Type or select user... (e.g. FMR-83A12C)"
                  className="w-full bg-white border border-[#D5D5D5] rounded-[10px] h-[44px] px-4 text-[14px] focus:outline-none focus:border-[#4880FF] focus:ring-2 focus:ring-[#4880FF]/20 transition-all font-mono"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  required={targetRole === "specific"}
                />
                <datalist id="user-datalist">
                  {users.map(u => (
                    <option key={u._id} value={u.customId || u._id}>
                      {u.name} ({u.role}) - {u.phone}
                    </option>
                  ))}
                </datalist>
                <p className="text-[12px] text-[#202224]/50 mt-2">
                  You can search by typing their Short ID (e.g., FMR-XXXXXX or BYR-XXXXXX) or name.
                </p>
              </div>
            )}
          </div>

          {/* Message Area */}
          <div>
            <label className="block text-[14px] font-bold text-[#202224] mb-2 flex items-center justify-between">
              <span>Message Content</span>
              <span className="text-[12px] text-[#202224]/40 font-normal">{message.length} characters</span>
            </label>
            <textarea
              className="w-full bg-[#F5F6FA] border border-[#D5D5D5] rounded-[10px] p-4 text-[14px] text-[#202224] focus:outline-none focus:border-[#4880FF] focus:ring-2 focus:ring-[#4880FF]/20 transition-all resize-none"
              rows={6}
              placeholder="Write your message here... (e.g., 'Notice: Market prices for Wheat have been updated for this week.')"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            <p className="text-[12px] text-[#202224]/50 mt-2 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#4880FF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
              This broadcast will be delivered directly to the mobile app in-app notification inbox of the targeted users.
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-[#E0E0E0]/50">
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-[10px] font-bold text-[14px] text-white shadow-sm transition-all ${
                loading || !message.trim()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#4880FF] hover:bg-[#3d6fd4] cursor-pointer shadow-md shadow-[#4880FF]/20"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                  Send Announcement
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Announcements;
