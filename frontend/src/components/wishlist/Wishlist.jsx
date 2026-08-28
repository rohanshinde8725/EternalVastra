import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Rating from "../rating/Rating";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { MdGridView, MdViewList } from "react-icons/md";
import { useToast } from "../../context/ToastContext";

const Wishlist = () => {
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState("4");
  const [cartIds, setCartIds] = useState([]);

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
    <div className="container bg-[#FEFAF8] min-h-screen py-14 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#74202D] hover:text-[#5c1b2b] transition"
        >
          <HiOutlineArrowLeft /> Back to Shop
        </Link>

        <div className="rounded-4xl border border-[#f3e7e4] bg-white p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#1f1f1f]">Your Wishlist</h1>
              <p className="text-sm text-gray-500 mt-2">Saved sarees you can review, remove, or add to cart.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">View</span>
              {[
                { id: "4", label: "4/4", icon: <MdGridView className="h-5 w-5" /> },
                { id: "table", label: "List", icon: <MdViewList className="h-5 w-5" /> },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleViewModeChange(option.id)}
                  aria-label={option.label}
                  className={`flex h-10 w-10 items-center justify-center rounded-md border transition ${
                    viewMode === option.id
                      ? "bg-[#74202D] text-white border-[#74202D]"
                      : "bg-white text-[#3b3737] border-gray-300 hover:border-[#74202D] hover:text-[#74202D]"
                  }`}
                >
                  {option.icon}
                </button>
              ))}
            </div>
            <span className="absolute -top-2 -right-2 bg-[#74202D] text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {wishlist.length} item{wishlist.length === 1 ? "" : "s"}
            </span>
          </div>

          {wishlist.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#d1b5ae] bg-[#fff6f2] p-10 text-center text-sm text-[#74202D]">
              Your wishlist is empty. Browse the shop and click the heart icon to save your favorite sarees.
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto rounded-3xl border border-[#f3e7e4] bg-[#fffdfb] shadow-sm">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#FEFAF8] text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlist.map((item) => (
                    <tr key={item.id} className="border-b border-[#f3e7e4] hover:bg-white transition">
                      <td className="px-4 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <img src={item.img} alt={item.title} className="w-20 h-20 object-cover rounded" />
                          <div>
                            <Link to={`/shop/${item.id}`} className="font-semibold text-sm hover:text-[#74202D] transition">
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
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => addToCart(item)}
                            disabled={cartIds.includes(item.id)}
                            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                              cartIds.includes(item.id)
                                ? "border border-gray-200 bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "border border-[#74202D] text-[#74202D] hover:bg-[#74202D] hover:text-white"
                            }`}
                          >
                            {cartIds.includes(item.id) ? "Already in Cart" : "Add to Cart"}
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="rounded-md border border-[#74202D] px-3 py-2 text-sm font-semibold text-[#74202D] hover:bg-[#fdf2f0] transition"
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div key={item.id} className="rounded-3xl border border-[#f3e7e4] bg-[#fffdfb] overflow-hidden shadow-sm">
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
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => addToCart(item)}
                        disabled={cartIds.includes(item.id)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                          cartIds.includes(item.id)
                            ? "border border-gray-200 bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "border border-[#74202D] bg-[#74202D] text-white hover:bg-[#5c1b2b]"
                        }`}
                      >
                        {cartIds.includes(item.id) ? "Already in Cart" : "Add to Cart"}
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="rounded-full border border-[#74202D] bg-white px-5 py-2 text-sm font-semibold text-[#74202D] hover:bg-[#fdf2f0] transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
