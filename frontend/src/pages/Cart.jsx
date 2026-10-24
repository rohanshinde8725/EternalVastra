import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiArrowRight,
  FiShoppingBag,
  FiShield,
  FiTruck,
  FiRefreshCw,
} from "react-icons/fi";
import { MdGridView, MdViewList } from "react-icons/md";
import { useToast } from "../context/ToastContext";
import { isAuthenticated } from "../utils/auth";
import FadeUp from "../components/animations/FadeUp";
import { resolveImageUrl } from "../api/products";

const Cart = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem("cartViewMode");
    return saved === "4" || saved === "table" ? saved : "4";
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      showToast.warning("Please sign in to view your cart.");
      navigate("/signin", { state: { from: location } });
    }
  }, [navigate, location, showToast]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("cartViewMode", mode);
  };

  // Sync cart from events
  useEffect(() => {
    const syncCart = () => {
      try {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(data);
      } catch {
        setCart([]);
      }
    };
    window.addEventListener("cartUpdated", syncCart);
    window.addEventListener("userUpdated", syncCart);
    return () => {
      window.removeEventListener("cartUpdated", syncCart);
      window.removeEventListener("userUpdated", syncCart);
    };
  }, []);

  // Update storage & dispatch sync event
  const updateStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Increase / Decrease quantity
  const updateQuantity = (id, type) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        if (type === "inc") {
          return { ...item, quantity: (item.quantity || 1) + 1 };
        }
        if (type === "dec" && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    });

    updateStorage(updatedCart);
  };

  // Remove item
  const removeItem = (id) => {
    const itemToRemove = cart.find((item) => item.id === id);
    const updatedCart = cart.filter((item) => item.id !== id);
    updateStorage(updatedCart);
    showToast.info(`Removed "${itemToRemove?.title || "Item"}" from cart.`);
  };

  // Clear cart
  const clearCart = () => {
    updateStorage([]);
    showToast.info("Cart cleared.");
  };

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + (Number(item.discountPrice) || 0) * (item.quantity || 1),
    0
  );
  const discount = Math.floor(subtotal * 0.15); // 15% promotional discount
  const total = subtotal - discount;
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="w-full bg-[#FEFAF8] min-h-[75vh]">
      {/* Refined Minimal Header */}
      <div className="bg-[#FAF4F0] border-b border-[#ebdcd5]/70 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <FadeUp delay={0.05}>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#74202D] block mb-1">
              Your Shopping Bag
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#4A1F1C]">
              Review Your Order
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {cart.length === 0
                ? "Your bag is currently empty"
                : `${totalItems} ${totalItems === 1 ? "saree" : "sarees"} in your bag`}
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#74202D] hover:text-[#5c1b2b] transition"
            >
              <span>&larr; Continue Shopping</span>
            </Link>
          </FadeUp>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {cart.length === 0 ? (
          /* Empty Bag State */
          <FadeUp delay={0.15}>
            <div className="max-w-md mx-auto my-12 py-16 px-6 text-center bg-white rounded-2xl border border-stone-200/80 shadow-xs space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#74202D]/10 flex items-center justify-center text-[#74202D]">
                <FiShoppingBag className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-stone-900">Your bag is empty</h2>
                <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                  Explore our curated collection of handcrafted sarees and find your next signature drape.
                </p>
              </div>
              <div>
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#74202D] px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white hover:bg-[#5c1b2b] transition duration-300 shadow-sm cursor-pointer"
                >
                  Explore Sarees
                </Link>
              </div>
            </div>
          </FadeUp>
        ) : (
          /* Cart Content: Items + Summary */
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10">
            {/* LEFT: Items List / Grid */}
            <div className="w-full lg:w-[68%] space-y-6">
              {/* Header Controls */}
              <FadeUp delay={0.05}>
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h2 className="text-base sm:text-lg font-semibold text-stone-800">
                    Items in Bag ({totalItems})
                  </h2>

                  {/* View Mode Switcher */}
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
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                  {cart.map((item, index) => (
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
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.title} from cart`}
                            title="Remove item"
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
                            <p className="text-xs text-stone-500 mt-0.5">
                              ₹{Number(item.discountPrice).toLocaleString("en-IN")} each
                            </p>
                          </div>

                          {/* Stepper & Total */}
                          <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                            {/* Stepper */}
                            <div className="flex items-center border border-stone-200 rounded-md bg-stone-50/70">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, "dec")}
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                                className="px-2 py-1 text-stone-600 hover:bg-stone-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                              >
                                <FiMinus className="h-3 w-3" />
                              </button>
                              <span className="px-2 text-xs font-semibold text-stone-800 min-w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, "inc")}
                                aria-label="Increase quantity"
                                className="px-2 py-1 text-stone-600 hover:bg-stone-200/60 transition cursor-pointer"
                              >
                                <FiPlus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Total */}
                            <span className="font-bold text-xs sm:text-sm text-[#74202D]">
                              ₹{(Number(item.discountPrice) * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              )}

              {/* LIST / TABLE VIEW */}
              {viewMode === "table" && (
                <FadeUp delay={0.15}>
                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xs">
                    <table className="min-w-full text-sm text-left">
                      <thead className="bg-[#FAF4F0] text-stone-700 text-xs font-semibold uppercase tracking-wider border-b border-stone-200">
                        <tr>
                          <th className="px-5 py-3.5">Product</th>
                          <th className="px-4 py-3.5">Price</th>
                          <th className="px-4 py-3.5">Quantity</th>
                          <th className="px-4 py-3.5">Total</th>
                          <th className="px-4 py-3.5 text-right">Remove</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {cart.map((item) => (
                          <tr key={item.id} className="hover:bg-stone-50/60 transition">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3.5">
                                <Link to={`/shop/${item.id}`} className="shrink-0 overflow-hidden rounded-lg group">
                                  <img
                                    src={resolveImageUrl(item.img)}
                                    alt={item.title}
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = "/images/silk/silk-1.webp";
                                    }}
                                    className="w-16 h-20 object-cover object-top rounded-lg group-hover:scale-105 transition duration-300"
                                  />
                                </Link>
                                <div className="min-w-0">
                                  <Link
                                    to={`/shop/${item.id}`}
                                    className="font-medium text-stone-900 hover:text-[#74202D] transition block line-clamp-1"
                                  >
                                    {item.title}
                                  </Link>
                                  <p className="text-xs text-stone-400 mt-0.5">
                                    {Array.isArray(item.category) ? item.category.join(", ") : item.category || ""}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 font-semibold text-stone-700">
                              ₹{Number(item.discountPrice).toLocaleString("en-IN")}
                            </td>
                            <td className="px-4 py-4">
                              <div className="inline-flex items-center border border-stone-200 rounded-md bg-stone-50/70">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, "dec")}
                                  disabled={item.quantity <= 1}
                                  aria-label="Decrease quantity"
                                  className="px-2 py-1 text-stone-600 hover:bg-stone-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                                >
                                  <FiMinus className="h-3 w-3" />
                                </button>
                                <span className="px-2 text-xs font-semibold text-stone-800 min-w-5 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, "inc")}
                                  aria-label="Increase quantity"
                                  className="px-2 py-1 text-stone-600 hover:bg-stone-200/60 transition cursor-pointer"
                                >
                                  <FiPlus className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-4 font-bold text-[#74202D]">
                              ₹{(Number(item.discountPrice) * item.quantity).toLocaleString("en-IN")}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                aria-label={`Remove ${item.title}`}
                                className="p-2 rounded-full text-stone-400 hover:text-[#74202D] hover:bg-stone-100 transition cursor-pointer"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile List View */}
                  <div className="block sm:hidden space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="p-3 bg-white rounded-xl border border-stone-200 flex gap-3 items-center">
                        <Link to={`/shop/${item.id}`} className="shrink-0 overflow-hidden rounded-lg">
                          <img
                            src={resolveImageUrl(item.img)}
                            alt={item.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/silk/silk-1.webp";
                            }}
                            className="w-16 h-20 object-cover object-top rounded-lg"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/shop/${item.id}`} className="font-medium text-xs text-stone-900 line-clamp-1 block">
                            {item.title}
                          </Link>
                          <p className="text-xs font-bold text-[#74202D] mt-0.5">
                            ₹{(Number(item.discountPrice) * item.quantity).toLocaleString("en-IN")}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-stone-200 rounded-md bg-stone-50/70">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, "dec")}
                                disabled={item.quantity <= 1}
                                className="px-2 py-0.5 text-stone-600 disabled:opacity-30"
                              >
                                <FiMinus className="h-2.5 w-2.5" />
                              </button>
                              <span className="px-2 text-xs font-semibold text-stone-800">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, "inc")}
                                className="px-2 py-0.5 text-stone-600"
                              >
                                <FiPlus className="h-2.5 w-2.5" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-stone-400 hover:text-[#74202D] p-1"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </FadeUp>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-semibold text-stone-500 hover:text-[#74202D] transition uppercase tracking-wider cursor-pointer"
                >
                  Clear Bag
                </button>
                <Link
                  to="/shop"
                  className="text-xs font-semibold text-[#74202D] hover:underline transition"
                >
                  + Add More Sarees
                </Link>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="w-full lg:w-[32%] lg:sticky lg:top-24">
              <FadeUp delay={0.2}>
                <div className="bg-white border border-stone-200/90 shadow-sm p-6 rounded-2xl space-y-5">
                  <h3 className="text-lg font-semibold text-stone-900 pb-3 border-b border-stone-100">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-sm text-stone-600">
                    <div className="flex justify-between">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="font-medium text-stone-800">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between text-emerald-600">
                      <span>Promotional Discount (15%)</span>
                      <span className="font-medium">- ₹{discount.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Shipping & Handling</span>
                      <span className="font-semibold text-emerald-600 uppercase text-xs">FREE</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                    <div>
                      <span className="font-semibold text-base text-stone-900 block">Total Amount</span>
                      <span className="text-[11px] text-stone-400">Inclusive of all taxes</span>
                    </div>
                    <span className="text-xl font-bold text-[#74202D]">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated()) {
                        showToast.warning("Please sign in to proceed to checkout.");
                        navigate("/signin", { state: { from: location } });
                        return;
                      }
                      showToast.info("Proceeding to secure checkout...");
                    }}
                    className="w-full flex items-center justify-center gap-2 uppercase bg-[#74202D] text-white py-3.5 px-5 text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#5c1b2b] cursor-pointer transition-all duration-300 shadow-md shadow-[#74202D]/15 active:scale-[0.99]"
                  >
                    <span>Proceed to Checkout</span>
                    <FiArrowRight className="h-4 w-4" />
                  </button>

                  {/* Trust Assurances */}
                  <div className="pt-4 border-t border-stone-100 space-y-2.5 text-stone-500 text-xs">
                    <div className="flex items-center gap-2.5">
                      <FiTruck className="text-[#74202D] h-4 w-4 shrink-0" />
                      <span>Complimentary insured delivery across India</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <FiShield className="text-[#74202D] h-4 w-4 shrink-0" />
                      <span>100% Genuine silk mark & authentic handlooms</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <FiRefreshCw className="text-[#74202D] h-4 w-4 shrink-0" />
                      <span>Easy 7-day hassle-free exchange</span>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;