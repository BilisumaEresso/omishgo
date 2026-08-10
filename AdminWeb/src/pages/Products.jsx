import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getUserAvatarUrl, formatLocation } from "../utils/avatar";

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

      // Client-side search & region filter
      if (searchQuery || regionFilter) {
        fetched = fetched.filter(p => {
          const matchQuery = !searchQuery || (
            (p.cropType && p.cropType.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.variety && p.variety.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.customId && p.customId.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.farmerId?.name && p.farmerId.name.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          const regionStr = p.location?.region || p.farmerId?.location?.region || "";
          const matchRegion = !regionFilter || regionStr.toLowerCase().includes(regionFilter.toLowerCase());
          return matchQuery && matchRegion;
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
      case "active": return "bg-success text-white";
      case "sold": return "bg-danger text-white";
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
        <h1 className="text-[32px] font-bold text-ink tracking-[-0.11px]">Products</h1>
        <div className="text-[14px] text-ink/60">
          {products.length} product{products.length !== 1 ? "s" : ""} found
        </div>
      </div>

      {error && <div className="text-red-500 bg-white p-4 rounded-[14px] shadow">{error}</div>}

      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-[14px] shadow-[6px_6px_54px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by crop, variety, or farmer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-muted border-[0.6px] border-border rounded-[10px] h-[44px] pl-11 pr-4 text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4880FF]/20 transition-all"
            />
          </div>

          {/* Region Filter */}
          <div className="relative lg:w-[200px]">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink opacity-40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <input
              type="text"
              placeholder="Filter by region..."
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full bg-surface-muted border-[0.6px] border-border rounded-[10px] h-[44px] pl-11 pr-4 text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4880FF]/20 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="relative lg:w-[160px]">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface-muted border-[0.6px] border-border rounded-[10px] h-[44px] px-4 text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4880FF]/20 transition-all appearance-none cursor-pointer"
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
              className="w-full bg-surface-muted border-[0.6px] border-border rounded-[10px] h-[44px] px-4 text-[14px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#4880FF]/20 transition-all appearance-none cursor-pointer"
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
                  <th className="py-3.5 px-4 font-bold rounded-tl-[14px]">Product</th>
                  <th className="py-3.5 px-4 font-bold">Farmer &amp; Location</th>
                  <th className="py-3.5 px-4 font-bold">Price &amp; Quantity</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold rounded-tr-[14px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#979797]/15 text-[14px]">
                {products.map((p) => (
                  <tr key={p._id} className={`hover:bg-[#F9FAFB] transition-colors ${p.priceAnomaly ? 'bg-orange-50/50' : ''}`}>
                    {/* 1. Product & Variety */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {p.photos && p.photos.length > 0 ? (
                          <img src={p.photos[0]} alt={p.cropType} className="w-[44px] h-[44px] rounded-[12px] object-cover flex-shrink-0 border border-border" />
                        ) : (
                          <PlaceholderImg />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link to={`/products/${p.customId || p._id}`} className="text-[14px] text-ink font-bold hover:text-primary hover:underline">
                              {p.cropType}
                            </Link>
                            {p.variety && (
                              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                                {p.variety}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-mono text-primary font-semibold">{p.customId || `#${p._id.slice(-6)}`}</span>
                            {p.priceAnomaly === 'high' && (
                              <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">High Price</span>
                            )}
                            {p.priceAnomaly === 'low' && (
                              <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">Low Price</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Farmer & Location */}
                    <td className="py-3.5 px-4">
                      {p.farmerId ? (
                        <div className="flex items-center gap-2.5">
                          <img
                            src={getUserAvatarUrl(p.farmerId, { bg: "4880FF" })}
                            alt={p.farmerId.name}
                            className="w-7 h-7 rounded-full object-cover border border-border flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <Link to={`/users/${p.farmerId.customId || p.farmerId._id}`} className="text-[13px] text-ink hover:text-primary hover:underline font-semibold block truncate">
                              {p.farmerId.name}
                            </Link>
                            <span className="text-[11px] text-ink/50 block truncate">
                              {formatLocation(p.location || p.farmerId?.location)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[13px]">Unknown</span>
                      )}
                    </td>

                    {/* 3. Price & Quantity */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-[14px] text-ink font-bold">ETB {p.price?.toLocaleString()}</div>
                      <div className="text-[11px] text-ink/50">
                        {p.quantity} {p.unit} · {new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </div>
                    </td>

                    {/* 4. Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-bold capitalize inline-block ${getStatusStyle(p.status)}`}>
                        {p.status}
                      </span>
                    </td>

                    {/* 5. Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link 
                        to={`/products/${p.customId || p._id}`} 
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-surface-muted text-primary rounded-[8px] font-bold text-[12px] hover:bg-primary hover:text-white transition-all"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-400 text-sm">
                      No products found.
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

export default Products;
