import React, { useState, useEffect } from "react";
import { MdMenuOpen } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import Rating from "../components/rating/Rating";
import sarees from "../api/LocalStorage";

const Shop = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(25000);
  const [sort, setSort] = useState("default");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // LOAD CART
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, maxPrice, sort]);


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

  // FILTER + SORT
  const filteredProducts = sarees
    .filter(
      (item) =>
        (selectedCategory === "All" ||
        item.category.includes(selectedCategory)) &&
        item.discountPrice <= maxPrice
    )
    .sort((a, b) => {
      if (sort === "low") return a.discountPrice - b.discountPrice;
      if (sort === "high") return b.discountPrice - a.discountPrice;
      return 0;
    });

    // pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  console.log(currentProducts.length);
console.log(currentProducts.map(item => item.id));

  return (
    <div className="bg-[#FEFAF8]">

      {/* Banner */}
      <div className="bg-[url('/images/banner/banner-1.png')] bg-cover bg-center h-75 sm:h-100 md:h-125 lg:h-162.5 2xl:h-200 w-full 
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
      {/* <div className="flex justify-between items-center p-4 lg:hidden">
        <button onClick={() => setShowFilter(true)} className="border px-3 py-1 rounded">
          Filters
        </button>

        <select onChange={(e) => setSort(e.target.value)} className="border px-2 py-1 text-sm">
          <option value="default">Sort</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div> */}

      <div className="w-[95%] mx-auto py-10">

        {/* Mobile Filter */}
        <div className="lg:hidden flex justify-between items-center mb-5">
          <button  onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 border px-4 py-2 rounded-md" >
            <MdMenuOpen />
            Filters
          </button>

          <select onChange={(e) => setSort(e.target.value)} className="border px-3 py-2 rounded-md text-sm">
            <option value="default">Sort By</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>

        {/* Desktop Filter Bar */}
        <div className="hidden lg:flex justify-between items-center bg-white border border-gray-300 rounded-xl shadow-sm px-6 py-5 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-[#74202D] font-semibold mr-2">
              Filter By Category
            </h3>

            {[ "All", "Silk Sarees", "Cotton Sarees", "Paithani Sarees", "Georgette Sarees", "Organza Sarees", 
            ].map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-md border text-sm transition-all duration-300 cursor-pointer
                  ${ selectedCategory === cat
                      ? "bg-[#74202D] text-white border-[#74202D]"
                      : "border-gray-300 hover:border-[#74202D] hover:text-[#74202D]"
                  }`}>
                {cat}
              </button>
            ))}
          </div>

          <select onChange={(e) => setSort(e.target.value)}
           className="border border-gray-300 px-4 py-2 rounded-md text-sm cursor-pointer">
            <option value="default">Sort By</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>

        {/* Mobile Sidebar */}
        <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 p-5 shadow-lg transition-transform 
        duration-300 lg:hidden ${ showFilter ? "translate-x-0" : "-translate-x-full" }`}>
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[#74202D] text-lg"> Filter By </h3>
            <MdMenuOpen
              className="text-2xl cursor-pointer"
              onClick={() => setShowFilter(false)}
            />
          </div>

          <h4 className="mt-8 mb-3 font-semibold text-[#74202D]">
            Categories
          </h4>

          {[ "All", "Silk Sarees", "Cotton Sarees", "Paithani Sarees", "Georgette Sarees", "Organza Sarees",
          ].map((cat) => (
            <button key={cat} onClick={() => {
                setSelectedCategory(cat);
                setShowFilter(false);
              }}
              className={`block w-full text-left py-2 text-sm ${
                selectedCategory === cat
                  ? "text-[#74202D] font-semibold"
                  : ""
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {showFilter && (
          <div className="fixed inset-0 bg-black/40 lg:hidden" onClick={() => setShowFilter(false)}/>
        )}

        {/* Products */}
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6">

          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstProduct + 1} -
              {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
            {filteredProducts.length === 0 ? (
              <p>No products found</p>
            ) : (
              currentProducts.map((item) => (
                <div key={item.id}
                  className="rounded-lg overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition"
                >
                  <img loading="lazy" src={item.img} alt={item.title} className="w-full h-72 object-cover object-top"/>
                  <div className="p-4">
                    <h2 className="font-medium text-sm line-clamp-2">{item.title}</h2>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[#74202D] font-bold">₹{item.discountPrice}</span>
                      <span className="line-through text-gray-400 text-sm">₹{item.actualPrice}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Rating rating={item.rating} />
                      <span className="text-xs text-gray-500">({item.ratings})</span>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full mt-4 border border-[#74202D] text-[#74202D] py-2 rounded-md text-sm hover:bg-[#74202D] hover:text-white transition cursor-pointer"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#74202D] hover:text-white cursor-pointer"
              }`}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button key={index} onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 border rounded ${
                  currentPage === index + 1
                    ? "bg-[#74202D] text-white border-[#74202D]"
                    : "hover:bg-[#74202D] hover:text-white cursor-pointer"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#74202D] hover:text-white cursor-pointer"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;