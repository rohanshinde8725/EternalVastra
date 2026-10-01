import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiLink, FiX, FiRotateCw, FiEdit2, FiCheckCircle } from "react-icons/fi";
import { API_BASE_URL, resolveImageUrl } from "../../api/products";
import { useToast } from "../../context/ToastContext";
import ImageUploader from "../../components/admin/ImageUploader";

const initialForm = {
  title: "",
  subtitle: "",
  description: "Discover our exquisite collection of sarees crafted with tradition, quality & love.",
  buttonText: "Shop Now",
  image: "/images/banner/banner-1.webp",
  link: "/shop",
  position: "Hero Main Banner",
  active: true,
};

const Banners = () => {
  const { showToast } = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState(initialForm);

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
              image: b.image?.startsWith("http") ? b.image : `${API_BASE_URL}${b.image || "/images/banner/banner-1.webp"}`,
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

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      description: banner.description || "Discover our exquisite collection of sarees crafted with tradition, quality & love.",
      buttonText: banner.buttonText || "Shop Now",
      image: banner.image || "/images/banner/banner-1.webp",
      link: banner.link || "/shop",
      position: banner.position || "Hero Main Banner",
      active: banner.active !== false,
    });
    setIsModalOpen(true);
  };

  const toggleActive = async (banner) => {
    const newActive = !banner.active;
    const updated = { ...banner, active: newActive };
    setBanners(banners.map((b) => ((b._id || b.id) === (banner._id || banner.id) ? updated : b)));

    try {
      if (banner._id) {
        await fetch(`${API_BASE_URL}/api/admin/banners/${banner._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: newActive }),
        });
      }
      window.dispatchEvent(new Event("bannersUpdated"));
      showToast.success(`Banner status set to ${newActive ? "Active on site" : "Draft"}`);
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
      window.dispatchEvent(new Event("bannersUpdated"));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingBanner) {
      // Update existing banner
      const bannerId = editingBanner._id || editingBanner.id;
      try {
        if (editingBanner._id) {
          const res = await fetch(`${API_BASE_URL}/api/admin/banners/${editingBanner._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
          if (res.ok) {
            const saved = await res.json();
            setBanners(
              banners.map((b) =>
                (b._id || b.id) === bannerId
                  ? {
                      ...saved,
                      image: saved.image?.startsWith("http") ? saved.image : `${API_BASE_URL}${saved.image}`,
                    }
                  : b
              )
            );
            showToast.success(`Banner "${formData.title}" updated in database!`);
          }
        } else {
          setBanners(banners.map((b) => ((b._id || b.id) === bannerId ? { ...b, ...formData } : b)));
          showToast.success(`Banner updated.`);
        }
        window.dispatchEvent(new Event("bannersUpdated"));
      } catch {
        showToast.error("Failed to update banner");
      }
    } else {
      // Add new banner
      const newBanner = {
        ...formData,
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
        window.dispatchEvent(new Event("bannersUpdated"));
      } catch {
        setBanners([{ ...newBanner, id: Date.now() }, ...banners]);
        showToast.info(`Banner "${newBanner.title}" saved locally.`);
      }
    }

    setIsModalOpen(false);
    setEditingBanner(null);
    setFormData(initialForm);
  };

  return (
    <div className="space-y-6 sm:space-y-7 max-w-[1600px] mx-auto text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Storefront Banners & Campaigns</h3>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-1">
            Manage top hero sliders, festival offer promo strips, and category banners in MongoDB. Changes update instantly on website.
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
            onClick={openAddModal}
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
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition duration-300"
          >
            {/* Banner Preview */}
            <div className="relative h-48 sm:h-60 bg-slate-900 overflow-hidden group">
              <img
                src={banner.image}
                alt={banner.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/banner/banner-1.webp";
                }}
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 sm:p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 block mb-1">
                  {banner.position}
                </span>
                <h4 className="text-base sm:text-xl font-bold drop-shadow-sm mt-0.5 truncate">{banner.title}</h4>
                <p className="text-xs sm:text-sm text-rose-100/95 font-medium mt-1 line-clamp-1">{banner.subtitle}</p>
                {banner.description && (
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-1 line-clamp-1 italic">{banner.description}</p>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs sm:text-sm bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-600 min-w-0">
                <FiLink className="text-sm sm:text-base text-slate-400 shrink-0" />
                <span className="font-mono text-xs font-semibold truncate max-w-[140px] sm:max-w-xs">{banner.link}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                <button
                  onClick={() => toggleActive(banner)}
                  className={`text-[11px] sm:text-xs font-bold px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full cursor-pointer transition ${
                    banner.active
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                  title="Click to toggle live status"
                >
                  {banner.active ? "Active on site" : "Draft"}
                </button>
                <button
                  onClick={() => openEditModal(banner)}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-[#6B1527] hover:bg-rose-50 border border-slate-200 transition cursor-pointer"
                  title="Edit Banner Details"
                >
                  <FiEdit2 className="text-sm sm:text-base" />
                </button>
                <button
                  onClick={() => handleDelete(banner)}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition cursor-pointer"
                  title="Move to Recycle Bin"
                >
                  <FiTrash2 className="text-sm sm:text-base" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-4 sm:p-7 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-admin-scroll">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 sm:pb-4 mb-4 sm:mb-5">
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                  {editingBanner ? "Edit Campaign Banner" : "Add Campaign Banner"}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingBanner ? "Update banner content, media or destination URL." : "Publish a new banner on the website."}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingBanner(null);
                }}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <FiX className="text-lg sm:text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Timeless Waves, Eternal Elegance"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Subtitle / Offer Highlight</label>
                <input
                  type="text"
                  placeholder="e.g. Up to 30% Off On Handloom Silk & Royal Paithanis"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Description / Summary</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Discover our exquisite collection of sarees crafted with tradition, quality & love."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Shop Now"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Target Link</label>
                  <input
                    type="text"
                    placeholder="e.g. /shop or /shop?cat=silk"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Placement Position</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none cursor-pointer"
                >
                  <option value="Hero Main Banner">Hero Main Banner (Top Slider)</option>
                  <option value="Homepage Mid Banner">Homepage Mid Banner (Special Highlights)</option>
                  <option value="Category Top Banner">Category Top Banner</option>
                </select>
              </div>

              <ImageUploader
                label="Banner Background Image"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="bannerActiveCheckbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-[#6B1527] rounded accent-[#6B1527] cursor-pointer"
                />
                <label htmlFor="bannerActiveCheckbox" className="font-medium text-slate-700 cursor-pointer">
                  Publish actively on live storefront
                </label>
              </div>

              <div className="pt-3 sm:pt-4 flex items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingBanner(null);
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
                  <span>{editingBanner ? "Save Changes" : "Publish Banner"}</span>
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
