import React, { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  FiShoppingBag, FiHeart, FiMapPin, FiUser, FiTruck, FiBox,
  FiArrowRight, FiStar
} from "react-icons/fi";
import { API_BASE_URL, resolveImageUrl } from "../../api/products";
import FadeUp from "../../components/animations/FadeUp";

const Dashboard = () => {
  const navigate = useNavigate();
  const outletCtx = useOutletContext() || {};
  const user = outletCtx.user || {};
  const userReviewsCount = outletCtx.userReviewsCount || 0;

  const [orders, setOrders] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load wishlist items
    try {
      const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlistItems(Array.isArray(storedWishlist) ? storedWishlist : []);
    } catch {
      setWishlistItems([]);
    }

    // Load recent orders from API
    const userId = user._id || user.id;
    if (userId) {
      fetch(`${API_BASE_URL}/api/users/profile/${userId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && Array.isArray(data.recentOrders)) {
            setOrders(data.recentOrders);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="space-y-8">
      {/* 4 Overview Stat Cards */}
      <FadeUp delay={0.15}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div
            onClick={() => navigate("/profile/orders")}
            className="bg-white rounded-2xl p-5 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group hover:border-[#d1b5ae]"
          >
            <div className="w-10 h-10 flex items-center justify-center text-2xl shrink-0 text-[#5A1622] group-hover:scale-110 transition-transform">
              <FiShoppingBag />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] sm:text-xs xl:text-sm font-medium text-slate-500 block truncate mb-0.5">
                Total Orders
              </span>
              <p className="text-sm sm:text-lg lg:text-base xl:text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap">
                {orders.length}
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate("/wishlist")}
            className="bg-white rounded-2xl p-5 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group hover:border-[#d1b5ae]"
          >
            <div className="w-10 h-10 flex items-center justify-center text-2xl shrink-0 text-[#5A1622] group-hover:scale-110 transition-transform">
              <FiHeart />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] sm:text-xs xl:text-sm font-medium text-slate-500 block truncate mb-0.5">
                Wishlist Items
              </span>
              <p className="text-sm sm:text-lg lg:text-base xl:text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap">
                {wishlistItems.length}
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate("/profile/reviews")}
            className="bg-white rounded-2xl p-5 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group hover:border-[#d1b5ae]"
          >
            <div className="w-10 h-10 flex items-center justify-center text-2xl shrink-0 text-[#5A1622] group-hover:scale-110 transition-transform">
              <FiStar />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] sm:text-xs xl:text-sm font-medium text-slate-500 block truncate mb-0.5">
                My Reviews
              </span>
              <p className="text-sm sm:text-lg lg:text-base xl:text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap">
                {userReviewsCount}
              </p>
            </div>
          </div>

          <div
            onClick={() => navigate("/profile/addresses")}
            className="bg-white rounded-2xl p-5 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group hover:border-[#d1b5ae]"
          >
            <div className="w-10 h-10 flex items-center justify-center text-2xl shrink-0 text-[#5A1622] group-hover:scale-110 transition-transform">
              <FiMapPin />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] sm:text-xs xl:text-sm font-medium text-slate-500 block truncate mb-0.5">
                Saved Addresses
              </span>
              <p className="text-sm sm:text-lg lg:text-base xl:text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap">
                {user.addresses?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Main Grid: Orders + Quick Links */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
        <FadeUp delay={0.25} className="xl:col-span-2 space-y-6">
          {/* Recent Orders Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Recent Orders</h3>
              <button
                onClick={() => navigate("/profile/orders")}
                className="text-xs font-bold text-[#74202D] flex items-center gap-1 hover:underline cursor-pointer"
              >
                View All Orders <FiArrowRight />
              </button>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              {orders.length === 0 ? (
                <div className="text-center py-10 text-slate-500 font-medium text-sm">
                  You have no recent orders.
                </div>
              ) : (
                <table className="w-full text-sm text-left min-w-[650px]">
                  <thead>
                    <tr className="text-slate-400 font-semibold border-b border-[#EEDACB] text-[11px] sm:text-xs uppercase tracking-wider">
                      <th className="pb-4 px-2">Order ID</th>
                      <th className="pb-4 px-2">Date</th>
                      <th className="pb-4 px-2">Items</th>
                      <th className="pb-4 px-2">Amount</th>
                      <th className="pb-4 px-2 text-center">Status</th>
                      <th className="pb-4 px-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3E6DA]">
                    {orders.slice(0, 5).map((order, i) => (
                      <tr key={order._id || i} className="hover:bg-[#FCF8F5] transition group">
                        <td className="py-4 px-2 font-bold text-slate-700 text-xs">
                          #{order.orderId || (order._id ? order._id.substring(order._id.length - 8).toUpperCase() : `ORD-${i + 1}`)}
                        </td>
                        <td className="py-4 px-2 text-slate-500 text-xs">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Recent"}
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded border border-[#EEDACB] overflow-hidden shrink-0">
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
                            <div className="min-w-0 max-w-[120px] lg:max-w-[180px]">
                              <p className="font-semibold text-slate-700 text-xs truncate">
                                {order.items && order.items[0]?.name ? order.items[0].name : "Handcrafted Saree"}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {order.items ? order.items.length : 1} item
                                {order.items && order.items.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2 font-bold text-slate-700 text-xs">
                          ₹ {(order.total || order.totalAmount || 0)?.toLocaleString("en-IN")}
                        </td>
                        <td className="py-4 px-2 text-center">
                          {!order.status || order.status === "Delivered" ? (
                            <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                              Delivered
                            </span>
                          ) : order.status === "Shipped" ? (
                            <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                              Shipped
                            </span>
                          ) : order.status === "Processing" ? (
                            <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                              Processing
                            </span>
                          ) : order.status === "Cancelled" ? (
                            <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-red-100 text-red-700 border border-red-200">
                              Cancelled
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                              {order.status || "Pending"}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-2 text-center">
                          <button
                            onClick={() => navigate("/profile/orders")}
                            className="bg-white text-[#74202D] uppercase py-1.5 px-3 rounded-md hover:bg-[#74202D] border-2 border-[#74202D] hover:text-white cursor-pointer transition-all duration-300 text-[10px] font-semibold shadow-xs"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Need Help Card */}
          <div className="bg-orange-50/50 rounded-2xl p-4 sm:p-5 border border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 flex items-center justify-center text-[#5A1622] shrink-0 bg-white rounded-full sm:bg-transparent sm:rounded-none shadow-sm sm:shadow-none">
                <FiTruck className="text-xl sm:text-2xl" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Need Help With Your Orders?</h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 max-w-[200px] sm:max-w-none mx-auto">
                  Our dedicated customer styling & concierge team is here for you.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/contact")}
              className="w-full sm:w-auto bg-[#74202D] text-white uppercase py-2.5 px-6 sm:px-8 rounded-md hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer transition-all duration-300 text-xs sm:text-sm font-semibold shadow-xs shrink-0 flex items-center justify-center gap-2"
            >
              Contact Us <FiArrowRight />
            </button>
          </div>
        </FadeUp>

        {/* Right Column: Quick Links + Wishlist */}
        <FadeUp delay={0.35} className="space-y-6">
          <div className="bg-[#FCF8F5] rounded-2xl p-4 sm:p-6 shadow-sm border border-[#EEDACB]/50">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-4 sm:mb-5 text-center sm:text-left">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <button
                onClick={() => navigate("/profile/orders")}
                className="bg-white border border-rose-100 rounded-xl p-3 sm:p-4 text-center hover:border-[#EEDACB] transition-all group flex flex-col items-center h-full shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 flex items-center justify-center text-[#5A1622] mb-2 sm:mb-3 group-hover:scale-110 transition-transform bg-rose-50 rounded-full">
                  <FiBox className="text-xl" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-[13px] w-full">Track Orders</h4>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-1 w-full">Order history</p>
              </button>

              <button
                onClick={() => navigate("/profile/reviews")}
                className="bg-white border border-rose-100 rounded-xl p-3 sm:p-4 text-center hover:border-[#EEDACB] transition-all group flex flex-col items-center h-full shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 flex items-center justify-center text-[#5A1622] mb-2 sm:mb-3 group-hover:scale-110 transition-transform bg-rose-50 rounded-full">
                  <FiStar className="text-xl" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-[13px] w-full">My Reviews</h4>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-1 w-full">Manage reviews</p>
              </button>

              <button
                onClick={() => navigate("/profile/addresses")}
                className="bg-white border border-rose-100 rounded-xl p-3 sm:p-4 text-center hover:border-[#EEDACB] transition-all group flex flex-col items-center h-full shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 flex items-center justify-center text-[#5A1622] mb-2 sm:mb-3 group-hover:scale-110 transition-transform bg-rose-50 rounded-full">
                  <FiMapPin className="text-xl" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-[13px] w-full">Addresses</h4>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-1 w-full">Shipping details</p>
              </button>

              <button
                onClick={() => navigate("/profile/account")}
                className="bg-white border border-rose-100 rounded-xl p-3 sm:p-4 text-center hover:border-[#EEDACB] transition-all group flex flex-col items-center h-full shadow-xs cursor-pointer"
              >
                <div className="w-8 h-8 flex items-center justify-center text-[#5A1622] mb-2 sm:mb-3 group-hover:scale-110 transition-transform bg-rose-50 rounded-full">
                  <FiUser className="text-xl" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-[13px] w-full">Account Details</h4>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-1 w-full">Update profile</p>
              </button>
            </div>
          </div>

          {/* Wishlist Snapshot */}
          <div className="bg-white rounded-2xl p-6 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">My Wishlist</h3>
              <button
                onClick={() => navigate("/wishlist")}
                className="text-[10px] sm:text-xs font-bold text-[#74202D] flex items-center gap-1 hover:underline cursor-pointer"
              >
                View All <FiArrowRight />
              </button>
            </div>

            {wishlistItems.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs font-medium">
                Your wishlist is empty.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {wishlistItems.slice(0, 3).map((item, i) => (
                  <div
                    key={item.id || item._id || i}
                    onClick={() => navigate(`/shop/${item.id || item._id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2 border border-[#EEDACB]">
                      <img
                        src={resolveImageUrl(item.img)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-rose-500 shadow-sm">
                        <FiHeart className="text-[10px] fill-current" />
                      </button>
                    </div>
                    <h4 className="text-[9px] sm:text-[10px] font-bold text-slate-800 truncate">
                      {item.title}
                    </h4>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 mt-0.5">
                      ₹ {item.discountPrice?.toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FadeUp>
      </div>
    </div>
  );
};

export default Dashboard;
