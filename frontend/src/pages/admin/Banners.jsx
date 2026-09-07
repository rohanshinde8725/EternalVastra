import React, { useState, useEffect } from "react";
import { FiPlus, FiImage, FiTrash2, FiLink, FiX, FiRotateCw } from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";
import ImageUploader from "../../components/admin/ImageUploader";

const Banners = () => {
  const { showToast } = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: `${API_BASE_URL}/images/banner/banner-1.png`,
    link: "/shop",
    position: "Hero Main Banner",
  });

  const fetchBanners = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/banners`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load banners");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBanners(
            data.map((b) => ({
              ...b,
              image: b.image?.startsWith("http") ? b.image : `${API_BASE_URL}${b.image || "/images/banner/banner-1.png"}`,
            }))
          );
        }
      })
      .catch(() => {
        showToast.error("Failed to load banners from MongoDB");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const toggleActive = async (banner) => {
    const updated = { ...banner, active: !banner.active };
    setBanners(banners.map((b) => ((b._id || b.id) === (banner._id || banner.id) ? updated : b)));

    try {
      if (banner._id) {
        await fetch(`${API_BASE_URL}/api/admin/banners/${banner._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: !banner.active }),
        });
      }
      showToast.success(`Banner status set to ${!banner.active ? "Active" : "Draft"}`);
    } catch {
      showToast.warning("Banner status updated locally");
    }
  };

  const handleDelete = async (banner) => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/recycle-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "banner",
          originalId: String(banner._id || banner.id),
          itemTitle: banner.title,
          itemSubtitle: `${banner.position} • ${banner.link}`,
          image: banner.image,
          data: banner,
        }),
      });

      if (banner._id) {
        await fetch(`${API_BASE_URL}/api/admin/banners/${banner._id}`, { method: "DELETE" }).catch(() => {});
      }
      showToast.success(`Moved banner "${banner.title}" to Recycle Bin.`);
    } catch {
      showToast.info(`Moved "${banner.title}" to Recycle Bin.`);
    }

    const currentRecycle = JSON.parse(localStorage.getItem("eternal_recycle_bin") || "[]");
    const recycleEntry = {
      _id: `rb-${Date.now()}`,
      itemType: "banner",
      originalId: String(banner._id || banner.id),
      itemTitle: banner.title,
      itemSubtitle: `${banner.position} • ${banner.link}`,
      image: banner.image,
      deletedAt: new Date().toISOString(),
      data: banner,
    };
    localStorage.setItem("eternal_recycle_bin", JSON.stringify([recycleEntry, ...currentRecycle]));

    setBanners(banners.filter((b) => (b._id || b.id) !== (banner._id || banner.id)));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const newBanner = {
      ...formData,
      active: true,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/banners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBanner),
      });
      if (res.ok) {
        const saved = await res.json();
        setBanners([
          {
            ...saved,
            image: saved.image?.startsWith("http") ? saved.image : `${API_BASE_URL}${saved.image}`,
          },
          ...banners,
        ]);
        showToast.success(`Banner "${newBanner.title}" published in database!`);
      } else {
        setBanners([{ ...newBanner, id: Date.now() }, ...banners]);
        showToast.success(`Banner "${newBanner.title}" published.`);
      }
    } catch {
      setBanners([{ ...newBanner, id: Date.now() }, ...banners]);
      showToast.info(`Banner "${newBanner.title}" saved locally.`);
    }

    setIsModalOpen(false);
    setFormData({
      title: "",
      subtitle: "",
      image: `${API_BASE_URL}/images/banner/banner-1.png`,
      link: "/shop",
      position: "Hero Main Banner",
    });
  };

  return (
    <div className="space-y-6 sm:space-y-7 max-w-[1600px] mx-auto pb-12 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Storefront Banners & Campaigns</h3>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-1">
            Manage top hero sliders, festival offer promo strips, and category banners saved in MongoDB.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={fetchBanners}
            className="p-2.5 sm:p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh Banners"
          >
            <FiRotateCw className={`text-sm sm:text-base ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-xs sm:text-sm md:text-base font-semibold shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer"
          >
            <FiPlus className="text-base sm:text-lg" />
            <span>Add New Banner</span>
          </button>
        </div>
      </div>

      {/* Banner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {banners.map((banner) => (
          <div
            key={banner._id || banner.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            {/* Banner Preview */}
            <div className="relative h-44 sm:h-56 bg-slate-900 overflow-hidden">
              <img
                src={banner.image}
                alt={banner.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80";
                }}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-4 sm:p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 block">
                  {banner.position}
                </span>
                <h4 className="text-base sm:text-xl font-bold drop-shadow-sm mt-1 truncate">{banner.title}</h4>
                <p className="text-xs sm:text-sm text-rose-100/95 font-medium mt-1 line-clamp-1">{banner.subtitle}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-600 min-w-0">
                <FiLink className="text-sm sm:text-base text-slate-400 shrink-0" />
                <span className="font-mono text-xs font-semibold truncate max-w-[150px] sm:max-w-xs">{banner.link}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  onClick={() => toggleActive(banner)}
                  className={`text-[11px] sm:text-xs font-bold px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full cursor-pointer ${
                    banner.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {banner.active ? "Active on site" : "Draft"}
                </button>
                <button
                  onClick={() => handleDelete(banner)}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Move to Recycle Bin"
                >
                  <FiTrash2 className="text-sm sm:text-base" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-4 sm:p-7 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-admin-scroll">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 sm:pb-4 mb-4 sm:mb-5">
              <h4 className="text-lg sm:text-xl font-bold text-slate-900">Add Campaign Banner</h4>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 transition cursor-pointer">
                <FiX className="text-lg sm:text-xl" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5 sm:space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Festive Saree Sale"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Subtitle / Offer</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 25% Off Across Pure Silks"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Placement</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                >
                  <option value="Hero Main Banner">Hero Main Banner</option>
                  <option value="Homepage Mid Banner">Homepage Mid Banner</option>
                  <option value="Category Top Banner">Category Top Banner</option>
                </select>
              </div>

              <ImageUploader
                label="Banner Image"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />

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
                  className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer"
                >
                  Upload Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
