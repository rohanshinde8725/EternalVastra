import React from "react";
import { FaHeart } from "react-icons/fa";
import { GiThreeLeaves } from "react-icons/gi";
import Rating from "../rating/Rating";
import { useState } from "react";

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

  const sareesSale = [
    {
      id: 1,
      img: "/images/categoryImg-1.png",
      category: "New",
      title: "Silk Sarees",
      discountPrice: 2899,
      actualPrice: 3699,
      rating: 4,
      ratings: "124",
    },
    {
      id: 2,
      img: "/images/categoryImg-2.png",
      category: "-20%",
      title: "Cotton Sarees",
      discountPrice: 3299,
      actualPrice: 4199,
      rating: 4,
      ratings: "98",
    },
    {
      id: 3,
      img: "/images/categoryImg-3.png",
      category: "-10%",
      title: "Paithani Sarees",
      discountPrice: 2999,
      actualPrice: 3799,
      rating: 4,
      ratings: "87",
    },
    {
      id: 4,
      img: "/images/categoryImg-4.png",
      category: "New",
      title: "Georgette Sarees",
      discountPrice: 1499,
      actualPrice: 1999,
      rating: 4,
      ratings: "64",
    },
    {
      id: 5,
      img: "/images/categoryImg-6.png",
      category: "New",
      title: "Organza Sarees",
      discountPrice: 1299,
      actualPrice: 1999,
      rating: 4,
      ratings: "93",
    },
  ];

  return (
    <div className="py-12 bg-[#FEFAF8]">

      {/* Heading */}
      <div className="py-20 lg:py-10">

        <div className="flex items-center justify-center gap-2">
          <GiThreeLeaves className="text-[#74202D] text-2xl" />
          <h1 className="uppercase font-semibold text-xl md:text-2xl">Best Sellers</h1>
          <GiThreeLeaves className="text-[#74202D] text-2xl" />
        </div>

        <div className="px-5 mt-10 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5 justify-center 
        items-center">
          
          {sareesSale.map((sareesSale, index) => (
            <div
              key={index}
              className="shadow rounded-b-lg relative overflow-hidden"
            >

              <img
                className="sm:h-auto lg:h-auto 2xl:h-95 w-full cursor-pointer transition-all duration-300 rounded-t-lg"
                src={sareesSale.img}
                alt=""
              />

              <div className="absolute top-3 left-0 flex items-center justify-between w-full px-3">
                <p className="bg-[#74202D] py-1 px-3 text-xs text-white rounded-sm cursor-pointer">
                  {sareesSale.category}
                </p>

                <FaHeart className="text-lg font-bold text-white cursor-pointer hover:text-red-600 transition-all duration-300" />{" "}
              </div>


              <div className="p-5">
                <h1 className="uppercase font-semibold text-base">
                  {sareesSale.title}
                </h1>


                <div className="flex gap-5 mt-2">
                  <h2 className="text-[#74202D] font-bold">
                    ₹{sareesSale.discountPrice}
                  </h2>
                  <h2 className="line-through text-gray-500 font-semibold">
                    ₹{sareesSale.actualPrice}
                  </h2>
                </div>


                <div className="flex gap-5 mt-2">
                  <Rating rating={sareesSale.rating} />
                  <span className="text-sm text-gray-600">
                    ({sareesSale.ratings})
                  </span>
                </div>


                <button onClick={() => addToCart(sareesSale)}
                className="bg-white text-[#74202D] uppercase py-1.5 rounded-sm cursor-pointer hover:bg-[#74202D] border-2 border-[#74202D] hover:text-white transition-all w-full duration-300 font-semibold text-sm mt-5">
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
