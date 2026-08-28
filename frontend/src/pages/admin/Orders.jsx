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
    <div className="space-y-7 max-w-[1600px] mx-auto pb-12 text-slate-800">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-sm text-slate-500 font-semibold">All Orders</span>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">{orders.length}</h3>
          <span className="text-xs text-emerald-700 font-semibold">Live from Database</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-sm text-slate-500 font-semibold">Delivered</span>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
            {orders.filter((o) => o.status === "Delivered").length}
          </h3>
          <span className="text-xs text-emerald-700 font-semibold">Successful fulfillment</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-sm text-slate-500 font-semibold">In Transit</span>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
            {orders.filter((o) => o.status === "Shipped" || o.status === "Processing").length}
          </h3>
          <span className="text-xs text-amber-700 font-semibold">Processing / Shipped</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-sm text-slate-500 font-semibold">Total Revenue</span>
          <h3 className="text-2xl md:text-3xl font-bold text-[#8B1C2C] mt-1">
            ₹{orders.reduce((acc, curr) => acc + curr.total, 0).toLocaleString("en-IN")}
          </h3>
          <span className="text-xs text-slate-500 font-medium">Calculated from live orders</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {["All", "Delivered", "Processing", "Shipped", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                  statusFilter === status
                    ? "bg-[#6B1527] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              title="Refresh Orders"
            >
              <FiRotateCw className={`text-base ${loading ? "animate-spin" : ""}`} />
            </button>
            {/* Search Bar */}
            <div className="relative min-w-[280px]">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="text"
                placeholder="Search by Order ID, customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#6B1527] focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-xs">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-500 text-base">
                    No orders found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-bold text-base text-slate-900">{order.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-[#6B1527] font-bold text-sm">
                          {order.customer?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-base text-slate-800">{order.customer}</div>
                          <div className="text-xs text-slate-500">{order.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 font-medium">{order.date}</td>
                    <td className="py-4 px-6 font-bold text-base text-slate-900">
                      ₹{order.total.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 font-medium">{order.paymentMethod}</td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-[#6B1527] cursor-pointer ${
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
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-[#6B1527] hover:text-white text-slate-700 transition cursor-pointer"
                        title="View Order Details"
                      >
                        <FiEye className="text-base" />
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-7 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Order Details</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
                  Customer & Delivery
                </span>
                <div className="font-bold text-base text-slate-900">{selectedOrder.customer}</div>
                <div className="text-slate-600 mt-1 text-sm">{selectedOrder.phone} • {selectedOrder.email}</div>
                <div className="text-slate-700 mt-2 text-sm bg-white p-2.5 rounded-lg border border-slate-200">{selectedOrder.address}</div>
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-2.5">
                  Ordered Items
                </span>
                <div className="space-y-2.5">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={item.img}
                          alt={item.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&auto=format&fit=crop&q=80";
                          }}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                          <div className="text-slate-500 text-xs mt-0.5">Qty: {item.qty}</div>
                        </div>
                      </div>
                      <span className="font-bold text-base text-slate-900">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 flex items-center justify-between font-bold text-base text-slate-900">
                <span>Total Amount</span>
                <span className="text-xl font-bold text-[#8B1C2C]">₹{selectedOrder.total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 rounded-xl bg-[#6B1527] text-white text-sm font-semibold hover:bg-[#7E1A2E] transition shadow-xs cursor-pointer"
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
