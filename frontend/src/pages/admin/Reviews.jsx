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
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Customer Ratings & Reviews</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Moderate verified buyer feedback, ratings, and customer stories in MongoDB.
          </p>
        </div>
        <button
          onClick={fetchReviews}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          title="Refresh Reviews"
        >
          <FiRotateCw className={`text-sm ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev._id || rev.id}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition flex flex-col md:flex-row items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <img
                src={rev.avatar}
                alt={rev.reviewer}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80";
                }}
                className="w-11 h-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800 text-sm">{rev.reviewer}</h4>
                  {rev.verified && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      Verified Buyer
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rev.status === "Approved" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {rev.status || "Approved"}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#8B1C2C]">{rev.product}</div>

                <div className="flex items-center gap-1 text-amber-400 my-1">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <FiStar key={i} className="fill-amber-400 text-xs" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1">
                    {Number(rev.rating || 5).toFixed(1)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl pt-1">
                  "{rev.comment}"
                </p>
              </div>
            </div>

            <div className="flex md:flex-col items-end justify-between gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              <span className="text-[11px] text-slate-400">{rev.date}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(rev)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                >
                  {rev.status === "Approved" ? "Hide" : "Approve"}
                </button>
                <button
                  onClick={() => handleDelete(rev)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition text-xs"
                  title="Delete Review"
                >
                  <FiTrash2 className="text-sm" />
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
