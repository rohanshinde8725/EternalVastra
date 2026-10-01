import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome, FiShoppingBag, FiHeart, FiMapPin, FiUser, FiLogOut, FiCamera,
  FiShield, FiMenu, FiX, FiArrowRight, FiStar
} from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { API_BASE_URL, resolveImageUrl } from "../../api/products";
import Logo from "../../components/common/Logo";
import { getStoredUser, isAuthenticated, loginUserSession, logout } from "../../utils/auth";
import { useToast } from "../../context/ToastContext";
import FadeUp from "../../components/animations/FadeUp";

const getUserAvatarUrl = (userOrAvatar, userName = "Patron") => {
  const avatar = typeof userOrAvatar === "object" ? userOrAvatar?.avatar : userOrAvatar;
  const name = typeof userOrAvatar === "object" ? userOrAvatar?.name || userName : userName;

  if (avatar && avatar !== "/images/default-avatar.webp" && !avatar.includes("testimonial-1.webp")) {
    return resolveImageUrl(avatar);
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Patron")}&background=74202D&color=FFFFFF&bold=true&size=128`;
};

const navItems = [
  { path: "/profile", label: "Dashboard", icon: FiHome, end: true },
  { path: "/profile/orders", label: "My Orders", icon: FiShoppingBag },
  { path: "/wishlist", label: "Wishlist", icon: FiHeart, external: true },
  { path: "/cart", label: "Cart", icon: HiOutlineShoppingBag, external: true },
  { path: "/profile/reviews", label: "My Reviews", icon: FiStar, hasBadge: true },
  { path: "/profile/addresses", label: "Address Book", icon: FiMapPin },
  { path: "/profile/account", label: "Account Details", icon: FiUser },
  { path: "/profile/security", label: "Security & Password", icon: FiShield },
];

const UserLayout = () => {
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(() => getStoredUser());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userReviewsCount, setUserReviewsCount] = useState(0);

  // Sync user profile from backend
  useEffect(() => {
    const rawUser = getStoredUser();
    if (!isAuthenticated(rawUser)) {
      navigate("/signin", { replace: true, state: { from: location } });
      return;
    }
    setUser(rawUser);

    const userId = rawUser._id || rawUser.id;
    if (userId) {
      fetch(`${API_BASE_URL}/api/users/profile/${userId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.user) {
            const updated = { ...rawUser, ...data.user };
            setUser(updated);
            loginUserSession(updated);
          }
        })
        .catch(() => {});
    }
  }, [location.pathname, navigate]);

  // Fetch reviews count for live badge
  useEffect(() => {
    const loadReviewsCount = () => {
      const currentUser = getStoredUser();
      if (!currentUser) return;

      fetch(`${API_BASE_URL}/api/admin/reviews`)
        .then((res) => (res.ok ? res.json() : []))
        .then((allReviews) => {
          if (Array.isArray(allReviews)) {
            const uId = currentUser._id || currentUser.id;
            const uEmail = currentUser.email?.trim().toLowerCase();
            const uName = currentUser.name?.trim().toLowerCase();

            const myReviews = allReviews.filter((r) => {
              if (r.status === "Hidden") return false;
              return (
                (uId && r.userId === uId) ||
                (uEmail && r.email?.trim().toLowerCase() === uEmail) ||
                (uName && r.reviewer?.trim().toLowerCase() === uName)
              );
            });
            setUserReviewsCount(myReviews.length);
          }
        })
        .catch(() => {});
    };

    loadReviewsCount();
    window.addEventListener("reviewsUpdated", loadReviewsCount);
    window.addEventListener("userUpdated", loadReviewsCount);
    return () => {
      window.removeEventListener("reviewsUpdated", loadReviewsCount);
      window.removeEventListener("userUpdated", loadReviewsCount);
    };
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const currentUser = getStoredUser();
    const userId = currentUser?._id || currentUser?.id;
    if (!userId) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}/avatar`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok && data.avatar) {
        const updatedUser = { ...currentUser, avatar: data.avatar };
        setUser(updatedUser);
        loginUserSession(updatedUser);
        window.dispatchEvent(new Event("userUpdated"));
        showToast.success("Profile photo updated successfully!");
      } else {
        showToast.error(data.message || "Failed to update profile photo.");
      }
    } catch {
      showToast.error("Failed to upload avatar.");
    }
  };

  const handleSignOut = () => {
    logout();
    showToast.success("Signed out successfully.");
    navigate("/signin");
  };

  if (!user) return null;

  // Derive current page title for breadcrumb
  const isDashboard = location.pathname === "/profile" || location.pathname === "/profile/dashboard";
  const matchedNav = navItems.find((item) =>
    item.end ? location.pathname === item.path : location.pathname.startsWith(item.path)
  );
  const pageTitle = isDashboard ? `Welcome back, ${user.name}` : matchedNav?.label || "My Account";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDF9F6] font-sans">
      {/* Sidebar */}
      <aside className="w-full lg:w-[280px] xl:w-[300px] bg-[#74202D] text-white flex flex-col justify-between shrink-0 lg:min-h-screen lg:sticky lg:top-0 shadow-lg z-20">
        <div className="p-6 md:p-8 md:pb-6 border-b border-[#8c2a38] flex items-center justify-between lg:justify-start gap-4 min-w-0 w-full">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="relative group w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
              <img
                src={getUserAvatarUrl(user.avatar, user.name)}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/default-avatar.webp";
                }}
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <FiCamera className="text-xl text-white" />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-white truncate">{user.name}</h3>
              <p className="text-xs text-rose-200/80 font-medium truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition cursor-pointer"
          >
            {isMobileMenuOpen ? <FiX className="text-xl text-white" /> : <FiMenu className="text-xl text-white" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav
          className={`py-4 lg:py-6 px-4 flex flex-col gap-1.5 transition-all duration-300 ${
            isMobileMenuOpen ? "flex" : "hidden lg:flex"
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.external) {
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all"
                >
                  <Icon className="text-lg lg:text-xl shrink-0 text-white" />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `cursor-pointer shrink-0 w-full flex items-center justify-between px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold transition-all ${
                    isActive
                      ? "bg-white/10 text-white shadow-md border border-white/10"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <div className="flex items-center gap-3 lg:gap-3.5">
                  <Icon className="text-lg lg:text-xl shrink-0 text-white" />
                  <span>{item.label}</span>
                </div>
                {item.hasBadge && userReviewsCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                    {userReviewsCount}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="hidden lg:block pt-4 pb-1">
            <div className="h-px bg-white/10"></div>
          </div>

          <button
            onClick={handleSignOut}
            className="cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold text-white/70 hover:bg-white/10 hover:text-rose-300 transition-all"
          >
            <FiLogOut className="text-lg lg:text-xl shrink-0 text-white" />
            <span>Logout</span>
          </button>
        </nav>

        {/* Bottom Website Link / Logo Branding */}
        <div className="p-4 lg:p-6 border-t border-[#8c2a38] mt-auto flex flex-col items-center justify-center text-center bg-[#631824]/40">
          <Link
            to="/"
            className="group flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all duration-300 w-full shadow-xs hover:shadow-md hover:scale-[1.02] cursor-pointer"
            title="Open Website Homepage"
          >
            <div className="bg-white px-3.5 py-1.5 rounded-xl shadow-sm inline-flex items-center justify-center mb-2 group-hover:bg-amber-50/95 transition-colors">
              <Logo className="h-7 sm:h-8 w-auto" to="" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-100 group-hover:text-white transition-colors">
              <span>Back to Store Website</span>
              <FiArrowRight className="text-sm text-white group-hover:translate-x-1 transition-transform" />
            </div>
            <span className="text-[10px] text-rose-200/70 mt-0.5 tracking-wider uppercase font-medium">
              Click to open website
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area with Outlet */}
      <main className="flex-1 p-4 sm:p-8 md:p-10 lg:p-12 overflow-y-auto min-w-0 w-full">
        <FadeUp delay={0.1} className="w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 xl:mb-10">
            <div>
              <p className="text-sm text-slate-500 mb-1">{isDashboard ? "Welcome back," : "My Account"}</p>
              <h1 className="text-3xl sm:text-4xl font-serif text-[#74202D] font-bold">
                {isDashboard ? user.name : pageTitle}
              </h1>
              <div className="flex items-center gap-2 mt-3">
                <svg className="w-4 h-4 text-[#74202D]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C12 2 12 8 8 12C12 16 12 22 12 22C12 22 12 16 16 12C12 8 12 2 12 2Z" />
                </svg>
                <div className="w-10 h-px bg-[#E5D5C5]"></div>
              </div>
            </div>

            {isDashboard && (
              <div className="relative rounded-2xl overflow-hidden shadow-sm h-24 w-full lg:w-[450px] shrink-0 bg-rose-50 border border-rose-100/50">
                <img
                  src="https://images.unsplash.com/photo-1610189044265-1ebf81393666?w=800&auto=format&fit=crop&q=80"
                  alt="Banner"
                  className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-rose-50 via-rose-50 to-transparent"></div>
                <div className="absolute inset-0 p-5 flex flex-col justify-center">
                  <h3 className="font-serif text-[#74202D] text-lg leading-tight">
                    Timeless Sarees<br />for Every Moment
                  </h3>
                  <p className="text-[10px] text-slate-600 font-medium tracking-wide mt-2">
                    Elegance &bull; Tradition &bull; You
                  </p>
                </div>
              </div>
            )}
          </div>
        </FadeUp>

        {/* Nested Child Route Content */}
        <Outlet context={{ user, setUser, userReviewsCount }} />
      </main>
    </div>
  );
};

export default UserLayout;
