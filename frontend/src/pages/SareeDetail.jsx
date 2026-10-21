import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Rating from "../components/rating/Rating";
import useProducts from "../hooks/useProducts";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { CiHeart } from "react-icons/ci";
import {
  FaFacebookF,
  FaInstagram,
  FaPhoneAlt,
  FaShareAlt,
  FaWhatsapp,
} from "react-icons/fa";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiMinus,
  FiPlus,
  FiCheckCircle,
  FiStar,
  FiEdit2,
  FiTrash2,
  FiX,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiArrowUp,
  FiLayers,
  FiShoppingBag,
} from "react-icons/fi";
import { useToast } from "../context/ToastContext";
import { getStoredUser, isAuthenticated } from "../utils/auth";
import FadeUp from "../components/animations/FadeUp";
import { API_BASE_URL, resolveImageUrl } from "../api/products";
import { ProductDetailSkeleton, ReviewSkeleton } from "../components/common";

const getUserAvatarUrl = (avatarStr, userName = "Patron") => {
  if (
    !avatarStr ||
    avatarStr === "/images/default-avatar.webp" ||
    avatarStr.includes("testimonial-1.webp")
  ) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userName || "Patron"
    )}&background=74202D&color=FFFFFF&bold=true&size=128`;
  }
  return resolveImageUrl(avatarStr);
};

const getCategoryMaterial = (category) => {
  const cat = String(category || "").toLowerCase();
  if (cat.includes("organza")) return "Delicate Organza with Scalloped Zari";
  if (cat.includes("cotton")) return "Fine Handloom Chanderi Cotton";
  if (cat.includes("paithani")) return "Pure Silk with Rich Gold Zari Pallu";
  if (cat.includes("georgette")) return "Flowing Pure Georgette with Chikankari";
  if (cat.includes("banarasi") || cat.includes("silk"))
    return "Heritage Banarasi Katan Silk with Gold Brocade";
  return "Premium Blended Silk";
};

const SareeDetail = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = useParams();
  const { products: sarees, loading, error } = useProducts();

  const product = sarees.find((item) => item.id === Number(productId));

  // Resolved Gallery Images
  const galleryImages = product
    ? Array.isArray(product.images) && product.images.length > 0
      ? product.images.map(resolveImageUrl)
      : [resolveImageUrl(product.img)]
    : [];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [cartIds, setCartIds] = useState([]);
  const [activeInfoTab, setActiveInfoTab] = useState("description"); // "description" | "reviews" | "shipping"
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Product Reviews State
  const [productReviews, setProductReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [userReviewForProduct, setUserReviewForProduct] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  // Reset active image and quantity when navigating to a new product
  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  // Track window scroll for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync Wishlist and Cart local states
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

  // Fetch reviews for this saree
  const fetchProductReviews = useCallback(() => {
    if (!product) return;
    setLoadingReviews(true);
    const user = getStoredUser();
    setCurrentUser(user);

    fetch(`${API_BASE_URL}/api/admin/reviews`)
      .then((res) => (res.ok ? res.json() : []))
      .then((allReviews) => {
        if (Array.isArray(allReviews)) {
          const pTitle = product.title?.trim().toLowerCase();
          const pId = String(product.id);

          const matched = allReviews.filter((r) => {
            if (r.status === "Hidden") return false;
            const rProdId = r.productId ? String(r.productId) : "";
            const rProdTitle = r.product ? r.product.trim().toLowerCase() : "";
            return (rProdId && rProdId === pId) || (rProdTitle && rProdTitle === pTitle);
          });

          setProductReviews(matched);

          if (user) {
            const uId = user._id || user.id;
            const uEmail = user.email?.trim().toLowerCase();
            const uName = user.name?.trim().toLowerCase();

            const myRev = matched.find(
              (r) =>
                (uId && r.userId === uId) ||
                (uEmail && r.email?.trim().toLowerCase() === uEmail) ||
                (uName && r.reviewer?.trim().toLowerCase() === uName)
            );
            setUserReviewForProduct(myRev || null);
          } else {
            setUserReviewForProduct(null);
          }
        }
      })
      .catch((err) => console.error("Error fetching product reviews:", err))
      .finally(() => setLoadingReviews(false));
  }, [product]);

  useEffect(() => {
    fetchProductReviews();
    const handleReviewsUpdate = () => fetchProductReviews();
    window.addEventListener("reviewsUpdated", handleReviewsUpdate);
    return () => window.removeEventListener("reviewsUpdated", handleReviewsUpdate);
  }, [fetchProductReviews]);

  // Image Navigation
  const handlePrevImage = () => {
    if (galleryImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (galleryImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  // Quantity controls
  const maxStock = Math.max(0, Number(product?.inventory ?? product?.stock ?? 15));
  const isOutOfStock = maxStock === 0;

  const handleQuantityDec = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleQuantityInc = () => {
    if (maxStock > 0 && quantity >= maxStock) {
      showToast.info(`Only ${maxStock} items available in stock.`);
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  // Add to Cart
  const handleAddToCart = () => {
    if (!product) return;
    if (isOutOfStock) {
      showToast.error("This saree is currently out of stock.");
      return;
    }

    if (!isAuthenticated()) {
      showToast.warning("Please sign in to add items to your cart.");
      navigate("/signin", { state: { from: location } });
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const found = existingCart.find((item) => item.id === product.id);
    const newQty = found ? found.quantity + quantity : quantity;

    if (maxStock > 0 && newQty > maxStock) {
      showToast.error(`Cannot add more than available stock (${maxStock}).`);
      return;
    }

    const updatedCart = found
      ? existingCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        )
      : [...existingCart, { ...product, quantity }];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    showToast.success(`Added ${quantity} × "${product.title}" to cart!`);
  };

  // Buy Now
  const handleBuyNow = () => {
    if (!product) return;
    if (isOutOfStock) {
      showToast.error("This saree is currently out of stock.");
      return;
    }

    if (!isAuthenticated()) {
      showToast.warning("Please sign in to proceed with purchase.");
      navigate("/signin", { state: { from: location } });
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const found = existingCart.find((item) => item.id === product.id);
    const updatedCart = found
      ? existingCart.map((item) =>
          item.id === product.id ? { ...item, quantity: Math.max(item.quantity, quantity) } : item
        )
      : [...existingCart, { ...product, quantity }];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/cart");
  };

  // Wishlist Toggle
  const toggleWishlist = (targetProduct) => {
    if (!isAuthenticated()) {
      showToast.warning("Please sign in to save items to your wishlist.");
      navigate("/signin", { state: { from: location } });
      return;
    }

    const itemToToggle =
      targetProduct && typeof targetProduct.id === "number" ? targetProduct : product;
    if (!itemToToggle || !itemToToggle.id) return;

    const rawWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const existingWishlist = Array.isArray(rawWishlist)
      ? rawWishlist.filter((item) => item && item.id)
      : [];

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

  // Review Actions
  const handleOpenReviewModal = () => {
    const user = getStoredUser();
    if (!isAuthenticated(user)) {
      showToast.info("Please sign in to write a review for this saree.");
      navigate("/signin", { state: { from: location } });
      return;
    }

    setCurrentUser(user);
    if (userReviewForProduct) {
      setReviewForm({
        rating: userReviewForProduct.rating || 5,
        comment: userReviewForProduct.comment || userReviewForProduct.review || "",
      });
    } else {
      setReviewForm({ rating: 5, comment: "" });
    }
    setIsReviewModalOpen(true);
  };

  const handleDeleteMyReview = async () => {
    if (!userReviewForProduct) return;
    if (!window.confirm("Are you sure you want to delete your review for this saree?")) return;

    try {
      const revId = userReviewForProduct._id || userReviewForProduct.id;
      if (revId) {
        await fetch(`${API_BASE_URL}/api/admin/reviews/${revId}`, { method: "DELETE" });
      }
      showToast.success("Your review was deleted.");
      setUserReviewForProduct(null);
      setProductReviews((prev) => prev.filter((r) => (r._id || r.id) !== revId));
      window.dispatchEvent(new Event("reviewsUpdated"));
    } catch {
      showToast.error("Failed to delete review.");
    }
  };

  const handleSaveProductReview = async (e) => {
    e.preventDefault();
    const user = getStoredUser();
    if (!isAuthenticated(user)) {
      showToast.warning("Please sign in to submit a review.");
      navigate("/signin", { state: { from: location } });
      return;
    }

    if (!reviewForm.comment.trim()) {
      showToast.warning("Please share your review comments.");
      return;
    }

    setSubmittingReview(true);
    const userAvatar =
      user?.avatar &&
      user.avatar !== "/images/default-avatar.webp" &&
      !user.avatar.includes("testimonial-1.webp")
        ? user.avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.name || "Patron"
          )}&background=74202D&color=FFFFFF&bold=true&size=128`;

    try {
      if (userReviewForProduct) {
        const revId = userReviewForProduct._id || userReviewForProduct.id;
        const payload = {
          rating: Number(reviewForm.rating || 5),
          comment: reviewForm.comment.trim(),
          reviewer: user.name,
          product: product.title,
          productId: String(product.id),
          avatar: userAvatar,
        };

        const res = await fetch(`${API_BASE_URL}/api/admin/reviews/${revId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const updated = await res.json();
          setUserReviewForProduct(updated);
          setProductReviews((prev) =>
            prev.map((r) => ((r._id || r.id) === revId ? { ...r, ...updated } : r))
          );
          showToast.success("Your review for this saree has been updated!");
        }
      } else {
        const payload = {
          reviewer: user.name,
          email: user.email,
          userId: user._id || user.id,
          productId: String(product.id),
          product: product.title,
          rating: Number(reviewForm.rating || 5),
          date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          comment: reviewForm.comment.trim(),
          verified: true,
          status: "Approved",
          avatar: userAvatar,
        };

        const res = await fetch(`${API_BASE_URL}/api/admin/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const created = await res.json();
          setUserReviewForProduct(created);
          setProductReviews((prev) => [created, ...prev]);
          showToast.success(`Thank you! Your review for "${product.title}" has been published.`);
        }
      }

      window.dispatchEvent(new Event("reviewsUpdated"));
      setIsReviewModalOpen(false);
      setReviewForm({ rating: 5, comment: "" });
    } catch {
      showToast.error("Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: product?.details?.description,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="container bg-[#FEFAF8] min-h-screen py-24 px-5">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200 p-10 shadow-sm text-center">
          <h1 className="text-2xl font-semibold text-[#74202D] mb-4">Saree Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn’t find the saree you were looking for. Please return to the shop and choose
            another beautiful saree.
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

  // Specifications resolution
  const specs = product.specifications || product.details?.specifications || {};
  const fabricVal =
    specs.fabric || product.details?.material || product.material || getCategoryMaterial(product.category?.[0]);
  const lengthVal = specs.sareeLength || "5.5 Meters";
  const blouseVal = specs.blousePiece || "Included (0.8 Meter Unstitched)";
  const colorVal = specs.color || "Artisanal Heritage Dye";
  const patternVal = specs.pattern || "Traditional Indian Ethnic Weave";
  const workVal = specs.workType || "Zari Woven Border & Pallu";
  const occasionVal = specs.occasion || product.details?.occasion || "Festive & Wedding Celebrations";
  const careVal = specs.care || product.details?.care || "Dry clean only. Store folded in a cool, dry place.";

  // Dynamic Highlights resolution
  const highlightsList =
    Array.isArray(product.details?.highlights) && product.details.highlights.length > 0
      ? product.details.highlights
      : [
          `Premium ${fabricVal}`,
          `Traditional ${workVal}`,
          `${lengthVal} with ${blouseVal}`,
          "Intricately woven traditional border & rich pallu",
          "Soft, lightweight & graceful silhouette drape",
          `Perfect for ${occasionVal}`,
        ];

  // Description resolution
  const fullDescription =
    product.details?.description?.trim() ||
    product.description?.trim() ||
    `Celebrate art and timeless elegance with this handcrafted ${product.title}. Beautifully draped with meticulous attention to detail, this saree features rich traditional motifs, intricate border weaving, and a luxurious designer pallu. Crafted from premium ${fabricVal}, the fabric offers a smooth texture, lightweight comfort, and a graceful drape with a subtle natural sheen. Ideal for festive occasions, weddings, family gatherings, and evening receptions.`;

  // Related Sarees
  const relatedSarees = sarees
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.category?.some((c) => product.category?.includes(c)) ||
          product.relatedProductIds?.includes(item.id))
    )
    .slice(0, 4);

  // Pricing calculations
  const discountPrice = Number(product.discountPrice) || 0;
  const actualPrice = Number(product.actualPrice) || discountPrice;
  const discountPercent =
    actualPrice > discountPrice ? Math.round(((actualPrice - discountPrice) / actualPrice) * 100) : 0;

  const currentActiveImage = galleryImages[activeImageIndex] || galleryImages[0] || "/images/silk/silk-1.webp";

  const whatsappMessage = encodeURIComponent(
    `Hi Eternal Vastra, I am interested in purchasing the "${product.title}" Saree (Price: ₹${discountPrice.toLocaleString(
      "en-IN"
    )}). Could you please provide more details?`
  );

  return (
    <div className="min-h-screen bg-[#FEFAF8] font-sans text-slate-700">
      
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-[#EEDACB]/60 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs sm:text-sm text-slate-500">
          <div className="flex items-center gap-2 truncate">
            <Link to="/" className="hover:text-[#74202D] transition">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-[#74202D] transition">
              Shop
            </Link>
            <span>/</span>
            <span className="text-[#74202D] font-medium truncate">{product.title}</span>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 font-semibold text-[#74202D] hover:underline shrink-0"
          >
            <HiOutlineArrowLeft className="text-sm" />
            <span className="hidden sm:inline">Back to Sarees</span>
          </Link>
        </div>
      </div>

      {/* Main Product Two-Column Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Large Product Image Gallery                 */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 w-full space-y-3 sm:space-y-4">
            
            {/* Primary Main Image Box */}
            <div
              className="relative w-full aspect-[3/4] max-h-[640px] rounded-2xl overflow-hidden border border-[#EEDACB] bg-[#FAF5F0] shadow-sm flex items-center justify-center select-none"
            >
              {/* Product Image */}
              <motion.img
                key={currentActiveImage}
                src={currentActiveImage}
                alt={product.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/silk/silk-1.webp";
                }}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full h-full object-cover object-top"
              />

              {/* Tag / Discount Badge on top-left */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
                {discountPercent > 0 && (
                  <span className="rounded-md bg-[#74202D] text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
                {product.tag && (
                  <span className="rounded-md bg-white/95 text-[#74202D] border border-[#74202D]/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider shadow-xs">
                    {product.tag}
                  </span>
                )}
              </div>

              {/* Wishlist Button on top-right */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
                  isWishlisted
                    ? "bg-[#74202D] text-white"
                    : "bg-white/95 text-[#74202D] hover:bg-[#74202D] hover:text-white"
                }`}
              >
                <CiHeart className={`text-2xl ${isWishlisted ? "fill-current" : ""}`} />
              </button>

              {/* Left & Right Carousel Arrows (shown if multiple images exist) */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 hover:bg-[#74202D] text-slate-700 hover:text-white border border-slate-200 shadow-md flex items-center justify-center transition opacity-90 hover:opacity-100 cursor-pointer"
                  >
                    <FiChevronLeft className="text-xl" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 hover:bg-[#74202D] text-slate-700 hover:text-white border border-slate-200 shadow-md flex items-center justify-center transition opacity-90 hover:opacity-100 cursor-pointer"
                  >
                    <FiChevronRight className="text-xl" />
                  </button>
                </>
              )}

              {/* Slide Indicator Dots */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-black/35 backdrop-blur-xs px-3 py-1.5 rounded-full">
                  {galleryImages.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(dotIdx);
                      }}
                      className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                        activeImageIndex === dotIdx ? "w-5 bg-white" : "w-2 bg-white/60 hover:bg-white/90"
                      }`}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Fullscreen Zoom Icon on bottom-right */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                aria-label="Enlarge image preview"
                className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-[#74202D] text-[#74202D] hover:text-white shadow-md flex items-center justify-center transition cursor-pointer"
                title="Click to view full-screen preview"
              >
                <FiMaximize2 className="text-sm" />
              </button>
            </div>

            {/* Thumbnail Carousel Row */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2.5 sm:gap-3 overflow-x-auto py-1 scrollbar-none">
                {galleryImages.map((imgUrl, idx) => {
                  const isActive = activeImageIndex === idx;
                  return (
                    <button
                      key={`${imgUrl}-${idx}`}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 sm:w-24 aspect-[3/4] rounded-xl overflow-hidden border-2 bg-white transition cursor-pointer shrink-0 ${
                        isActive
                          ? "border-[#74202D] ring-2 ring-[#74202D]/20 shadow-xs"
                          : "border-[#EEDACB] hover:border-[#74202D]/60 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.title} view ${idx + 1}`}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/silk/silk-1.webp";
                        }}
                        className="w-full h-full object-cover object-top"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Product Information & Purchase Section     */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 w-full space-y-5">
            
            {/* Title & Category */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#74202D]">
                  {product.category?.[0] || "HERITAGE SAREE"}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">SKU: {product.sku || `EV-${String(product.id).padStart(3, "0")}`}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 leading-snug tracking-tight">
                {product.title}
              </h1>

              {/* Rating Summary */}
              <div className="mt-2.5 flex items-center justify-between border-b border-[#EEDACB]/70 pb-3">
                <div className="flex items-center gap-2">
                  <Rating
                    rating={
                      productReviews.length > 0
                        ? Number(
                            (
                              productReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) /
                              productReviews.length
                            ).toFixed(1)
                          )
                        : product.rating || 5
                    }
                  />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">
                    {productReviews.length > 0
                      ? (
                          productReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) /
                          productReviews.length
                        ).toFixed(1)
                      : product.rating || 5}
                    .0 ({productReviews.length > 0 ? productReviews.length : (product.ratings || "24")}{" "}
                    verified reviews)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenReviewModal}
                  className="text-xs font-bold text-[#74202D] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <FiStar className="text-amber-500" />
                  <span>{userReviewForProduct ? "Edit Review" : "Write a Review"}</span>
                </button>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex flex-wrap items-baseline gap-3 border-b border-[#EEDACB]/70 pb-4">
              {actualPrice > discountPrice && (
                <span className="text-base sm:text-lg text-slate-400 line-through font-medium">
                  ₹{actualPrice.toLocaleString("en-IN")}.00
                </span>
              )}
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#74202D]">
                ₹{discountPrice.toLocaleString("en-IN")}.00
              </span>

              {/* Stock Status Badge */}
              <div className="ml-auto">
                {isOutOfStock ? (
                  <span className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700">
                    Out of Stock
                  </span>
                ) : maxStock <= 5 ? (
                  <span className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
                    Only {maxStock} left in stock!
                  </span>
                ) : (
                  <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <FiCheckCircle className="text-emerald-600" /> In Stock & Ready to Ship
                  </span>
                )}
              </div>
            </div>

            {/* Purchase Controls Row (Matching Image 2 Layout) */}
            <div className="space-y-3 pt-1">
              
              {/* Row with Quantity Selector + Add to Cart Button */}
              <div className="flex items-center gap-3">
                {/* Quantity Box */}
                <div className="flex items-center border border-slate-300 rounded-xl bg-white h-12 px-2 shadow-2xs">
                  <button
                    type="button"
                    onClick={handleQuantityDec}
                    disabled={isOutOfStock || quantity <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus className="text-xs" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-900 select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleQuantityInc}
                    disabled={isOutOfStock || quantity >= maxStock}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <FiPlus className="text-xs" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 h-12 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                    isOutOfStock
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                      : cartIds.includes(product.id)
                      ? "bg-[#5A1622] text-white border-2 border-[#5A1622]"
                      : "bg-[#74202D] text-white hover:bg-[#5A1622] active:scale-[0.99]"
                  }`}
                >
                  <FiShoppingBag className="text-base" />
                  <span>{isOutOfStock ? "Out of Stock" : cartIds.includes(product.id) ? "Add More to Cart" : "Add to Cart"}</span>
                </button>
              </div>

              {/* Buy Now Full-Width Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full h-12 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                <span>Buy Now with Express Checkout</span>
                <span className="text-amber-300 font-normal">→</span>
              </button>
            </div>

            {/* Store Guarantees & Trust Bullets (Inspired by Image 2, in Eternal Vastra style) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FCF8F5] border border-[#EEDACB] space-y-2 text-xs sm:text-sm leading-relaxed text-slate-800">
              <p className="font-serif italic font-bold text-[#74202D] text-sm">
                ✦ Store Pickup Also Available at our Mumbai Flagship
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 pt-1 text-slate-700">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-700 shrink-0" />
                  <span>Trusted by Saree Lovers for 15+ Years</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-700 shrink-0" />
                  <span>4.9 Google Rated • 1000+ Happy Patrons</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-700 shrink-0" />
                  <span>Direct From Master Weavers</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-700 shrink-0" />
                  <span>Quality Checked Before Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-700 shrink-0" />
                  <span>7-Day Easy & Fast Exchange Process</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-700 shrink-0" />
                  <span>Insured Worldwide Shipping</span>
                </div>
              </div>
            </div>

            {/* Product Highlights Bullet Points */}
            <div className="border-t border-[#EEDACB]/70 pt-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#74202D]">
                Product Highlights:
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                {highlightsList.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#74202D] font-bold leading-tight">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories & Social Share Footer */}
            <div className="border-t border-[#EEDACB]/70 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                <span className="font-bold text-slate-800">Categories: </span>
                <span>{product.category?.join(", ") || "Sarees"}</span>
              </div>

              {/* Social Share Icons */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Share:</span>
                <button
                  type="button"
                  onClick={shareProduct}
                  aria-label="Share on Facebook"
                  className="w-7 h-7 rounded-full border border-slate-300 hover:border-[#74202D] hover:bg-[#74202D] hover:text-white flex items-center justify-center transition cursor-pointer text-slate-700 text-xs"
                >
                  <FaFacebookF />
                </button>
                <button
                  type="button"
                  onClick={shareProduct}
                  aria-label="Share on Instagram"
                  className="w-7 h-7 rounded-full border border-slate-300 hover:border-[#74202D] hover:bg-[#74202D] hover:text-white flex items-center justify-center transition cursor-pointer text-slate-700 text-xs"
                >
                  <FaInstagram />
                </button>
                <a
                  href={`https://wa.me/?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Share on WhatsApp"
                  className="w-7 h-7 rounded-full border border-slate-300 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition cursor-pointer text-slate-700 text-xs"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DEDICATED INFORMATION TABS SECTION (Inspired by Image 2)                  */}
        {/* ========================================================================= */}
        <section className="mt-14 sm:mt-20 pt-8 border-t border-[#EEDACB]">
          
          {/* Centered Tab Switcher Buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-10">
            <button
              type="button"
              onClick={() => setActiveInfoTab("description")}
              className={`px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeInfoTab === "description"
                  ? "bg-[#74202D] text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-300 hover:border-[#74202D] hover:text-[#74202D]"
              }`}
            >
              Description
            </button>

            <button
              type="button"
              onClick={() => setActiveInfoTab("reviews")}
              className={`px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeInfoTab === "reviews"
                  ? "bg-[#74202D] text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-300 hover:border-[#74202D] hover:text-[#74202D]"
              }`}
            >
              Reviews ({productReviews.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveInfoTab("shipping")}
              className={`px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeInfoTab === "shipping"
                  ? "bg-[#74202D] text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-300 hover:border-[#74202D] hover:text-[#74202D]"
              }`}
            >
              Shipping & Returns
            </button>
          </div>

          {/* TAB 1: DESCRIPTION */}
          {activeInfoTab === "description" && (
            <FadeUp delay={0.1}>
              <div className="max-w-4xl mx-auto space-y-8 text-center sm:text-left">
                {/* Centered Heading */}
                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#74202D]">
                    Description
                  </h3>
                  <div className="w-16 h-0.5 bg-[#74202D] mx-auto mt-2" />
                </div>

                {/* Paragraphs */}
                <div className="space-y-4 text-xs sm:text-sm md:text-base leading-relaxed text-slate-700">
                  <p>{fullDescription}</p>
                  <p>
                    The saree is complemented with an unstitched matching blouse piece that can be tailored
                    to your exact preference. Whether draped for a temple ceremony, a wedding reception,
                    or a festive family gathering, this design effortlessly embodies the heritage, craftsmanship,
                    and grace of authentic Indian couture.
                  </p>
                </div>

                {/* Saree Specifications Card */}
                <div className="rounded-2xl border border-[#EEDACB] bg-white p-6 sm:p-8 shadow-2xs">
                  <h4 className="text-sm sm:text-base font-serif font-bold text-[#74202D] mb-4 pb-2 border-b border-[#EEDACB]">
                    Saree Specifications & Attributes
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                        Fabric Material
                      </span>
                      <span className="font-semibold text-slate-800">{fabricVal}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                        Saree Length
                      </span>
                      <span className="font-semibold text-slate-800">{lengthVal}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                        Blouse Piece
                      </span>
                      <span className="font-semibold text-slate-800">{blouseVal}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                        Color / Shade
                      </span>
                      <span className="font-semibold text-slate-800">{colorVal}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                        Pattern / Motif
                      </span>
                      <span className="font-semibold text-slate-800">{patternVal}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                        Work Type
                      </span>
                      <span className="font-semibold text-slate-800">{workVal}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                        Occasion
                      </span>
                      <span className="font-semibold text-slate-800">{occasionVal}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                        Wash & Care
                      </span>
                      <span className="font-semibold text-slate-800">{careVal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          )}

          {/* TAB 2: REVIEWS */}
          {activeInfoTab === "reviews" && (
            <FadeUp delay={0.1}>
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#74202D]">
                    Customer Reviews
                  </h3>
                  <div className="w-16 h-0.5 bg-[#74202D] mx-auto mt-2" />
                  <p className="text-xs sm:text-sm text-slate-500 mt-2">
                    Verified patrons share their experiences with the {product.title}.
                  </p>
                </div>

                {/* Score & Add Review CTA */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center rounded-2xl bg-white border border-[#EEDACB] p-6 sm:p-8">
                  <div className="md:col-span-5 text-center border-b md:border-b-0 md:border-r border-[#EEDACB] pb-6 md:pb-0 md:pr-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Average Rating
                    </span>
                    <div className="text-5xl font-serif font-bold text-[#74202D]">
                      {productReviews.length > 0
                        ? (
                            productReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) /
                            productReviews.length
                          ).toFixed(1)
                        : product.rating || 5}
                    </div>
                    <div className="flex justify-center text-amber-400 text-lg my-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>★</span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">
                      Based on {productReviews.length > 0 ? productReviews.length : (product.ratings || "24")}{" "}
                      verified reviews
                    </p>
                  </div>

                  <div className="md:col-span-7 flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-3">
                    <h4 className="font-serif font-bold text-lg text-slate-900">
                      Have you draped this saree?
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Share your thoughts on the fabric texture, zari craftsmanship, color fidelity, and drape.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenReviewModal}
                      className="px-6 py-2.5 rounded-xl bg-[#74202D] hover:bg-[#5A1622] text-white text-xs font-bold uppercase tracking-wider transition shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <FiEdit2 />
                      <span>{userReviewForProduct ? "Edit Your Review" : "Write a Review"}</span>
                    </button>
                  </div>
                </div>

                {/* Review Cards List */}
                <div className="space-y-4">
                  {loadingReviews ? (
                    <ReviewSkeleton count={2} />
                  ) : productReviews.length === 0 ? (
                    <div className="text-center py-10 px-4 rounded-2xl border-2 border-dashed border-[#EEDACB] bg-white">
                      <p className="text-sm font-semibold text-slate-700">
                        No reviews yet for this saree.
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Be the first patron to share your experience!
                      </p>
                    </div>
                  ) : (
                    productReviews.map((rev, idx) => (
                      <div
                        key={rev._id || idx}
                        className="p-5 rounded-2xl bg-white border border-[#EEDACB] shadow-2xs space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={getUserAvatarUrl(rev.avatar, rev.reviewer)}
                              alt={rev.reviewer}
                              className="w-10 h-10 rounded-full object-cover border border-[#74202D]/30 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-slate-900 text-sm">{rev.reviewer}</h5>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <FiCheckCircle className="text-[10px]" /> Verified
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400">{rev.date || "Recent"}</span>
                            </div>
                          </div>

                          <div className="flex text-amber-400 text-sm">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span key={s} className={s <= (rev.rating || 5) ? "text-amber-400" : "text-slate-200"}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 italic bg-[#FCF8F5] p-3.5 rounded-xl border border-[#EEDACB]/40">
                          "{rev.comment || rev.review}"
                        </p>

                        {currentUser &&
                          (rev.userId === (currentUser._id || currentUser.id) ||
                            rev.email === currentUser.email) && (
                            <div className="flex items-center justify-end gap-3 text-xs pt-1">
                              <button
                                type="button"
                                onClick={handleOpenReviewModal}
                                className="font-semibold text-[#74202D] hover:underline cursor-pointer"
                              >
                                Edit
                              </button>
                              <span className="text-slate-300">•</span>
                              <button
                                type="button"
                                onClick={handleDeleteMyReview}
                                className="font-semibold text-rose-600 hover:underline cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </FadeUp>
          )}

          {/* TAB 3: SHIPPING & RETURNS */}
          {activeInfoTab === "shipping" && (
            <FadeUp delay={0.1}>
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#74202D]">
                    Shipping & Exchange Policies
                  </h3>
                  <div className="w-16 h-0.5 bg-[#74202D] mx-auto mt-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-6 rounded-2xl bg-white border border-[#EEDACB] space-y-2">
                    <FiTruck className="text-2xl text-[#74202D]" />
                    <h4 className="font-bold text-slate-900 text-sm">Express Pan-India Delivery</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Orders are dispatched within 24 to 48 hours. Delivered across India via premium express couriers in 3-5 business days.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-[#EEDACB] space-y-2">
                    <FiShield className="text-2xl text-[#74202D]" />
                    <h4 className="font-bold text-slate-900 text-sm">Archival Gift Packaging</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Every saree is carefully folded in archival butter paper, protected in a signature rigid luxury box, and waterproofed.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-[#EEDACB] space-y-2">
                    <FiRotateCcw className="text-2xl text-[#74202D]" />
                    <h4 className="font-bold text-slate-900 text-sm">7-Day Hassle-Free Exchange</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Not completely in love with the shade? Initiate an easy exchange within 7 days of delivery for unworn sarees with original tags intact.
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>
          )}
        </section>

        {/* ========================================================================= */}
        {/* RELATED PRODUCTS SECTION (Inspired by Image 2)                            */}
        {/* ========================================================================= */}
        {relatedSarees.length > 0 && (
          <section className="mt-16 sm:mt-24 pt-12 border-t border-[#EEDACB]">
            <FadeUp delay={0.1}>
              <div className="text-center mb-8 sm:mb-10">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#74202D]">
                  Related Products
                </h3>
                <div className="w-16 h-0.5 bg-[#74202D] mx-auto mt-2" />
                <p className="text-xs sm:text-sm text-slate-500 mt-2">
                  Explore other handwoven sarees from our curated collections
                </p>
              </div>
            </FadeUp>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedSarees.map((item, index) => {
                const relDiscount = Number(item.discountPrice) || 0;
                const relActual = Number(item.actualPrice) || relDiscount;
                const relPercent =
                  relActual > relDiscount ? Math.round(((relActual - relDiscount) / relActual) * 100) : 0;

                return (
                  <FadeUp key={item.id} delay={0.05 + (index % 4) * 0.08}>
                    <div className="group rounded-2xl overflow-hidden border border-[#EEDACB] bg-white transition-all duration-300 hover:shadow-md flex flex-col justify-between h-full">
                      {/* Card Image */}
                      <div className="relative overflow-hidden aspect-[3/4] bg-[#FAF5F0]">
                        <Link to={`/shop/${item.id}`} className="block w-full h-full">
                          <img
                            loading="lazy"
                            src={resolveImageUrl(item.img)}
                            alt={item.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/silk/silk-1.webp";
                            }}
                            className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-[1.05]"
                          />
                        </Link>

                        {/* Top-Left Discount Badge matching Image 2 */}
                        {relPercent > 0 && (
                          <span className="absolute top-2.5 left-2.5 rounded-md bg-[#74202D] text-white text-[10px] font-bold px-2 py-0.5 uppercase shadow-xs">
                            {relPercent}% OFF
                          </span>
                        )}

                        {/* Wishlist Icon */}
                        <button
                          type="button"
                          onClick={() => toggleWishlist(item)}
                          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-[#74202D] hover:text-white text-[#74202D] transition shadow-xs flex items-center justify-center cursor-pointer"
                          aria-label="Save to wishlist"
                        >
                          <CiHeart className={`text-lg ${wishlistIds.includes(item.id) ? "fill-current" : ""}`} />
                        </button>
                      </div>

                      {/* Card Body */}
                      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between text-center sm:text-left space-y-2">
                        <div>
                          <Link
                            to={`/shop/${item.id}`}
                            className="block font-medium text-xs sm:text-sm text-slate-800 hover:text-[#74202D] transition line-clamp-2 leading-snug"
                          >
                            {item.title}
                          </Link>

                          <div className="flex flex-wrap items-baseline gap-2 mt-1 justify-center sm:justify-start">
                            {relActual > relDiscount && (
                              <span className="line-through text-slate-400 text-[11px] sm:text-xs">
                                ₹{relActual.toLocaleString("en-IN")}
                              </span>
                            )}
                            <span className="font-bold text-[#74202D] text-xs sm:text-sm md:text-base">
                              ₹{relDiscount.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        {/* "VIEW DETAILS" button matching Image 2 */}
                        <Link
                          to={`/shop/${item.id}`}
                          className="w-full py-2 rounded-xl border border-[#74202D] text-[#74202D] hover:bg-[#74202D] hover:text-white text-xs font-bold uppercase tracking-wider text-center transition block cursor-pointer"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* ========================================================================= */}
      {/* LIGHTBOX FULLSCREEN MODAL FOR PRODUCT IMAGE                               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-2 right-2 sm:-top-10 sm:-right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition cursor-pointer z-20"
                aria-label="Close fullscreen preview"
              >
                <FiX className="text-xl" />
              </button>

              {/* Prev / Next controls */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition cursor-pointer z-20"
                    aria-label="Previous"
                  >
                    <FiChevronLeft className="text-2xl" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition cursor-pointer z-20"
                    aria-label="Next"
                  >
                    <FiChevronRight className="text-2xl" />
                  </button>
                </>
              )}

              {/* Enlarged Image */}
              <img
                src={currentActiveImage}
                alt={product.title}
                className="max-h-[82vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
              />

              <p className="text-white/80 text-xs sm:text-sm mt-3 font-medium">
                {product.title} • ({activeImageIndex + 1} of {galleryImages.length})
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* WRITE / EDIT REVIEW MODAL FOR THIS SAREE                                  */}
      {/* ========================================================================= */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#EEDACB] overflow-hidden text-slate-800">
            <div className="bg-[#74202D] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiStar className="text-amber-300 text-lg" />
                <h3 className="font-serif font-bold text-base sm:text-lg">
                  {userReviewForProduct ? `Edit Review for ${product.title}` : `Write Review for ${product.title}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSaveProductReview} className="p-6 space-y-4 text-slate-800">
              <div className="flex items-center gap-3 bg-rose-50/70 p-3 rounded-xl border border-rose-100">
                <img
                  src={getUserAvatarUrl(currentUser?.avatar, currentUser?.name)}
                  alt={currentUser?.name || "Reviewer"}
                  className="w-10 h-10 rounded-full object-cover border border-[#74202D]/30"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    Posting as: {currentUser?.name || "Valued Patron"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Your Rating (1 to 5 Stars) *
                </label>
                <div className="flex items-center gap-2 bg-[#FCF8F5] p-3 rounded-xl border border-[#EEDACB]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <span className={star <= reviewForm.rating ? "text-amber-400" : "text-slate-300"}>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {reviewForm.rating}.0 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Your Experience with this Saree *
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share details about the fabric drape, zari lustre, border embroidery, and packaging..."
                  className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EEDACB]">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-[#74202D] hover:bg-[#5A1622] text-white uppercase py-2 px-5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {submittingReview ? "Saving..." : userReviewForProduct ? "Update Review" : "Publish Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#74202D] text-white shadow-lg hover:bg-[#5A1622] flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
          aria-label="Scroll back to top"
        >
          <FiArrowUp className="text-lg" />
        </button>
      )}
    </div>
  );
};

export default SareeDetail;
