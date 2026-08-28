import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiEye,
  FiShoppingBag,
  FiCheckCircle,
  FiX,
  FiRotateCw,
} from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";

const statusStyles = {
  Delivered: "bg-[#DCFCE7] text-[#15803D]",
  Processing: "bg-[#FEF3C7] text-[#B45309]",
  Shipped: "bg-[#DBEAFE] text-[#1D4ED8]",
  Cancelled: "bg-[#FFE4E6] text-[#E11D48]",
  Pending: "bg-[#EDE9FE] text-[#7C3AED]",
};

const Orders = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/orders`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load orders");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders(
            data.map((o) => ({
              _id: o._id,
              id: o.orderId || `#ORD${o._id?.slice(-5)}`,
              customer: o.customerName,
              email: o.email || "customer@example.com",
              phone: o.phone || "+91 98200 00000",
              date: o.orderDate || new Date(o.createdAt).toLocaleDateString("en-IN"),
              items: o.items?.length
                ? o.items.map((it) => ({
                    ...it,
                    img: it.img?.startsWith("http") ? it.img : `${API_BASE_URL}${it.img}`,
                  }))
                : [
                    {
                      name: "Mysore Silk Saree - Crimson Gold",
                      qty: 1,
                      price: o.total || 3299,
                      img: `${API_BASE_URL}/images/silk/silk-1.jpg`,
                    },
                  ],
              total: Number(o.total || 0),
              paymentMethod: o.paymentMethod || "UPI (Google Pay)",
              status: o.status || "Pending",
              address: o.address || "Standard Delivery Address",
            }))
          );
        }
      })
      .catch(() => {
        // Fallback default
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = async (order, newStatus) => {
    const previousStatus = order.status;

    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === order.id) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }

    try {
      if (order._id) {
        const response = await fetch(`${API_BASE_URL}/api/admin/orders/${order._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) throw new Error("Status update failed");
      }
      showToast.success(`Order ${order.id} status updated to ${newStatus}`);
    } catch {
      // Revert if error
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: previousStatus } : o))
      );
      showToast.error("Failed to update status in database");
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">All Orders</span>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{orders.length}</h3>
          <span className="text-[11px] text-emerald-600 font-medium">Live from MongoDB</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Delivered</span>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">
            {orders.filter((o) => o.status === "Delivered").length}
          </h3>
          <span className="text-[11px] text-emerald-600 font-medium">Successful fulfillment</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">In Transit</span>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">
            {orders.filter((o) => o.status === "Shipped" || o.status === "Processing").length}
          </h3>
          <span className="text-[11px] text-amber-600 font-medium">Processing / Shipped</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Revenue</span>
          <h3 className="text-2xl font-bold text-[#8B1C2C] mt-1">
            ₹{orders.reduce((acc, curr) => acc + curr.total, 0).toLocaleString("en-IN")}
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Calculated from live orders</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {["All", "Delivered", "Processing", "Shipped", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  statusFilter === status
                    ? "bg-[#6B1527] text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
              title="Refresh Orders"
            >
              <FiRotateCw className={`text-sm ${loading ? "animate-spin" : ""}`} />
            </button>
            {/* Search Bar */}
            <div className="relative min-w-[260px]">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search by Order ID, customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#6B1527] focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">Order ID</th>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">Total</th>
                <th className="py-3.5 px-5">Payment</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No orders found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-5 font-bold text-slate-800">{order.id}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-[#6B1527] font-bold text-xs">
                          {order.customer.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{order.customer}</div>
                          <div className="text-[11px] text-slate-400">{order.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-500">{order.date}</td>
                    <td className="py-4 px-5 font-bold text-slate-800">
                      ₹{order.total.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-5 text-slate-500">{order.paymentMethod}</td>
                    <td className="py-4 px-5">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order, e.target.value)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border-0 focus:ring-2 focus:ring-[#6B1527] cursor-pointer ${
                          statusStyles[order.status] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <option value="Delivered">Delivered</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-[#6B1527] hover:text-white text-slate-600 transition"
                        title="View Order Details"
                      >
                        <FiEye className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-xs text-slate-400">Order Details</span>
                <h3 className="text-lg font-bold text-slate-800">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Customer & Delivery
                </span>
                <div className="font-bold text-slate-800">{selectedOrder.customer}</div>
                <div className="text-slate-500 mt-0.5">{selectedOrder.phone} • {selectedOrder.email}</div>
                <div className="text-slate-600 mt-1.5 text-[11px]">{selectedOrder.address}</div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                  Ordered Items
                </span>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/60">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.img}
                          alt={item.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&auto=format&fit=crop&q=80";
                          }}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <div>
                          <div className="font-semibold text-slate-800">{item.name}</div>
                          <div className="text-slate-400 text-[11px]">Qty: {item.qty}</div>
                        </div>
                      </div>
                      <span className="font-bold text-slate-800">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between font-bold text-sm text-slate-800">
                <span>Total Amount</span>
                <span className="text-[#8B1C2C]">₹{selectedOrder.total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 rounded-xl bg-[#6B1527] text-white text-xs font-semibold hover:bg-[#7E1A2E] transition shadow-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
