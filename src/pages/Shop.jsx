import React, { useState, useEffect } from "react";
import { MdMenuOpen } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import Rating from "../components/rating/Rating";

const Shop = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(25000);
  const [sort, setSort] = useState("default");
  const [showFilter, setShowFilter] = useState(false);

  // LOAD CART
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  // ADD TO CART
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
    setCart(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // DATA
  const sareesSale = [
    {
      id: 1,
      img: "/images/categoryImg-1.png",
      label: "New",
      category: "Silk",
      title: "Silk Sarees",
      discountPrice: 2899,
      actualPrice: 3699,
      rating: 4,
      ratings: "124",
    },
    {
      id: 2,
      img: "/images/categoryImg-2.png",
      label: "-20%",
      category: "Cotton",
      title: "Cotton Sarees",
      discountPrice: 3299,
      actualPrice: 4199,
      rating: 4,
      ratings: "98",
    },
    {
      id: 3,
      img: "/images/categoryImg-3.png",
      label: "-10%",
      category: "Paithani",
      title: "Paithani Sarees",
      discountPrice: 2999,
      actualPrice: 3799,
      rating: 4,
      ratings: "87",
    },
    {
      id: 4,
      img: "/images/categoryImg-4.png",
      label: "New",
      category: "Georgette",
      title: "Georgette Sarees",
      discountPrice: 1499,
      actualPrice: 1999,
      rating: 4,
      ratings: "64",
    },
    {
      id: 5,
      img: "/images/categoryImg-6.png",
      label: "New",
      category: "Organza",
      title: "Organza Sarees",
      discountPrice: 1299,
      actualPrice: 1999,
      rating: 4,
      ratings: "93",
    },
  ];

  // FILTER + SORT
  const filteredProducts = sareesSale
    .filter(
      (item) =>
        (selectedCategory === "All" ||
          item.category === selectedCategory) &&
        item.discountPrice <= maxPrice
    )
    .sort((a, b) => {
      if (sort === "low") return a.discountPrice - b.discountPrice;
      if (sort === "high") return b.discountPrice - a.discountPrice;
      return 0;
    });

  return (
    <div className="bg-[#FEFAF8]">

      {/* Banner */}
      <div className="bg-[url('/images/banner-1.png')] bg-cover bg-center h-75 sm:h-100 md:h-125 lg:h-162.5 2xl:h-200 w-full 
      flex items-center px-5 md:px-16 lg:px-24 relative overflow-hidden">
        <div className='w-full lg:w-[70%] lg:ml-10 absolute'>
          <h3 className='text-xs md:text-sm text-[#74202D] font-bold uppercase'>Shop</h3>
          <h1 className="text-lg sm:text-3xl lg:text-5xl font-semibold text-[#4A1F1C]">Our Saree Collection</h1>
          <div className='w-[50%] border md:w-[35%] lg:w-[40%] text-[#74202D] rounded-lg my-2 md:my-3 lg:my-4'></div>
          <p className='w-[60%] md:w-[50%] text-[#3b3737] text-xs md:text-base'>
            Discover timeless sarees crafted with tradition, <br /> woven with love.
          </p>

          <button className='bg-[#74202D] text-white uppercase py-1.5 px-3 md:py-2 md:px-8 rounded-sm
              hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer
              transition text-xs md:text-sm font-semibold mt-5'>
                Shop Now
          </button>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="flex justify-between items-center p-4 lg:hidden">
        <button
          onClick={() => setShowFilter(true)}
          className="border px-3 py-1 rounded"
        >
          Filters
        </button>

        <select
          onChange={(e) => setSort(e.target.value)}
          className="border px-2 py-1 text-sm"
        >
          <option value="default">Sort</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      <div className="w-[95%] mx-auto py-10 flex gap-6">

        {/* Sidebar */}
        <div
          className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-3/4 lg:w-[20%] bg-white z-20 p-5 shadow-md 
            transition-transform duration-300 rounded-lg border border-gray-300
          ${showFilter ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="flex justify-between items-center">
            <h4 className="text-[#74202D] font-semibold">Filter By</h4>
            <MdMenuOpen
              className="text-xl cursor-pointer lg:hidden"
              onClick={() => setShowFilter(false)}
            />
          </div>

          {/* Categories */}
          <h1 className="text-[#74202D] mt-6 mb-3 font-semibold">
            Categories
          </h1>

          {["All", "Silk", "Cotton", "Paithani", "Georgette", "Organza"].map(
            (cat) => (
              <p
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer mb-2 text-sm ${
                  selectedCategory === cat
                    ? "text-[#74202D] font-semibold"
                    : ""
                }`}
              >
                {cat}
              </p>
            )
          )}

          {/* Price */}
          <h1 className="text-[#74202D] mt-6 mb-2 font-semibold">
            Price
          </h1>

          <input
            type="range"
            min="500"
            max="25000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full accent-[#74202D]"
          />

          <p className="text-sm mt-2">Up to ₹{maxPrice}</p>
        </div>

        {/* Overlay */}
        {showFilter && (
          <div
            onClick={() => setShowFilter(false)}
            className="fixed inset-0 bg-black/40 lg:hidden"
          ></div>
        )}

        {/* Products */}
        <div className="w-full lg:w-[80%] bg-white py-5 px-10 border border-gray-300 rounded-lg shadow-md">

          {/* Desktop Top */}
          <div className="hidden lg:flex justify-between items-center my-5">
            <p className="text-sm text-gray-600">
              Showing {filteredProducts.length} products
            </p>

            <select
              onChange={(e) => setSort(e.target.value)}
              className="border px-2 py-1 text-sm cursor-pointer rounded-sm"
            >
              <option value="default">Default</option>
              <option value="low">Low → High</option>
              <option value="high">High → Low</option>
            </select>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 pb-10">

            {filteredProducts.length === 0 ? (
              <p>No products found</p>
            ) : (
              filteredProducts.map((item) => (
                <div key={item.id} className="shadow rounded overflow-hidden bg-white">

                  <img src={item.img} alt="" className="w-full" />

                  <div className="p-4">
                    <h2 className="font-semibold text-sm">{item.title}</h2>

                    <div className="flex gap-2 mt-1">
                      <span className="text-[#74202D] font-bold">
                        ₹{item.discountPrice}
                      </span>
                      <span className="line-through text-gray-400 text-sm">
                        ₹{item.actualPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <Rating rating={item.rating} />
                      <span className="text-xs text-gray-500">
                        ({item.ratings})
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(item)}
                      className="w-full mt-3 border border-[#74202D] text-[#74202D] py-1 text-sm 
                      hover:bg-[#74202D] hover:text-white cursor-pointer rounded-sm transition-all duration-300"
                    >
                      Add To Cart
                    </button>
                  </div>

                </div>
              ))
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;