import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { MdMenuOpen, MdGridView, MdViewList } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import Rating from "../components/rating/Rating";
import useProducts from "../hooks/useProducts";
import { API_BASE_URL } from "../api/products";

const DEFAULT_CATEGORIES = [
  "Silk Sarees",
  "Cotton Sarees",
  "Paithani Sarees",
  "Georgette Sarees",
  "Organza Sarees",
];

const Shop = () => {
  const { products: sarees, loading, error } = useProducts();
  const [categoryList, setCategoryList] = useState(["All", ...DEFAULT_CATEGORIES]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const maxPrice = 25000;
  const [sort, setSort] = useState("default");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [viewMode, setViewMode] = useState("4");
  const [cartIds, setCartIds] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const location = useLocation();
  const searchQuery = (new URLSearchParams(location.search).get("search") || "").trim().toLowerCase();
  const categoryQuery = new URLSearchParams(location.search).get("category") || "";

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/categories`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const apiCats = data.map((c) => c.name).filter(Boolean);
          const productCats = sarees.flatMap((p) => p.category || []).filter(Boolean);
          const combined = Array.from(new Set([...apiCats, ...DEFAULT_CATEGORIES, ...productCats]));
          setCategoryList(["All", ...combined]);
        }
      })
      .catch(() => {});
  }, [sarees]);

  useEffect(() => {
    const savedViewMode = localStorage.getItem("shopViewMode");
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

  useEffect(() => {
    const loadWishlistIds = () => {
      const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlistIds(existingWishlist.map((item) => item.id));
    };

    loadWishlistIds();
    window.addEventListener("wishlistUpdated", loadWishlistIds);
    return () => window.removeEventListener("wishlistUpdated", loadWishlistIds);
  }, []);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("shopViewMode", mode);
  };

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
    setCartIds(updatedCart.map((item) => item.id));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const toggleWishlist = (product) => {
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isWishlisted = existingWishlist.some((item) => item.id === product.id);
    const updatedWishlist = isWishlisted
      ? existingWishlist.filter((item) => item.id !== product.id)
      : [...existingWishlist, product];

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlistIds(updatedWishlist.map((item) => item.id));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    } else {
      setSelectedCategory("All");
    }
    setCurrentPage(1);
  }, [categoryQuery]);

  const handleSortChange = (value) => {
    setSort(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // FILTER + SORT
  const filteredProducts = sarees
    .filter(
      (item) =>
        (selectedCategory === "All" ||
        item.category.includes(selectedCategory)) &&
        item.discountPrice <= maxPrice &&
        (searchQuery === "" ||
          item.title?.toLowerCase().includes(searchQuery) ||
          item.category.some((cat) =>
            cat.toLowerCase().includes(searchQuery)
          ))
    )
    .sort((a, b) => {
      if (sort === "low") return a.discountPrice - b.discountPrice;
      if (sort === "high") return b.discountPrice - a.discountPrice;
      return 0;
    });

    // pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const indexOfLastProduct = safeCurrentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageButtons = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (safeCurrentPage === 1) {
      return [1, 2, 3];
    }

    if (safeCurrentPage === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }

    return [safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1];
  };

  const gridClassNames = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4";

  return (
    <div className="w-full bg-[#FEFAF8]">

      {/* Banner */}
      <div className="h-70 w-full bg-center bg-[url('/images/banner/banner-1.png')] flex items-center px-5 md:px-16 lg:px-24">
        <div className="flex items-baseline gap-3">
          <h3 className="text-xs md:text-sm text-[#74202D] font-bold uppercase">Shop</h3>
          <span>/</span>
          <h1 className="text-lg sm:text-2xl font-semibold text-[#74202D]">Our Saree Collection</h1>
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

      <div className="container mx-auto py-10">

        {/* Mobile Filter */}
        <div className="lg:hidden flex justify-between items-center mb-5">
          <button  onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 border px-4 py-2 rounded-md" >
            <MdMenuOpen />
            Filters
          </button>

          <select onChange={(e) => handleSortChange(e.target.value)} className="border px-3 py-2 rounded-md text-sm">
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

            {categoryList.map((cat) => (
              <button key={cat} onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2 rounded-md border text-sm transition-all duration-300 cursor-pointer
                  ${ selectedCategory === cat
                      ? "bg-[#74202D] text-white border-[#74202D]"
                      : "border-gray-300 hover:border-[#74202D] hover:text-[#74202D]"
                  }`}>
                {cat}
              </button>
            ))}
          </div>

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

          {categoryList.map((cat) => (
            <button key={cat} onClick={() => {
                handleCategoryChange(cat);
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

          <div className="flex flex-col gap-3 justify-between items-start mb-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length === 0 ? 0 : indexOfFirstProduct + 1} -
                {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              </p>
              {searchQuery && (
                <p className="text-sm text-[#74202D] mt-1">
                  Search results for "{searchQuery}"
                </p>
              )}
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
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm text-[#3b3737]"
                >
                  <option value="default">Default</option>
                  <option value="low">Price: Low → High</option>
                  <option value="high">Price: High → Low</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-12 h-12 border-4 border-[#74202D] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-base font-medium text-[#74202D]">Loading sarees collection...</p>
              <p className="text-xs text-gray-500">Fetching handpicked weaves just for you</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xl font-bold">!</div>
              <p className="text-base font-semibold text-red-700">{error}</p>
              <p className="text-xs text-gray-500">Please check your internet connection or backend status.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
              <p className="text-base font-medium text-gray-700">No products found</p>
              <p className="text-xs text-gray-400 mt-1">Try selecting a different category or clearing search filters.</p>
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-500">
                    <th className="py-3 pr-4">Product</th>
                    <th className="py-3 pr-4">Price</th>
                    <th className="py-3 pr-4">Rating</th>
                    <th className="py-3 pr-4">Add</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="py-4 pr-4 align-top">
                        <div className="flex items-center gap-3">
                          <img src={item.img} alt={item.title} className="w-20 h-20 object-cover rounded" />
                          <div>
                            <Link to={`/shop/${item.id}`} className="font-medium text-sm hover:text-[#74202D] transition">
                              {item.title}
                            </Link>
                            <p className="text-xs text-gray-500 mt-1">{item.category.join(", ")}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4 align-top">
                        <span className="text-[#74202D] font-semibold">₹{item.discountPrice}</span>
                        <div className="text-xs text-gray-400 line-through">₹{item.actualPrice}</div>
                      </td>
                      <td className="py-4 pr-4 align-top">
                        <div className="flex items-center gap-2">
                          <Rating rating={item.rating} />
                          <span className="text-xs text-gray-500">({item.ratings})</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4 align-top">
                        <button
                          onClick={() => addToCart(item)}
                          disabled={cartIds.includes(item.id)}
                          className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                            cartIds.includes(item.id)
                              ? "border-gray-200 bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "border-[#74202D] bg-white text-[#74202D] hover:bg-[#74202D] hover:text-white"
                          }`}
                        >
                          {cartIds.includes(item.id) ? "Already in Cart" : "Add To Cart"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={`grid ${gridClassNames} gap-5`}>
              {currentProducts.map((item) => (
                <div key={item.id}
                  className="group rounded-lg overflow-hidden border border-gray-200 bg-white transition"
                >
                  <div className="relative overflow-hidden">
                    <Link to={`/shop/${item.id}`} className="block">
                    <img loading="lazy" src={item.img} alt={item.title} className="w-full h-90 2xl:object-center object-cover object-top transition duration-300 group-hover:scale-[1.05]"/>
                    </Link>
                    <div className="pointer-events-none absolute inset-0 flex items-start justify-between bg-black/10 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="rounded-full bg-[#e9829a] px-2.5 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
                        {item.tag || "Handcrafted"}
                      </span>
                      <div className="pointer-events-auto flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => toggleWishlist(item)}
                          aria-label={wishlistIds.includes(item.id) ? "Remove from wishlist" : "Add to wishlist"}
                          className={`flex h-9 w-9 items-center justify-center cursor-pointer rounded-full bg-white shadow-sm transition hover:bg-[#75212E] hover:text-white ${wishlistIds.includes(item.id) ? "text-[#75212E]" : "text-[#75212E]"}`}
                        >
                          <CiHeart className="text-xl" />
                        </button>
                        <Link
                          to={`/shop/${item.id}`}
                          aria-label={`View ${item.title}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#75212E] shadow-sm transition hover:bg-[#75212E] hover:text-white"
                        >
                          <FiEye className="text-lg" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <Link to={`/shop/${item.id}`} className="block font-medium text-sm line-clamp-2 hover:text-[#74202D] transition mb-2">
                      {item.title}
                    </Link>
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
                      disabled={cartIds.includes(item.id)}
                      className={`w-full mt-4 rounded-md py-2 text-sm transition cursor-pointer ${
                        cartIds.includes(item.id)
                          ? "border border-gray-200 bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "border border-[#74202D] text-[#74202D] hover:bg-[#74202D] hover:text-white"
                      }`}
                    >
                      {cartIds.includes(item.id) ? "Already in Cart" : "Add To Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && filteredProducts.length > 0 && (
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

              {pageButtons().map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded transition ${
                    safeCurrentPage === page
                      ? "bg-[#74202D] text-white border-[#74202D] scale-105"
                      : "bg-white text-[#3b3737] border-gray-300 opacity-70 hover:opacity-100 hover:bg-[#74202D] hover:text-white cursor-pointer"
                  }`}
                >
                  {page}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;