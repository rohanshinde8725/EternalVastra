import React, { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiShoppingBag,
  FiBox,
  FiTag,
  FiUsers,
  FiStar,
  FiImage,
  FiTrash2,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiPlus,
  FiCalendar,
  FiChevronDown,
  FiCheck,
} from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: FiGrid, exact: true },
  { path: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { path: "/admin/products", label: "Products", icon: FiBox },
  { path: "/admin/categories", label: "Categories", icon: FiTag },
  { path: "/admin/customers", label: "Customers", icon: FiUsers },
  { path: "/admin/reviews", label: "Reviews", icon: FiStar },
  { path: "/admin/banners", label: "Banners", icon: FiImage },
  { path: "/admin/recycle-bin", label: "Recycle Bin", icon: FiTrash2 },
  { path: "/admin/settings", label: "Settings", icon: FiSettings },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState("28 Aug, 2026");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Determine current page title
  const currentNavItem = navItems.find((item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
  );
  const pageTitle = currentNavItem ? currentNavItem.label : "Admin";

  const handleLogout = () => {
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-slate-800 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          background: "linear-gradient(180deg, #6B1527 0%, #540F1D 60%, #3D0A14 100%)",
        }}
      >
        {/* Mandala Watermark Background Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07] bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='40' cy='40' r='18' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Ccircle cx='40' cy='40' r='30' fill='none' stroke='%23ffffff' stroke-width='1' stroke-dasharray='3 3'/%3E%3Cpath d='M40 10 C42 25 45 25 40 40 C35 25 38 25 40 10 Z' /%3E%3Cpath d='M40 70 C42 55 45 55 40 40 C35 55 38 55 40 70 Z' /%3E%3Cpath d='M10 40 C25 42 25 45 40 40 C25 35 25 38 10 40 Z' /%3E%3Cpath d='M70 40 C55 42 55 45 40 40 C55 35 55 38 70 40 Z' /%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Top Branding & Admin Profile */}
        <div className="relative z-10 p-6 pb-2">
          {/* Logo Header */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center mx-auto text-center">
              {/* Gold Mandala Emblem */}
              <div className="w-9 h-9 mb-1.5 flex items-center justify-center text-amber-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 opacity-90 drop-shadow-sm">
                  <path d="M12 2L13.5 6.5L18 8L13.5 9.5L12 14L10.5 9.5L6 8L10.5 6.5L12 2Z" />
                  <path d="M12 14L13 17.5L16.5 18.5L13 19.5L12 23L11 19.5L7.5 18.5L11 17.5L12 14Z" opacity="0.6" />
                  <circle cx="12" cy="12" r="2" fill="white" />
                </svg>
              </div>
              <h1 className="text-xl font-serif font-bold tracking-[0.25em] text-white uppercase drop-shadow-sm">
                SAREE
              </h1>
              <p className="text-[9px] tracking-[0.28em] text-amber-200/80 uppercase font-light mt-0.5">
                — ELEGANCE ETERNAL —
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white p-1 rounded-md"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Admin User Profile Card */}
          <div className="mt-7 mb-4 relative">
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all duration-200 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={`${API_BASE_URL}/images/testimonial/testimonial-1.png`}
                    alt="Admin Avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";
                    }}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-300/40 shadow-sm"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#540F1D] rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white">Admin</span>
                    <FiChevronDown className="text-xs text-amber-200/80" />
                  </div>
                  <span className="text-[11px] text-amber-200/70 font-medium block">Super Admin</span>
                </div>
              </div>
            </div>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#440C16] border border-white/15 rounded-xl shadow-xl p-2 z-50 text-xs">
                <Link
                  to="/admin/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="block px-3 py-2 text-rose-100 hover:bg-white/10 rounded-lg transition"
                >
                  My Profile
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="block px-3 py-2 text-rose-100 hover:bg-white/10 rounded-lg transition"
                >
                  Account Settings
                </Link>
                <div className="my-1 border-t border-white/10" />
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-300 hover:bg-red-500/20 rounded-lg transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="relative z-10 flex-1 px-4 py-2 overflow-y-auto custom-admin-scroll space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#7E1A2E] text-white shadow-md shadow-black/20 border border-white/15"
                    : "text-rose-100/75 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className={`text-lg shrink-0 ${isActive ? "text-amber-300" : "text-rose-200/70"}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Actions & Logout */}
        <div className="relative z-10 p-4 border-t border-white/10 mt-auto">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-medium text-rose-100/80 hover:text-white hover:bg-white/10 transition duration-200"
          >
            <FiLogOut className="text-lg text-rose-300" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            >
              <FiMenu className="text-xl" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{pageTitle}</h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                Welcome back, Admin! Here's what's happening with your store. 👋
              </p>
            </div>
          </div>

          {/* Header Controls: Date Picker & + Add New */}
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs md:text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-xs transition"
              >
                <FiCalendar className="text-slate-400 text-sm" />
                <span>{dateRange}</span>
                <FiChevronDown className="text-slate-400 text-xs ml-1" />
              </button>

              {showDatePicker && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 text-xs">
                  {["Today", "28 Aug, 2026", "Last 7 Days", "Last 30 Days", "This Quarter", "This Year"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setDateRange(opt);
                        setShowDatePicker(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-between"
                    >
                      {opt}
                      {dateRange === opt && <FiCheck className="text-[#6B1527]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* + Add New Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded bg-[#6B1527] hover:bg-white border-2 border-[#6B1527]
                text-white text-xs md:text-sm font-medium shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer "
              >
                <FiPlus className="text-base" />
                <span>Add New</span>
                <FiChevronDown className="text-xs opacity-80 ml-0.5" />
              </button>

              {showAddMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-xs">
                  <Link
                    to="/admin/products"
                    onClick={() => setShowAddMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-rose-50 hover:text-[#6B1527] transition"
                  >
                    <FiBox className="text-slate-400" />
                    <span>New Saree Product</span>
                  </Link>
                  <Link
                    to="/admin/categories"
                    onClick={() => setShowAddMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-rose-50 hover:text-[#6B1527] transition"
                  >
                    <FiTag className="text-slate-400" />
                    <span>New Category</span>
                  </Link>
                  <Link
                    to="/admin/banners"
                    onClick={() => setShowAddMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-rose-50 hover:text-[#6B1527] transition"
                  >
                    <FiImage className="text-slate-400" />
                    <span>Promotional Banner</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Page Outlet Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#F8F9FA] custom-admin-scroll">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-[#6B1527] mb-4">
              <FiLogOut className="text-xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Exit Admin Console?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              You will be redirected back to the Eternal Vastra storefront.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-[#6B1527] text-white text-xs font-semibold hover:bg-[#7E1A2E] transition shadow-sm"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
