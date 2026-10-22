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
import Logo from "../common/Logo";
import { isAdmin, logout } from "../../utils/auth";

const Header = () => {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const desktopSearchBtnRef = useRef(null);
  const mobileSearchBtnRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Load authenticated user & cart/wishlist
  const loadUserAndCounts = () => {
    try {
      const user = JSON.parse(localStorage.getItem("eternal_user"));
      setCurrentUser(user);
      if (user && (user.email || user.id || user._id || user.name)) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setCartCount(cart.length);
        setWishlistCount(wishlist.length);
      } else {
        setCartCount(0);
        setWishlistCount(0);
      }
    } catch {
      setCurrentUser(null);
      setCartCount(0);
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    loadUserAndCounts();

    const updateCartCount = () => {
      const rawUser = localStorage.getItem("eternal_user");
      if (!rawUser) {
        setCartCount(0);
        return;
      }
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };

    const updateWishlistCount = () => {
      const rawUser = localStorage.getItem("eternal_user");
      if (!rawUser) {
        setWishlistCount(0);
        return;
      }
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlistCount(wishlist.length);
    };

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("wishlistUpdated", updateWishlistCount);
    window.addEventListener("userUpdated", loadUserAndCounts);
    window.addEventListener("storage", loadUserAndCounts);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
      window.removeEventListener("userUpdated", loadUserAndCounts);
      window.removeEventListener("storage", loadUserAndCounts);
    };
  }, []);

  // Close menus & search on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (
        isSearchOpen &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target) &&
        !desktopSearchBtnRef.current?.contains(e.target) &&
        !mobileSearchBtnRef.current?.contains(e.target)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  // Close search on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 80);
    }
  }, [isSearchOpen]);

  // Close search on page navigation
  useEffect(() => {
    setIsSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchTerm(query);
  }, [location.search, searchParams]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    const searchPath = trimmed ? `/shop?search=${encodeURIComponent(trimmed)}` : "/shop";
    navigate(searchPath);
    setIsSearchOpen(false);
  };

  const handleQuickTagClick = (tag) => {
    setSearchTerm(tag);
    navigate(`/shop?search=${encodeURIComponent(tag)}`);
    setIsSearchOpen(false);
  };

  const handleSignOut = () => {
    logout();
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    showToast.info("Signed out of your account successfully.");
    navigate("/");
  };

  const handleAccountClick = () => {
    if (!currentUser) {
      navigate("/signin");
    } else {
      navigate("/profile");
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast.warning("Please sign in to view your wishlist.");
      navigate("/signin", { state: { from: location } });
    } else {
      navigate("/wishlist");
    }
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast.warning("Please sign in to view your cart.");
      navigate("/signin", { state: { from: location } });
    } else {
      navigate("/cart");
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
          <Logo className="h-10 sm:h-12 lg:h-14" />

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

          {/* RIGHT: ACTION CONTROLS */}
          <div className="flex items-center flex-shrink-0">
            
            {/* Desktop Search Button (Toggles Search Drawer Under Header) */}
            <button
              ref={desktopSearchBtnRef}
              type="button"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              aria-label={isSearchOpen ? "Close Search" : "Open Search"}
              title={isSearchOpen ? "Close Search" : "Search Store"}
              className={`hidden lg:flex p-2.5 rounded-full transition cursor-pointer ${
                isSearchOpen
                  ? "bg-rose-100/80 text-[#6B1527] ring-2 ring-[#6B1527]/20"
                  : "text-slate-700 hover:text-[#6B1527] hover:bg-rose-50/60"
              }`}
            >
              {isSearchOpen ? <FiX className="text-xl" /> : <FiSearch className="text-xl" />}
            </button>

            {/* Desktop Wishlist Icon */}
            <button
              type="button"
              onClick={handleWishlistClick}
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
            </button>

            {/* Desktop Cart Icon */}
            <button
              type="button"
              onClick={handleCartClick}
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
            </button>

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
                          {isAdmin(currentUser) && (
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
                        navigate("/profile");
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

                    {isAdmin(currentUser) && (
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
              ref={mobileSearchBtnRef}
              type="button"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              aria-label={isSearchOpen ? "Close Search" : "Search Store"}
              className={`lg:hidden p-2 rounded-full transition cursor-pointer ${
                isSearchOpen
                  ? "bg-rose-100/80 text-[#6B1527] ring-2 ring-[#6B1527]/20"
                  : "text-slate-700 hover:text-[#6B1527] hover:bg-rose-50"
              }`}
            >
              {isSearchOpen ? <FiX className="text-2xl" /> : <FiSearch className="text-2xl" />}
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

        {/* ========================================================================= */}
        {/* EXPANDABLE SEARCH PANEL DIRECTLY UNDER THE HEADER */}
        {/* ========================================================================= */}
        {isSearchOpen && (
          <div
            ref={searchContainerRef}
            className="w-full border-t border-rose-100/90 bg-white/98 backdrop-blur-md shadow-lg transition-all animate-in slide-in-from-top-2 duration-200"
          >
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-3.5 sm:py-5">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base sm:text-lg pointer-events-none" />
                  <input
                    required
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search authentic sarees, silk, paithani, cotton, occasions..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 sm:pl-11 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#6B1527] focus:bg-white focus:ring-2 focus:ring-[#6B1527]/15 transition"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                      aria-label="Clear search text"
                    >
                      <FiX className="text-base" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#6B1527] hover:bg-[#5A1622] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 shadow-xs cursor-pointer whitespace-nowrap"
                >
                  Search
                </button>

                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  aria-label="Close search"
                  className="p-2 sm:p-2.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  title="Close Search"
                >
                  <FiX className="text-lg sm:text-xl" />
                </button>
              </form>

              {/* Popular Searches Quick Suggestions */}
              <div className="mt-2.5 sm:mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Popular Searches:
                </span>
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
                    className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-[#6B1527] border border-transparent hover:border-[#6B1527]/20 transition cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Dimmed backdrop overlay when search is open */}
      {isSearchOpen && (
        <div
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 z-30 bg-black/25 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

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
            onClick={() => {
              setIsSearchOpen((prev) => !prev);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer ${
              isSearchOpen
                ? "text-[#6B1527] font-bold"
                : "text-slate-600 hover:text-[#6B1527]"
            }`}
          >
            <FiSearch className="text-xl" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mt-1">
              Search
            </span>
          </button>

          {/* 3. WISHLIST */}
          <button
            type="button"
            onClick={handleWishlistClick}
            className={`relative flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer ${
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
          </button>

          {/* 4. CART */}
          <button
            type="button"
            onClick={handleCartClick}
            className={`relative flex flex-col items-center justify-center py-1 transition-all duration-200 cursor-pointer ${
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
          </button>

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
                      navigate("/profile");
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
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-rose-50 hover:text-[#6B1527] transition"
                >
                  Blog
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
              {isAdmin(currentUser) && (
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
      {/* 5. PATRON PROFILE DETAILS MODAL (Removed in favor of /profile page) */}
      {/* ========================================================================= */}
    </>
  );
};

export default Header;