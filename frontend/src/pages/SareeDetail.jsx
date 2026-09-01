import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Rating from "../components/rating/Rating";
import useProducts from "../hooks/useProducts";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { CiSearch, CiHeart } from "react-icons/ci";
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaShareAlt, FaWhatsapp } from "react-icons/fa";
import { FiScissors, FiEye } from "react-icons/fi";
import { useToast } from "../context/ToastContext";

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
    return () => {
      window.removeEventListener("cartUpdated", updateLocalStates);
      window.removeEventListener("wishlistUpdated", updateLocalStates);
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
    <div className="min-h-screen bg-[#FEFAF8] pb-16 pt-0 font-sans text-[#351b15]">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER SECTION */}
      {/* ========================================================================= */}
      <section className="bg-[url('/images/banner/banner-4.png')] bg-cover bg-center h-48 sm:h-56 md:h-64 w-full flex items-center px-4 sm:px-8 md:px-16 lg:px-24 relative overflow-hidden">
        <div className="container max-w-[1440px] mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Content */}
            <div className="lg:col-span-8 text-center sm:text-left">
              <div className="inline-flex items-center mb-2 sm:mb-3 gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#6B1527]">
                <span>🌸</span>
                <span>{product.category?.[0] || "HERITAGE SAREES"}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight tracking-tight">
                {product.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2">
                Handcrafted timeless elegance designed for celebrations
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* ========================================================================= */}
      {/* 2. MAIN PRODUCT DETAILS CONTAINER */}
      {/* ========================================================================= */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-10">
        
        {/* Back Link Breadcrumb */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#75212e] hover:text-[#5a1520] transition-colors py-1 mb-4 sm:mb-6 group cursor-pointer"
        >
          <HiOutlineArrowLeft className="text-base group-hover:-translate-x-1 transition-transform" />
          <span>Back to Products</span>
        </Link>

        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          
          {/* ========================================== */}
          {/* Left Column: Image Gallery */}
          {/* ========================================== */}
          <section className="w-full lg:col-span-5 xl:col-span-5">
            <div className="relative aspect-[4/4.5] sm:aspect-[4/4.2] w-full overflow-hidden rounded-lg border border-[#eaded7] bg-[#f8efe9] shadow-xs">
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
              <span className="absolute left-3 top-3 sm:left-4 sm:top-4 rounded-lg bg-[#e9829a] px-3 py-1 text-[10px] sm:text-xs font-bold uppercase text-white shadow-xs">
                {product.tag || "Handcrafted"}
              </span>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={`absolute rounded-full right-3 top-3 sm:right-4 sm:top-4 rounded p-2.5 sm:p-2 transition-all duration-300 shadow-xs cursor-pointer ${
                  isWishlisted
                    ? "bg-[#75212e] text-white"
                    : "bg-white/95 text-[#75212e] hover:bg-[#75212e] hover:text-white"
                }`}
              >
                <CiHeart className={`text-xl sm:text-2xl ${isWishlisted ? "fill-current" : ""}`} />
              </button>

              {/* Search Zoom Icon */}
              <button
                aria-label="View product image"
                onClick={() => window.open(selectedImage || product.img, "_blank")}
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 rounded-lg bg-white/90 p-2 sm:p-2.5 text-[#75212e] shadow-xs hover:bg-white transition cursor-pointer"
              >
                <CiSearch className="text-xl" />
              </button>
            </div>

            {/* Thumbnail Carousel / Grid */}
            <div className="mt-3 sm:mt-4 grid grid-cols-4 gap-2 sm:gap-3">
              {thumbnails.map((thumb, idx) => (
                <button
                  key={`${thumb}-${idx}`}
                  onClick={() => setSelectedImage(thumb)}
                  className={`overflow-hidden rounded-lg border-2 bg-white p-1 transition-all cursor-pointer ${
                    (selectedImage || product.img) === thumb && idx === 0
                      ? "border-[#75212e] shadow-xs"
                      : "border-[#eaded7] hover:border-[#75212e]/60"
                  }`}
                >
                  <img
                    src={thumb}
                    alt={`${product.title} thumbnail ${idx + 1}`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/silk/silk-1.jpg";
                    }}
                    className="h-16 sm:h-20 w-full object-cover object-top rounded-lg"
                  />
                </button>
              ))}
            </div>
          </section>

          {/* ========================================== */}
          {/* Right Column: Product Information & Action */}
          {/* ========================================== */}
          <section className="w-full lg:col-span-7 xl:col-span-7 flex flex-col justify-start">
            {/* Category Pill */}
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#b35d54]">
              {product.category?.[0] || "Saree Collection"}
            </p>

            {/* Title */}
            <h1 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-[#75212e]">
              {product.title?.toLowerCase().includes("saree") ? product.title : `${product.title} Saree`}
            </h1>

            {/* Rating & Reviews */}
            <div className="mt-2.5 flex items-center gap-2.5 border-b border-[#eaded7]/80 pb-3.5">
              <Rating rating={product.rating} />
              <span className="text-xs sm:text-sm font-medium text-[#6b5149]">
                {product.rating}.0 ({product.ratings || 24} verified customer reviews)
              </span>
            </div>

            {/* Pricing Section */}
            <div className="flex flex-wrap items-baseline gap-3 sm:gap-4 border-b border-[#eaded7]/80 py-3.5 sm:py-4">
              <span className="text-2xl sm:text-3xl font-bold text-[#75212e]">
                ₹{product.discountPrice?.toLocaleString("en-IN")}
              </span>
              <span className="text-base sm:text-lg text-gray-400 line-through">
                ₹{product.actualPrice?.toLocaleString("en-IN")}
              </span>
              <span className="rounded-lg bg-[#d6f5e5] px-3 py-1 text-xs font-bold text-[#137747]">
                In Stock & Ready to Ship
              </span>
            </div>

            {/* Material Highlight Badge */}
            <div className="my-3.5 sm:my-4 flex items-center gap-2.5 rounded-lg border border-[#eaded7] bg-[#fffaf7] px-3.5 py-2.5 text-xs sm:text-sm">
              <FiScissors className="text-[#75212e] text-base flex-shrink-0" />
              <span>
                <strong className="text-[#75212e]">Material:</strong> {content.material}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base leading-relaxed text-[#5d4c46]">
              {content.description}
            </p>

            {/* Action Buttons: Responsive Grid */}
            <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
              <button
                onClick={handleAddToCart}
                disabled={cartIds.includes(product.id)}
                className={`py-2.5 px-4 text-xs sm:text-sm rounded font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                  cartIds.includes(product.id)
                    ? "bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed"
                    : "bg-[#75212e] text-white border-2 border-[#75212e] hover:bg-white hover:text-[#75212e]"
                }`}
              >
                {cartIds.includes(product.id) ? "Already in Cart" : "Add to Cart"}
              </button>

              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#20c968] border-2 border-[#20c968] py-2.5 px-4 text-center text-xs sm:text-sm font-bold text-white rounded hover:bg-white hover:text-[#20c968] transition-all duration-300 flex items-center justify-center gap-2 shadow-xs"
              >
                <FaWhatsapp className="text-base sm:text-lg" />
                <span>Buy on WhatsApp</span>
              </a>

              <a
                href="tel:+919820087250"
                className="bg-white border-2 border-[#75212e] py-2.5 px-4 text-center text-xs sm:text-sm font-bold text-[#75212e] rounded hover:bg-[#75212e] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-xs"
              >
                <FaPhoneAlt className="text-xs sm:text-sm" />
                <span>Call Now</span>
              </a>
            </div>

            {/* Tabbed Specifications */}
            <div className="mt-6 sm:mt-8 border-y border-[#eaded7]">
              <div className="flex gap-4 sm:gap-8 overflow-x-auto text-sm sm:text-base font-semibold text-[#806a62] scrollbar-none py-1">
                {["Care & Craft", "Shipping & Gifting", "Custom Orders"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap border-b-2 py-3 transition-colors cursor-pointer ${
                      activeTab === tab
                        ? "border-[#75212e] text-[#75212e] font-bold"
                        : "border-transparent hover:text-[#75212e]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="py-4 text-xs sm:text-sm leading-relaxed text-[#5d4c46]">
                {activeTab === "Care & Craft" && (
                  <ul className="list-disc space-y-1.5 pl-4">
                    {[content.care, ...(content.highlights || [])].slice(0, 5).map((item, idx) => (
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
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#9b5c51]">
              <div className="flex items-center gap-1.5">
                <FaShareAlt />
                <span>Share Saree:</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={shareProduct}
                  aria-label="Share product on WhatsApp"
                  className="rounded border border-[#20b86a] p-2 text-[#20b86a] cursor-pointer hover:bg-[#20b86a] hover:text-white transition-all duration-300"
                >
                  <FaWhatsapp className="text-sm" />
                </button>
                <button
                  aria-label="Share on Instagram"
                  onClick={shareProduct}
                  className="rounded border border-[#e9829a] p-2 text-[#e9829a] cursor-pointer hover:bg-[#e9829a] hover:text-white transition-all duration-300"
                >
                  <FaInstagram className="text-sm" />
                </button>
                <button
                  aria-label="Share on Facebook"
                  onClick={shareProduct}
                  className="rounded border border-[#4285d4] p-2 text-[#4285d4] cursor-pointer hover:bg-[#4285d4] hover:text-white transition-all duration-300"
                >
                  <FaFacebookF className="text-sm" />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* ========================================================================= */}
        {/* 3. RELATED SAREES SECTION (SHOP PAGE COMPATIBLE CARDS) */}
        {/* ========================================================================= */}
        {relatedSarees.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-10 border-t border-[#eaded7]">
            <div className="text-center mb-8 sm:mb-10">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#6B1527]">
                🌸 Similar Collections
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#75212e] mt-1">
                You May Also Love
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {relatedSarees.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-lg overflow-hidden border border-gray-200 bg-white transition flex flex-col justify-between"
                >
                  {/* Card Image + Shop Page Hover Overlay */}
                  <div className="relative overflow-hidden">
                    <Link to={`/shop/${item.id}`} className="block">
                      <img
                        loading="lazy"
                        src={item.img}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/silk/silk-1.jpg";
                        }}
                        className="w-full h-85 2xl:object-top object-cover object-top transition duration-300 group-hover:scale-[1.05]"
                      />
                    </Link>
                    
                    {/* Hover Overlay: Tag + Action Icons (Wishlist & View Eye) */}
                    <div className="pointer-events-none absolute inset-0 flex items-start justify-between bg-black/10 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="rounded-full bg-[#e9829a] px-2.5 py-1 text-[10px] font-bold uppercase text-white shadow-xs">
                        {item.tag || item.category?.[0] || "Handcrafted"}
                      </span>
                      
                      <div className="pointer-events-auto flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => toggleWishlist(item)}
                          aria-label={wishlistIds.includes(item.id) ? "Remove from wishlist" : "Add to wishlist"}
                          className={`flex h-9 w-9 items-center justify-center cursor-pointer rounded-full bg-white shadow-xs transition hover:bg-[#75212E] hover:text-white ${
                            wishlistIds.includes(item.id) ? "text-[#75212E]" : "text-[#75212E]"
                          }`}
                        >
                          <CiHeart className={`text-xl ${wishlistIds.includes(item.id) ? "fill-current" : ""}`} />
                        </button>
                        
                        <Link
                          to={`/shop/${item.id}`}
                          aria-label={`View ${item.title}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#75212E] shadow-xs transition hover:bg-[#75212E] hover:text-white"
                        >
                          <FiEye className="text-lg" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Card Body matching Shop.jsx font size, family & layout */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <Link
                        to={`/shop/${item.id}`}
                        className="block font-medium text-sm line-clamp-2 hover:text-[#74202D] transition mb-2"
                      >
                        {item.title}
                      </Link>
                      
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-[#74202D] font-bold text-sm sm:text-base">
                          ₹{item.discountPrice?.toLocaleString("en-IN")}
                        </span>
                        <span className="line-through text-gray-400 text-sm">
                          ₹{item.actualPrice?.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Rating rating={item.rating} />
                        <span className="text-xs text-gray-500">({item.ratings || 24})</span>
                      </div>
                    </div>

                    <Link
                      to={`/shop/${item.id}`}
                      className="w-full mt-4 block text-center rounded py-2 text-sm font-medium border border-[#74202D] text-[#74202D] hover:bg-[#74202D] hover:text-white transition cursor-pointer"
                    >
                      View Saree
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SareeDetail;
