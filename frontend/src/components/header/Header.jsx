import { useState, useEffect, useRef } from "react";
import {
  FiHome,
  FiSearch,
  FiHeart,
  FiUser,
  FiShoppingBag,
  FiLogOut,
  FiShield,
  FiX,
  FiCheck,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { HiOutlineShoppingBag, HiMenu, HiX } from "react-icons/hi";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

const Header = () => {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const userMenuRef = useRef(null);
  const desktopSearchContainerRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const desktopSearchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Load authenticated user & cart/wishlist
  const loadUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("eternal_user"));
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };

    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlistCount(wishlist.length);
    };

    updateCartCount();
    updateWishlistCount();

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("wishlistUpdated", updateWishlistCount);
    window.addEventListener("userUpdated", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
      window.removeEventListener("userUpdated", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (
        desktopSearchContainerRef.current &&
        !desktopSearchContainerRef.current.contains(e.target)
      ) {
        setIsDesktopSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchTerm(query);
  }, [location.search, searchParams]);

  useEffect(() => {
    if (isSearchModalOpen && mobileSearchInputRef.current) {
      setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
    }
  }, [isSearchModalOpen]);

  useEffect(() => {
    if (isDesktopSearchOpen && desktopSearchInputRef.current) {
      setTimeout(() => desktopSearchInputRef.current?.focus(), 100);
    }
  }, [isDesktopSearchOpen]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    const searchPath = trimmed ? `/shop?search=${encodeURIComponent(trimmed)}` : "/shop";
    navigate(searchPath);
    setIsSearchModalOpen(false);
    setIsDesktopSearchOpen(false);
  };

  const handleQuickTagClick = (tag) => {
    setSearchTerm(tag);
    navigate(`/shop?search=${encodeURIComponent(tag)}`);
    setIsSearchModalOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("eternal_user");
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    showToast.info("Signed out of your account successfully.");
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/");
  };

  const handleAccountClick = () => {
    if (!currentUser) {
      navigate("/signin");
    } else {
      setIsProfileModalOpen(true);
    }
  };

  // Check active paths
  const isActivePath = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP STICKY NAVBAR (DESKTOP & MOBILE HEADER) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-[#FEFAF8]/95 backdrop-blur-md border-b border-rose-100/60 shadow-xs transition-all">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* LEFT: BRAND LOGO */}
          <Link to="/" className="flex items-center flex-shrink-0 group">
            <img
              src="/images/navImg2.png"
              alt="Eternal Vastra"
              loading="eager"
              decoding="async"
              className="h-11 sm:h-14 lg:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* CENTER: DESKTOP NAVIGATION MENU (PROPERLY ALIGNED WITH BLOG PAGE) */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-4">
            <ul className="flex items-center gap-7 xl:gap-11 uppercase text-sm font-semibold tracking-wide">
              <li>
                <Link
                  to="/"
                  className={`relative py-1.5 transition-all duration-200 ${
                    isActivePath("/")
                      ? "text-[#6B1527] font-bold"
                      : "text-slate-700 hover:text-[#6B1527]"
                  }`}
                >
                  Home
                  {isActivePath("/") && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6B1527] rounded-full" />
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`relative py-1.5 transition-all duration-200 ${
                    isActivePath("/about")
                      ? "text-[#6B1527] font-bold"
                      : "text-slate-700 hover:text-[#6B1527]"
                  }`}
                >
                  About
                  {isActivePath("/about") && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6B1527] rounded-full" />
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className={`relative py-1.5 transition-all duration-200 ${
                    isActivePath("/shop")
                      ? "text-[#6B1527] font-bold"
                      : "text-slate-700 hover:text-[#6B1527]"
                  }`}
                >
                  Shop
                  {isActivePath("/shop") && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6B1527] rounded-full" />
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className={`relative py-1.5 transition-all duration-200 ${
                    isActivePath("/blog")
                      ? "text-[#6B1527] font-bold"
                      : "text-slate-700 hover:text-[#6B1527]"
                  }`}
                >
                  Blog
                  {isActivePath("/blog") && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6B1527] rounded-full" />
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`relative py-1.5 transition-all duration-200 ${
                    isActivePath("/contact")
                      ? "text-[#6B1527] font-bold"
                      : "text-slate-700 hover:text-[#6B1527]"
                  }`}
                >
                  Contact Us
                  {isActivePath("/contact") && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6B1527] rounded-full" />
                  )}
                </Link>
              </li>
            </ul>
          </nav>

          {/* RIGHT: ACTION CONTROLS (EXPANDABLE SEARCH ON CLICK) */}
          <div className="flex items-center flex-shrink-0">
            
            {/* Desktop Expandable Search Bar */}
            <div className="hidden lg:flex items-center" ref={desktopSearchContainerRef}>
              {isDesktopSearchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative flex items-center w-64 xl:w-72 animate-in fade-in zoom-in-95 duration-200"
                >
                  <input
                    ref={desktopSearchInputRef}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="text"
                    placeholder="Search sarees..."
                    className="w-full bg-white border border-slate-300 rounded-full pl-4 pr-16 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#6B1527] focus:ring-2 focus:ring-[#6B1527]/15 shadow-sm transition"
                  />
                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#6B1527] transition cursor-pointer"
                  >
                    <FiSearch className="text-base" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDesktopSearchOpen(false)}
                    aria-label="Close search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  >
                    <FiX className="text-base" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsDesktopSearchOpen(true)}
                  aria-label="Open Search"
                  title="Search Store"
                  className="p-2.5 rounded-full text-slate-700 hover:text-[#6B1527] hover:bg-rose-50/60 transition cursor-pointer"
                >
                  <FiSearch className="text-xl" />
                </button>
              )}
            </div>

            {/* Desktop Wishlist Icon */}
            <Link
              to="/wishlist"
              className="hidden lg:flex p-2.5 rounded-full text-slate-700 hover:text-[#6B1527] hover:bg-rose-50/60 transition cursor-pointer"
              title="Saved Sarees"
            >
              <div className="relative">
                <FiHeart className="text-xl" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#6B1527] text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Desktop Cart Icon */}
            <Link
              to="/cart"
              className="hidden lg:flex p-2.5 rounded-full text-slate-700 hover:text-[#6B1527] hover:bg-rose-50/60 transition cursor-pointer"
              title="Shopping Cart"
            >
              <div className="relative">
                <HiOutlineShoppingBag className="text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#6B1527] text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Desktop User Profile Button & Dropdown */}
            <div className="hidden lg:block relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  if (!currentUser) navigate("/signin");
                  else setIsUserMenuOpen((prev) => !prev);
                }}
                className="p-2.5 rounded-full text-slate-700 hover:text-[#74202D] hover:bg-rose-50/60 transition cursor-pointer flex items-center justify-center"
                title={currentUser ? currentUser.name : "Sign In"}
                aria-label={currentUser ? "Account Profile" : "Sign In"}
              >
                <FiUser className="text-xl" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && currentUser && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-slate-100 shadow-2xl p-2.5 z-50 text-sm animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3.5 bg-gradient-to-br from-[#74202D] via-[#5B131F] to-[#400B15] rounded-xl text-white mb-2 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-amber-200 text-sm flex-shrink-0">
                        {currentUser.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm truncate leading-tight">{currentUser.name}</h4>
                          {currentUser.role === "admin" && (
                            <span className="text-[9px] bg-amber-400/25 text-amber-200 border border-amber-300/40 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-rose-200/80 truncate mt-0.5">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-rose-50 hover:text-[#74202D] transition cursor-pointer font-medium group"
                    >
                      <div className="flex items-center gap-2.5">
                        <FiUser className="text-slate-400 group-hover:text-[#74202D] text-base transition" />
                        <span>My Profile Details</span>
                      </div>
                      <span className="text-slate-300 group-hover:text-[#74202D] text-xs">→</span>
                    </button>

                    {currentUser.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-50/80 text-amber-950 font-semibold hover:bg-amber-100/90 border border-amber-200/60 transition group"
                      >
                        <div className="flex items-center gap-2.5">
                          <FiShield className="text-amber-700 text-base" />
                          <span>Admin Control Portal</span>
                        </div>
                        <span className="text-amber-600 group-hover:translate-x-0.5 transition text-xs font-bold">→</span>
                      </Link>
                    )}

                    <div className="pt-1.5 border-t border-slate-100 mt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-rose-700 hover:bg-rose-50 font-semibold transition cursor-pointer"
                      >
                        <FiLogOut className="text-rose-500 text-base" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Top Header: Search Icon Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              aria-label="Search"
              className="lg:hidden p-2 rounded-full text-slate-700 hover:text-[#6B1527] hover:bg-rose-50 transition cursor-pointer"
            >
              <FiSearch className="text-2xl" />
            </button>

            {/* Mobile Top Header: Hamburger Menu Button */}
            <button
              type="button"
              aria-label="Open Navigation Menu"
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-800 hover:bg-rose-50 transition cursor-pointer"
            >
              <HiMenu className="text-2xl" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MOBILE & TABLET BOTTOM NAVIGATION BAR (MATCHING USER SCREENSHOT) */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] py-2 px-1"
      >
        <div className="mx-auto grid grid-cols-5 items-center text-center">
          
          {/* 1. HOME */}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-1 transition-all duration-200 ${
              isActivePath("/")
                ? "text-[#6B1527] font-bold"
                : "text-slate-600 hover:text-[#6B1527]"
            }`}
          >
            <FiHome className={`text-xl ${isActivePath("/") ? "stroke-[2.5]" : ""}`} />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mt-1">
              Home
            </span>
          </Link>

          {/* 2. SEARCH */}
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-slate-600 hover:text-[#6B1527] transition-all duration-200 cursor-pointer"
          >
            <FiSearch className="text-xl" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mt-1">
              Search
            </span>
          </button>

          {/* 3. WISHLIST */}
          <Link
            to="/wishlist"
            className={`relative flex flex-col items-center justify-center py-1 transition-all duration-200 ${
              isActivePath("/wishlist")
                ? "text-[#6B1527] font-bold"
                : "text-slate-600 hover:text-[#6B1527]"
            }`}
          >
            <div className="relative">
              <FiHeart className={`text-xl ${isActivePath("/wishlist") ? "fill-[#6B1527] text-[#6B1527]" : ""}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#6B1527] text-white text-[9px] font-bold min-w-3.5 h-3.5 px-0.5 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mt-1">
              Wishlist
            </span>
          </Link>

          {/* 4. CART */}
          <Link
            to="/cart"
            className={`relative flex flex-col items-center justify-center py-1 transition-all duration-200 ${
              isActivePath("/cart")
                ? "text-[#6B1527] font-bold"
                : "text-slate-600 hover:text-[#6B1527]"
            }`}
          >
            <div className="relative">
              <HiOutlineShoppingBag className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#6B1527] text-white text-[9px] font-bold min-w-3.5 h-3.5 px-0.5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mt-1">
              Cart
            </span>
          </Link>

          {/* 5. ACCOUNT */}
          <button
            type="button"
            onClick={handleAccountClick}
            className={`flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer ${
              isActivePath("/signin") || isActivePath("/signup")
                ? "text-[#6B1527] font-bold"
                : "text-slate-600 hover:text-[#6B1527]"
            }`}
          >
            <FiUser className="text-xl" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mt-1">
              Account
            </span>
          </button>

        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 3. MOBILE SEARCH MODAL / OVERLAY */}
      {/* ========================================================================= */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-20 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-slate-800">
                <FiSearch className="text-[#6B1527] text-lg" />
                <h3 className="font-bold text-base">Search Store</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative mb-5">
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search authentic sarees, silk, cotton..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#6B1527] focus:bg-white transition"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#6B1527] text-white text-xs font-semibold hover:bg-[#7E1A2E] transition cursor-pointer"
              >
                Search
              </button>
            </form>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Silk Sarees",
                  "Paithani Sarees",
                  "Cotton Sarees",
                  "Organza Sarees",
                  "Georgette Sarees",
                  "Banarasi Sarees",
                  "New Arrivals",
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickTagClick(tag)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-[#6B1527] text-slate-700 text-xs font-semibold transition cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MOBILE NAVIGATION DRAWER */}
      {/* ========================================================================= */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] sm:w-[70%] max-w-[320px] bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top Section */}
        <div>
          {/* Close Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <span className="font-bold text-slate-800 text-sm">Navigation Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition text-xl cursor-pointer"
            >
              <HiX />
            </button>
          </div>

          <div className="p-5">
            {/* User Greeting if Logged in */}
            {currentUser ? (
              <div className="p-4 bg-gradient-to-br from-[#6B1527] to-[#450C16] text-white rounded-2xl mb-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-amber-200 text-base">
                    {currentUser.name?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm truncate">{currentUser.name}</div>
                    <div className="text-xs text-rose-200/90 truncate">{currentUser.email}</div>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="text-xs font-semibold text-amber-200 hover:underline cursor-pointer"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                    className="text-xs font-semibold text-rose-200 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <FiLogOut className="text-xs" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-rose-50/80 rounded-2xl mb-5 border border-rose-100">
                <p className="text-xs text-slate-600 mb-3 font-medium">
                  Sign in to track orders, save your wishlist, and get exclusive member deals.
                </p>
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-2.5 px-4 rounded-xl bg-[#6B1527] text-white font-semibold text-xs shadow-xs hover:bg-[#7E1A2E] transition"
                >
                  Sign In / Register
                </Link>
              </div>
            )}

            {/* Menu Links */}
            <ul className="flex flex-col gap-1 text-base font-semibold text-slate-800">
              <li>
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-rose-50 hover:text-[#6B1527] transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-rose-50 hover:text-[#6B1527] transition"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-rose-50 hover:text-[#6B1527] transition"
                >
                  Shop Sarees
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-rose-50 hover:text-[#6B1527] transition"
                >
                  Blog & Heritage Stories
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-rose-50 hover:text-[#6B1527] transition"
                >
                  Contact Us
                </Link>
              </li>
              {currentUser?.role === "admin" && (
                <li>
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block py-2.5 px-3 rounded-xl bg-amber-50 text-amber-900 font-bold transition mt-2"
                  >
                    Admin Control Portal
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer in Drawer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 text-center">
          <p>© 2026 Eternal Vastra — Elegance Eternal</p>
        </div>
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* 5. PATRON PROFILE DETAILS MODAL */}
      {/* ========================================================================= */}
      {isProfileModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="text-base font-bold text-slate-800">My Patron Profile</h4>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-[#6B1527] text-amber-300 font-bold text-lg flex items-center justify-center flex-shrink-0">
                  {currentUser.name?.charAt(0) || "P"}
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">{currentUser.name}</h5>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6B1527] text-white">
                    {currentUser.role === "admin" ? "Super Admin" : "Verified Customer"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                  <FiMail className="text-[#6B1527] text-sm" />
                  <span className="font-medium truncate">{currentUser.email}</span>
                </div>
                {currentUser.phone && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                    <FiPhone className="text-[#6B1527] text-sm" />
                    <span className="font-medium">{currentUser.phone}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    handleSignOut();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 transition cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;