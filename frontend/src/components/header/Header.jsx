import { useState, useEffect, useRef } from "react";
import { CiSearch, CiHeart } from "react-icons/ci";
import { HiOutlineShoppingBag, HiMenu, HiX } from "react-icons/hi";
import {
  FiUser,
  FiLogOut,
  FiShoppingBag,
  FiHeart,
  FiShield,
  FiX,
  FiCheck,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

const Header = () => {
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const userMenuRef = useRef(null);
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

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const handleSignOut = () => {
    localStorage.removeItem("eternal_user");
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    showToast.info("Signed out of your account successfully.");
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/");
  };

  const handleUserIconClick = () => {
    if (!currentUser) {
      navigate("/signin");
    } else {
      setIsUserMenuOpen((prev) => !prev);
    }
  };

  return (
    <nav className="relative w-full py-2 sticky top-0 z-50 bg-[#FEFAF8] shadow-lg">
      <div className="container flex items-center justify-between px-3 sm:px-6 lg:px-10">
        <Link to="/" className="h-14 w-24 sm:h-16 sm:w-28 lg:h-20 lg:w-30 flex-shrink-0">
          <img
            src="/images/navImg2.png"
            alt="Eternal Vastra"
            loading="eager"
            decoding="async"
            className="h-full w-full object-contain"
          />
        </Link>

        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-6 xl:gap-10">
          <ul className="flex flex-wrap justify-center gap-8 xl:gap-12 uppercase text-sm lg:text-base font-semibold">
            <li className="cursor-pointer hover:text-[#74202D] transition-all duration-300">
              <Link to={"/"}>Home</Link>
            </li>
            <li className="cursor-pointer hover:text-[#74202D] transition-all duration-300">
              <Link to={"/about"}>About</Link>
            </li>
            <li className="cursor-pointer hover:text-[#74202D] transition-all duration-300">
              <Link to={"/shop"}>Shop</Link>
            </li>
            <li className="cursor-pointer hover:text-[#74202D] transition-all duration-300">
              <Link to={"/contact"}>Contact Us</Link>
            </li>
            <li className="cursor-pointer hover:text-[#74202D] transition-all duration-300">
              <Link to={"/shop?search=Sale"}>Sale</Link>
            </li>
          </ul>
        </div>

        {/* Icons + Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 text-lg md:text-2xl flex-shrink-0 ml-2 sm:ml-3">
          {/* Search Bar */}
          <div className="relative flex items-center justify-end w-10 sm:w-12 md:w-14 lg:w-56 xl:w-64">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="search"
                  placeholder="Search sarees..."
                  autoFocus
                  className="w-full border border-gray-300 rounded-full bg-white px-3 py-2 pr-10 text-sm outline-none shadow-sm"
                />
                <button
                  type="button"
                  onClick={toggleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#74202D] hover:text-[#5c1b2b]"
                >
                  <HiX className="cursor-pointer" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={toggleSearch}
                className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-[#74202D] cursor-pointer"
              >
                <CiSearch />
              </button>
            )}
          </div>

          {/* Wishlist */}
          <div className="relative">
            <Link to="/wishlist" className="text-[#74202D] hover:text-[#5c1b2b] transition">
              <CiHeart className="cursor-pointer" />
            </Link>
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#74202D] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* Cart */}
          <div className="relative">
            <Link to="/cart">
              <HiOutlineShoppingBag className="cursor-pointer" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#74202D] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* User Account / Profile Dropdown Trigger */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={handleUserIconClick}
              aria-label="User Account"
              title={currentUser ? `${currentUser.name} (${currentUser.role || "Patron"})` : "Sign In"}
              className={`flex items-center justify-center transition cursor-pointer p-1 rounded-full ${
                currentUser ? "text-[#6B1527] ring-2 ring-[#6B1527]/30 bg-rose-50" : "text-[#74202D] hover:text-[#5c1b2b]"
              }`}
            >
              <FiUser className="text-xl" />
            </button>

            {/* Account Popover Menu for Logged In User */}
            {isUserMenuOpen && currentUser && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-slate-100 shadow-2xl p-2.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                {/* User Header */}
                <div className="p-3 bg-gradient-to-br from-[#6B1527] to-[#3D0A14] rounded-xl text-white mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-amber-200">
                      {currentUser.name?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs truncate leading-tight">{currentUser.name}</h4>
                      <p className="text-[10px] text-rose-200/90 truncate">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-amber-200">
                      {currentUser.role === "admin" ? "Super Admin" : "Verified Patron"}
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-rose-50 hover:text-[#6B1527] transition cursor-pointer font-medium"
                  >
                    <FiUser className="text-slate-400" />
                    <span>My Profile Details</span>
                  </button>

                  <Link
                    to="/cart"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-rose-50 hover:text-[#6B1527] transition font-medium"
                  >
                    <FiShoppingBag className="text-slate-400" />
                    <span>My Cart & Orders ({cartCount})</span>
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-rose-50 hover:text-[#6B1527] transition font-medium"
                  >
                    <FiHeart className="text-slate-400" />
                    <span>Saved Sarees ({wishlistCount})</span>
                  </Link>

                  {currentUser.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-900 font-semibold hover:bg-amber-100 transition"
                    >
                      <FiShield className="text-amber-700" />
                      <span>Admin Control Portal</span>
                    </Link>
                  )}

                  <div className="pt-1 border-t border-slate-100 mt-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 font-semibold transition cursor-pointer"
                    >
                      <FiLogOut className="text-rose-500" />
                      <span>Sign Out / Log Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="lg:hidden text-2xl flex-shrink-0"
            onClick={() => setIsOpen(true)}
          >
            <HiMenu />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] sm:w-[70%] max-w-[320px] bg-white shadow-lg z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-5">
          <button onClick={() => setIsOpen(false)} className="text-2xl">
            <HiX />
          </button>
        </div>

        {/* Menu Items */}
        <div className="px-6 pb-8">
          {currentUser && (
            <div className="p-3 bg-rose-50 rounded-xl mb-4 text-xs">
              <div className="font-bold text-slate-800">{currentUser.name}</div>
              <div className="text-[11px] text-slate-500">{currentUser.email}</div>
              <button
                onClick={handleSignOut}
                className="mt-2 text-[11px] font-bold text-rose-700 hover:underline flex items-center gap-1"
              >
                <FiLogOut />
                <span>Log Out</span>
              </button>
            </div>
          )}

          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#74202D] mb-4">
            Navigation
          </h2>
          <ul className="flex flex-col gap-4 text-base font-semibold">
            <Link to="/" onClick={() => setIsOpen(false)}>
              <li className="cursor-pointer hover:text-[#74202D]">Home</li>
            </Link>
            <Link to="/about" onClick={() => setIsOpen(false)}>
              <li className="cursor-pointer hover:text-[#74202D]">About</li>
            </Link>
            <Link to="/shop" onClick={() => setIsOpen(false)}>
              <li className="cursor-pointer hover:text-[#74202D]">Shop</li>
            </Link>
            <Link to="/contact" onClick={() => setIsOpen(false)}>
              <li className="cursor-pointer hover:text-[#74202D]">Contact Us</li>
            </Link>
            <Link to="/shop?search=Sale" onClick={() => setIsOpen(false)}>
              <li className="cursor-pointer hover:text-[#74202D]">Sale</li>
            </Link>
            {!currentUser ? (
              <Link to="/signin" onClick={() => setIsOpen(false)}>
                <li className="cursor-pointer text-[#6B1527]">Sign In / Register</li>
              </Link>
            ) : (
              currentUser.role === "admin" && (
                <Link to="/admin" onClick={() => setIsOpen(false)}>
                  <li className="cursor-pointer text-amber-700">Admin Portal</li>
                </Link>
              )
            )}
          </ul>
        </div>
      </div>

      {/* Profile Details Modal for Patron */}
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

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};

export default Header;