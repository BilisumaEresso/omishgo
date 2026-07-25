import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("cropType", searchQuery);
      
      const res = await api.get(`/admin/products?${params.toString()}`);
      let fetched = res.data?.data?.products || [];

      // Client-side region filter
      if (regionFilter) {
        fetched = fetched.filter(p => {
          const region = p.location?.region || p.farmerId?.location?.region || "";
          return region.toLowerCase().includes(regionFilter.toLowerCase());
        });
      }

      // Client-side sort
      if (sortBy === "newest") fetched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      else if (sortBy === "oldest") fetched.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      else if (sortBy === "price_high") fetched.sort((a, b) => b.price - a.price);
      else if (sortBy === "price_low") fetched.sort((a, b) => a.price - b.price);

      setProducts(fetched);
    } catch (err) {
      setError("Failed to fetch products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(timer);
  }, [statusFilter, searchQuery, regionFilter, sortBy]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "active": return "bg-[#00B69B] text-white";
      case "sold": return "bg-[#FD5454] text-white";
      case "draft": return "bg-[#979797] text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  const PlaceholderImg = () => (
    <div className="w-[48px] h-[48px] rounded-[14px] bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center flex-shrink-0">
      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
      </svg>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-[32px] font-bold text-[#202224] tracking-[-0.11px]">Products</h1>
        <div className="text-[14px] text-[#202224]/60">
          {products.length} product{products.length !== 1 ? "s" : ""} found
        </div>
      </div>

      {error && <div className="text-red-500 bg-white p-4 rounded-[14px] shadow">{error}</div>}

      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#202224] opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by crop name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5F6FA] border-[0.6px] border-[#D5D5D5] rounded-[10px] h-[44px] pl-11 pr-4 text-[14px] focus:outline-none focus:border-[#4880FF] focus:ring-2 focus:ring-[#4880FF]/20 transition-all"
            />
          </div>

          {/* Region Filter */}
          <div className="relative lg:w-[200px]">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#202224] opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <input
              type="text"
              placeholder="Filter by region..."
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full bg-[#F5F6FA] border-[0.6px] border-[#D5D5D5] rounded-[10px] h-[44px] pl-11 pr-4 text-[14px] focus:outline-none focus:border-[#4880FF] focus:ring-2 focus:ring-[#4880FF]/20 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="relative lg:w-[160px]">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#F5F6FA] border-[0.6px] border-[#D5D5D5] rounded-[10px] h-[44px] px-4 text-[14px] focus:outline-none focus:border-[#4880FF] focus:ring-2 focus:ring-[#4880FF]/20 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="draft">Draft</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>

          {/* Sort */}
          <div className="relative lg:w-[160px]">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#F5F6FA] border-[0.6px] border-[#D5D5D5] rounded-[10px] h-[44px] px-4 text-[14px] focus:outline-none focus:border-[#4880FF] focus:ring-2 focus:ring-[#4880FF]/20 transition-all appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_high">Price: High → Low</option>
              <option value="price_low">Price: Low → High</option>
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#4880FF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F1F4F9]">
                <th className="py-4 px-5 text-[14px] font-bold text-[#202224] rounded-tl-[14px]">Product</th>
                <th className="py-4 px-5 text-[14px] font-bold text-[#202224]">ID</th>
                <th className="py-4 px-5 text-[14px] font-bold text-[#202224]">Farmer</th>
                <th className="py-4 px-5 text-[14px] font-bold text-[#202224]">Quantity</th>
                <th className="py-4 px-5 text-[14px] font-bold text-[#202224]">Price</th>
                <th className="py-4 px-5 text-[14px] font-bold text-[#202224]">Region</th>
                <th className="py-4 px-5 text-[14px] font-bold text-[#202224]">Date</th>
                <th className="py-4 px-5 text-[14px] font-bold text-[#202224]">Status</th>
                <th className="py-4 px-5 text-[14px] font-bold text-[#202224] rounded-tr-[14px] text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className={`border-b border-[#979797]/15 last:border-0 hover:bg-[#F9FAFB] transition-colors ${p.priceAnomaly ? 'bg-orange-50/50' : ''}`}>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      {p.photos && p.photos.length > 0 ? (
                        <img src={p.photos[0]} alt={p.cropType} className="w-[48px] h-[48px] rounded-[14px] object-cover flex-shrink-0" />
                      ) : (
                        <PlaceholderImg />
                      )}
                      <div>
                        <Link to={`/products/${p.customId || p._id}`} className="text-[14px] text-[#202224] font-semibold hover:text-[#4880FF] hover:underline">
                          {p.cropType}
                        </Link>
                        {p.priceAnomaly === 'high' && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                            <span className="text-[11px] text-red-500 font-semibold">High Price</span>
                          </div>
                        )}
                        {p.priceAnomaly === 'low' && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                            <span className="text-[11px] text-amber-500 font-semibold">Low Price</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <Link to={`/products/${p.customId || p._id}`} className="text-[13px] font-mono text-[#4880FF] hover:underline">
                      {p.customId || `#${p._id.slice(-6)}`}
                    </Link>
                  </td>
                  <td className="py-4 px-5">
                    {p.farmerId ? (
                      <Link to={`/users/${p.farmerId.customId || p.farmerId._id}`} className="text-[14px] text-[#202224] hover:text-[#4880FF] hover:underline font-medium">
                        {p.farmerId.name}
                      </Link>
                    ) : (
                      <span className="text-gray-400">Unknown</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-[14px] text-[#202224]/80 whitespace-nowrap">
                    {p.quantity} {p.unit}
                  </td>
                  <td className="py-4 px-5 text-[14px] text-[#202224] font-semibold whitespace-nowrap">
                    ETB {p.price?.toLocaleString()}
                  </td>
                  <td className="py-4 px-5 text-[14px] text-[#202224]/70 whitespace-nowrap">
                    {p.location?.region || p.farmerId?.location?.region || "—"}
                  </td>
                  <td className="py-4 px-5 text-[14px] text-[#202224]/70 whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-5">
                    <span className={`px-4 py-1.5 rounded-[13.5px] text-[13px] font-semibold capitalize inline-block ${getStatusStyle(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <Link 
                      to={`/products/${p.customId || p._id}`} 
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F5F6FA] text-[#4880FF] rounded-[10px] font-semibold text-[13px] hover:bg-[#4880FF] hover:text-white transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="9" className="py-16 text-center">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    <div className="text-gray-400 text-[16px] font-medium">No products found</div>
                    <div className="text-gray-300 text-[13px] mt-1">Try adjusting your search or filters</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Products;
