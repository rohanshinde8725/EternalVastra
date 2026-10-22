import React, { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { FiShoppingBag, FiArrowRight, FiRefreshCw } from "react-icons/fi";
import { API_BASE_URL, resolveImageUrl } from "../../api/products";
import FadeUp from "../../components/animations/FadeUp";

const Orders = () => {
  const navigate = useNavigate();
  const outletCtx = useOutletContext() || {};
  const user = outletCtx.user || {};

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    const userId = user._id || user.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API_BASE_URL}/api/users/profile/${userId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.recentOrders)) {
          setOrders(data.recentOrders);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return (
    <FadeUp delay={0.15} className="bg-white rounded-2xl p-6 md:p-8 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#EEDACB] pb-5">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif text-[#74202D] font-bold">My Order History</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track status, view items, and manage all your purchases from Eternal Vastra.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="text-xs font-semibold text-[#74202D] hover:underline flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <FiRefreshCw className={`text-xs ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <FiRefreshCw className="text-2xl animate-spin mx-auto mb-3 text-[#74202D]" />
          <p className="text-sm font-medium">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-300 mx-auto mb-4 border border-rose-100">
            <FiShoppingBag className="text-3xl text-[#74202D]" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-700">No Orders Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6 max-w-sm mx-auto">
            Looks like you haven't made your first purchase yet. Explore our handcrafted sarees to begin your journey.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#74202D] text-white uppercase py-2.5 px-8 rounded-xl hover:bg-[#5A1622] transition-all text-xs sm:text-sm font-bold shadow-md cursor-pointer"
          >
            <span>Start Shopping</span>
            <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-sm text-left min-w-[700px]">
            <thead>
              <tr className="text-slate-400 font-semibold border-b border-[#EEDACB] text-xs uppercase tracking-wider bg-[#FCF8F5]">
                <th className="py-4 px-4 rounded-tl-lg">Order ID</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Items</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-center rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3E6DA]">
              {orders.map((order, i) => (
                <tr key={order._id || i} className="hover:bg-[#FCF8F5] transition group">
                  <td className="py-5 px-4 font-bold text-slate-700 text-sm">
                    #{order.orderId || (order._id ? order._id.substring(order._id.length - 8).toUpperCase() : `ORD-${i + 1}`)}
                  </td>
                  <td className="py-5 px-4 text-slate-500 text-sm">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Recent"}
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg border border-[#EEDACB] overflow-hidden shrink-0 shadow-sm bg-[#FCF8F5]">
                        <img
                          src={
                            order.items && order.items[0]?.img
                              ? resolveImageUrl(order.items[0].img)
                              : "https://images.unsplash.com/photo-1610189044265-1ebf81393666?w=100&auto=format&fit=crop&q=80"
                          }
                          alt="Item"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 max-w-[220px]">
                        <p className="font-bold text-slate-800 text-sm truncate">
                          {order.items && order.items[0]?.name ? order.items[0].name : "Handcrafted Saree"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {order.items ? order.items.length : 1} item
                          {order.items && order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4 font-bold text-slate-800 text-sm">
                    ₹ {(order.total || order.totalAmount || 0)?.toLocaleString("en-IN")}
                  </td>
                  <td className="py-5 px-4 text-center">
                    {!order.status || order.status === "Delivered" ? (
                      <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Delivered
                      </span>
                    ) : order.status === "Shipped" ? (
                      <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                        Shipped
                      </span>
                    ) : order.status === "Processing" ? (
                      <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                        Processing
                      </span>
                    ) : order.status === "Cancelled" ? (
                      <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-red-100 text-red-700 border border-red-200">
                        Cancelled
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                        {order.status || "Pending"}
                      </span>
                    )}
                  </td>
                  <td className="py-5 px-4 text-center">
                    <button className="bg-white text-[#74202D] uppercase py-1.5 px-4 rounded-md hover:bg-[#74202D] border-2 border-[#74202D] hover:text-white cursor-pointer transition-all duration-300 text-[10px] font-semibold shadow-xs">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </FadeUp>
  );
};

export default Orders;
