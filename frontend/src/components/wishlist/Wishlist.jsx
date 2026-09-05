import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Rating from "../rating/Rating";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { MdGridView, MdViewList } from "react-icons/md";
import { useToast } from "../../context/ToastContext";
import { isAuthenticated } from "../../utils/auth";

const Wishlist = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState("4");
  const [cartIds, setCartIds] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      showToast.warning("Please sign in to view your wishlist.");
      navigate("/signin", { state: { from: location } });
    }
  }, [navigate, location, showToast]);

  useEffect(() => {
    const savedViewMode = localStorage.getItem("wishlistViewMode");
    if (savedViewMode === "4" || savedViewMode === "table") {
      setViewMode(savedViewMode);
    }
  }, []);

  useEffect(() => {
    const loadCartIds = () => {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartIds(existingCart.map((item) => item.id));
    };

    loadCartIds();
    const handleCartUpdated = () => loadCartIds();
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, []);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("wishlistViewMode", mode);
  };

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  const removeFromWishlist = (productId) => {
    const itemToRemove = wishlist.find((item) => item.id === productId);
    const updatedWishlist = wishlist.filter((item) => item.id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
    showToast.info(`Removed "${itemToRemove?.title || "Item"}" from wishlist.`);
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
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...existingCart, { ...product, quantity: 1 }];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartIds(updatedCart.map((item) => item.id));
    window.dispatchEvent(new Event("cartUpdated"));
    showToast.success(`Added "${product.title}" to cart!`);
  };

  return (
    <div className="w-full bg-[#FEFAF8] pb-20">
      {/* Banner */}
      <div className="h-60 bg-[url(/images/banner/banner-2.png)] bg-cover bg-center flex items-center px-5">
        <div className="max-w-[1600px] mx-auto px-5 w-full">
          <h1 className="text-4xl font-semibold text-[#74202D] uppercase tracking-wide">
            Your Wishlist
          </h1>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 py-10 space-y-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#74202D] hover:text-[#5c1b2b] transition"
        >
          <HiOutlineArrowLeft /> Back to Shop
        </Link>

        <div className="rounded-lg border border-gray-200 bg-white p-5 md:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Wishlist Items ({wishlist.length})
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Saved items that you can review or move to your cart.
              </p>
            </div>
            {/* View Switcher: Hidden on mobile */}
            <div className="hidden sm:flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">View</span>
              {[
                { id: "4", label: "4/4", icon: <MdGridView className="h-5 w-5" /> },
                { id: "table", label: "List", icon: <MdViewList className="h-5 w-5" /> },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleViewModeChange(option.id)}
                  aria-label={option.label}
                  className={`flex h-10 w-10 items-center justify-center rounded-md border transition cursor-pointer ${
                    viewMode === option.id
                      ? "bg-[#74202D] text-white border-[#74202D]"
                      : "bg-white text-[#3b3737] border-gray-300 hover:border-[#74202D] hover:text-[#74202D]"
                  }`}
                >
                  {option.icon}
                </button>
              ))}
            </div>
          </div>

          {wishlist.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#d1b5ae] bg-[#fff6f2] p-10 text-center text-sm text-[#74202D]">
              Your wishlist is empty. Browse the shop and click the heart icon to save your favorite sarees.
            </div>
          ) : (
            <>
              {/* Desktop Table View (Only visible on desktop/tablet when List mode is selected) */}
              {viewMode === "table" && (
                <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-[#FEFAF8] text-gray-600">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Rating</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wishlist.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                          <td className="px-4 py-4 align-top">
                            <div className="flex items-start gap-3">
                              <Link to={`/shop/${item.id}`} className="shrink-0 group">
                                <img
                                  src={item.img}
                                  alt={item.title}
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/images/silk/silk-1.jpg";
                                  }}
                                  className="w-20 h-20 object-cover rounded group-hover:opacity-90 transition cursor-pointer"
                                />
                              </Link>
                              <div>
                                <Link to={`/shop/${item.id}`} className="font-semibold text-sm hover:text-[#74202D] transition block">
                                  {item.title}
                                </Link>
                                <p className="text-xs text-gray-500 mt-1">{item.category?.join(", ") || ""}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <div className="text-[#74202D] font-semibold">₹{item.discountPrice}</div>
                            <div className="text-xs text-gray-400 line-through">₹{item.actualPrice}</div>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <div className="flex items-center gap-2">
                              <Rating rating={item.rating} />
                              <span className="text-xs text-gray-500">({item.ratings})</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 align-top text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => addToCart(item)}
                                disabled={cartIds.includes(item.id)}
                                className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase border-2 transition cursor-pointer ${
                                  cartIds.includes(item.id)
                                    ? "border-gray-200 bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "border-[#74202D] bg-[#74202D] text-white hover:bg-transparent hover:text-[#74202D]"
                                }`}
                              >
                                {cartIds.includes(item.id) ? "In Cart" : "Add to Cart"}
                              </button>
                              <button
                                onClick={() => removeFromWishlist(item.id)}
                                className="rounded-md border-2 border-[#74202D] bg-white px-3 py-1.5 text-xs font-semibold text-[#74202D] uppercase hover:bg-[#74202D] hover:text-white transition cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Grid View (Always active on mobile, and active on desktop when Grid mode is selected) */}
              <div className={`${viewMode === "table" ? "block sm:hidden" : "grid"} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`}>
                {wishlist.map((item) => (
                  <div key={item.id} className="group shadow rounded-lg relative overflow-hidden border border-gray-200 bg-white transition">
                    <Link to={`/shop/${item.id}`} className="block overflow-hidden relative">
                      <img src={item.img} alt={item.title} className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105" />
                    </Link>
                    <div className="p-4 space-y-3">
                      <Link to={`/shop/${item.id}`} className="block text-base font-semibold uppercase text-gray-800 hover:text-[#74202D] transition truncate">
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-2">
                        <span className="text-[#74202D] font-bold">₹{item.discountPrice}</span>
                        <span className="line-through text-xs text-gray-400">₹{item.actualPrice}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Rating rating={item.rating} />
                        <span className="text-xs text-gray-500">({item.ratings})</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => addToCart(item)}
                          disabled={cartIds.includes(item.id)}
                          className={`flex-1 rounded-md py-2 text-xs font-semibold uppercase border-2 transition cursor-pointer ${
                            cartIds.includes(item.id)
                              ? "border-gray-200 bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "border-[#74202D] bg-[#74202D] text-white hover:bg-transparent hover:text-[#74202D]"
                          }`}
                        >
                          {cartIds.includes(item.id) ? "In Cart" : "Add to Cart"}
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="rounded-md border-2 border-[#74202D] bg-white px-3 py-2 text-xs font-semibold text-[#74202D] uppercase hover:bg-[#74202D] hover:text-white transition cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
