import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Rating from "../components/rating/Rating";
import useProducts from "../hooks/useProducts";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { CiSearch, CiHeart } from "react-icons/ci";
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaShareAlt, FaWhatsapp } from "react-icons/fa";
import { FiScissors, FiEye } from "react-icons/fi";
import { useToast } from "../context/ToastContext";
import { isAuthenticated } from "../utils/auth";
import FadeUp from "../components/animations/FadeUp";

const defaultDetails = {
  description:
    "This saree is crafted with careful attention to color and texture, making it an elegant choice for celebrations and special events. Enjoy refined drape and comfortable wear throughout the day.",
  material: "Delicate Organza",
  occasion: "Festive and formal wear",
  care: "Dry clean only. Store folded in a cool, dry place away from direct sunlight.",
  highlights: [
    "Graceful saree silhouette",
    "Comfortable drape throughout the day",
    "Lightweight feel with premium finish",
    "Designed for contemporary and festive styling",
  ],
};

const getCategoryMaterial = (category) => {
  const cat = String(category || "").toLowerCase();
  if (cat.includes("organza")) return "Delicate Organza";
  if (cat.includes("cotton")) return "Fine Chanderi Cotton";
  if (cat.includes("paithani")) return "Pure Silk with Gold Zari Border";
  if (cat.includes("georgette")) return "Flowing Pure Georgette";
  if (cat.includes("banarasi")) return "Heritage Banarasi Katan Silk";
  if (cat.includes("chiffon")) return "Lightweight Premium Chiffon";
  if (cat.includes("linen")) return "Organic Handwoven Linen";
  return "Premium Blended Silk";
};

const getResolvedDetails = (product) => {
  if (!product) return defaultDetails;
  const raw = product.details || {};
  const catName = product.category?.[0] || "Heritage Sarees";
  const cleanTitle = product.title?.trim() || "Saree";

  const description =
    raw.description?.trim() ||
    product.description?.trim() ||
    `${cleanTitle} blends elegant texture with refined color detail. Designed for a graceful silhouette, this saree is ideal for special occasions and festive celebrations.`;

  const material =
    raw.material?.trim() ||
    product.material?.trim() ||
    getCategoryMaterial(catName);

  const occasion =
    raw.occasion?.trim() ||
    product.occasion?.trim() ||
    "Festive and Celebration Wear";

  const care =
    raw.care?.trim() ||
    product.care?.trim() ||
    "Dry clean only. Store folded in a cool, dry place away from direct sunlight.";

  const highlights =
    Array.isArray(raw.highlights) && raw.highlights.length > 0
      ? raw.highlights
      : [
          `${cleanTitle} inspired elegance`,
          "Comfortable drape throughout the day",
          "Lightweight feel with premium finish",
          `${catName} styling for contemporary looks`,
        ];

  return {
    description,
    material,
    occasion,
    care,
    highlights,
  };
};

const SareeDetail = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = useParams();
  const { products: sarees, loading, error } = useProducts();
  const product = sarees.find((item) => item.id === Number(productId));
  const content = getResolvedDetails(product);
  const thumbnails = product ? [product.img, product.img, product.img, product.img] : [];

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [cartIds, setCartIds] = useState([]);
  const [selectedImage, setSelectedImage] = useState(product?.img || "");
  const [activeTab, setActiveTab] = useState("Care & Craft");

  const addToCart = (productItem) => {
    if (!isAuthenticated()) {
      showToast.warning("Please sign in to add items to your cart.");
      navigate("/signin", { state: { from: location } });
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const found = existingCart.find((item) => item.id === productItem.id);
    const updatedCart = found
      ? existingCart.map((item) =>
          item.id === productItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...existingCart, { ...productItem, quantity: 1 }];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    showToast.success(`Added "${productItem.title}" to cart!`);
  };

  const toggleWishlist = (targetProduct) => {
    if (!isAuthenticated()) {
      showToast.warning("Please sign in to save items to your wishlist.");
      navigate("/signin", { state: { from: location } });
      return;
    }

    // If targetProduct is a React Click Event or null, default to current product
    const itemToToggle = (targetProduct && typeof targetProduct.id === "number") ? targetProduct : product;
    if (!itemToToggle || !itemToToggle.id) return;

    const rawWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    // Sanitize any malformed entries
    const existingWishlist = Array.isArray(rawWishlist) ? rawWishlist.filter((item) => item && item.id) : [];

    const isInWishlist = existingWishlist.some((item) => item.id === itemToToggle.id);
    const updatedWishlist = isInWishlist
      ? existingWishlist.filter((item) => item.id !== itemToToggle.id)
      : [...existingWishlist, itemToToggle];

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlistIds(updatedWishlist.map((item) => item.id));

    if (itemToToggle.id === product?.id) {
      setIsWishlisted(!isInWishlist);
    }

    window.dispatchEvent(new Event("wishlistUpdated"));

    if (!isInWishlist) {
      showToast.success(`Saved "${itemToToggle.title}" to wishlist!`);
    } else {
      showToast.info(`Removed "${itemToToggle.title}" from wishlist.`);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
  };

  useEffect(() => {
    const updateLocalStates = () => {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartIds(existingCart.map((item) => item.id));
      const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlistIds(existingWishlist.map((item) => item.id));
      if (product) {
        setIsWishlisted(existingWishlist.some((item) => item.id === product.id));
      }
    };

    updateLocalStates();
    window.addEventListener("cartUpdated", updateLocalStates);
    window.addEventListener("wishlistUpdated", updateLocalStates);
    window.addEventListener("userUpdated", updateLocalStates);
    return () => {
      window.removeEventListener("cartUpdated", updateLocalStates);
      window.removeEventListener("wishlistUpdated", updateLocalStates);
      window.removeEventListener("userUpdated", updateLocalStates);
    };
  }, [product]);

  if (loading) {
    return <div className="container min-h-screen bg-[#fffdfb] px-5 py-24 text-center">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="container bg-[#FEFAF8] min-h-screen py-24 px-5">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200 p-10 shadow-sm text-center">
          <h1 className="text-2xl font-semibold text-[#74202D] mb-4">Saree Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn’t find the saree you were looking for. Please return to the shop and choose another beautiful saree.
          </p>
          <Link
            to="/shop"
            className="inline-block rounded-full bg-[#74202D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5c1b2b] transition"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({ title: product.title, text: content.description, url: window.location.href });
    }
  };
  const whatsappMessage = encodeURIComponent(`Hi, I am interested in the ${product.title} Saree (Price: ₹${product.discountPrice}). Could you please share more details?`);

  // Related sarees from same category or collection
  const relatedSarees = sarees
    .filter((item) => item.id !== product.id && item.category?.some((c) => product.category?.includes(c)))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white pt-0 font-sans text-slate-700">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER SECTION */}
      {/* ========================================================================= */}
      <section className="bg-[url('/images/banner/banner-4.png')] bg-cover bg-center h-44 sm:h-56 md:h-64 w-full flex items-center relative overflow-hidden">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Content */}
            <div className="lg:col-span-8 text-center sm:text-left">
              <FadeUp delay={0.1}>
                <div className="inline-flex items-center mb-1.5 sm:mb-2 gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#74202D]">
                  <span>🌸</span>
                  <span>{product.category?.[0] || "HERITAGE SAREES"}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#74202D] leading-tight tracking-tight">
                  {product.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2">
                  Handcrafted timeless elegance designed for celebrations
                </p>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>
      
      {/* ========================================================================= */}
      {/* 2. MAIN PRODUCT DETAILS CONTAINER */}
      {/* ========================================================================= */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        
        {/* Back Link Breadcrumb */}
        <FadeUp delay={0.05}>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#74202D] transition-colors py-1 mb-4 sm:mb-6 group cursor-pointer"
          >
            <HiOutlineArrowLeft className="text-base group-hover:-translate-x-1 transition-transform" />
            <span>Back to Products</span>
          </Link>
        </FadeUp>

        {/* Product Showcase Grid: 1-column on mobile & tablet (md), 2-column (1/2 each) on desktop (lg) */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 lg:gap-8 xl:gap-12 items-start">
          
          {/* ========================================== */}
          {/* Left Column: Image Gallery (1/2 width on lg) */}
          {/* ========================================== */}
          <section className="w-full flex flex-col justify-start">
            <FadeUp delay={0.1}>
              <div className="relative w-full aspect-[4/3.6] sm:aspect-[4/4] md:aspect-[4/3.6] lg:aspect-[4/4.4] xl:aspect-[4/3.8] 2xl:aspect-[4/3.9] max-h-[340px] sm:max-h-[460px] md:max-h-[500px] lg:max-h-none xl:max-h-[520px] overflow-hidden rounded-lg border border-[#eaded7] bg-[#f8efe9] shadow-xs">
                <motion.img
                  key={selectedImage || product.img}
                  src={selectedImage || product.img}
                  alt={product.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/silk/silk-1.jpg";
                  }}
                  initial={{ opacity: 0.6, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full w-full object-cover object-top"
                />
                
                {/* Tag Badge */}
                <span className="absolute left-3 top-3 sm:left-4 sm:top-4 rounded-lg bg-[#e9829a] px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold uppercase text-white shadow-xs">
                  {product.tag || "Handcrafted"}
                </span>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className={`absolute rounded-full right-3 top-3 sm:right-4 sm:top-4 p-2 sm:p-2 transition-all duration-300 shadow-xs cursor-pointer ${
                    isWishlisted
                      ? "bg-[#74202D] text-white"
                      : "bg-white/95 text-[#74202D] hover:bg-[#74202D] hover:text-white"
                  }`}
                >
                  <CiHeart className={`text-xl sm:text-2xl ${isWishlisted ? "fill-current" : ""}`} />
                </button>

                {/* Search Zoom Icon */}
                <button
                  aria-label="View product image"
                  onClick={() => window.open(selectedImage || product.img, "_blank")}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 rounded-lg bg-white/90 p-2 sm:p-2.5 text-[#74202D] shadow-xs hover:bg-white transition cursor-pointer"
                >
                  <CiSearch className="text-xl" />
                </button>
              </div>

              {/* Thumbnail Carousel / Grid */}
              <div className="mt-2.5 sm:mt-3 grid grid-cols-4 gap-1.5 md:gap-1.5 lg:gap-2">
                {thumbnails.map((thumb, idx) => (
                  <button
                    key={`${thumb}-${idx}`}
                    onClick={() => setSelectedImage(thumb)}
                    className={`overflow-hidden rounded-lg border-2 bg-white p-0.5 transition-all cursor-pointer ${
                      (selectedImage || product.img) === thumb && idx === 0
                        ? "border-[#74202D] shadow-xs"
                        : "border-[#eaded7] hover:border-[#74202D]/60"
                    }`}
                  >
                    <img
                      src={thumb}
                      alt={`${product.title} thumbnail ${idx + 1}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/silk/silk-1.jpg";
                      }}
                      className="h-14 sm:h-16 md:h-12 lg:h-14 xl:h-14 2xl:h-16 w-full object-cover object-top rounded-md"
                    />
                  </button>
                ))}
              </div>
            </FadeUp>
          </section>

          {/* ========================================== */}
          {/* Right Column: Product Information & Action (1/2 width) */}
          {/* ========================================== */}
          <section className="w-full flex flex-col justify-start">
            <FadeUp delay={0.15}>
              {/* Category Pill */}
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-700">
                {product.category?.[0] || "Saree Collection"}
              </p>

              {/* Title */}
              <h1 className="mt-1 sm:mt-1.5 text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl font-semibold leading-snug text-[#74202D]">
                {product.title?.toLowerCase().includes("saree") ? product.title : `${product.title} Saree`}
              </h1>

              {/* Rating & Reviews */}
              <div className="mt-2 md:mt-2 lg:mt-2 xl:mt-2.5 flex items-center gap-2 border-b border-[#eaded7]/80 pb-2.5 md:pb-2.5 lg:pb-2.5 xl:pb-3">
                <Rating rating={product.rating} />
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  {product.rating}.0 ({product.ratings || 24} verified reviews)
                </span>
              </div>

              {/* Pricing Section */}
              <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3 border-b border-[#eaded7]/80 py-2.5 sm:py-2.5 md:py-2.5 lg:py-3 xl:py-3.5">
                <span className="text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl font-bold text-[#74202D]">
                  ₹{product.discountPrice?.toLocaleString("en-IN")}
                </span>
                <span className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base text-gray-400 line-through">
                  ₹{product.actualPrice?.toLocaleString("en-IN")}
                </span>
                <span className="rounded-md bg-[#d6f5e5] px-2 py-0.5 text-[10px] sm:text-xs font-bold text-[#137747]">
                  In Stock & Ready to Ship
                </span>
              </div>

              {/* Material Highlight Badge */}
              <div className="my-2.5 md:my-2.5 lg:my-2.5 xl:my-3 flex items-center gap-2 rounded-lg border border-[#eaded7] bg-[#fffaf7] px-3 py-2 text-xs sm:text-sm text-slate-700">
                <FiScissors className="text-[#74202D] text-sm sm:text-base flex-shrink-0" />
                <span>
                  <strong className="text-slate-700">Material:</strong> {content.material}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                {content.description}
              </p>

              {/* Action Buttons: Responsive Grid */}
              <div className="mt-3.5 md:mt-3.5 lg:mt-3.5 xl:mt-5 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-2.5 md:gap-2 lg:gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={cartIds.includes(product.id)}
                  className={`py-2.5 sm:py-2 md:py-2 lg:py-2.5 px-2.5 sm:px-2.5 md:px-2 lg:px-3 text-xs sm:text-xs md:text-xs lg:text-sm rounded font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1 shadow-xs cursor-pointer ${
                    cartIds.includes(product.id)
                      ? "bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed"
                      : "bg-[#74202D] text-white border-2 border-[#74202D] hover:bg-white hover:text-[#74202D]"
                  }`}
                >
                  {cartIds.includes(product.id) ? "In Cart" : "Add to Cart"}
                </button>

                <a
                  href={`https://wa.me/?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#20c968] border-2 border-[#20c968] py-2.5 sm:py-2 md:py-2 lg:py-2.5 px-2.5 sm:px-2.5 md:px-2 lg:px-3 text-center text-xs sm:text-xs md:text-xs lg:text-sm font-bold text-white rounded hover:bg-white hover:text-[#20c968] transition-all duration-300 flex items-center justify-center gap-1 shadow-xs whitespace-nowrap"
                >
                  <FaWhatsapp className="text-sm md:text-xs lg:text-sm xl:text-base shrink-0" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href="tel:+919820087250"
                  className="bg-white border-2 border-[#74202D] py-2.5 sm:py-2 md:py-2 lg:py-2.5 px-2.5 sm:px-2.5 md:px-2 lg:px-3 text-center text-xs sm:text-xs md:text-xs lg:text-sm font-bold text-slate-700 hover:text-white hover:bg-[#74202D] rounded transition-all duration-300 flex items-center justify-center gap-1 shadow-xs whitespace-nowrap cursor-pointer"
                >
                  <FaPhoneAlt className="text-xs md:text-[11px] lg:text-xs xl:text-sm shrink-0" />
                  <span>Call Now</span>
                </a>
              </div>

              {/* Tabbed Specifications */}
              <div className="mt-3.5 md:mt-3.5 lg:mt-3.5 xl:mt-6 border-y border-[#eaded7]">
                <div className="flex gap-4 sm:gap-6 md:gap-4 lg:gap-5 overflow-x-auto text-xs sm:text-sm font-semibold text-slate-700 scrollbar-none py-0.5">
                  {["Care & Craft", "Shipping & Gifting", "Custom Orders"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`whitespace-nowrap border-b-2 py-2 md:py-1.5 lg:py-2 xl:py-2.5 transition-colors cursor-pointer ${
                        activeTab === tab
                          ? "border-[#74202D] text-[#74202D] font-bold"
                          : "border-transparent text-slate-700 hover:text-[#74202D]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                
                <div className="py-2.5 md:py-2 lg:py-2.5 xl:py-3.5 text-xs sm:text-sm leading-relaxed text-slate-700">
                  {activeTab === "Care & Craft" && (
                    <ul className="list-disc space-y-1 pl-4">
                      {[content.care, ...(content.highlights || [])].slice(0, 4).map((item, idx) => (
                        <li key={`${item}-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {activeTab === "Shipping & Gifting" && (
                    <p>
                      Packed with archival silk paper and sent in a protective luxury gift box. Fast insured courier delivery with live tracking throughout India and worldwide.
                    </p>
                  )}
                  {activeTab === "Custom Orders" && (
                    <p>
                      Looking for matching blouses, bridal customization, or group festive orders? Contact our design stylists directly via WhatsApp or phone.
                    </p>
                  )}
                </div>
              </div>

              {/* Social Share */}
              <div className="mt-3 md:mt-2.5 lg:mt-3 xl:mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-700">
                <div className="flex items-center gap-1.5">
                  <FaShareAlt className="text-[#74202D]" />
                  <span>Share Saree:</span>
                </div>
                <div className="flex items-center gap-2 text-[#74202D]">
                  <button
                    onClick={shareProduct}
                    aria-label="Share on Facebook"
                    className="w-8 h-8 rounded-full border border-[#74202D]/40 hover:border-[#74202D] hover:bg-[#74202D] hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer text-xs shadow-2xs"
                  >
                    <FaFacebookF />
                  </button>
                  <button
                    onClick={shareProduct}
                    aria-label="Share on Instagram"
                    className="w-8 h-8 rounded-full border border-[#74202D]/40 hover:border-[#74202D] hover:bg-[#74202D] hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer text-xs shadow-2xs"
                  >
                    <FaInstagram />
                  </button>
                  <button
                    onClick={shareProduct}
                    aria-label="Share on WhatsApp"
                    className="w-8 h-8 rounded-full border border-[#74202D]/40 hover:border-[#74202D] hover:bg-[#74202D] hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer text-xs shadow-2xs"
                  >
                    <FaWhatsapp />
                  </button>
                </div>
              </div>
            </FadeUp>
          </section>
        </div>

        {/* ========================================================================= */}
        {/* 3. RELATED SAREES SECTION (SHOP PAGE COMPATIBLE CARDS) */}
        {/* ========================================================================= */}
        {relatedSarees.length > 0 && (
          <div className="sm:mt-10 pt-10 border-t border-[#eaded7]">
            <FadeUp delay={0.1}>
              <div className="text-center mb-8 sm:mb-10">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#74202D]">
                  🌸 Similar Collections
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#74202D] mt-1">
                  You May Also Love
                </h2>
              </div>
            </FadeUp>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
              {relatedSarees.map((item, index) => (
                <FadeUp key={item.id} delay={0.05 + (index % 4) * 0.08}>
                  <div
                    className="group rounded-lg overflow-hidden border border-gray-200 bg-white transition flex flex-col justify-between h-full shadow-xs"
                  >
                    {/* Card Image + Shop Page Hover Overlay */}
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
                          {item.tag || item.category?.[0] || "Handcrafted"}
                        </span>
                        
                        <div className="pointer-events-auto flex flex-col gap-1.5 sm:gap-2">
                          <button
                            type="button"
                            onClick={() => toggleWishlist(item)}
                            aria-label={wishlistIds.includes(item.id) ? "Remove from wishlist" : "Add to wishlist"}
                            className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center cursor-pointer rounded-full shadow-md backdrop-blur-xs transform translate-x-0 opacity-100 md:translate-x-4 md:opacity-0 transition-all duration-300 ease-out md:group-hover:translate-x-0 md:group-hover:opacity-100 hover:scale-110 active:scale-95 delay-75 ${
                              wishlistIds.includes(item.id)
                                ? "bg-[#74202D] text-white"
                                : "bg-white/95 text-[#74202D] hover:bg-[#74202D] hover:text-white"
                            }`}
                          >
                            <CiHeart className={`text-lg sm:text-xl transition-transform duration-200 ${wishlistIds.includes(item.id) ? "fill-current scale-110" : ""}`} />
                          </button>
                          
                          <Link
                            to={`/shop/${item.id}`}
                            aria-label={`View ${item.title}`}
                            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/95 text-[#74202D] shadow-md backdrop-blur-xs transform translate-x-0 opacity-100 md:translate-x-4 md:opacity-0 transition-all duration-300 ease-out md:group-hover:translate-x-0 md:group-hover:opacity-100 hover:bg-[#74202D] hover:text-white hover:scale-110 active:scale-95 delay-150"
                          >
                            <FiEye className="text-base sm:text-lg" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Card Body matching Shop.jsx font size, family & layout */}
                    <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <Link
                          to={`/shop/${item.id}`}
                          className="block font-medium text-xs sm:text-sm line-clamp-2 text-slate-700 hover:text-[#74202D] transition mb-1 sm:mb-2"
                        >
                          {item.title}
                        </Link>
                        
                        <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                          <span className="text-[#74202D] font-bold text-xs sm:text-sm md:text-base">
                            ₹{item.discountPrice?.toLocaleString("en-IN")}
                          </span>
                          <span className="line-through text-gray-400 text-[10px] sm:text-xs md:text-sm">
                            ₹{item.actualPrice?.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                          <Rating rating={item.rating} />
                          <span className="text-[10px] sm:text-xs text-slate-700">({item.ratings || 24})</span>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        disabled={cartIds.includes(item.id)}
                        className={`w-full mt-3 sm:mt-4 rounded py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition cursor-pointer ${
                          cartIds.includes(item.id)
                            ? "border border-gray-200 bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "border border-[#74202D] text-[#74202D] hover:bg-[#74202D] hover:text-white"
                        }`}
                      >
                        {cartIds.includes(item.id) ? "Already in Cart" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SareeDetail;
