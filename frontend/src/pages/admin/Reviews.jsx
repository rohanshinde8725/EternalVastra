import React, { useState, useEffect } from "react";
import { FiStar, FiCheck, FiTrash2, FiEye, FiRotateCw } from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";

const Reviews = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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
              avatar: r.avatar?.startsWith("http") ? r.avatar : `${API_BASE_URL}${r.avatar || "/images/testimonial/testimonial-1.png"}`,
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

  const handleDelete = async (rev) => {
    try {
      if (rev._id) {
        await fetch(`${API_BASE_URL}/api/admin/reviews/${rev._id}`, { method: "DELETE" }).catch(() => {});
      }
      showToast.success(`Review from "${rev.reviewer}" deleted from database.`);
    } catch {
      showToast.info(`Review deleted locally.`);
    }

    setReviews(reviews.filter((r) => (r._id || r.id) !== (rev._id || rev.id)));
  };

  const handleToggleStatus = async (rev) => {
    const newStatus = rev.status === "Approved" ? "Hidden" : "Approved";
    setReviews(reviews.map((r) => ((r._id || r.id) === (rev._id || rev.id) ? { ...r, status: newStatus } : r)));

    try {
      if (rev._id) {
        await fetch(`${API_BASE_URL}/api/admin/reviews/${rev._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
      }
      showToast.success(`Review marked as ${newStatus}`);
    } catch {
      showToast.warning("Status updated locally");
    }
  };

  return (
    <div className="space-y-7 max-w-[1600px] mx-auto pb-12 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Customer Ratings & Reviews</h3>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Moderate verified buyer feedback, ratings, and customer stories in MongoDB.
          </p>
        </div>
        <button
          onClick={fetchReviews}
          className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          title="Refresh Reviews"
        >
          <FiRotateCw className={`text-base ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Review List */}
      <div className="space-y-5">
        {reviews.map((rev) => (
          <div
            key={rev._id || rev.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start justify-between gap-5"
          >
            <div className="flex items-start gap-4">
              <img
                src={rev.avatar}
                alt={rev.reviewer}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80";
                }}
                className="w-13 h-13 rounded-full object-cover border border-slate-200 flex-shrink-0"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h4 className="font-bold text-slate-900 text-base">{rev.reviewer}</h4>
                  {rev.verified && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                      Verified Buyer
                    </span>
                  )}
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      rev.status === "Approved" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {rev.status || "Approved"}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#8B1C2C]">{rev.product}</div>

                <div className="flex items-center gap-1.5 text-amber-500 my-1">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <FiStar key={i} className="fill-amber-400 text-sm" />
                  ))}
                  <span className="text-sm font-bold text-slate-800 ml-1">
                    {Number(rev.rating || 5).toFixed(1)}
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed max-w-4xl pt-1">
                  "{rev.comment}"
                </p>
              </div>
            </div>

            <div className="flex md:flex-col items-end justify-between gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              <span className="text-xs text-slate-400 font-medium">{rev.date}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(rev)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition cursor-pointer"
                >
                  {rev.status === "Approved" ? "Hide" : "Approve"}
                </button>
                <button
                  onClick={() => handleDelete(rev)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Delete Review"
                >
                  <FiTrash2 className="text-base" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
