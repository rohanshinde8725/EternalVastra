import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit3, FiLayers, FiX, FiRotateCw } from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";
import ImageUploader from "../../components/admin/ImageUploader";

const Categories = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState(`${API_BASE_URL}/images/silk/silkCategory.png`);

  const fetchCategories = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/categories`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load categories");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(
            data.map((c) => ({
              ...c,
              banner: c.banner?.startsWith("http") ? c.banner : `${API_BASE_URL}${c.banner || "/images/silk/silkCategory.png"}`,
            }))
          );
        }
      })
      .catch(() => {
        showToast.error("Failed to load categories from database");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCat = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      count: 0,
      share: "10%",
      banner,
      description,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCat),
      });
      if (res.ok) {
        const created = await res.json();
        setCategories([
          {
            ...created,
            banner: created.banner?.startsWith("http") ? created.banner : `${API_BASE_URL}${created.banner}`,
          },
          ...categories,
        ]);
        showToast.success(`Category "${name}" created in database!`);
      } else {
        setCategories([{ ...newCat, id: Date.now() }, ...categories]);
        showToast.success(`Category "${name}" added.`);
      }
    } catch {
      setCategories([{ ...newCat, id: Date.now() }, ...categories]);
      showToast.info(`Category "${name}" created locally.`);
    }

    setName("");
    setDescription("");
    setIsModalOpen(false);
  };

  const handleDelete = async (cat) => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/recycle-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "category",
          originalId: String(cat._id || cat.id),
          itemTitle: cat.name,
          itemSubtitle: `Category • ${cat.count || 0} Sarees`,
          image: cat.banner,
          data: cat,
        }),
      });

      if (cat._id) {
        await fetch(`${API_BASE_URL}/api/admin/categories/${cat._id}`, { method: "DELETE" }).catch(() => {});
      }
      showToast.success(`Moved category "${cat.name}" to Recycle Bin.`);
    } catch {
      showToast.info(`Moved "${cat.name}" to Recycle Bin.`);
    }

    const currentRecycle = JSON.parse(localStorage.getItem("eternal_recycle_bin") || "[]");
    const recycleEntry = {
      _id: `rb-${Date.now()}`,
      itemType: "category",
      originalId: String(cat._id || cat.id),
      itemTitle: cat.name,
      itemSubtitle: `Category • ${cat.count || 0} Sarees`,
      image: cat.banner,
      deletedAt: new Date().toISOString(),
      data: cat,
    };
    localStorage.setItem("eternal_recycle_bin", JSON.stringify([recycleEntry, ...currentRecycle]));

    setCategories(categories.filter((c) => (c._id || c.id) !== (cat._id || cat.id)));
  };

  return (
    <div className="space-y-7 max-w-[1600px] mx-auto pb-12 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Saree Categories & Weaves</h3>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Organize sarees by collection, fabric types, and festive classifications in MongoDB.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCategories}
            className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh Categories"
          >
            <FiRotateCw className={`text-base ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-sm md:text-base font-semibold shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer"
          >
            <FiPlus className="text-lg" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id || cat.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between"
          >
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img
                src={cat.banner}
                alt={cat.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80";
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold drop-shadow-sm">{cat.name}</h4>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs">
                    {cat.share || "15%"} sales
                  </span>
                </div>
                <span className="text-sm text-amber-200 font-semibold">{cat.count || 24} Sarees Live</span>
              </div>
            </div>

            <div className="p-5 flex flex-col justify-between flex-1">
              <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {cat.description || "Traditional curated weaves for festive and everyday elegance."}
              </p>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono font-semibold">/{cat.slug || cat.name?.toLowerCase()}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Move Category to Recycle Bin"
                  >
                    <FiTrash2 className="text-base" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-7 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-admin-scroll">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <h4 className="text-xl font-bold text-slate-900">Add Saree Category</h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 text-sm">
              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Banarasi Sarees"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">Description</label>
                <textarea
                  rows="3"
                  placeholder="Short description of this saree style..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                />
              </div>

              <ImageUploader
                label="Category Banner Image"
                value={banner}
                onChange={(url) => setBanner(url)}
              />

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-sm font-semibold shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
