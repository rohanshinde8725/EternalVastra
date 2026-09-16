import { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { GiThreeLeaves } from "react-icons/gi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Rating from "../rating/Rating";
import useProducts from "../../hooks/useProducts";
import FadeImage from "../animations/FadeImage";
import FadeUp from "../animations/FadeUp";
import { useToast } from "../../context/ToastContext";
import { isAuthenticated } from "../../utils/auth";

const Seller = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { products: sarees } = useProducts();

  const [cartIds, setCartIds] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);

  const loadWishlist = () => {
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistIds(existingWishlist.map((item) => item.id));
  };

  const loadCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartIds(existingCart.map((item) => item.id));
  };

  useEffect(() => {
    loadWishlist();
    loadCart();

    const syncWishlist = () => loadWishlist();
    const syncCart = () => loadCart();

    window.addEventListener("wishlistUpdated", syncWishlist);
    window.addEventListener("cartUpdated", syncCart);
    window.addEventListener("userUpdated", syncWishlist);
    window.addEventListener("userUpdated", syncCart);
    return () => {
      window.removeEventListener("wishlistUpdated", syncWishlist);
      window.removeEventListener("cartUpdated", syncCart);
      window.removeEventListener("userUpdated", syncWishlist);
      window.removeEventListener("userUpdated", syncCart);
    };
  }, []);

  const toggleSellerWishlist = (product) => {
    if (!isAuthenticated()) {
      showToast.warning("Please sign in to save items to your wishlist.");
      navigate("/signin", { state: { from: location } });
      return;
    }

    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isInWishlist = existingWishlist.some((item) => item.id === product.id);
    const updatedWishlist = isInWishlist
      ? existingWishlist.filter((item) => item.id !== product.id)
      : [...existingWishlist, product];

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlistIds(updatedWishlist.map((item) => item.id));
    window.dispatchEvent(new Event("wishlistUpdated"));

    if (!isInWishlist) {
      showToast.success(`Saved "${product.title}" to wishlist!`);
    } else {
      showToast.info(`Removed "${product.title}" from wishlist.`);
    }
  };

  const addToCart = (product) => {
    if (!isAuthenticated()) {
      showToast.warning("Please sign in to add items to your cart.");
      navigate("/signin", { state: { from: location } });
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const isInCart = existingCart.some((item) => item.id === product.id);
    if (isInCart) return;

    const updatedCart = [...existingCart, { ...product, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartIds(updatedCart.map((item) => item.id));
    window.dispatchEvent(new Event("cartUpdated"));
    showToast.success(`Added "${product.title}" to cart!`);
  };

  return (
    <div className="py-8 sm:py-12 md:py-14 bg-[#FEFAF8] w-full">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <FadeUp delay={0.1}>
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-center">
            <GiThreeLeaves className="text-[#74202D] text-lg sm:text-xl md:text-2xl" />
            <h2 className="uppercase font-semibold text-xl sm:text-2xl md:text-3xl text-slate-800 tracking-tight">Best Sellers</h2>
            <GiThreeLeaves className="text-[#74202D] text-lg sm:text-xl md:text-2xl" />
          </div>
        </FadeUp>

        <div className="seller mt-8 sm:mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 justify-center items-center">

          {sarees.slice(0, 5).map((saree, index) => (
            <FadeUp key={saree.id || index} delay={0.08 + index * 0.07} className="h-full">
              <div
                className="group shadow-sm rounded-xl relative overflow-hidden border border-gray-200 bg-white transition hover:shadow-md h-full flex flex-col justify-between"
              >
                {/* Image + Hover Overlay */}
                <div className="relative overflow-hidden rounded-t-xl">
                  <Link to={`/shop/${saree.id}`} className="block">
                    <img
                      src={saree.img}
                      alt={saree.title}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/silk/silk-1.jpg";
                      }}
                      className="h-48 sm:h-56 md:h-56 lg:h-64 xl:h-72 w-full rounded-t-xl object-cover object-top transition duration-300 group-hover:scale-[1.05]"
                    />
                  </Link>

                  {/* Hover Overlay — matches Shop page */}
                  <div className="pointer-events-none absolute inset-0 flex items-start justify-between bg-transparent md:bg-black/15 p-2.5 sm:p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 ease-out rounded-t-xl">
                    {/* Tag Badge */}
                    <span className="rounded-full bg-[#e9829a] px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase text-white shadow-xs transform translate-y-0 opacity-100 md:-translate-y-2 md:opacity-0 transition-all duration-300 ease-out md:group-hover:translate-y-0 md:group-hover:opacity-100">
                      {saree.tag || "Handcrafted"}
                    </span>

                    {/* Action Icons — Wishlist + Quick View */}
                    <div className="pointer-events-auto flex flex-col gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSellerWishlist(saree)}
                        aria-label={wishlistIds.includes(saree.id) ? "Remove from wishlist" : "Add to wishlist"}
                        className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center cursor-pointer rounded-full shadow-md backdrop-blur-xs transform translate-x-0 opacity-100 md:translate-x-4 md:opacity-0 transition-all duration-300 ease-out md:group-hover:translate-x-0 md:group-hover:opacity-100 hover:scale-110 active:scale-95 delay-75 ${
                          wishlistIds.includes(saree.id)
                            ? "bg-[#74202D] text-white"
                            : "bg-white/95 text-[#74202D] hover:bg-[#74202D] hover:text-white"
                        }`}
                      >
                        <CiHeart className={`text-lg sm:text-xl transition-transform duration-200 ${wishlistIds.includes(saree.id) ? "fill-current scale-110" : ""}`} />
                      </button>

                      <Link
                        to={`/shop/${saree.id}`}
                        aria-label={`View ${saree.title}`}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/95 text-[#74202D] shadow-md backdrop-blur-xs transform translate-x-0 opacity-100 md:translate-x-4 md:opacity-0 transition-all duration-300 ease-out md:group-hover:translate-x-0 md:group-hover:opacity-100 hover:bg-[#74202D] hover:text-white hover:scale-110 active:scale-95 delay-150"
                      >
                        <FiEye className="text-base sm:text-lg" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      to={`/shop/${saree.id}`}
                      className="block uppercase font-medium text-xs sm:text-sm line-clamp-2 text-slate-800 hover:text-[#74202D] transition mb-1 sm:mb-2"
                    >
                      {saree.title}
                    </Link>

                    <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                      <span className="text-[#74202D] font-bold text-xs sm:text-sm md:text-base">
                        ₹{saree.discountPrice?.toLocaleString("en-IN")}
                      </span>
                      <span className="line-through text-gray-400 font-normal text-[10px] sm:text-xs md:text-sm">
                        ₹{saree.actualPrice?.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                      <Rating rating={saree.rating} />
                      <span className="text-[10px] sm:text-xs text-gray-500">
                        ({saree.ratings || 24})
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(saree)}
                    disabled={cartIds.includes(saree.id)}
                    className={`w-full mt-3 sm:mt-4 rounded-md py-2 px-3 text-xs sm:text-sm font-semibold uppercase transition-all duration-300
                      ${cartIds.includes(saree.id)
                        ? "border border-gray-200 bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "border-2 border-[#74202D] text-[#74202D] hover:bg-[#74202D] hover:text-white cursor-pointer shadow-xs"
                      }`}
                  >
                    {cartIds.includes(saree.id) ? "Already in Cart" : "Add To Cart"}
                  </button>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Seller;