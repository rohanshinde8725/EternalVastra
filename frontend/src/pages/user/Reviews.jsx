import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { FiStar, FiEdit2, FiTrash2, FiPlus, FiX, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import { API_BASE_URL, resolveImageUrl } from "../../api/products";
import { useToast } from "../../context/ToastContext";
import FadeUp from "../../components/animations/FadeUp";

const getUserAvatarUrl = (avatarStr, userName = "Patron") => {
  if (!avatarStr || avatarStr === "/images/default-avatar.webp" || avatarStr.includes("testimonial-1.webp")) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || "Patron")}&background=74202D&color=FFFFFF&bold=true&size=128`;
  }
  return resolveImageUrl(avatarStr);
};

const Reviews = () => {
  const { showToast } = useToast();
  const outletCtx = useOutletContext() || {};
  const user = outletCtx.user || {};

  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [savingReview, setSavingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    product: "",
    rating: 5,
    comment: "",
  });

  const fetchUserReviews = useCallback(() => {
    if (!user) return;
    setLoading(true);

    fetch(`${API_BASE_URL}/api/admin/reviews`)
      .then((res) => (res.ok ? res.json() : []))
      .then((allReviews) => {
        if (Array.isArray(allReviews)) {
          const uId = user._id || user.id;
          const uEmail = user.email?.trim().toLowerCase();
          const uName = user.name?.trim().toLowerCase();

          const myReviews = allReviews.filter((r) => {
            if (r.status === "Hidden") return false;
            return (
              (uId && r.userId === uId) ||
              (uEmail && r.email?.trim().toLowerCase() === uEmail) ||
              (uName && r.reviewer?.trim().toLowerCase() === uName)
            );
          });
          setUserReviews(myReviews);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    fetchUserReviews();
    const handleSync = () => fetchUserReviews();
    window.addEventListener("reviewsUpdated", handleSync);
    return () => window.removeEventListener("reviewsUpdated", handleSync);
  }, [fetchUserReviews]);

  const handleOpenAddModal = () => {
    setEditingReview(null);
    setReviewForm({
      product: "",
      rating: 5,
      comment: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rev) => {
    setEditingReview(rev);
    setReviewForm({
      product: rev.product || "",
      rating: rev.rating || 5,
      comment: rev.comment || rev.review || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteReview = async (rev) => {
    if (!window.confirm(`Are you sure you want to delete your review for "${rev.product || "this saree"}"?`)) return;

    const revId = rev._id || rev.id;
    try {
      if (revId) {
        await fetch(`${API_BASE_URL}/api/admin/reviews/${revId}`, {
          method: "DELETE",
        });
      }
      setUserReviews((prev) => prev.filter((r) => (r._id || r.id) !== revId));
      window.dispatchEvent(new Event("reviewsUpdated"));
      showToast.success("Review deleted successfully.");
    } catch {
      showToast.error("Failed to delete review.");
    }
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.product.trim() || !reviewForm.comment.trim()) {
      showToast.warning("Please provide a saree name and your review comment.");
      return;
    }

    setSavingReview(true);

    const userAvatar =
      user?.avatar && user.avatar !== "/images/default-avatar.webp" && !user.avatar.includes("testimonial-1.webp")
        ? user.avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Patron")}&background=74202D&color=FFFFFF&bold=true&size=128`;

    try {
      if (editingReview) {
        const revId = editingReview._id || editingReview.id;
        const payload = {
          product: reviewForm.product.trim(),
          rating: Number(reviewForm.rating || 5),
          comment: reviewForm.comment.trim(),
          reviewer: user.name,
          avatar: userAvatar,
        };

        const res = await fetch(`${API_BASE_URL}/api/admin/reviews/${revId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const updated = await res.json();
          setUserReviews((prev) => prev.map((r) => ((r._id || r.id) === revId ? { ...r, ...updated } : r)));
          showToast.success("Review updated successfully!");
        } else {
          showToast.success("Review updated.");
        }
      } else {
        const payload = {
          reviewer: user.name,
          email: user.email,
          userId: user._id || user.id,
          product: reviewForm.product.trim(),
          rating: Number(reviewForm.rating || 5),
          date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
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
          setUserReviews((prev) => [created, ...prev]);
          showToast.success("Thank you! Your review has been published.");
        } else {
          showToast.success("Review submitted.");
        }
      }

      window.dispatchEvent(new Event("reviewsUpdated"));
      setIsModalOpen(false);
      setEditingReview(null);
      setReviewForm({ product: "", rating: 5, comment: "" });
    } catch {
      showToast.error("Failed to save review.");
    } finally {
      setSavingReview(false);
    }
  };

  return (
    <FadeUp delay={0.15} className="bg-white rounded-2xl p-6 md:p-8 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-[#EEDACB] pb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif text-[#74202D] font-bold">My Customer Reviews</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Share your experience, edit existing feedback, or add a review for your favorite sarees.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 bg-[#74202D] text-white uppercase py-2.5 px-5 rounded-xl hover:bg-[#5A1622] transition-all duration-300 text-xs font-bold shadow-sm cursor-pointer shrink-0"
        >
          <FiPlus className="text-base" />
          <span>Write a Review</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <FiRefreshCw className="text-2xl animate-spin mx-auto mb-3 text-[#74202D]" />
          <p className="text-sm font-medium">Loading your reviews...</p>
        </div>
      ) : userReviews.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-[#EEDACB] rounded-2xl bg-[#FCF8F5]">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-xs">
            <FiStar className="text-2xl fill-amber-400" />
          </div>
          <h4 className="text-base font-bold text-slate-800">No Reviews Written Yet</h4>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6 max-w-md mx-auto">
            Your feedback helps others discover timeless elegance. Write a review about your purchase and experience with Eternal Vastra!
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-[#74202D] text-white uppercase py-2.5 px-6 rounded-xl hover:bg-[#5A1622] transition-all text-xs font-bold shadow-md cursor-pointer"
          >
            <FiPlus /> Write Your First Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {userReviews.map((rev, index) => {
            const rRating = Math.round(Number(rev.rating) || 5);
            return (
              <div
                key={rev._id || rev.id || index}
                className="bg-[#FCF8F5] border border-[#EEDACB] hover:border-[#cbb3a3] rounded-2xl p-5 sm:p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Header: Saree Title & Rating */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[#74202D] uppercase tracking-wider block mb-0.5">
                        Saree / Product
                      </span>
                      <h4 className="font-serif font-bold text-slate-900 text-base sm:text-lg truncate">
                        {rev.product || "Eternal Heritage Saree"}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg shrink-0">
                      <div className="flex text-amber-500 text-xs">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={star <= rRating ? "text-amber-500" : "text-slate-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-amber-900 ml-1">
                        {rev.rating || 5}.0
                      </span>
                    </div>
                  </div>

                  {/* Review Comment */}
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4 italic font-normal bg-white/60 p-3.5 rounded-xl border border-[#EEDACB]/40">
                    "{rev.comment || rev.review || ""}"
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-4 pt-1">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <FiCheckCircle className="text-xs text-emerald-600 shrink-0" />
                      Verified Customer Review
                    </span>
                    <span>{rev.date || "Recent"}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EEDACB]">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(rev)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#74202D] bg-rose-50 hover:bg-[#74202D] hover:text-white transition-all cursor-pointer border border-[#74202D]/20"
                  >
                    <FiEdit2 className="text-xs" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteReview(rev)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50/50 hover:bg-rose-600 hover:text-white transition-all cursor-pointer border border-rose-200"
                  >
                    <FiTrash2 className="text-xs" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT REVIEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#EEDACB] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#74202D] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiStar className="text-amber-300 text-lg" />
                <h3 className="font-serif font-bold text-base sm:text-lg">
                  {editingReview ? "Edit Your Review" : "Write a Saree Review"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveReview} className="p-6 space-y-5 text-slate-800">
              {/* Reviewer Profile Preview */}
              <div className="flex items-center gap-3 bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                <img
                  src={getUserAvatarUrl(user.avatar, user.name)}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#74202D]/30"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/default-avatar.webp";
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">Posting as: {user.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                </div>
              </div>

              {/* Saree / Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Saree / Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={reviewForm.product}
                  onChange={(e) => setReviewForm({ ...reviewForm, product: e.target.value })}
                  placeholder="e.g. Pure Kanjeevaram Silk Saree, Banarasi Silk, etc."
                  className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3"
                />
              </div>

              {/* Star Rating selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Your Rating (1 to 5 Stars) *
                </label>
                <div className="flex items-center gap-3 bg-[#FCF8F5] p-3 rounded-xl border border-[#EEDACB]">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                        title={`${star} Star${star > 1 ? "s" : ""}`}
                      >
                        <span className={star <= reviewForm.rating ? "text-amber-400" : "text-slate-300"}>
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {reviewForm.rating === 5 && "5.0 - Outstanding ★★★★★"}
                    {reviewForm.rating === 4 && "4.0 - Very Good ★★★★☆"}
                    {reviewForm.rating === 3 && "3.0 - Good ★★★☆☆"}
                    {reviewForm.rating === 2 && "2.0 - Fair ★★☆☆☆"}
                    {reviewForm.rating === 1 && "1.0 - Poor ★☆☆☆☆"}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Your Review / Experience *
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Describe fabric texture, zari work, packaging, and comfort..."
                  className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EEDACB]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingReview}
                  className="bg-[#74202D] text-white uppercase py-2.5 px-6 rounded-xl hover:bg-[#5A1622] transition-all text-xs font-bold shadow-md cursor-pointer disabled:opacity-70 flex items-center gap-2"
                >
                  <FiCheckCircle className="text-sm" />
                  <span>{savingReview ? "Saving..." : editingReview ? "Update Review" : "Publish Review"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </FadeUp>
  );
};

export default Reviews;
