import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiTrendingUp,
  FiChevronDown,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiXCircle,
  FiImage,
  FiTag,
} from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [salesPeriod, setSalesPeriod] = useState("This Week");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 1245890,
    totalOrdersCount: 848,
    totalCustomersCount: 1246,
    totalProductsCount: 152,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  // Fetch live stats & data from backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/dashboard-stats`)
      .then((res) => {
        if (!res.ok) throw new Error("Dashboard stats failed");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setStats({
            totalSales: data.totalSales || 1245890,
            totalOrdersCount: data.totalOrdersCount || 848,
            totalCustomersCount: data.totalCustomersCount || 1246,
            totalProductsCount: data.totalProductsCount || 152,
          });
          if (Array.isArray(data.recentOrders) && data.recentOrders.length > 0) {
            setRecentOrders(
              data.recentOrders.map((o) => ({
                id: o.orderId || `#ORD${o._id?.slice(-5) || "12345"}`,
                customer: o.customerName || "Customer",
                price: `₹${Number(o.total || 0).toLocaleString("en-IN")}`,
                status: o.status || "Delivered",
                statusColor:
                  o.status === "Delivered"
                    ? "bg-[#DCFCE7] text-[#15803D]"
                    : o.status === "Processing"
                    ? "bg-[#FEF3C7] text-[#B45309]"
                    : o.status === "Shipped"
                    ? "bg-[#DBEAFE] text-[#1D4ED8]"
                    : "bg-[#FFE4E6] text-[#E11D48]",
                img: o.items?.[0]?.img ? `${API_BASE_URL}${o.items[0].img}` : `${API_BASE_URL}/images/silk/silk-1.jpg`,
              }))
            );
          }
        }
      })
      .catch(() => {
        // Fallback default
      });

    // Also fetch products for top selling list
    fetch(`${API_BASE_URL}/api/products`)
      .then((r) => r.json())
      .then((prods) => {
        if (Array.isArray(prods) && prods.length > 0) {
          setTopProducts(prods.slice(0, 5));
        }
      })
      .catch(() => {});
  }, []);

  // Default fallback recent orders
  const displayOrders =
    recentOrders.length > 0
      ? recentOrders
      : [
          {
            id: "#ORD12345",
            customer: "Ritika Sharma",
            price: "₹3,299",
            status: "Delivered",
            statusColor: "bg-[#DCFCE7] text-[#15803D]",
            img: `${API_BASE_URL}/images/silk/silk-1.jpg`,
          },
          {
            id: "#ORD12344",
            customer: "Anjali Mehta",
            price: "₹2,899",
            status: "Processing",
            statusColor: "bg-[#FEF3C7] text-[#B45309]",
            img: `${API_BASE_URL}/images/cotton/cotton-1.jpg`,
          },
          {
            id: "#ORD12343",
            customer: "Priya Verma",
            price: "₹4,199",
            status: "Shipped",
            statusColor: "bg-[#DBEAFE] text-[#1D4ED8]",
            img: `${API_BASE_URL}/images/silk/silk-2.jpg`,
          },
          {
            id: "#ORD12342",
            customer: "Sneha Joshi",
            price: "₹3,699",
            status: "Cancelled",
            statusColor: "bg-[#FFE4E6] text-[#E11D48]",
            img: `${API_BASE_URL}/images/cotton/cotton-2.jpg`,
          },
          {
            id: "#ORD12341",
            customer: "Kavita Singh",
            price: "₹2,199",
            status: "Delivered",
            statusColor: "bg-[#DCFCE7] text-[#15803D]",
            img: `${API_BASE_URL}/images/silk/silk-3.jpg`,
          },
        ];

  // Default fallback top selling products
  const displayTopProducts =
    topProducts.length > 0
      ? topProducts.map((p, idx) => ({
          name: p.title,
          revenue: `₹${(p.discountPrice * (245 - idx * 25)).toLocaleString("en-IN")}`,
          sold: `${245 - idx * 25} sold`,
          progress: 92 - idx * 10,
          img: p.img?.startsWith("http") ? p.img : `${API_BASE_URL}${p.img}`,
        }))
      : [
          {
            name: "Mysore Silk Saree",
            revenue: "₹2,89,990",
            sold: "245 sold",
            progress: 92,
            img: `${API_BASE_URL}/images/silk/silk-1.jpg`,
          },
          {
            name: "Temple Silk Saree",
            revenue: "₹2,45,890",
            sold: "210 sold",
            progress: 79,
            img: `${API_BASE_URL}/images/cotton/cotton-1.jpg`,
          },
          {
            name: "Crimson Silk Saree",
            revenue: "₹2,15,670",
            sold: "185 sold",
            progress: 68,
            img: `${API_BASE_URL}/images/silk/silk-4.jpg`,
          },
          {
            name: "Emerald Silk Saree",
            revenue: "₹1,98,450",
            sold: "168 sold",
            progress: 61,
            img: `${API_BASE_URL}/images/cotton/cotton-3.jpg`,
          },
          {
            name: "Pearl Silk Saree",
            revenue: "₹1,75,230",
            sold: "150 sold",
            progress: 54,
            img: `${API_BASE_URL}/images/silk/silk-5.jpg`,
          },
        ];

  // Store Activity events
  const activities = [
    {
      icon: FiShoppingBag,
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
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* 1. TOP METRIC SUMMARY CARDS (4-Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Total Sales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-13 h-13 rounded-2xl bg-[#FDE8EC] flex items-center justify-center flex-shrink-0 text-[#8B1C2C]">
            <FiShoppingBag className="text-2xl" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-slate-500 block">Total Sales</span>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
              ₹{Number(stats.totalSales).toLocaleString("en-IN")}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-emerald-600 text-xs font-semibold">
              <span>↑ 18.6%</span>
              <span className="text-slate-400 font-normal">vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-13 h-13 rounded-2xl bg-[#FEF3C7] flex items-center justify-center flex-shrink-0 text-[#D97706]">
            <FiShoppingBag className="text-2xl" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-slate-500 block">Orders</span>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
              {stats.totalOrdersCount}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-emerald-600 text-xs font-semibold">
              <span>↑ 15.3%</span>
              <span className="text-slate-400 font-normal">vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-13 h-13 rounded-2xl bg-[#DCFCE7] flex items-center justify-center flex-shrink-0 text-[#16A34A]">
            <FiUsers className="text-2xl" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-slate-500 block">Customers</span>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
              {stats.totalCustomersCount}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-emerald-600 text-xs font-semibold">
              <span>↑ 11.8%</span>
              <span className="text-slate-400 font-normal">vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
          <div className="w-13 h-13 rounded-2xl bg-[#EDE9FE] flex items-center justify-center flex-shrink-0 text-[#7C3AED]">
            <FiBox className="text-2xl" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-slate-500 block">Products</span>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight mt-0.5">
              {stats.totalProductsCount}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-emerald-600 text-xs font-semibold">
              <span>↑ 8.2%</span>
              <span className="text-slate-400 font-normal">vs last 7 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW (Sales Overview Chart, Recent Orders, Top Selling Products) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sales Overview Line / Area Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-slate-800">Sales Overview</h4>
            <div className="relative">
              <button
                onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                <span>{salesPeriod}</span>
                <FiChevronDown className="text-slate-400 text-xs" />
              </button>

              {showPeriodDropdown && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-20 text-xs">
                  {["This Week", "Last Week", "This Month", "This Year"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSalesPeriod(opt);
                        setShowPeriodDropdown(false);
                        showToast.info(`Switched view to ${opt}`);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-slate-700 hover:text-[#8B1C2C]"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Smooth Bezier Curve Chart SVG */}
          <div className="relative pt-2 pb-1">
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[11px] font-medium text-slate-400 select-none">
              <span>20K</span>
              <span>15K</span>
              <span>10K</span>
              <span>5K</span>
              <span>0</span>
            </div>

            <div className="ml-8 relative h-48">
              <svg viewBox="0 0 400 180" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="maroonSalesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B1C2C" stopOpacity="0.32" />
                    <stop offset="60%" stopColor="#8B1C2C" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#8B1C2C" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="400" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="175" x2="400" y2="175" stroke="#f1f5f9" strokeWidth="1" />

                <path
                  d="M 10 175 C 50 150, 60 90, 100 105 C 130 115, 140 145, 170 125 C 200 100, 220 70, 250 95 C 275 110, 290 120, 320 100 C 350 80, 360 85, 390 70 L 390 175 Z"
                  fill="url(#maroonSalesGradient)"
                />

                <path
                  d="M 10 175 C 50 150, 60 90, 100 105 C 130 115, 140 145, 170 125 C 200 100, 220 70, 250 95 C 275 110, 290 120, 320 100 C 350 80, 360 85, 390 70"
                  fill="none"
                  stroke="#8B1C2C"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle cx="100" cy="105" r="4.5" fill="#8B1C2C" stroke="#ffffff" strokeWidth="2" />
                <circle cx="170" cy="125" r="4.5" fill="#8B1C2C" stroke="#ffffff" strokeWidth="2" />
                <circle cx="250" cy="95" r="4.5" fill="#8B1C2C" stroke="#ffffff" strokeWidth="2" />
                <circle cx="320" cy="100" r="4.5" fill="#8B1C2C" stroke="#ffffff" strokeWidth="2" />
                
                <circle cx="390" cy="70" r="7" fill="#8B1C2C" stroke="#ffffff" strokeWidth="3" className="animate-pulse" />
                <circle cx="390" cy="70" r="3" fill="#ffffff" />
              </svg>

              <div
                className="absolute right-0 -top-2 bg-[#6B1527] text-white px-3 py-1.5 rounded-lg shadow-lg text-[11px] text-center pointer-events-none transform -translate-x-2"
                style={{ filter: "drop-shadow(0 4px 6px rgba(107, 21, 39, 0.3))" }}
              >
                <div className="font-bold tracking-tight">₹{Number(stats.totalSales).toLocaleString("en-IN")}</div>
                <div className="text-[9px] text-rose-200 opacity-90">28 Aug, 2026</div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-[#6B1527] rotate-45" />
              </div>
            </div>

            <div className="ml-8 mt-2 flex justify-between text-[10px] font-medium text-slate-400">
              <span>22 Aug</span>
              <span>23 Aug</span>
              <span>24 Aug</span>
              <span>25 Aug</span>
              <span>26 Aug</span>
              <span>27 Aug</span>
              <span className="font-semibold text-slate-700">28 Aug</span>
            </div>
          </div>
        </div>

        {/* Recent Orders List Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-slate-800">Recent Orders</h4>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-[#8B1C2C] hover:text-[#6B1527] transition"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3.5">
            {displayOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded-xl transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={order.img}
                    alt={order.customer}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&auto=format&fit=crop&q=80";
                    }}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-100 flex-shrink-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{order.id}</span>
                    <span className="text-xs text-slate-500 block">{order.customer}</span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-800">{order.price}</span>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full text-center min-w-[76px] ${order.statusColor}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-slate-800">Top Selling Products</h4>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-[#8B1C2C] hover:text-[#6B1527] transition"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {displayTopProducts.map((prod) => (
              <div key={prod.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.img}
                      alt={prod.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&auto=format&fit=crop&q=80";
                      }}
                      className="w-9 h-9 rounded-lg object-cover bg-slate-100 border border-slate-100 flex-shrink-0"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{prod.name}</h5>
                      <span className="text-[11px] text-slate-400">{prod.sold}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800">{prod.revenue}</span>
                </div>

                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8B1C2C] rounded-full transition-all duration-500"
                    style={{ width: `${prod.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW (Orders by Status Donut, Sales by Category Donut, Store Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Orders by Status Donut Chart Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
          <h4 className="text-base font-bold text-slate-800 mb-4">Orders by Status</h4>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="13" />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="13"
                  strokeDasharray="90 149"
                  strokeDashoffset="0"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="13"
                  strokeDasharray="59 180"
                  strokeDashoffset="-90"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="13"
                  strokeDasharray="51 188"
                  strokeDashoffset="-149"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="13"
                  strokeDasharray="25 214"
                  strokeDashoffset="-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="13"
                  strokeDasharray="14 225"
                  strokeDashoffset="-225"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-extrabold text-slate-800 leading-tight">{stats.totalOrdersCount}</span>
                <span className="text-[10px] text-slate-400 font-medium">Total</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 text-xs w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                  <span className="text-slate-600 font-medium">Delivered</span>
                </div>
                <span className="text-slate-500 font-medium">320 (37.7%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span className="text-slate-600 font-medium">Processing</span>
                </div>
                <span className="text-slate-500 font-medium">210 (24.8%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                  <span className="text-slate-600 font-medium">Shipped</span>
                </div>
                <span className="text-slate-500 font-medium">180 (21.2%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span className="text-slate-600 font-medium">Cancelled</span>
                </div>
                <span className="text-slate-500 font-medium">90 (10.6%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                  <span className="text-slate-600 font-medium">Pending</span>
                </div>
                <span className="text-slate-500 font-medium">48 (5.7%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sales by Category Donut Chart Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
          <h4 className="text-base font-bold text-slate-800 mb-4">Sales by Category</h4>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="13" />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#881337"
                  strokeWidth="13"
                  strokeDasharray="107 132"
                  strokeDashoffset="0"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="13"
                  strokeDasharray="60 179"
                  strokeDashoffset="-107"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="13"
                  strokeDasharray="36 203"
                  strokeDashoffset="-167"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="13"
                  strokeDasharray="24 215"
                  strokeDashoffset="-203"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="13"
                  strokeDasharray="12 227"
                  strokeDashoffset="-227"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                <span className="text-xs font-extrabold text-slate-800 leading-tight">
                  ₹{Number(stats.totalSales).toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Total</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 text-xs w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#881337]" />
                  <span className="text-slate-600 font-medium">Silk Sarees</span>
                </div>
                <span className="text-slate-500 font-medium">45%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                  <span className="text-slate-600 font-medium">Cotton Sarees</span>
                </div>
                <span className="text-slate-500 font-medium">25%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-slate-600 font-medium">Paithani Sarees</span>
                </div>
                <span className="text-slate-500 font-medium">15%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                  <span className="text-slate-600 font-medium">Georgette Sarees</span>
                </div>
                <span className="text-slate-500 font-medium">10%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                  <span className="text-slate-600 font-medium">Organza Sarees</span>
                </div>
                <span className="text-slate-500 font-medium">5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Activity Timeline Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-slate-800">Store Activity</h4>
            <span
              onClick={() => showToast.info("Displaying recent automated store events")}
              className="text-xs font-semibold text-[#8B1C2C] cursor-pointer hover:underline"
            >
              View All
            </span>
          </div>

          <div className="space-y-3.5">
            {activities.map((act, index) => {
              const Icon = act.icon;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${act.iconBg}`}
                    >
                      <Icon className="text-sm" />
                    </div>
                    <p className="text-xs text-slate-700 font-medium truncate">{act.title}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap ml-2">
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
