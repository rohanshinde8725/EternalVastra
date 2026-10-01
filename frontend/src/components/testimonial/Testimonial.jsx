import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GiThreeLeaves } from "react-icons/gi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { FiEdit3, FiStar, FiX, FiCheckCircle, FiCamera, FiUploadCloud } from "react-icons/fi";
import Rating from "../rating/Rating";
import BottomTrustBar from "../bottomtrustbar/BottomTrustBar";
import FadeUp from "../animations/FadeUp";
import { API_BASE_URL, resolveImageUrl } from "../../api/products";
import { useToast } from "../../context/ToastContext";
import { getStoredUser, isAuthenticated, loginUserSession } from "../../utils/auth";

const getUserAvatarUrl = (userOrAvatar, userName = "Patron") => {
  const avatar = typeof userOrAvatar === "object" ? userOrAvatar?.avatar : userOrAvatar;
  const name = typeof userOrAvatar === "object" ? userOrAvatar?.name || userName : userName;

  if (avatar && avatar !== "/images/default-avatar.webp" && !avatar.includes("testimonial-1.webp")) {
    return resolveImageUrl(avatar);
  }

  // Generate high-resolution monogram avatar with user's actual name
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Patron")}&background=74202D&color=FFFFFF&bold=true&size=128`;
};

const defaultTestimonials = [
  {
    name: "Priya Sharma.",
    review: "The saree quality is amazing and exactly as shown in the pictures. Truly loved it!",
    img: "/images/testimonial/testimonial-1.webp",
    rating: 5,
  },
  {
    name: "Anjali Mehta.",
    review: "Beautiful collection and super fast delivery. Will shop again!",
    img: "/images/testimonial/testimonial-2.webp",
    rating: 5,
  },
  {
    name: "Meera Roy.",
    review: "Elegant design, soft fabric and great customer support.",
    img: "/images/testimonial/testimonial-3.webp",
    rating: 4.7,
  },
  {
    name: "Ritika Gupta.",
    review: "Amazing craftsmanship and detailing. Worth every rupee.",
    img: "/images/testimonial/testimonial-4.webp",
    rating: 4.7,
  },
];

const Testimonial = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [rawReviews, setRawReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [liveAvatar, setLiveAvatar] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    product: "",
    rating: 5,
    review: "",
  });

  const fetchLiveReviews = useCallback(() => {
    fetch(`${API_BASE_URL}/api/admin/reviews`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          setRawReviews(data);
          const approved = data.filter((r) => r.status !== "Hidden");
          if (approved.length > 0) {
            // Deduplicate so each user/reviewer appears ONLY once in Testimonials slider
            const userMap = new Map();
            approved.forEach((item) => {
              const key = (item.userId || item.email || item.reviewer || item.name || "").toLowerCase().trim();
              if (key && !userMap.has(key)) {
                userMap.set(key, item);
              }
            });
            const uniqueTestimonials = Array.from(userMap.values());

            setTestimonials(
              uniqueTestimonials.map((item) => ({
                name: item.reviewer || item.name || "Valued Patron",
                product: item.product || "",
                review: item.comment || item.review || "",
                rating: item.rating || 5,
                img: getUserAvatarUrl(item.avatar || item.img, item.reviewer || item.name),
              }))
            );
          } else {
            setTestimonials(defaultTestimonials);
          }
        }
      })
      .catch(() => {
        // keep defaults
      });
  }, []);

  useEffect(() => {
    fetchLiveReviews();
    window.addEventListener("reviewsUpdated", fetchLiveReviews);
    return () => {
      window.removeEventListener("reviewsUpdated", fetchLiveReviews);
    };
  }, [fetchLiveReviews]);

  const handleWriteReviewClick = async () => {
    const user = getStoredUser();
    if (!isAuthenticated(user)) {
      showToast.info("Please login to your account to write a review.");
      navigate("/signin", { state: { from: "/" } });
      return;
    }

    let freshUser = user;
    const userId = user._id || user.id;

    // Fetch fresh profile from backend to ensure real uploaded photo is used
    if (userId) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/profile/${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            freshUser = { ...user, ...data.user };
            loginUserSession(freshUser);
          }
        }
      } catch {
        // use local
      }
    }

    setCurrentUser(freshUser);
    setLiveAvatar(freshUser.avatar || "");

    // Check if this user already has an existing review
    const existing = rawReviews.find((r) => {
      const uId = freshUser._id || freshUser.id;
      const uEmail = freshUser.email?.toLowerCase().trim();
      const uName = freshUser.name?.toLowerCase().trim();
      return (
        (uId && r.userId === uId) ||
        (uEmail && r.email?.toLowerCase().trim() === uEmail) ||
        (uName && r.reviewer?.toLowerCase().trim() === uName)
      );
    });

    if (existing) {
      setEditingReviewId(existing._id || existing.id);
      setFormData({
        name: freshUser.name || existing.reviewer || "",
        product: existing.product || "",
        rating: existing.rating || 5,
        review: existing.comment || existing.review || "",
      });
      showToast.info("You have already shared a review. You can edit your existing review below.");
    } else {
      setEditingReviewId(null);
      setFormData({
        name: freshUser.name || "",
        product: "",
        rating: 5,
        review: "",
      });
    }

    setIsModalOpen(true);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const user = getStoredUser();
    const userId = user?._id || user?.id;
    if (!userId) return;

    setUploadingAvatar(true);
    const form = new FormData();
    form.append("avatar", file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile/${userId}/avatar`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      if (res.ok && data.avatar) {
        setLiveAvatar(data.avatar);
        const updated = { ...user, avatar: data.avatar };
        setCurrentUser(updated);
        loginUserSession(updated);
        showToast.success("Profile photo updated successfully!");
      } else {
        showToast.error(data.message || "Failed to upload avatar");
      }
    } catch {
      showToast.error("Error uploading profile photo");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const user = getStoredUser();
    if (!isAuthenticated(user)) {
      showToast.warning("Please sign in to submit a review.");
      navigate("/signin", { state: { from: "/" } });
      return;
    }

    if (!formData.name.trim() || !formData.review.trim()) {
      showToast.warning("Please enter your name and review message.");
      return;
    }

    setIsSubmitting(true);

    const activeAvatar = liveAvatar || currentUser?.avatar || user?.avatar || "";
    const resolvedAvatarToSave =
      activeAvatar && activeAvatar !== "/images/default-avatar.webp" && !activeAvatar.includes("testimonial-1.webp")
        ? activeAvatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name.trim() || "Patron")}&background=74202D&color=FFFFFF&bold=true&size=128`;

    const payload = {
      reviewer: formData.name.trim(),
      email: user.email || currentUser?.email || "",
      userId: user._id || user.id || "",
      product: formData.product.trim() || "Eternal Vastra Saree",
      rating: Number(formData.rating || 5),
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      comment: formData.review.trim(),
      verified: true,
      status: "Approved",
      avatar: resolvedAvatarToSave,
    };

    try {
      if (editingReviewId) {
        // Update existing review
        const res = await fetch(`${API_BASE_URL}/api/admin/reviews/${editingReviewId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          showToast.success("Your review has been updated successfully!");
        } else {
          showToast.success("Review updated.");
        }
      } else {
        // Create review (one per user in testimonial)
        const res = await fetch(`${API_BASE_URL}/api/admin/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          showToast.success("Thank you! Your review has been submitted.");
        } else {
          showToast.success("Thank you for your review!");
        }
      }

      window.dispatchEvent(new Event("reviewsUpdated"));
      setIsModalOpen(false);
      setEditingReviewId(null);
      setFormData({
        name: "",
        product: "",
        rating: 5,
        review: "",
      });
    } catch {
      showToast.error("Failed to save review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 md:py-14 bg-[#FEFAF8] w-full">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp delay={0.1}>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-center">
              <GiThreeLeaves className="text-[#74202D] text-lg sm:text-xl md:text-2xl" />
              <h2 className="uppercase font-semibold text-xl sm:text-2xl md:text-3xl text-slate-800 tracking-tight">
                What Our Customers Say
              </h2>
              <GiThreeLeaves className="text-[#74202D] text-lg sm:text-xl md:text-2xl" />
            </div>

            {/* Write a Review Button */}
            <button
              onClick={handleWriteReviewClick}
              className="mt-3.5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#74202D]/40 text-[#74202D] hover:bg-[#74202D] hover:text-white transition-all duration-300 text-xs sm:text-sm font-semibold shadow-2xs cursor-pointer active:scale-95"
            >
              <FiEdit3 className="text-sm" />
              <span>Write a Review</span>
            </button>
          </div>
        </FadeUp>

        <div className="mt-8 sm:mt-10 md:mt-12">
          <Swiper
            className="w-full py-2 testimonial-swiper"
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={3}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop={testimonials.length > 3}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1440: {
                slidesPerView: 3,
              },
            }}
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index} className="!h-auto flex">
                <div className="w-full h-full min-h-[220px] sm:min-h-[240px] bg-white border border-gray-200/80 shadow-xs rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-all duration-300">
                  {/* Review Text Container */}
                  <div className="flex-1 flex flex-col justify-center my-auto min-h-[85px] sm:min-h-[95px]">
                    <p className="text-slate-600 italic text-center text-xs sm:text-sm md:text-base leading-relaxed line-clamp-4">
                      “{item.review}”
                    </p>
                  </div>

                  {/* User Profile & Rating footer */}
                  <div className="flex items-center justify-center gap-3.5 sm:gap-4 mt-6 pt-4 border-t border-gray-100 shrink-0">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={item.img}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || "Patron")}&background=74202D&color=FFFFFF&bold=true&size=128`;
                      }}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#74202D]/30 shrink-0"
                    />
                    <div className="text-left min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm text-slate-800 truncate">{item.name}</h3>
                      <div className="text-xs text-gray-500 mt-0.5">
                        <Rating rating={item.rating || 5} />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <BottomTrustBar />
      </div>

      {/* Customer "Write a Review" Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-7 border border-[#74202D]/20 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto custom-admin-scroll text-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 sm:pb-4 mb-4 sm:mb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {editingReviewId ? "Edit Your Customer Review" : "Write a Customer Review"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingReviewId
                    ? "Update your review and feedback for Eternal Vastra."
                    : "Share your experience with Eternal Vastra."}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <FiX className="text-lg sm:text-xl" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs sm:text-sm">
              {/* Profile Card Header with User's Real Profile Picture */}
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-rose-50/50 border border-rose-100">
                <div className="relative group shrink-0">
                  <img
                    src={getUserAvatarUrl(liveAvatar || currentUser?.avatar, currentUser?.name || formData.name)}
                    alt={currentUser?.name || formData.name || "Reviewer"}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || "Patron")}&background=74202D&color=FFFFFF&bold=true&size=128`;
                    }}
                    className="w-13 h-13 rounded-full object-cover border-2 border-[#74202D] shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute -bottom-1 -right-1 p-1 bg-[#74202D] text-white rounded-full hover:bg-rose-900 transition shadow-md cursor-pointer text-[10px]"
                    title="Change profile picture"
                  >
                    <FiCamera className="text-xs" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm truncate">
                      {currentUser?.name || formData.name || "Valued Patron"}
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {currentUser?.email || "Signed in customer"}
                  </p>
                  {uploadingAvatar && (
                    <span className="text-[11px] text-[#74202D] font-medium animate-pulse">
                      Uploading new photo...
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#74202D] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Saree Name / Collection</label>
                <input
                  type="text"
                  placeholder="e.g. Pure Paithani Silk Saree"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#74202D] focus:outline-none"
                />
              </div>

              {/* Rating Selector */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 text-2xl cursor-pointer hover:scale-110 transition text-amber-400"
                    >
                      <FiStar
                        className={star <= formData.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                      />
                    </button>
                  ))}
                  <span className="text-xs sm:text-sm font-bold text-slate-700 ml-2">
                    {formData.rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Your Review *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about the fabric quality, color, and finish..."
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#74202D] focus:outline-none resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 sm:pt-4 flex items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 sm:py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition text-xs sm:text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#74202D] hover:bg-white border-2 border-[#74202D] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all duration-300 hover:text-[#74202D] cursor-pointer disabled:opacity-50"
                >
                  <FiCheckCircle className="text-base" />
                  <span>{isSubmitting ? (editingReviewId ? "Updating..." : "Submitting...") : (editingReviewId ? "Update Review" : "Submit Review")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonial;