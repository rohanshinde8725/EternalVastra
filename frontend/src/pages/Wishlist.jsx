import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Rating from "../components/rating/Rating";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { MdGridView, MdViewList } from "react-icons/md";
import { useToast } from "../context/ToastContext";
import { isAuthenticated } from "../utils/auth";
import FadeUp from "../components/animations/FadeUp";

const Wishlist = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState("table");
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
    } else {
      setViewMode("table");
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
      <div className="h-60 bg-[url(/images/banner/banner-2.png)] bg-cover bg-center">
        <div className="py-20 px-5 sm:px-8 md:px-10 lg:px-12">
          <FadeUp delay={0.1}>
            <h1 className="text-4xl font-semibold text-[#74202D]">
              Your Wishlist
            </h1>
          </FadeUp>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 space-y-6">
        <FadeUp delay={0.05}>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#74202D] hover:text-[#5c1b2b] transition"
          >
            <HiOutlineArrowLeft /> Back to Shop
          </Link>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
                Wishlist Items ({wishlist.length})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Saved items that you can review or move to your cart.
              </p>
            </div>
            {/* View Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600">View</span>
              {[
                { id: "4", label: "4/4", icon: <MdGridView className="h-4 w-4 sm:h-5 sm:w-5" /> },
                { id: "table", label: "List", icon: <MdViewList className="h-4 w-4 sm:h-5 sm:w-5" /> },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleViewModeChange(option.id)}
                  aria-label={option.label}
                  className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md border transition cursor-pointer ${
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
        </FadeUp>

        {wishlist.length === 0 ? (
          <FadeUp delay={0.15}>
            <div className="rounded-2xl border border-dashed border-[#d1b5ae] bg-[#fff6f2] p-10 text-center space-y-4">
              <p className="text-sm md:text-base font-medium text-slate-700">
                Your wishlist is empty. Browse the shop and click the heart icon to save your favorite sarees.
              </p>
              <div>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-md bg-[#74202D] px-6 py-2.5 text-xs sm:text-sm font-semibold uppercase text-white hover:bg-transparent border-2 border-[#74202D] hover:text-[#74202D] transition-all duration-300 shadow-xs cursor-pointer"
                >
                  Explore Shop
                </Link>
              </div>
            </div>
          </FadeUp>
        ) : viewMode === "table" ? (
          /* List View Mode: 2/2 Grid for lg devices with original w-20 h-20 image size */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {wishlist.map((item, index) => (
              <FadeUp key={item.id} delay={Math.min(index * 0.05, 0.4)} className="h-full">
                <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-lg border border-gray-200 bg-white transition h-full shadow-xs">
                  {/* Left: Thumbnail Image (w-20 h-20) + Info */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <Link to={`/shop/${item.id}`} className="shrink-0 overflow-hidden rounded block">
                      <img
                        src={item.img}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/silk/silk-1.jpg";
                        }}
                        className="w-20 h-20 object-cover rounded shrink-0 transition-transform duration-300 ease-out group-hover:scale-110"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/shop/${item.id}`} className="font-medium text-sm hover:text-[#74202D] transition line-clamp-1 block">
                        {item.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {Array.isArray(item.category) ? item.category.join(", ") : item.category || ""}
                      </p>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-[#74202D] font-semibold text-sm">₹{item.discountPrice}</span>
                        <span className="text-xs text-gray-400 line-through">₹{item.actualPrice}</span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1">
                        <Rating rating={item.rating} />
                        <span className="text-xs text-gray-500">({item.ratings})</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="shrink-0 flex items-center gap-2 sm:self-center">
                    <button
                      onClick={() => addToCart(item)}
                      disabled={cartIds.includes(item.id)}
                      className={`rounded-md px-3.5 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                        cartIds.includes(item.id)
                          ? "border border-gray-200 bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "border border-[#74202D] bg-[#74202D] text-white hover:bg-white hover:text-[#74202D]"
                      }`}
                    >
                      {cartIds.includes(item.id) ? "In Cart" : "Add to Cart"}
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="rounded-md border border-[#74202D] bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#74202D] hover:bg-[#74202D] hover:text-white transition cursor-pointer whitespace-nowrap"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        ) : (
          /* 4/4 Grid View */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {wishlist.map((item, index) => (
              <FadeUp key={item.id} delay={0.05 + (index % 4) * 0.08} className="h-full">
                <div className="group rounded-lg overflow-hidden border border-gray-200 bg-white transition flex flex-col justify-between h-full shadow-xs hover:shadow-md">
                  <div className="relative overflow-hidden bg-[#f8efe9]">
                    <Link to={`/shop/${item.id}`} className="block">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={item.img}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/silk/silk-1.jpg";
                        }}
                        className="w-full h-48 sm:h-56 md:h-56 lg:h-64 xl:h-72 object-cover object-top transition duration-300 group-hover:scale-[1.05]"
                      />
                    </Link>
                  </div>
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/shop/${item.id}`} className="block font-medium text-xs sm:text-sm line-clamp-2 hover:text-[#74202D] transition mb-1 sm:mb-2">
                        {item.title}
                      </Link>
                      <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                        <span className="text-[#74202D] font-bold text-xs sm:text-sm md:text-base">₹{item.discountPrice?.toLocaleString("en-IN")}</span>
                        <span className="line-through text-gray-400 text-[10px] sm:text-xs md:text-sm">₹{item.actualPrice?.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                        <Rating rating={item.rating} />
                        <span className="text-[10px] sm:text-xs text-gray-500">({item.ratings || 24})</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-2">
                      <button
                        onClick={() => addToCart(item)}
                        disabled={cartIds.includes(item.id)}
                        className={`flex-1 rounded-md py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition cursor-pointer ${
                          cartIds.includes(item.id)
                            ? "border border-gray-200 bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "border border-[#74202D] bg-[#74202D] text-white hover:bg-white hover:text-[#74202D]"
                        }`}
                      >
                        {cartIds.includes(item.id) ? "In Cart" : "Add to Cart"}
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="rounded-md border border-[#74202D] bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#74202D] hover:bg-[#74202D] hover:text-white transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        )}

        {/* Clear Wishlist */}
        {wishlist.length > 0 && (
          <FadeUp delay={0.1}>
            <button
              onClick={clearWishlist}
              className="text-[#74202D] font-semibold cursor-pointer transition-all duration-300 hover:underline"
            >
              CLEAR WISHLIST
            </button>
          </FadeUp>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
