import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
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

    const syncWishlist = () => {
      loadWishlist();
    };

    const syncCart = () => {
      loadCart();
    };

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

  // ADD TO CART FUNCTION
  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const isInCart = existingCart.some((item) => item.id === product.id);
    if (isInCart) {
      return;
    }

    const updatedCart = [...existingCart, { ...product, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartIds(updatedCart.map((item) => item.id));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="py-10 bg-[#FEFAF8]">

      {/* Heading */}
      <div className="">

        <div className="flex items-center justify-center gap-2">
          <GiThreeLeaves className="text-[#74202D] text-2xl" />
          <h1 className="uppercase font-semibold text-xl md:text-2xl">Best Sellers</h1>
          <GiThreeLeaves className="text-[#74202D] text-2xl" />
        </div>

        <div className="seller px-5 mt-10 mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 justify-center 
        items-center">
          
          {sarees.slice(0, 5).map((saree, index) => (
            <div
              key={index}
              className="shadow rounded-b-lg relative overflow-hidden">

              <Link to={`/shop/${saree.id}`} className="block overflow-hidden">
                <FadeImage
                  src={saree.img}
                  alt={saree.title}
                  loading="lazy"
                  decoding="async"
                  className="sm:h-auto lg:h-auto 2xl:h-95 w-full rounded-t-lg object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>

              <div className="absolute top-3 left-0 flex items-center justify-between w-full px-3">
                <p className="bg-[#74202D] py-1 px-3 text-xs text-white rounded-sm cursor-pointer">
                  {saree.tag}
                </p>

                <button
                  type="button"
                  onClick={() => toggleSellerWishlist(saree)}
                  className={`rounded-full p-2 bg-transparent transition-all duration-300 ${wishlistIds.includes(saree.id) ? 
                    'text-[#74202D]' : 'text-white hover:text-[#74202D]'}`}
                >
                  <FaHeart className="text-lg cursor-pointer" />
                </button>
              </div>

              <div className="p-5">
                <FadeUp>
                  <Link to={`/shop/${saree.id}`} className="block uppercase font-semibold text-base hover:text-[#74202D] transition">
                    {saree.title}
                  </Link>
                </FadeUp>


                <div className="flex gap-5 mt-2">
                  <FadeUp>
                    <h2 className="text-[#74202D] font-bold text-base">
                      ₹{saree.discountPrice}
                    </h2>
                  </FadeUp>
                  <FadeUp>
                    <h2 className="line-through text-gray-500 font-semibold text-base">
                      ₹{saree.actualPrice}
                    </h2>
                  </FadeUp>
                </div>


                <div className="flex items-center gap-5 mt-2">
                  <FadeUp>
                    <Rating className="text-xl" rating={saree.rating} />
                  </FadeUp>
                  <FadeUp>
                    <span className="text-sm text-gray-600 lg:text-lg">
                    ({saree.ratings})
                  </span>
                 </FadeUp>
                </div>


                <button
                  onClick={() => addToCart(saree)}
                  disabled={cartIds.includes(saree.id)}
                  className={`w-full uppercase py-1.5 rounded-sm transition-all duration-300 font-semibold text-sm mt-5
                    ${cartIds.includes(saree.id)
                    ? 'bg-gray-200 text-gray-500 border border-gray-200'
                    : 'bg-white text-[#74202D] hover:bg-[#74202D] border-2 border-[#74202D] hover:text-white cursor-pointer'
                  }`}
                >
                  {cartIds.includes(saree.id) ? 'Already in Cart' : 'Add To Cart'}
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