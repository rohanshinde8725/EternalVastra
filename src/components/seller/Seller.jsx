import React from "react";
import { FaHeart } from "react-icons/fa";
import { GiThreeLeaves } from "react-icons/gi";
import Rating from "../rating/Rating";
import { useState } from "react";
import sarees from "../../api/LocalStorage";
import FadeImage from "../animations/FadeImage";
import FadeUp from "../animations/FadeUp";

const Seller = () => {

  const [cart, setCart] = useState([]);

  // ADD TO CART FUNCTION
  const addToCart = (product) => {
  const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

  const found = existingCart.find((item) => item.id === product.id);

  let updatedCart;

  if (found) {
    updatedCart = existingCart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    updatedCart = [...existingCart, { ...product, quantity: 1 }];
  }

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  window.dispatchEvent(new Event("cartUpdated"));

  console.log("Cart Updated:", updatedCart); // debug
};

  return (
    <div className="py-12 bg-[#FEFAF8]">

      {/* Heading */}
      <div className="py-20 lg:py-10 lg:px-8">

        <div className="flex items-center justify-center gap-2">
          <GiThreeLeaves className="text-[#74202D] text-2xl" />
          <h1 className="uppercase font-semibold text-xl md:text-2xl">Best Sellers</h1>
          <GiThreeLeaves className="text-[#74202D] text-2xl" />
        </div>

        <div className="px-5 mt-10 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5 justify-center 
        items-center">
          
          {sarees.slice(0, 5).map((sarees, index) => (
            <div
              key={index}
              className="shadow rounded-b-lg relative overflow-hidden">

              <img
                loading="lazy"
                decoding="async"
                className="sm:h-auto lg:h-auto 2xl:h-95 w-full cursor-pointer transition-all duration-300 
                rounded-t-lg object-cover"
                src={sarees.img}
                alt=""
              />

              <div className="absolute top-3 left-0 flex items-center justify-between w-full px-3">
                <p className="bg-[#74202D] py-1 px-3 text-xs text-white rounded-sm cursor-pointer">
                  {sarees.tag}
                </p>

                <FaHeart className="text-lg font-bold text-white cursor-pointer hover:text-red-600 transition-all duration-300" />{" "}
              </div>

              <div className="p-5">
                <FadeUp>
                  <h1 className="uppercase font-semibold text-xl">
                    {sarees.title}
                  </h1>
                </FadeUp>


                <div className="flex gap-5 mt-2">
                  <FadeUp>
                    <h2 className="text-[#74202D] font-bold text-base">
                      ₹{sarees.discountPrice}
                    </h2>
                  </FadeUp>
                  <FadeUp>
                    <h2 className="line-through text-gray-500 font-semibold text-base">
                      ₹{sarees.actualPrice}
                    </h2>
                  </FadeUp>
                </div>


                <div className="flex items-center gap-5 mt-2">
                  <FadeUp>
                    <Rating className="text-xl" rating={sarees.rating} />
                  </FadeUp>
                  <FadeUp>
                    <span className="text-sm text-gray-600 lg:text-lg">
                    ({sarees.ratings})
                  </span>
                 </FadeUp>
                </div>


                <button onClick={() => addToCart(sarees)}
                className="bg-white text-[#74202D] uppercase py-1.5 rounded-sm cursor-pointer 
                hover:bg-[#74202D] border-2 border-[#74202D] hover:text-white transition-all w-full 
                duration-300 font-semibold text-sm mt-5">
                  Add To Cart
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