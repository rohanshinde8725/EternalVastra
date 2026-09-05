import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Rating from "../components/rating/Rating";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useToast } from "../context/ToastContext";
import { isAuthenticated } from "../utils/auth";
import FadeUp from "../components/animations/FadeUp";

const Wishlist = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      showToast.warning("Please sign in to view your wishlist.");
      navigate("/signin", { state: { from: location } });
    }
  }, [navigate, location, showToast]);

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
    window.dispatchEvent(new Event("cartUpdated"));
    showToast.success(`Added "${product.title}" to cart!`);
  };

  return (
    <div className="bg-[#FEFAF8] min-h-screen py-14 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <FadeUp delay={0.05}>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#74202D] hover:text-[#5c1b2b] transition"
          >
            <HiOutlineArrowLeft /> Back to Shop
          </Link>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="rounded-[32px] border border-[#f3e7e4] bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#1f1f1f]">Your Wishlist</h1>
                <p className="text-sm text-gray-500 mt-2">Saved sarees you can review, remove, or add to cart.</p>
              </div>
              <span className="rounded-full border border-[#74202D] bg-[#fdf2f0] px-4 py-2 text-sm font-semibold text-[#74202D]">
                {wishlist.length} item{wishlist.length === 1 ? "" : "s"}
              </span>
            </div>

            {wishlist.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#d1b5ae] bg-[#fff6f2] p-10 text-center text-sm text-[#74202D]">
                Your wishlist is empty. Browse the shop and click the heart icon to save your favorite sarees.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item, index) => (
                  <FadeUp key={item.id} delay={0.05 + (index % 3) * 0.08}>
                    <div className="rounded-3xl border border-[#f3e7e4] bg-[#fffdfb] overflow-hidden shadow-sm h-full flex flex-col justify-between">
                      <div>
                        <Link to={`/shop/${item.id}`} className="block overflow-hidden">
                          <img src={item.img} alt={item.title} className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105" />
                        </Link>
                        <div className="p-5 space-y-4">
                          <Link to={`/shop/${item.id}`} className="block text-xl font-semibold uppercase text-[#1f1f1f] hover:text-[#74202D] transition">
                            {item.title}
                          </Link>
                          <div className="flex items-center gap-3">
                            <span className="text-[#74202D] font-bold">₹{item.discountPrice}</span>
                            <span className="line-through text-gray-400">₹{item.actualPrice}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Rating rating={item.rating} />
                            <span className="text-sm text-gray-500">({item.ratings})</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-0 flex flex-wrap gap-3">
                        <button
                          onClick={() => addToCart(item)}
                          className="rounded-full border border-[#74202D] bg-[#74202D] px-5 py-2 text-sm font-semibold text-white hover:bg-[#5c1b2b] transition cursor-pointer"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="rounded-full border border-[#74202D] bg-white px-5 py-2 text-sm font-semibold text-[#74202D] hover:bg-[#fdf2f0] transition cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            )}
          </div>
        </FadeUp>
      </div>
    </div>
  );
};

export default Wishlist;
