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
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.city && c.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Customer Directory</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            View shopper profiles, lifetime spend, order history, and contact details live from MongoDB.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCustomers}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh Customers"
          >
            <FiRotateCw className={`text-sm ${loading ? "animate-spin" : ""}`} />
          </button>
          <div className="relative min-w-[280px]">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search customers by name, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#6B1527] shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Contact Details</th>
                <th className="py-3.5 px-5">Location</th>
                <th className="py-3.5 px-5">Patron Tier</th>
                <th className="py-3.5 px-5">Orders</th>
                <th className="py-3.5 px-5">Total Spent</th>
                <th className="py-3.5 px-5">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((customer) => (
                <tr key={customer.id || customer._id} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80";
                        }}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-800 block">{customer.name}</span>
                        <span className="text-[11px] text-slate-400 block">{customer.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-slate-600">
                    <div className="flex items-center gap-1 text-[11px] text-slate-700">
                      <FiMail className="text-slate-400" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                      <FiPhone className="text-slate-400" />
                      <span>{customer.phone || "+91 98000 00000"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-slate-600">
                    <div className="flex items-center gap-1">
                      <FiMapPin className="text-slate-400 text-xs flex-shrink-0" />
                      <span>{customer.city || "Mumbai, Maharashtra"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        tierStyles[customer.tier] || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {customer.tier || "Silver Patron"}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-bold text-slate-800">
                    {customer.ordersCount || 1} orders
                  </td>
                  <td className="py-4 px-5 font-bold text-[#8B1C2C]">
                    ₹{Number(customer.totalSpent || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-5 text-slate-400">{customer.joined || "Jan 2025"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
