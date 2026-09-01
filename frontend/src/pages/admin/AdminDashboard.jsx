import React, { useState, useEffect } from "react";
import {
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiChevronDown,
  FiCalendar,
  FiPercent,
  FiUserCheck,
  FiTag,
  FiTruck,
  FiImage,
} from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [globalPeriod, setGlobalPeriod] = useState("This Week");
  const [showGlobalDropdown, setShowGlobalDropdown] = useState(false);

  const [salesPeriod, setSalesPeriod] = useState("This Week");
  const [showSalesDropdown, setShowSalesDropdown] = useState(false);

  const [stats, setStats] = useState({
    totalSales: 21794,
    totalOrdersCount: 6,
    totalCustomersCount: 6,
    totalProductsCount: 61,
  });

  // Fetch live stats from backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/dashboard-stats`)
      .then((res) => {
        if (!res.ok) throw new Error("Dashboard stats failed");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setStats({
            totalSales: data.totalSales || 21794,
            totalOrdersCount: data.totalOrdersCount || 6,
            totalCustomersCount: data.totalCustomersCount || 6,
            totalProductsCount: data.totalProductsCount || 61,
          });
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/products`)
      .then((r) => (r.ok ? r.json() : []))
      .then((prods) => {
        if (Array.isArray(prods) && prods.length > 0) {
          setStats((prev) => ({
            ...prev,
            totalProductsCount: prods.length,
          }));
        }
      })
      .catch(() => {});
  }, []);

  // Store Activity events
  const activities = [
    {
      icon: FiCalendar,
      iconBg: "bg-rose-50 text-rose-500",
      title: "New order #ORD12345 received",
      time: "2 mins ago",
    },
    {
      icon: FiTag,
      iconBg: "bg-emerald-50 text-emerald-500",
      title: 'Product "Mysore Silk Saree" added',
      time: "15 mins ago",
    },
    {
      icon: FiUsers,
      iconBg: "bg-amber-50 text-amber-500",
      title: "Customer Priya Verma registered",
      time: "1 hr ago",
    },
    {
      icon: FiTruck,
      iconBg: "bg-blue-50 text-blue-500",
      title: "Order #ORD12343 shipped",
      time: "3 hrs ago",
    },
    {
      icon: FiImage,
      iconBg: "bg-purple-50 text-purple-500",
      title: 'Banner "Festival Offer" updated',
      time: "5 hrs ago",
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-800">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, Admin! Here's what's happening with your store today.
          </p>
        </div>

        {/* Date Filter Dropdown */}
        <div className="relative self-start sm:self-auto">
          <button
            onClick={() => setShowGlobalDropdown(!showGlobalDropdown)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <FiCalendar className="text-slate-500 text-sm" />
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

      {/* 2. TOP METRIC CARDS (4-Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-rose-500">
            <FiShoppingBag className="text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-slate-500 block">Total Sales</span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              ₹{Number(stats.totalSales).toLocaleString("en-IN")}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-emerald-600 text-xs font-semibold">
              <span>↑ 18.6%</span>
              <span className="text-slate-400 font-normal">vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-500">
            <FiBox className="text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-slate-500 block">Orders</span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              {stats.totalOrdersCount}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-emerald-600 text-xs font-semibold">
              <span>↑ 15.3%</span>
              <span className="text-slate-400 font-normal">vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-500">
            <FiUsers className="text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-slate-500 block">Customers</span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              {stats.totalCustomersCount}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-emerald-600 text-xs font-semibold">
              <span>↑ 11.8%</span>
              <span className="text-slate-400 font-normal">vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 text-purple-500">
            <FiBox className="text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-slate-500 block">Products</span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              {stats.totalProductsCount}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-emerald-600 text-xs font-semibold">
              <span>↑ 8.2%</span>
              <span className="text-slate-400 font-normal">vs last 7 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ROW (Sales Overview & Store Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sales Overview Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-slate-900">Sales Overview</h4>
            <div className="relative">
              <button
                onClick={() => setShowSalesDropdown(!showSalesDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
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
          <div className="relative pt-6 pb-2">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-6 bottom-10 flex flex-col justify-between text-[11px] font-medium text-slate-400 select-none">
              <span>20K</span>
              <span>15K</span>
              <span>10K</span>
              <span>5K</span>
              <span>0</span>
            </div>

            {/* SVG Graph Area */}
            <div className="ml-8 relative h-48 sm:h-52">
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
                
                {/* Active Tooltip Node on 28 Aug */}
                <circle cx="480" cy="62" r="6" fill="#75212e" stroke="#ffffff" strokeWidth="2.5" />
              </svg>

              {/* Tooltip Card */}
              <div
                className="absolute right-0 -top-3 bg-[#75212e] text-white px-3 py-1.5 rounded-lg shadow-md text-xs text-center pointer-events-none transform translate-x-1"
              >
                <div className="font-bold">₹21,794</div>
                <div className="text-[10px] text-rose-200">28 Aug, 2025</div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-[#75212e] rotate-45" />
              </div>
            </div>

            {/* X-Axis Date Labels */}
            <div className="ml-8 mt-3 flex justify-between text-xs text-slate-400 font-medium">
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
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900 mb-5">Store Summary</h4>

            {/* Performance Banner Box */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-rose-50/40 border border-rose-100/60 mb-6">
              <div className="w-13 h-13 rounded-full bg-rose-100/70 flex items-center justify-center flex-shrink-0 text-[#75212e]">
                <FiShoppingBag className="text-2xl" />
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-snug">
                Excellent! Your store is performing great this week.
              </p>
            </div>

            {/* Metric Summary Rows */}
            <div className="space-y-4">
              {/* Average Order Value */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                    <FiShoppingBag className="text-sm" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-600">Average Order Value</span>
                </div>
                <span className="text-sm font-bold text-slate-900">₹3,632</span>
              </div>

              {/* Conversion Rate */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
                    <FiPercent className="text-sm" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-600">Conversion Rate</span>
                </div>
                <span className="text-sm font-bold text-slate-900">3.24%</span>
              </div>

              {/* Repeat Customers */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                    <FiUserCheck className="text-sm" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-600">Repeat Customers</span>
                </div>
                <span className="text-sm font-bold text-slate-900">23</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ROW (Orders by Status, Sales by Category, Store Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Orders by Status Donut */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <h4 className="text-base font-bold text-slate-900 mb-4">Orders by Status</h4>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-auto">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f8fafc" strokeWidth="12" />
                {/* Delivered - Green (37.7%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="12"
                  strokeDasharray="90 149"
                  strokeDashoffset="0"
                />
                {/* Processing - Amber (24.8%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="12"
                  strokeDasharray="59 180"
                  strokeDashoffset="-90"
                />
                {/* Shipped - Blue (21.2%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="12"
                  strokeDasharray="51 188"
                  strokeDashoffset="-149"
                />
                {/* Cancelled - Red (10.6%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="12"
                  strokeDasharray="25 214"
                  strokeDashoffset="-200"
                />
                {/* Pending - Purple (5.7%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="12"
                  strokeDasharray="14 225"
                  strokeDashoffset="-225"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-slate-900 leading-tight">6</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">TOTAL</span>
              </div>
            </div>

            {/* Status Legend */}
            <div className="flex-1 space-y-2 text-xs w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                  <span className="text-slate-600 font-medium">Delivered</span>
                </div>
                <span className="text-slate-700 font-semibold">320 (37.7%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span className="text-slate-600 font-medium">Processing</span>
                </div>
                <span className="text-slate-700 font-semibold">210 (24.8%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                  <span className="text-slate-600 font-medium">Shipped</span>
                </div>
                <span className="text-slate-700 font-semibold">180 (21.2%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span className="text-slate-600 font-medium">Cancelled</span>
                </div>
                <span className="text-slate-700 font-semibold">90 (10.6%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                  <span className="text-slate-600 font-medium">Pending</span>
                </div>
                <span className="text-slate-700 font-semibold">48 (5.7%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sales by Category Donut */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <h4 className="text-base font-bold text-slate-900 mb-4">Sales by Category</h4>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-auto">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f8fafc" strokeWidth="12" />
                {/* Silk Sarees - Maroon 45% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#75212e"
                  strokeWidth="12"
                  strokeDasharray="107 132"
                  strokeDashoffset="0"
                />
                {/* Cotton Sarees - Orange 25% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="12"
                  strokeDasharray="60 179"
                  strokeDashoffset="-107"
                />
                {/* Paithani Sarees - Green 15% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray="36 203"
                  strokeDashoffset="-167"
                />
                {/* Georgette Sarees - Blue 10% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="12"
                  strokeDasharray="24 215"
                  strokeDashoffset="-203"
                />
                {/* Organza Sarees - Purple 5% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="12"
                  strokeDasharray="12 227"
                  strokeDashoffset="-227"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1">
                <span className="text-xs font-bold text-slate-900 leading-tight">₹21,794</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">TOTAL</span>
              </div>
            </div>

            {/* Category Legend */}
            <div className="flex-1 space-y-2 text-xs w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#75212e]" />
                  <span className="text-slate-600 font-medium">Silk Sarees</span>
                </div>
                <span className="text-slate-700 font-semibold">45%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                  <span className="text-slate-600 font-medium">Cotton Sarees</span>
                </div>
                <span className="text-slate-700 font-semibold">25%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-slate-600 font-medium">Paithani Sarees</span>
                </div>
                <span className="text-slate-700 font-semibold">15%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                  <span className="text-slate-600 font-medium">Georgette Sarees</span>
                </div>
                <span className="text-slate-700 font-semibold">10%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                  <span className="text-slate-600 font-medium">Organza Sarees</span>
                </div>
                <span className="text-slate-700 font-semibold">5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Activity Timeline */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-slate-900">Store Activity</h4>
          </div>

          <div className="space-y-3.5 my-auto">
            {activities.map((act, index) => {
              const Icon = act.icon;
              return (
                <div key={index} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${act.iconBg}`}
                    >
                      <Icon className="text-xs" />
                    </div>
                    <p className="text-xs text-slate-800 font-medium truncate">{act.title}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap font-normal">
                    {act.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
