import React, { useState, useEffect } from "react";
import api from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("cropType", searchQuery);
      
      const res = await api.get(`/admin/products?${params.toString()}`);
      setProducts(res.data?.data?.products || []);
    } catch (err) {
      setError("Failed to fetch products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [statusFilter, searchQuery]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "sold": return "bg-red-100 text-red-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Products</h1>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Filters Bar */}
      <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by crop type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-secondary">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Crop Type</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Farmer</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Quantity</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Price</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Location</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Status</th>
                  <th className="py-3 px-4 text-sm font-semibold text-text-secondary">Listed On</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-text-primary">{p.cropType}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {p.farmerId?.name || "Unknown"}
                      <div className="text-xs text-gray-500">{p.farmerId?.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-primary">{p.quantity} {p.unit}</td>
                    <td className="py-3 px-4 text-sm text-text-primary">ETB {p.price}</td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {p.location?.region || p.farmerId?.location?.region || "-"}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-text-secondary">
                      No products found matching your filters.
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
