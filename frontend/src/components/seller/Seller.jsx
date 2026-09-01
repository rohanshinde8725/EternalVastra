import { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { GiThreeLeaves } from "react-icons/gi";
import { Link } from "react-router-dom";
import Rating from "../rating/Rating";
import useProducts from "../../hooks/useProducts";
import FadeImage from "../animations/FadeImage";
import FadeUp from "../animations/FadeUp";

const Seller = () => {
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
    return () => {
      window.removeEventListener("wishlistUpdated", syncWishlist);
      window.removeEventListener("cartUpdated", syncCart);
    };
  }, []);

  const toggleSellerWishlist = (product) => {
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isInWishlist = existingWishlist.some((item) => item.id === product.id);
    const updatedWishlist = isInWishlist
      ? existingWishlist.filter((item) => item.id !== product.id)
      : [...existingWishlist, product];

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlistIds(updatedWishlist.map((item) => item.id));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const isInCart = existingCart.some((item) => item.id === product.id);
    if (isInCart) return;

    const updatedCart = [...existingCart, { ...product, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartIds(updatedCart.map((item) => item.id));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="py-10 bg-[#FEFAF8] w-full">
      <div className="max-w-[1600px] mx-auto px-5">

        {/* Heading */}
        <div className="flex items-center justify-center gap-2">
          <GiThreeLeaves className="text-[#74202D] text-2xl" />
          <h1 className="uppercase font-semibold text-xl md:text-2xl">Best Sellers</h1>
          <GiThreeLeaves className="text-[#74202D] text-2xl" />
        </div>

        <div className="seller mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 justify-center items-center">

          {sarees.slice(0, 5).map((saree, index) => (
            <div
              key={index}
              className="group shadow rounded-b-lg relative overflow-hidden border border-gray-200 bg-white transition rounded-t-lg"
            >
              {/* Image + Hover Overlay */}
              <div className="relative overflow-hidden rounded-t-lg">
                <Link to={`/shop/${saree.id}`} className="block">
                  <FadeImage
                    src={saree.img}
                    alt={saree.title}
                    loading="lazy"
                    decoding="async"
                    className="sm:h-auto lg:h-auto 2xl:h-75 w-full rounded-t-lg object-cover object-top transition duration-300 group-hover:scale-[1.05]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>

                {/* Hover Overlay — matches Shop page exactly */}
                <div className="pointer-events-none absolute inset-0 flex items-start justify-between bg-black/10 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-t-lg">
                  {/* Tag Badge (bottom-left style → top-left like shop) */}
                  <span className="rounded-full bg-[#e9829a] px-2.5 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
                    {saree.tag || "Handcrafted"}
                  </span>

                  {/* Action Icons — Wishlist + Quick View */}
                  <div className="pointer-events-auto flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSellerWishlist(saree)}
                      aria-label={wishlistIds.includes(saree.id) ? "Remove from wishlist" : "Add to wishlist"}
                      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-[#75212e] hover:text-white ${
                        wishlistIds.includes(saree.id) ? "text-[#75212e]" : "text-[#75212e]"
                      }`}
                    >
                      <CiHeart className="text-xl" />
                    </button>

                    <Link
                      to={`/shop/${saree.id}`}
                      aria-label={`View ${saree.title}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#75212e] shadow-sm transition hover:bg-[#75212e] hover:text-white"
                    >
                      <FiEye className="text-lg" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <FadeUp>
                  <Link
                    to={`/shop/${saree.id}`}
                    className="block uppercase font-semibold text-sm line-clamp-2 hover:text-[#74202D] transition mb-2"
                  >
                    {saree.title}
                  </Link>
                </FadeUp>

                <div className="flex gap-3 mt-1">
                  <FadeUp>
                    <h2 className="text-[#74202D] font-bold text-base">
                      ₹{saree.discountPrice}
                    </h2>
                  </FadeUp>
                  <FadeUp>
                    <h2 className="line-through text-gray-400 font-semibold text-sm mt-0.5">
                      ₹{saree.actualPrice}
                    </h2>
                  </FadeUp>
                </div>

                <div className="flex items-center gap-2 mt-1.5">
                  <FadeUp>
                    <Rating className="text-xl" rating={saree.rating} />
                  </FadeUp>
                  <FadeUp>
                    <span className="text-sm text-gray-600">
                      ({saree.ratings})
                    </span>
                  </FadeUp>
                </div>

                <button
                  onClick={() => addToCart(saree)}
                  disabled={cartIds.includes(saree.id)}
                  className={`w-full mt-4 rounded-md py-2 text-sm font-semibold transition-all duration-300
                    ${cartIds.includes(saree.id)
                      ? "border border-gray-200 bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "border border-[#74202D] text-[#74202D] hover:bg-[#74202D] hover:text-white cursor-pointer"
                    }`}
                >
                  {cartIds.includes(saree.id) ? "Already in Cart" : "Add To Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Seller;