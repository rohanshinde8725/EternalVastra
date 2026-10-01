import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiChevronDown,
  FiCalendar,
  FiPercent,
  FiUserCheck,
  FiUserX,
  FiTag,
  FiTruck,
  FiImage,
  FiLock,
  FiUnlock,
  FiTrash2,
  FiShield,
  FiUser,
  FiArrowRight,
  FiCheckCircle,
  FiAlertTriangle,
  FiMail,
} from "react-icons/fi";
import { API_BASE_URL, resolveImageUrl } from "../../api/products";
import { useToast } from "../../context/ToastContext";
import { getStoredUser } from "../../utils/auth";

const AdminDashboard = () => {
  const { showToast } = useToast();
  const currentUser = getStoredUser();
  const [globalPeriod, setGlobalPeriod] = useState("This Week");
  const [showGlobalDropdown, setShowGlobalDropdown] = useState(false);

  const [salesPeriod, setSalesPeriod] = useState("This Week");
  const [showSalesDropdown, setShowSalesDropdown] = useState(false);

  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrdersCount: 0,
    totalCustomersCount: 0,
    totalProductsCount: 0,
    totalUsersCount: 0,
    activeUsersCount: 0,
    blockedUsersCount: 0,
    recentUsers: [],
    ordersByStatus: { Delivered: 0, Processing: 0, Shipped: 0, Cancelled: 0, Pending: 0 },
    salesByCategory: [],
    activities: [],
  });

  // Fetch live stats from backend
  const fetchDashboardStats = () => {
    fetch(`${API_BASE_URL}/api/admin/dashboard-stats`)
      .then((res) => {
        if (!res.ok) throw new Error("Dashboard stats failed");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setStats({
            totalSales: data.totalSales || 0,
            totalOrdersCount: data.totalOrdersCount || 0,
            totalCustomersCount: data.totalCustomersCount || 0,
            totalProductsCount: data.totalProductsCount || 0,
            totalUsersCount: data.totalUsersCount || (data.recentUsers ? data.recentUsers.length : 0),
            activeUsersCount: data.activeUsersCount || 0,
            blockedUsersCount: data.blockedUsersCount || 0,
            recentUsers: (data.recentUsers || []).map((u) => ({
              ...u,
              id: u._id || u.id,
              avatar: resolveImageUrl(u.avatar || "/images/default-avatar.webp"),
            })),
            ordersByStatus: data.ordersByStatus || {
              Delivered: 0,
              Processing: 0,
              Shipped: 0,
              Cancelled: 0,
              Pending: 0,
            },
            salesByCategory: data.salesByCategory || [],
            activities: data.activities || [],
          });
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Toggle Block / Unblock from Dashboard
  const handleToggleBlock = async (user) => {
    if (user.email === "rohanshinde8725@gmail.com") {
      showToast.error("Primary Admin account cannot be blocked.");
      return;
    }

    setActionLoadingId(user.id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${user.id}/toggle-block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to toggle block status");
      }

      const newIsBlocked = !user.isBlocked;
      const newStatus = newIsBlocked ? "blocked" : "active";

      setStats((prev) => ({
        ...prev,
        recentUsers: prev.recentUsers.map((u) =>
          u.id === user.id ? { ...u, isBlocked: newIsBlocked, status: newStatus } : u
        ),
        activeUsersCount: newIsBlocked
          ? Math.max(0, prev.activeUsersCount - 1)
          : prev.activeUsersCount + 1,
        blockedUsersCount: newIsBlocked
          ? prev.blockedUsersCount + 1
          : Math.max(0, prev.blockedUsersCount - 1),
      }));

      if (newIsBlocked) {
        showToast.warning(`User ${user.name} has been BLOCKED.`);
      } else {
        showToast.success(`User ${user.name} is now ACTIVE.`);
      }
    } catch (err) {
      showToast.error(err.message || "Error blocking user");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete User from Dashboard
  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    if (deleteConfirmUser.email === "rohanshinde8725@gmail.com") {
      showToast.error("Primary Admin account cannot be deleted.");
      setDeleteConfirmUser(null);
      return;
    }

    setActionLoadingId(deleteConfirmUser.id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${deleteConfirmUser.id}`, {
        method: "DELETE",
      });

      if (!res.ok && res.status !== 204) {
        throw new Error("Failed to delete user");
      }

      setStats((prev) => ({
        ...prev,
        recentUsers: prev.recentUsers.filter((u) => u.id !== deleteConfirmUser.id),
        totalUsersCount: Math.max(0, prev.totalUsersCount - 1),
      }));

      showToast.success(`User ${deleteConfirmUser.name} deleted. Moved to Recycle Bin.`);
    } catch (err) {
      showToast.error(err.message || "Error deleting user");
    } finally {
      setActionLoadingId(null);
      setDeleteConfirmUser(null);
    }
  };

  const circumference = 2 * Math.PI * 38; // ~238.76

  const renderDonutSlices = (dataItems, total, colors) => {
    let currentOffset = 0;
    return dataItems.map((item, i) => {
      const percentage = total > 0 ? item.value / total : 0;
      const strokeLength = percentage * circumference;
      const strokeGap = circumference - strokeLength;

      const slice = (
        <circle
          key={item.name}
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke={colors[i % colors.length]}
          strokeWidth="12"
          strokeDasharray={`${strokeLength} ${strokeGap}`}
          strokeDashoffset={-currentOffset}
          className="transition-all duration-1000 ease-out"
        />
      );
      currentOffset += strokeLength;
      return slice;
    });
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-[1600px] mx-auto text-slate-800">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
            Welcome back, Admin! Here's what's happening with your store and user accounts today.
          </p>
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative self-start sm:self-auto">
          <button
            onClick={() => setShowGlobalDropdown(!showGlobalDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <FiCalendar className="text-slate-500 text-xs sm:text-sm" />
            <span>{globalPeriod}</span>
            <FiChevronDown className="text-slate-400 text-xs" />
          </button>

          {showGlobalDropdown && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-30 text-xs font-medium">
              {["This Week", "Last Week", "This Month", "This Year"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setGlobalPeriod(opt);
                    setShowGlobalDropdown(false);
                    showToast.info(`Filtered dashboard for ${opt}`);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-slate-700 hover:text-[#75212e] cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. TOP 5 METRIC CARDS (INCLUDING REGISTERED USERS) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 xl:gap-4">
        {/* Total Sales */}
        <div className="bg-white rounded-xl xl:rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-start xl:items-center gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 text-rose-500">
            <FiShoppingBag className="text-base sm:text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] sm:text-xs font-medium text-slate-500 block truncate">
              Total Sales
            </span>
            <h3 className="text-sm sm:text-base xl:text-xl font-bold text-slate-900 tracking-tight mt-0.5 whitespace-nowrap">
              ₹{Number(stats.totalSales).toLocaleString("en-IN")}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-emerald-600 text-[10px] font-semibold">
              <span>↑ 18.6%</span>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-xl xl:rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-start xl:items-center gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 text-amber-500">
            <FiBox className="text-base sm:text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] sm:text-xs font-medium text-slate-500 block truncate">
              Orders
            </span>
            <h3 className="text-sm sm:text-base xl:text-xl font-bold text-slate-900 tracking-tight mt-0.5 whitespace-nowrap">
              {stats.totalOrdersCount}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-emerald-600 text-[10px] font-semibold">
              <span>↑ 15.3%</span>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl xl:rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-start xl:items-center gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 text-purple-500">
            <FiBox className="text-base sm:text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] sm:text-xs font-medium text-slate-500 block truncate">
              Products
            </span>
            <h3 className="text-sm sm:text-base xl:text-xl font-bold text-slate-900 tracking-tight mt-0.5 whitespace-nowrap">
              {stats.totalProductsCount}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-emerald-600 text-[10px] font-semibold">
              <span>↑ 8.2%</span>
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-xl xl:rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-start xl:items-center gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-500">
            <FiUsers className="text-base sm:text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] sm:text-xs font-medium text-slate-500 block truncate">
              Customers
            </span>
            <h3 className="text-sm sm:text-base xl:text-xl font-bold text-slate-900 tracking-tight mt-0.5 whitespace-nowrap">
              {stats.totalCustomersCount}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-emerald-600 text-[10px] font-semibold">
              <span>↑ 11.8%</span>
            </div>
          </div>
        </div>

        {/* Registered Users (New Column & Card) */}
        <Link
          to="/admin/users"
          className="col-span-2 sm:col-span-1 bg-gradient-to-br from-[#74202D] to-[#4E111C] text-white rounded-xl xl:rounded-2xl p-3 sm:p-4 shadow-md flex items-start xl:items-center gap-3 min-w-0 hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 text-white">
            <FiUserCheck className="text-base sm:text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] sm:text-xs font-medium text-rose-200 block truncate">
              User Accounts
            </span>
            <h3 className="text-sm sm:text-base xl:text-xl font-bold text-white tracking-tight mt-0.5 whitespace-nowrap">
              {stats.totalUsersCount}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-rose-200">
              <span className="text-emerald-300 font-bold">{stats.activeUsersCount} active</span>
              {stats.blockedUsersCount > 0 && (
                <span className="text-red-300 font-bold">• {stats.blockedUsersCount} blocked</span>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* 3. USER MANAGEMENT & ACCESS CONTROL SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                User Access & Account Directory
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-[#74202D] border border-rose-100">
                Live MongoDB
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage system permissions, block/unblock accounts, or delete users directly.
            </p>
          </div>

          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#74202D] hover:text-white text-slate-700 text-xs font-bold transition duration-200"
          >
            <span>Manage All Users</span>
            <FiArrowRight className="text-xs" />
          </Link>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                <th className="py-3 px-3 sm:px-4">User</th>
                <th className="py-3 px-3 sm:px-4">Email Address</th>
                <th className="py-3 px-3 sm:px-4">Role</th>
                <th className="py-3 px-3 sm:px-4">Status</th>
                <th className="py-3 px-3 sm:px-4">Joined Date</th>
                <th className="py-3 px-3 sm:px-4 text-right">Quick Access</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {stats.recentUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                    No registered user accounts found.
                  </td>
                </tr>
              ) : (
                stats.recentUsers.map((user) => {
                  const isBlocked = user.isBlocked || user.status === "blocked";
                  const isMasterAdmin = user.email === "rohanshinde8725@gmail.com";
                  const isCurrent = currentUser?.email === user.email;

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isBlocked ? "bg-red-50/20" : ""
                      }`}
                    >
                      {/* Avatar & Name */}
                      <td className="py-3 px-3 sm:px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/default-avatar.webp";
                            }}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate">
                              {user.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {user.phone || "No phone"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-3 sm:px-4">
                        <a
                          href={`mailto:${user.email}`}
                          className="text-slate-700 hover:text-[#74202D] truncate block transition"
                        >
                          {user.email}
                        </a>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-3 sm:px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {user.role === "admin" ? <FiShield className="text-[10px]" /> : null}
                          <span className="capitalize">{user.role || "customer"}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 sm:px-4">
                        {isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700">
                            <FiLock className="text-[10px]" />
                            <span>Blocked</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="py-3 px-3 sm:px-4 text-xs text-slate-500">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Jan 2025"}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 sm:px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Block/Unblock Toggle */}
                          <button
                            disabled={isMasterAdmin || actionLoadingId === user.id}
                            onClick={() => handleToggleBlock(user)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                              isBlocked
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                            }`}
                            title={
                              isMasterAdmin
                                ? "Primary admin cannot be blocked"
                                : isBlocked
                                ? "Unblock account"
                                : "Block account"
                            }
                          >
                            {isBlocked ? "Unblock" : "Block"}
                          </button>

                          {/* Delete Button */}
                          <button
                            disabled={isMasterAdmin || isCurrent || actionLoadingId === user.id}
                            onClick={() => setDeleteConfirmUser(user)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Delete User"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MIDDLE ROW (Sales Overview & Store Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Sales Overview Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl xl:rounded-2xl p-4 sm:p-5 xl:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h4 className="text-sm sm:text-base font-bold text-slate-900">Sales Overview</h4>
            <div className="relative">
              <button
                onClick={() => setShowSalesDropdown(!showSalesDropdown)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <span>{salesPeriod}</span>
                <FiChevronDown className="text-slate-400 text-xs" />
              </button>

              {showSalesDropdown && (
                <div className="absolute right-0 mt-1.5 w-32 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-20 text-xs font-medium">
                  {["This Week", "Last Week", "This Month"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSalesPeriod(opt);
                        setShowSalesDropdown(false);
                        showToast.info(`Chart updated to ${opt}`);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-slate-700 hover:text-[#75212e] cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Smooth Curved Line & Area Graph */}
          <div className="relative pt-4 sm:pt-6 pb-2">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-4 sm:top-6 bottom-8 sm:bottom-10 flex flex-col justify-between text-[10px] sm:text-[11px] font-medium text-slate-400 select-none">
              <span>20K</span>
              <span>15K</span>
              <span>10K</span>
              <span>5K</span>
              <span>0</span>
            </div>

            {/* SVG Graph Area */}
            <div className="ml-7 sm:ml-8 relative h-44 sm:h-52">
              <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="maroonChartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#75212e" stopOpacity="0.25" />
                    <stop offset="70%" stopColor="#75212e" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#75212e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="175" x2="500" y2="175" stroke="#f1f5f9" strokeWidth="1" />

                {/* Gradient Area Fill */}
                <path
                  d="M 20 175 C 50 175, 80 120, 110 115 C 145 110, 160 145, 195 130 C 235 110, 255 75, 290 85 C 330 95, 340 125, 375 110 C 410 95, 435 75, 480 62 L 480 175 Z"
                  fill="url(#maroonChartFill)"
                />

                {/* Curved Line Path */}
                <path
                  d="M 20 175 C 50 175, 80 120, 110 115 C 145 110, 160 145, 195 130 C 235 110, 255 75, 290 85 C 330 95, 340 125, 375 110 C 410 95, 435 75, 480 62"
                  fill="none"
                  stroke="#75212e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Node Points */}
                <circle cx="110" cy="115" r="4.5" fill="#75212e" stroke="#ffffff" strokeWidth="2" />
                <circle cx="195" cy="130" r="4.5" fill="#75212e" stroke="#ffffff" strokeWidth="2" />
                <circle cx="290" cy="85" r="4.5" fill="#75212e" stroke="#ffffff" strokeWidth="2" />
                <circle cx="375" cy="110" r="4.5" fill="#75212e" stroke="#ffffff" strokeWidth="2" />

                {/* Active Tooltip Node */}
                <circle cx="480" cy="62" r="6" fill="#75212e" stroke="#ffffff" strokeWidth="2.5" />
              </svg>

              {/* Tooltip Card */}
              <div className="absolute right-0 -top-3 bg-[#75212e] text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-md text-xs text-center pointer-events-none transform translate-x-1">
                <div className="font-bold text-[11px] sm:text-xs">₹21,794</div>
                <div className="text-[9px] sm:text-[10px] text-rose-200">28 Aug, 2026</div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-[#75212e] rotate-45" />
              </div>
            </div>

            {/* X-Axis Date Labels */}
            <div className="ml-7 sm:ml-8 mt-3 flex justify-between text-[10px] sm:text-xs text-slate-400 font-medium">
              <span>22 Aug</span>
              <span>23 Aug</span>
              <span>24 Aug</span>
              <span>25 Aug</span>
              <span>26 Aug</span>
              <span>27 Aug</span>
              <span className="font-bold text-slate-900">28 Aug</span>
            </div>
          </div>
        </div>

        {/* Store Summary (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl xl:rounded-2xl p-4 sm:p-5 xl:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-3 sm:mb-4">
              Store Summary
            </h4>

            {/* Performance Banner Box */}
            <div className="flex items-center gap-3 p-3 sm:p-3.5 xl:p-4 rounded-xl bg-rose-50/40 border border-rose-100/60 mb-4 xl:mb-5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-rose-100/70 flex items-center justify-center shrink-0 text-[#75212e]">
                <FiShoppingBag className="text-lg sm:text-xl" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                Excellent! Your store is performing great this week.
              </p>
            </div>

            {/* Metric Summary Rows */}
            <div className="space-y-3 sm:space-y-3.5">
              {/* Average Order Value */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                    <FiShoppingBag className="text-xs sm:text-sm" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-600 truncate">
                    Average Order Value
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 shrink-0 ml-2">
                  ₹3,632
                </span>
              </div>

              {/* Conversion Rate */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                    <FiPercent className="text-xs sm:text-sm" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-600 truncate">
                    Conversion Rate
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 shrink-0 ml-2">
                  3.24%
                </span>
              </div>

              {/* Repeat Customers */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <FiUserCheck className="text-xs sm:text-sm" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-600 truncate">
                    Repeat Customers
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 shrink-0 ml-2">
                  23
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM ROW (Orders by Status, Sales by Category, Store Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Orders by Status Donut */}
        <div className="bg-white rounded-xl xl:rounded-2xl p-4 sm:p-5 xl:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-3 sm:mb-4">
            Orders by Status
          </h4>

          <div className="flex flex-col sm:flex-row lg:flex-col 2xl:flex-row items-center justify-between gap-4 xl:gap-5 my-auto">
            {/* SVG Donut */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 xl:w-34 xl:h-34 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f8fafc" strokeWidth="12" />
                {(() => {
                  const items = [
                    { name: "Delivered", value: stats.ordersByStatus.Delivered || 0 },
                    { name: "Processing", value: stats.ordersByStatus.Processing || 0 },
                    { name: "Shipped", value: stats.ordersByStatus.Shipped || 0 },
                    { name: "Cancelled", value: stats.ordersByStatus.Cancelled || 0 },
                    { name: "Pending", value: stats.ordersByStatus.Pending || 0 },
                  ];
                  const total = stats.totalOrdersCount;
                  const colors = ["#22C55E", "#F59E0B", "#3B82F6", "#EF4444", "#8B5CF6"];
                  return renderDonutSlices(items, total, colors);
                })()}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg xl:text-xl font-bold text-slate-900 leading-tight">
                  {stats.totalOrdersCount}
                </span>
                <span className="text-[9px] xl:text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  TOTAL
                </span>
              </div>
            </div>

            {/* Status Legend */}
            <div className="flex-1 space-y-1.5 xl:space-y-2 text-xs w-full">
              {[
                { label: "Delivered", color: "bg-[#22C55E]", key: "Delivered" },
                { label: "Processing", color: "bg-[#F59E0B]", key: "Processing" },
                { label: "Shipped", color: "bg-[#3B82F6]", key: "Shipped" },
                { label: "Cancelled", color: "bg-[#EF4444]", key: "Cancelled" },
                { label: "Pending", color: "bg-[#8B5CF6]", key: "Pending" },
              ].map((status) => {
                const count = stats.ordersByStatus[status.key] || 0;
                const percentage =
                  stats.totalOrdersCount > 0
                    ? ((count / stats.totalOrdersCount) * 100).toFixed(1)
                    : 0;
                return (
                  <div key={status.key} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full ${status.color} shrink-0`}
                      />
                      <span className="text-slate-600 font-medium truncate">{status.label}</span>
                    </div>
                    <span className="text-slate-700 font-semibold shrink-0">
                      {count} ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sales by Category Donut */}
        <div className="bg-white rounded-xl xl:rounded-2xl p-4 sm:p-5 xl:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-3 sm:mb-4">
            Sales by Category
          </h4>

          <div className="flex flex-col sm:flex-row lg:flex-col 2xl:flex-row items-center justify-between gap-4 xl:gap-5 my-auto">
            {/* SVG Donut */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 xl:w-34 xl:h-34 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f8fafc" strokeWidth="12" />
                {(() => {
                  const colors = ["#75212e", "#F97316", "#10B981", "#0284C7", "#8B5CF6"];
                  const totalCategorySales = stats.salesByCategory.reduce(
                    (sum, item) => sum + item.value,
                    0
                  );
                  return renderDonutSlices(stats.salesByCategory, totalCategorySales, colors);
                })()}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1">
                <span className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">
                  ₹{Number(stats.totalSales).toLocaleString()}
                </span>
                <span className="text-[9px] xl:text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  TOTAL
                </span>
              </div>
            </div>

            {/* Category Legend */}
            <div className="flex-1 space-y-1.5 xl:space-y-2 text-xs w-full">
              {stats.salesByCategory.map((cat, idx) => {
                const colors = [
                  "bg-[#75212e]",
                  "bg-[#F97316]",
                  "bg-[#10B981]",
                  "bg-[#0284C7]",
                  "bg-[#8B5CF6]",
                ];
                const totalCategorySales = stats.salesByCategory.reduce(
                  (sum, item) => sum + item.value,
                  0
                );
                const percentage =
                  totalCategorySales > 0 ? ((cat.value / totalCategorySales) * 100).toFixed(1) : 0;
                return (
                  <div key={cat.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`w-2 h-2 xl:w-2.5 xl:h-2.5 rounded-full ${
                          colors[idx % colors.length]
                        } shrink-0`}
                      />
                      <span className="text-slate-600 font-medium truncate">{cat.name}</span>
                    </div>
                    <span className="text-slate-700 font-semibold shrink-0">{percentage}%</span>
                  </div>
                );
              })}
              {stats.salesByCategory.length === 0 && (
                <div className="text-slate-400 text-center py-4 font-medium text-xs">
                  No sales data found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Store Activity Timeline */}
        <div className="bg-white rounded-xl xl:rounded-2xl p-4 sm:p-5 xl:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h4 className="text-sm sm:text-base font-bold text-slate-900">Store Activity</h4>
          </div>

          <div className="space-y-2.5 sm:space-y-3 my-auto">
            {stats.activities.length === 0 && (
              <div className="text-slate-400 text-center py-4 font-medium text-xs">
                No recent activity
              </div>
            )}
            {stats.activities.map((act, index) => {
              const Icon = act.type === "order" ? FiTruck : FiTag;
              const timeString =
                new Date(act.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }) +
                " " +
                new Date(act.time).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                });
              return (
                <div key={index} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${act.iconBg}`}
                    >
                      <Icon className="text-xs" />
                    </div>
                    <p className="text-xs text-slate-800 font-medium truncate" title={act.title}>
                      {act.title}
                    </p>
                  </div>
                  <span className="text-[10px] xl:text-[11px] text-slate-400 whitespace-nowrap font-normal shrink-0 ml-1">
                    {timeString}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. DELETE USER CONFIRMATION MODAL */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <FiAlertTriangle className="text-2xl" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">Delete User Account?</h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Are you sure you want to delete user{" "}
              <strong className="text-slate-800">{deleteConfirmUser.name}</strong> (
              {deleteConfirmUser.email})? A copy will be preserved in your{" "}
              <strong>Recycle Bin</strong> where it can be restored.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
