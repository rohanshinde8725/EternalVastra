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
import Logo from "../../components/common/Logo";

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
        <div className="relative z-20 p-6 pb-2">
          {/* Logo Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center mx-auto bg-white/95 px-4 py-2 rounded-2xl shadow-sm border border-white/20 hover:bg-white hover:scale-105 transition-all duration-300">
              <Logo className="h-8 sm:h-9 w-auto" to="/" />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white p-1.5 rounded-md"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          {/* Admin User Profile Card */}
          <div className="mt-7 mb-4 relative">
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all duration-200 backdrop-blur-sm"
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
                    className="w-11 h-11 rounded-full object-cover border-2 border-amber-300/50 shadow-sm"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#540F1D] rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold text-white">Admin</span>
                    <FiChevronDown className="text-sm text-amber-200/90" />
                  </div>
                  <span className="text-xs text-amber-200/80 font-medium block">Super Admin</span>
                </div>
              </div>
            </div>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#440C16] border border-white/15 rounded-xl shadow-2xl p-2 z-50 text-sm">
                <Link
                  to="/admin/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="block px-3.5 py-2.5 text-rose-100 hover:bg-white/10 rounded-lg transition font-medium"
                >
                  My Profile
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="block px-3.5 py-2.5 text-rose-100 hover:bg-white/10 rounded-lg transition font-medium"
                >
                  Account Settings
                </Link>
                <div className="my-1.5 border-t border-white/10" />
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-rose-300 hover:bg-red-500/20 rounded-lg transition font-medium cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="relative z-10 flex-1 px-4 py-3 overflow-y-auto custom-admin-scroll space-y-1.5">
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
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#7E1A2E] text-white shadow-md shadow-black/20 border border-white/15"
                    : "text-rose-100/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className={`text-xl shrink-0 ${isActive ? "text-amber-300" : "text-rose-200/80"}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Actions & Logout */}
        <div className="relative z-10 p-4 border-t border-white/10 mt-auto">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-[15px] font-semibold text-rose-100/80 hover:text-white hover:bg-white/10 transition duration-200 cursor-pointer"
          >
            <FiLogOut className="text-xl text-rose-300" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Scrollable Page Outlet Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#F8F9FA] custom-admin-scroll text-sm">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-7 border border-slate-200">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-[#6B1527] mb-4">
              <FiLogOut className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Exit Admin Console?</h3>
            <p className="text-sm text-slate-600 mt-1.5 mb-6">
              You will be redirected back to the Eternal Vastra storefront.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl bg-[#6B1527] text-white text-sm font-semibold hover:bg-[#7E1A2E] transition shadow-sm cursor-pointer"
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
