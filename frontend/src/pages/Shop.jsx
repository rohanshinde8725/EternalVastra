import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { MdMenuOpen, MdGridView, MdViewList } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import Rating from "../components/rating/Rating";
import useProducts from "../hooks/useProducts";
import { API_BASE_URL } from "../api/products";
import { useToast } from "../context/ToastContext";
import { isAuthenticated } from "../utils/auth";
import FadeUp from "../components/animations/FadeUp";

const DEFAULT_CATEGORIES = [
  "Silk Sarees",
  "Cotton Sarees",
  "Paithani Sarees",
  "Georgette Sarees",
  "Organza Sarees",
];

const Shop = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
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
    if (!isAuthenticated()) {
      showToast.warning("Please sign in to add items to your cart.");
      navigate("/signin", { state: { from: location } });
      return;
    }

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
    showToast.success(`Added "${product.title}" to cart!`);
  };

  const toggleWishlist = (product) => {
    if (!isAuthenticated()) {
      showToast.warning("Please sign in to save items to your wishlist.");
      navigate("/signin", { state: { from: location } });
      return;
    }

    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isWishlisted = existingWishlist.some((item) => item.id === product.id);
    const updatedWishlist = isWishlisted
      ? existingWishlist.filter((item) => item.id !== product.id)
      : [...existingWishlist, product];

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlistIds(updatedWishlist.map((item) => item.id));
    window.dispatchEvent(new Event("wishlistUpdated"));

    if (!isWishlisted) {
      showToast.success(`Saved "${product.title}" to wishlist!`);
    } else {
      showToast.info(`Removed "${product.title}" from wishlist.`);
    }
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

  return (
    <div className="w-full bg-[#FEFAF8]">

      {/* Banner */}
      <div className="h-44 sm:h-56 md:h-64 w-full bg-center bg-cover bg-[url('/images/banner/banner-1.png')] flex items-center">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline gap-2 sm:gap-3">
            <h3 className="text-xs sm:text-sm text-[#74202D] font-bold uppercase tracking-wider">Shop</h3>
            <span className="text-slate-400">/</span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#74202D]">Our Saree Collection</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Explore authentic handwoven silks, pure chanderi cottons, and timeless heritage weaves.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">

        {/* Mobile Filter */}
        <div className="lg:hidden flex justify-between items-center mb-4 sm:mb-6">
          <button onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 border border-gray-300 bg-white px-3.5 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold shadow-xs cursor-pointer hover:border-[#74202D]" >
            <MdMenuOpen className="text-base sm:text-lg" />
            <span>Filters</span>
          </button>

          <select onChange={(e) => handleSortChange(e.target.value)} className="border border-gray-300 bg-white px-3 py-2 rounded-md text-xs sm:text-sm font-semibold shadow-xs focus:outline-none focus:border-[#74202D]">
            <option value="default">Sort By: Default</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>

        {/* Desktop Filter Bar */}
        <div className="hidden lg:flex justify-between items-center bg-white border border-gray-200/90 rounded-xl shadow-xs px-6 py-4 mb-8">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-xs sm:text-sm text-[#74202D] font-bold uppercase tracking-wider mr-2">
              Filter By Category:
            </h3>

            {categoryList.map((cat) => (
              <button key={cat} onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-md border text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer
                  ${ selectedCategory === cat
                      ? "bg-[#74202D] text-white border-[#74202D] shadow-xs"
                      : "border-gray-200 bg-gray-50/50 text-slate-700 hover:border-[#74202D] hover:text-[#74202D]"
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
          <div className="fixed inset-0 bg-black/40 lg:hidden z-40" onClick={() => setShowFilter(false)}/>
        )}

        {/* Products */}
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-3 sm:p-5 md:p-6">

          <div className="flex flex-col gap-3 justify-between items-start mb-4 sm:mb-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">
                Showing {filteredProducts.length === 0 ? 0 : indexOfFirstProduct + 1} -
                {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              </p>
              {searchQuery && (
                <p className="text-xs sm:text-sm text-[#74202D] mt-1">
                  Search results for "{searchQuery}"
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600">View</span>
              {[
                { id: "4", label: "4/4", icon: <MdGridView className="h-4 w-4 sm:h-5 sm:w-5" /> },
                { id: "table", label: "List", icon: <MdViewList className="h-4 w-4 sm:h-5 sm:w-5" /> },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleViewModeChange(option.id)}
                  aria-label={option.label}
                  className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md border transition cursor-pointer ${
                    viewMode === option.id
                      ? "bg-[#74202D] text-white border-[#74202D]"
                      : "bg-white text-[#3b3737] border-gray-300 hover:border-[#74202D] hover:text-[#74202D]"
                  }`}
                >
                  {option.icon}
                </button>
              ))}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-[#3b3737]"
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
            /* List View Mode: 2/2 Grid for lg devices with original w-20 h-20 image size */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {currentProducts.map((item, index) => (
                <FadeUp key={item.id} delay={Math.min(index * 0.05, 0.4)} className="h-full">
                  <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-lg border border-gray-200 bg-white transition h-full shadow-xs">
                    {/* Left: Thumbnail Image (w-20 h-20) + Info */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <Link to={`/shop/${item.id}`} className="shrink-0 overflow-hidden rounded block">
                        <img
                          src={item.img}
                          alt={item.title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/images/silk/silk-1.jpg";
                          }}
                          className="w-20 h-20 object-cover rounded shrink-0 transition-transform duration-300 ease-out group-hover:scale-110"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link to={`/shop/${item.id}`} className="font-medium text-sm hover:text-[#74202D] transition line-clamp-1 block">
                          {item.title}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{Array.isArray(item.category) ? item.category.join(", ") : item.category}</p>

                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-[#74202D] font-semibold text-sm">₹{item.discountPrice}</span>
                          <span className="text-xs text-gray-400 line-through">₹{item.actualPrice}</span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-1">
                          <Rating rating={item.rating} />
                          <span className="text-xs text-gray-500">({item.ratings})</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Add To Cart Button */}
                    <div className="shrink-0 sm:self-center">
                      <button
                        onClick={() => addToCart(item)}
                        disabled={cartIds.includes(item.id)}
                        className={`w-full sm:w-auto rounded-md border px-3.5 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                          cartIds.includes(item.id)
                            ? "border-gray-200 bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "border-[#74202D] bg-white text-[#74202D] hover:bg-[#74202D] hover:text-white"
                        }`}
                      >
                        {cartIds.includes(item.id) ? "Already in Cart" : "Add To Cart"}
                      </button>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          ) : (
            /* 4/4 Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {currentProducts.map((item, index) => (
                <FadeUp key={item.id} delay={Math.min(index * 0.05, 0.4)} className="h-full">
                  <div
                    className="group rounded-lg overflow-hidden border border-gray-200 bg-white transition h-full flex flex-col justify-between shadow-xs hover:shadow-md"
                  >
                    <div className="relative overflow-hidden bg-[#f8efe9]">
                      <Link to={`/shop/${item.id}`} className="block">
                        <img
                          loading="lazy"
                          src={item.img}
                          alt={item.title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/images/silk/silk-1.jpg";
                          }}
                          className="w-full h-48 sm:h-56 md:h-56 lg:h-64 xl:h-72 object-cover object-top transition duration-300 group-hover:scale-[1.05]"
                        />
                      </Link>
                      {/* Hover Overlay: Tag + Action Icons (Wishlist & View Eye) */}
                      <div className="pointer-events-none absolute inset-0 flex items-start justify-between bg-transparent md:bg-black/15 p-2.5 sm:p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 ease-out">
                        <span className="rounded-full bg-[#e9829a] px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase text-white shadow-xs transform translate-y-0 opacity-100 md:-translate-y-2 md:opacity-0 transition-all duration-300 ease-out md:group-hover:translate-y-0 md:group-hover:opacity-100">
                          {item.tag || "Handcrafted"}
                        </span>
                        <div className="pointer-events-auto flex flex-col gap-1.5 sm:gap-2">
                          <button
                            type="button"
                            onClick={() => toggleWishlist(item)}
                            aria-label={wishlistIds.includes(item.id) ? "Remove from wishlist" : "Add to wishlist"}
                            className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center cursor-pointer rounded-full shadow-md backdrop-blur-xs transform translate-x-0 opacity-100 md:translate-x-4 md:opacity-0 transition-all duration-300 ease-out md:group-hover:translate-x-0 md:group-hover:opacity-100 hover:scale-110 active:scale-95 delay-75 ${
                              wishlistIds.includes(item.id)
                                ? "bg-[#75212E] text-white"
                                : "bg-white/95 text-[#75212E] hover:bg-[#75212E] hover:text-white"
                            }`}
                          >
                            <CiHeart className={`text-lg sm:text-xl transition-transform duration-200 ${wishlistIds.includes(item.id) ? "fill-current scale-110" : ""}`} />
                          </button>
                          <Link
                            to={`/shop/${item.id}`}
                            aria-label={`View ${item.title}`}
                            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/95 text-[#75212E] shadow-md backdrop-blur-xs transform translate-x-0 opacity-100 md:translate-x-4 md:opacity-0 transition-all duration-300 ease-out md:group-hover:translate-x-0 md:group-hover:opacity-100 hover:bg-[#75212E] hover:text-white hover:scale-110 active:scale-95 delay-150"
                          >
                            <FiEye className="text-base sm:text-lg" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <Link to={`/shop/${item.id}`} className="block font-medium text-xs sm:text-sm line-clamp-2 hover:text-[#74202D] transition mb-1 sm:mb-2">
                          {item.title}
                        </Link>
                        <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                          <span className="text-[#74202D] font-bold text-xs sm:text-sm md:text-base">₹{item.discountPrice?.toLocaleString("en-IN")}</span>
                          <span className="line-through text-gray-400 text-[10px] sm:text-xs md:text-sm">₹{item.actualPrice?.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                          <Rating rating={item.rating} />
                          <span className="text-[10px] sm:text-xs text-gray-500">({item.ratings || 24})</span>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={cartIds.includes(item.id)}
                        className={`w-full mt-2.5 sm:mt-4 rounded-md py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition cursor-pointer ${
                          cartIds.includes(item.id)
                            ? "border border-gray-200 bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "border border-[#74202D] text-[#74202D] hover:bg-[#74202D] hover:text-white"
                        }`}
                      >
                        {cartIds.includes(item.id) ? "Already in Cart" : "Add To Cart"}
                      </button>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3.5 py-2 border rounded-md text-xs sm:text-sm font-semibold transition ${
                  currentPage === 1
                    ? "opacity-40 cursor-not-allowed border-gray-200 text-gray-400"
                    : "border-gray-300 text-slate-700 hover:bg-[#74202D] hover:text-white hover:border-[#74202D] cursor-pointer"
                }`}
              >
                Prev
              </button>

              {pageButtons().map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={`min-w-9 px-3.5 py-2 border rounded-md text-xs sm:text-sm font-semibold transition ${
                    safeCurrentPage === page
                      ? "bg-[#74202D] text-white border-[#74202D] shadow-xs"
                      : "bg-white text-slate-700 border-gray-300 hover:bg-[#74202D] hover:text-white hover:border-[#74202D] cursor-pointer"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3.5 py-2 border rounded-md text-xs sm:text-sm font-semibold transition ${
                  currentPage === totalPages
                    ? "opacity-40 cursor-not-allowed border-gray-200 text-gray-400"
                    : "border-gray-300 text-slate-700 hover:bg-[#74202D] hover:text-white hover:border-[#74202D] cursor-pointer"
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