import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { MdMenuOpen, MdGridView, MdViewList } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { FiEye, FiSearch, FiGrid, FiList } from "react-icons/fi";
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
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [viewMode, setViewMode] = useState("4");
  const [cartIds, setCartIds] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const location = useLocation();
  const searchQuery = (new URLSearchParams(location.search).get("search") || "").trim().toLowerCase();
  const categoryQuery = new URLSearchParams(location.search).get("category") || "";
  const [search, setSearch] = useState(searchQuery);

  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

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
    window.addEventListener("cartUpdated", loadCartIds);
    window.addEventListener("userUpdated", loadCartIds);
    return () => {
      window.removeEventListener("cartUpdated", loadCartIds);
      window.removeEventListener("userUpdated", loadCartIds);
    };
  }, []);

  useEffect(() => {
    const loadWishlistIds = () => {
      const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlistIds(existingWishlist.map((item) => item.id));
    };

    loadWishlistIds();
    window.addEventListener("wishlistUpdated", loadWishlistIds);
    window.addEventListener("userUpdated", loadWishlistIds);
    return () => {
      window.removeEventListener("wishlistUpdated", loadWishlistIds);
      window.removeEventListener("userUpdated", loadWishlistIds);
    };
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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
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
        (search.trim() === "" ||
          item.title?.toLowerCase().includes(search.toLowerCase().trim()) ||
          item.category.some((cat) =>
            cat.toLowerCase().includes(search.toLowerCase().trim())
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
      <div className="h-44 sm:h-56 md:h-64 w-full bg-center bg-cover bg-[url('/images/banner/banner-1.webp')] flex items-center">
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

        {/* ========================================================================= */}
        {/* UNIFIED SEARCH & FILTER CONTROLS (Blog Style) */}
        {/* ========================================================================= */}
        <FadeUp delay={0.15}>
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-4 mb-8">

            {/* Top Row: Search Input + Sort Dropdown + Grid/List Toggle */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

              {/* Search Box */}
              <div className="relative flex-1 max-w-xl">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search sarees by name, type, or occasion..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#74202D] focus:bg-white transition"
                />
              </div>

              {/* Controls Right */}
              <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="text-slate-500 whitespace-nowrap">Sort by:</span>
                  <select
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 rounded-md bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#74202D] cursor-pointer"
                  >
                    <option value="default">Default</option>
                    <option value="low">Price: Low → High</option>
                    <option value="high">Price: High → Low</option>
                  </select>
                </div>

                {/* View Switcher: Grid vs List */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleViewModeChange("4")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${viewMode === "4"
                        ? "bg-[#74202D] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                      }`}
                    title="Grid View"
                  >
                    <FiGrid className="text-sm" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleViewModeChange("table")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${viewMode === "table"
                        ? "bg-[#74202D] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                      }`}
                    title="List View"
                  >
                    <FiList className="text-sm" />
                    <span className="hidden sm:inline">List</span>
                  </button>
                </div>

              </div>

            </div>

            {/* Bottom Row: Category Pills */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto custom-admin-scroll pb-1">
              {categoryList.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 rounded-md border text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${isSelected
                        ? "bg-[#74202D] text-white border-[#74202D] shadow-xs"
                        : "border-gray-200 bg-gray-50/50 text-slate-700 hover:border-[#74202D] hover:text-[#74202D]"
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 justify-between items-start sm:flex-row sm:items-center">
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
          </div>

          </div>
        </FadeUp>

        {/* Products */}
        <div className="">

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
                            e.currentTarget.src = "/images/silk/silk-1.webp";
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
                            e.currentTarget.src = "/images/silk/silk-1.webp";
                          }}
                          className="w-full h-[230px] sm:h-[300px] 2xl:h-[360px] object-cover object-top transition duration-300 group-hover:scale-[1.05]"
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