import React, { useState, useEffect } from "react";
import { FiStar, FiTrash2, FiRotateCw, FiPlus, FiEdit2, FiX, FiCheckCircle, FiCheck, FiEyeOff } from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";
import ImageUploader from "../../components/admin/ImageUploader";

const initialReviewForm = {
  reviewer: "",
  product: "",
  rating: 5,
  date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
  comment: "",
  verified: true,
  status: "Approved",
  avatar: "/images/testimonial/testimonial-1.webp",
};

const presetAvatars = [
  "/images/testimonial/testimonial-1.webp",
  "/images/testimonial/testimonial-2.webp",
  "/images/testimonial/testimonial-3.webp",
  "/images/testimonial/testimonial-4.webp",
];

const Reviews = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState(initialReviewForm);

  const fetchReviews = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/reviews`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load reviews");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(
            data.map((r) => ({
              ...r,
              avatar: r.avatar?.startsWith("http") ? r.avatar : `${API_BASE_URL}${r.avatar || "/images/testimonial/testimonial-1.webp"}`,
            }))
          );
        }
      })
      .catch(() => {
        showToast.error("Failed to load reviews from MongoDB");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openAddModal = () => {
    setEditingReview(null);
    setFormData({
      ...initialReviewForm,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (rev) => {
    setEditingReview(rev);
    setFormData({
      reviewer: rev.reviewer || "",
      product: rev.product || "",
      rating: rev.rating || 5,
      date: rev.date || new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      comment: rev.comment || "",
      verified: rev.verified !== false,
      status: rev.status || "Approved",
      avatar: rev.avatar || "/images/testimonial/testimonial-1.webp",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (rev) => {
    try {
      if (rev._id) {
        await fetch(`${API_BASE_URL}/api/admin/recycle-bin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemType: "review",
            originalId: String(rev._id || rev.id),
            itemTitle: rev.reviewer,
            itemSubtitle: `${rev.product} • Rating: ${rev.rating}/5`,
            image: rev.avatar,
            data: rev,
          }),
        }).catch(() => { });

        await fetch(`${API_BASE_URL}/api/admin/reviews/${rev._id}`, { method: "DELETE" }).catch(() => { });
      }
      window.dispatchEvent(new Event("reviewsUpdated"));
      showToast.success(`Review from "${rev.reviewer}" deleted from database.`);
    } catch {
      showToast.info(`Review deleted locally.`);
    }

    setReviews(reviews.filter((r) => (r._id || r.id) !== (rev._id || rev.id)));
  };

  const handleToggleStatus = async (rev) => {
    const newStatus = rev.status === "Approved" ? "Hidden" : "Approved";
    const updated = { ...rev, status: newStatus };
    setReviews(reviews.map((r) => ((r._id || r.id) === (rev._id || rev.id) ? updated : r)));

    try {
      if (rev._id) {
        await fetch(`${API_BASE_URL}/api/admin/reviews/${rev._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
      }
      window.dispatchEvent(new Event("reviewsUpdated"));
      showToast.success(`Review status marked as ${newStatus}`);
    } catch {
      showToast.warning("Status updated locally");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingReview) {
      // Edit existing review
      const revId = editingReview._id || editingReview.id;
      try {
        if (editingReview._id) {
          const res = await fetch(`${API_BASE_URL}/api/admin/reviews/${editingReview._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          if (res.ok) {
            const saved = await res.json();
            setReviews(
              reviews.map((r) =>
                (r._id || r.id) === revId
                  ? {
                    ...saved,
                    avatar: saved.avatar?.startsWith("http") ? saved.avatar : `${API_BASE_URL}${saved.avatar || "/images/testimonial/testimonial-1.webp"}`,
                  }
                  : r
              )
            );
            showToast.success(`Review by "${formData.reviewer}" updated in database!`);
          }
        } else {
          setReviews(reviews.map((r) => ((r._id || r.id) === revId ? { ...r, ...formData } : r)));
          showToast.success(`Review updated.`);
        }
        window.dispatchEvent(new Event("reviewsUpdated"));
      } catch {
        showToast.error("Failed to update review");
      }
    } else {
      // Add new review
      const newReview = { ...formData };
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReview),
        });
        if (res.ok) {
          const saved = await res.json();
          setReviews([
            {
              ...saved,
              avatar: saved.avatar?.startsWith("http") ? saved.avatar : `${API_BASE_URL}${saved.avatar || "/images/testimonial/testimonial-1.webp"}`,
            },
            ...reviews,
          ]);
          showToast.success(`Review by "${newReview.reviewer}" added to database!`);
        } else {
          setReviews([{ ...newReview, id: Date.now() }, ...reviews]);
          showToast.success(`Review added.`);
        }
        window.dispatchEvent(new Event("reviewsUpdated"));
      } catch {
        setReviews([{ ...newReview, id: Date.now() }, ...reviews]);
        showToast.info(`Review saved locally.`);
      }
    }

    setIsModalOpen(false);
    setEditingReview(null);
    setFormData(initialReviewForm);
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterStatus === "approved") return r.status === "Approved";
    if (filterStatus === "hidden") return r.status === "Hidden";
    if (filterStatus === "pending") return r.status === "Pending";
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-7 max-w-[1600px] mx-auto text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Customer Ratings & Reviews</h3>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-1">
            Moderate and add customer stories, feedback ratings, and testimonials displayed on the storefront.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={fetchReviews}
            className="p-2.5 sm:p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh Reviews"
          >
            <FiRotateCw className={`text-sm sm:text-base ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-xs sm:text-sm md:text-base font-semibold shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer"
          >
            <FiPlus className="text-base sm:text-lg" />
            <span>Add New Review</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${filterStatus === "all" ? "bg-[#6B1527] text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
        >
          All Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setFilterStatus("approved")}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${filterStatus === "approved" ? "bg-[#6B1527] text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
        >
          Approved ({reviews.filter((r) => r.status === "Approved").length})
        </button>
        <button
          onClick={() => setFilterStatus("hidden")}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${filterStatus === "hidden" ? "bg-[#6B1527] text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
        >
          Hidden ({reviews.filter((r) => r.status === "Hidden").length})
        </button>
      </div>

      {/* Review List */}
      <div className="space-y-4 sm:space-y-5">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-200">
            <p className="text-slate-500 font-medium">No reviews found matching the selected filter.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev._id || rev.id}
              className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start justify-between gap-4 sm:gap-5"
            >
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <img
                  src={rev.avatar}
                  alt={rev.reviewer}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/testimonial/testimonial-1.webp";
                  }}
                  className="w-11 h-11 sm:w-13 sm:h-13 rounded-full object-cover border-2 border-rose-100 shrink-0"
                />
                <div className="space-y-1 sm:space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">{rev.reviewer}</h4>
                    {rev.verified && (
                      <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center gap-1">
                        <FiCheck className="text-xs" /> Verified Buyer
                      </span>
                    )}
                    <span
                      className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full ${rev.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : rev.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                    >
                      {rev.status || "Approved"}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#8B1C2C] truncate">{rev.product}</div>

                  <div className="flex items-center gap-1 sm:gap-1.5 text-amber-500 my-0.5 sm:my-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`text-xs sm:text-sm ${i < Math.round(Number(rev.rating || 5)) ? "fill-amber-400 text-amber-400" : "text-slate-300"
                          }`}
                      />
                    ))}
                    <span className="text-xs sm:text-sm font-bold text-slate-800 ml-1">
                      {Number(rev.rating || 5).toFixed(1)}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl pt-0.5 sm:pt-1 italic">
                    "{rev.comment}"
                  </p>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between gap-2.5 sm:gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                <span className="text-[11px] sm:text-xs text-slate-400 font-medium">{rev.date}</span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => handleToggleStatus(rev)}
                    className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${rev.status === "Approved"
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                      }`}
                  >
                    {rev.status === "Approved" ? "Hide" : "Approve"}
                  </button>
                  <button
                    onClick={() => openEditModal(rev)}
                    className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-[#6B1527] hover:bg-rose-50 border border-slate-200 transition cursor-pointer"
                    title="Edit Review"
                  >
                    <FiEdit2 className="text-sm sm:text-base" />
                  </button>
                  <button
                    onClick={() => handleDelete(rev)}
                    className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition cursor-pointer"
                    title="Delete Review"
                  >
                    <FiTrash2 className="text-sm sm:text-base" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-4 sm:p-7 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-admin-scroll">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 sm:pb-4 mb-4 sm:mb-5">
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                  {editingReview ? "Edit Customer Review" : "Add New Customer Review"}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingReview ? "Update customer feedback or rating." : "Add a verified testimonial to display on the storefront."}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingReview(null);
                }}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <FiX className="text-lg sm:text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Customer / Reviewer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={formData.reviewer}
                  onChange={(e) => setFormData({ ...formData, reviewer: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Product / Saree Purchased *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Paithani Silk Saree"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                />
              </div>

              {/* Star Rating selector */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">Rating Score (1-5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 text-2xl cursor-pointer hover:scale-110 transition"
                    >
                      <FiStar
                        className={star <= formData.rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-slate-800 ml-2">{formData.rating} / 5 Stars</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none cursor-pointer"
                  >
                    <option value="Approved">Approved (Live)</option>
                    <option value="Pending">Pending Review</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Customer Review Comment *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Write the customer's testimonial or review here..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none resize-none"
                />
              </div>

              {/* Avatar presets or custom */}
              <div>
                <label className="font-semibold text-slate-800 block mb-2">Reviewer Avatar Preset</label>
                <div className="flex items-center gap-3">
                  {presetAvatars.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: preset })}
                      className={`relative rounded-full overflow-hidden p-0.5 border-2 transition cursor-pointer ${formData.avatar.includes(`testimonial-${idx + 1}`)
                          ? "border-[#6B1527] scale-105 shadow-sm"
                          : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                    >
                      <img src={preset} alt={`Avatar ${idx + 1}`} className="w-10 h-10 rounded-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <ImageUploader
                label="Or Upload Custom Photo / Avatar"
                value={formData.avatar}
                onChange={(url) => setFormData({ ...formData, avatar: url })}
              />

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="reviewVerifiedCheckbox"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="w-4 h-4 text-[#6B1527] rounded accent-[#6B1527] cursor-pointer"
                />
                <label htmlFor="reviewVerifiedCheckbox" className="font-medium text-slate-700 cursor-pointer">
                  Mark as Verified Buyer badge
                </label>
              </div>

              <div className="pt-3 sm:pt-4 flex items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingReview(null);
                  }}
                  className="flex-1 py-2.5 sm:py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition text-xs sm:text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer"
                >
                  <FiCheckCircle className="text-base" />
                  <span>{editingReview ? "Save Changes" : "Publish Review"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
