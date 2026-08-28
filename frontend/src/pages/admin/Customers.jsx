import React, { useState, useEffect } from "react";
import { FiSearch, FiMail, FiPhone, FiMapPin, FiRotateCw } from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";

const tierStyles = {
  "VIP Patron": "bg-[#FDE8EC] text-[#8B1C2C]",
  "Gold Member": "bg-[#FEF3C7] text-[#B45309]",
  "Silver Patron": "bg-slate-100 text-slate-700",
};

const Customers = () => {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/customers`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load customers");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCustomers(
            data.map((c) => ({
              ...c,
              id: c.customerId || `CUST-${c._id?.slice(-3) || "001"}`,
              avatar: c.avatar?.startsWith("http") ? c.avatar : `${API_BASE_URL}${c.avatar || "/images/testimonial/testimonial-1.png"}`,
            }))
          );
        }
      })
      .catch(() => {
        showToast.error("Failed to load customer directory");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      (c.city && c.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-7 max-w-[1600px] mx-auto pb-12 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Customer Directory</h3>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            View shopper profiles, lifetime spend, order history, and contact details live from MongoDB.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCustomers}
            className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh Customers"
          >
            <FiRotateCw className={`text-base ${loading ? "animate-spin" : ""}`} />
          </button>
          <div className="relative min-w-[300px]">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
            <input
              type="text"
              placeholder="Search customers by name, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#6B1527] shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-xs">
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Contact Details</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Patron Tier</th>
                <th className="py-4 px-6">Orders</th>
                <th className="py-4 px-6">Total Spent</th>
                <th className="py-4 px-6">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-500 text-base">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr key={customer.id || customer._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80";
                          }}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-base text-slate-800 block">{customer.name}</span>
                          <span className="text-xs text-slate-400 block mt-0.5">{customer.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
                        <FiMail className="text-slate-400 text-sm" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <FiPhone className="text-slate-400 text-xs" />
                        <span>{customer.phone || "+91 98000 00000"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      <div className="flex items-center gap-1.5 text-sm">
                        <FiMapPin className="text-slate-400 text-sm flex-shrink-0" />
                        <span>{customer.city || "Mumbai, Maharashtra"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          tierStyles[customer.tier] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {customer.tier || "Silver Patron"}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-base text-slate-800">
                      {customer.ordersCount || 1} orders
                    </td>
                    <td className="py-4 px-6 font-bold text-base text-[#8B1C2C]">
                      ₹{Number(customer.totalSpent || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500 font-medium">{customer.joined || "Jan 2025"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
