import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdGridView, MdViewList } from "react-icons/md";
import { FiTrash2, FiShoppingBag, FiCheck } from "react-icons/fi";
import { CiHeart } from "react-icons/ci";
import { useToast } from "../context/ToastContext";
import { isAuthenticated } from "../utils/auth";
import FadeUp from "../components/animations/FadeUp";
import { resolveImageUrl } from "../api/products";

const Wishlist = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      return [];
    }
  });
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem("wishlistViewMode");
    return saved === "4" || saved === "table" ? saved : "4";
  });
  const [cartIds, setCartIds] = useState(() => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      return existingCart.map((item) => item.id);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      showToast.warning("Please sign in to view your wishlist.");
      navigate("/signin", { state: { from: location } });
    }
  }, [navigate, location, showToast]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("wishlistViewMode", mode);
  };

  useEffect(() => {
    const syncCartIds = () => {
      try {
        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartIds(existingCart.map((item) => item.id));
      } catch {
        setCartIds([]);
      }
    };

    window.addEventListener("cartUpdated", syncCartIds);
    window.addEventListener("userUpdated", syncCartIds);
    return () => {
      window.removeEventListener("cartUpdated", syncCartIds);
      window.removeEventListener("userUpdated", syncCartIds);
    };
  }, []);

  useEffect(() => {
    const syncWishlist = () => {
      try {
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(storedWishlist);
      } catch {
        setWishlist([]);
      }
    };
    window.addEventListener("wishlistUpdated", syncWishlist);
    window.addEventListener("userUpdated", syncWishlist);
    return () => {
      window.removeEventListener("wishlistUpdated", syncWishlist);
      window.removeEventListener("userUpdated", syncWishlist);
    };
  }, []);

  const removeFromWishlist = (productId) => {
    const itemToRemove = wishlist.find((item) => item.id === productId);
    const updatedWishlist = wishlist.filter((item) => item.id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
    showToast.info(`Removed "${itemToRemove?.title || "Item"}" from wishlist.`);
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.setItem("wishlist", JSON.stringify([]));
    window.dispatchEvent(new Event("wishlistUpdated"));
    showToast.info("Wishlist cleared.");
  };

  const addToCart = (product) => {
    if (!isAuthenticated()) {
      showToast.warning("Please sign in to add items to your cart.");
      navigate("/signin", { state: { from: location } });
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const found = existingCart.find((item) => item.id === product.id);
    const updatedCart = found
      ? existingCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        )
      : [...existingCart, { ...product, quantity: 1 }];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartIds(updatedCart.map((item) => item.id));
    window.dispatchEvent(new Event("cartUpdated"));
    showToast.success(`Added "${product.title}" to cart!`);
  };

  return (
    <div className="w-full bg-[#FEFAF8] min-h-[75vh]">
      {/* Refined Minimal Header */}
      <div className="bg-[#FAF4F0] border-b border-[#ebdcd5]/70 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <FadeUp delay={0.05}>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#74202D] block mb-1">
              Saved Collection
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#4A1F1C]">
              Your Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {wishlist.length === 0
                ? "No items saved in your wishlist yet"
                : `${wishlist.length} ${wishlist.length === 1 ? "saree" : "sarees"} saved for later`}
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#74202D] hover:text-[#5c1b2b] transition"
            >
              <span>&larr; Back to Shop</span>
            </Link>
          </FadeUp>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {wishlist.length === 0 ? (
          /* Empty Wishlist State */
          <FadeUp delay={0.15}>
            <div className="max-w-md mx-auto my-12 py-16 px-6 text-center bg-white rounded-2xl border border-stone-200/80 shadow-xs space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#74202D]/10 flex items-center justify-center text-[#74202D]">
                <CiHeart className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-stone-900">Your wishlist is empty</h2>
                <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                  Browse our handpicked saree collections and tap the heart icon on any saree you wish to save.
                </p>
              </div>
              <div>
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#74202D] px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white hover:bg-[#5c1b2b] transition duration-300 shadow-sm cursor-pointer"
                >
                  Explore Shop
                </Link>
              </div>
            </div>
          </FadeUp>
        ) : (
          /* Wishlist Items */
          <div className="space-y-6">
            {/* Header Controls */}
            <FadeUp delay={0.05}>
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h2 className="text-base sm:text-lg font-semibold text-stone-800">
                  Wishlist Items ({wishlist.length})
                </h2>

                {/* View Switcher */}
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
                  <button
                    type="button"
                    onClick={() => handleViewModeChange("4")}
                    aria-label="Grid view"
                    title="Grid View"
                    className={`flex h-8 w-8 items-center justify-center rounded-md transition cursor-pointer ${
                      viewMode === "4"
                        ? "bg-white text-[#74202D] shadow-xs font-semibold"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <MdGridView className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleViewModeChange("table")}
                    aria-label="List view"
                    title="List View"
                    className={`flex h-8 w-8 items-center justify-center rounded-md transition cursor-pointer ${
                      viewMode === "table"
                        ? "bg-white text-[#74202D] shadow-xs font-semibold"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <MdViewList className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </FadeUp>

            {/* GRID VIEW (Full image, minimal content) */}
            {viewMode === "4" && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {wishlist.map((item, index) => (
                  <FadeUp key={item.id} delay={Math.min(index * 0.05, 0.3)} className="h-full">
                    <div className="group relative bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
                      {/* FULL IMAGE - Edge to Edge, No Padding */}
                      <div className="relative w-full aspect-[3/4] overflow-hidden bg-stone-100">
                        <Link to={`/shop/${item.id}`} className="block w-full h-full">
                          <img
                            loading="lazy"
                            decoding="async"
                            src={resolveImageUrl(item.img)}
                            alt={item.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/silk/silk-1.webp";
                            }}
                            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                        </Link>

                        {/* Quick Remove Floating Button */}
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.id)}
                          aria-label={`Remove ${item.title} from wishlist`}
                          title="Remove from wishlist"
                          className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-stone-600 hover:text-[#74202D] hover:bg-white shadow-sm backdrop-blur-xs transition cursor-pointer"
                        >
                          <FiTrash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* SIMPLE CONTENT - Minimal, Uncluttered */}
                      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-3">
                        <div>
                          <Link
                            to={`/shop/${item.id}`}
                            className="font-medium text-stone-900 text-xs sm:text-sm line-clamp-1 hover:text-[#74202D] transition block"
                          >
                            {item.title}
                          </Link>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="font-bold text-xs sm:text-sm md:text-base text-[#74202D]">
                              ₹{Number(item.discountPrice).toLocaleString("en-IN")}
                            </span>
                            {item.actualPrice && Number(item.actualPrice) > Number(item.discountPrice) && (
                              <span className="line-through text-stone-400 text-[11px] sm:text-xs">
                                ₹{Number(item.actualPrice).toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Clean Action Button */}
                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          disabled={cartIds.includes(item.id)}
                          className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition duration-200 ${
                            cartIds.includes(item.id)
                              ? "bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200"
                              : "bg-[#74202D] text-white hover:bg-[#5c1b2b] cursor-pointer shadow-xs active:scale-[0.99]"
                          }`}
                        >
                          {cartIds.includes(item.id) ? (
                            <>
                              <FiCheck className="h-3.5 w-3.5" />
                              <span>In Bag</span>
                            </>
                          ) : (
                            <>
                              <FiShoppingBag className="h-3.5 w-3.5" />
                              <span>Move to Bag</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            )}

            {/* LIST VIEW */}
            {viewMode === "table" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {wishlist.map((item, index) => (
                  <FadeUp key={item.id} delay={Math.min(index * 0.05, 0.3)} className="h-full">
                    <div className="p-3.5 sm:p-4 rounded-xl border border-stone-200/90 bg-white hover:shadow-sm transition flex gap-4 items-center justify-between">
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <Link to={`/shop/${item.id}`} className="shrink-0 overflow-hidden rounded-lg group">
                          <img
                            src={resolveImageUrl(item.img)}
                            alt={item.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/silk/silk-1.webp";
                            }}
                            className="w-16 h-22 sm:w-20 sm:h-26 object-cover object-top rounded-lg group-hover:scale-105 transition duration-300"
                          />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/shop/${item.id}`}
                            className="font-medium text-stone-900 text-xs sm:text-sm hover:text-[#74202D] transition block line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <p className="text-xs text-stone-400 mt-0.5">
                            {Array.isArray(item.category) ? item.category.join(", ") : item.category || ""}
                          </p>
                          <div className="flex items-baseline gap-2 mt-1.5">
                            <span className="font-bold text-xs sm:text-sm text-[#74202D]">
                              ₹{Number(item.discountPrice).toLocaleString("en-IN")}
                            </span>
                            {item.actualPrice && Number(item.actualPrice) > Number(item.discountPrice) && (
                              <span className="line-through text-stone-400 text-[11px] sm:text-xs">
                                ₹{Number(item.actualPrice).toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          disabled={cartIds.includes(item.id)}
                          className={`flex items-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-lg text-xs font-semibold transition ${
                            cartIds.includes(item.id)
                              ? "bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed"
                              : "bg-[#74202D] text-white hover:bg-[#5c1b2b] cursor-pointer shadow-xs"
                          }`}
                        >
                          {cartIds.includes(item.id) ? (
                            <>
                              <FiCheck className="h-3.5 w-3.5" />
                              <span>In Bag</span>
                            </>
                          ) : (
                            <>
                              <FiShoppingBag className="h-3.5 w-3.5" />
                              <span>Move to Bag</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="p-2 rounded-lg text-stone-400 hover:text-[#74202D] hover:bg-stone-100 transition cursor-pointer"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={clearWishlist}
                className="text-xs font-semibold text-stone-500 hover:text-[#74202D] transition uppercase tracking-wider cursor-pointer"
              >
                Clear Wishlist
              </button>
              <Link
                to="/shop"
                className="text-xs font-semibold text-[#74202D] hover:underline transition"
              >
                + Explore More Sarees
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
