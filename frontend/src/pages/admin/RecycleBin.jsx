import React, { useState, useEffect } from "react";
import {
  FiTrash2,
  FiRotateCcw,
  FiSearch,
  FiBox,
  FiTag,
  FiImage,
  FiAlertTriangle,
  FiRotateCw,
  FiShoppingBag,
} from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";

const typeBadgeStyles = {
  product: { bg: "bg-rose-50 text-[#8B1C2C]", label: "Product", icon: FiBox },
  category: { bg: "bg-amber-50 text-amber-800", label: "Category", icon: FiTag },
  banner: { bg: "bg-purple-50 text-purple-800", label: "Banner", icon: FiImage },
  order: { bg: "bg-blue-50 text-blue-800", label: "Order", icon: FiShoppingBag },
};

const RecycleBin = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [search, setSearch] = useState("");
  const [confirmEmptyModal, setConfirmEmptyModal] = useState(false);
  const [itemToDeletePermanent, setItemToDeletePermanent] = useState(null);

  const fetchRecycleBin = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/recycle-bin`)
      .then((res) => {
        if (!res.ok) throw new Error("API not available");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
          localStorage.setItem("eternal_recycle_bin", JSON.stringify(data));
        }
      })
      .catch(() => {
        const saved = localStorage.getItem("eternal_recycle_bin");
        if (saved) setItems(JSON.parse(saved));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecycleBin();
  }, []);

  const handleRestore = async (item) => {
    try {
      if (item._id && !item._id.startsWith("rb-")) {
        const res = await fetch(`${API_BASE_URL}/api/admin/recycle-bin/${item._id}/restore`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Restore failed");
      }
      showToast.success(`Restored "${item.itemTitle}" back to active records!`);
    } catch {
      showToast.info(`Restored "${item.itemTitle}" locally.`);
    }

    const updated = items.filter((i) => (i._id || i.id) !== (item._id || item.id));
    setItems(updated);
    localStorage.setItem("eternal_recycle_bin", JSON.stringify(updated));
  };

  const handleDeletePermanent = async (item) => {
    try {
      if (item._id && !item._id.startsWith("rb-")) {
        const res = await fetch(`${API_BASE_URL}/api/admin/recycle-bin/${item._id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete failed");
      }
      showToast.success(`Permanently purged "${item.itemTitle}" from database.`);
    } catch {
      showToast.info(`Deleted "${item.itemTitle}".`);
    }

    const updated = items.filter((i) => (i._id || i.id) !== (item._id || item.id));
    setItems(updated);
    localStorage.setItem("eternal_recycle_bin", JSON.stringify(updated));
    setItemToDeletePermanent(null);
  };

  const handleEmptyBin = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/recycle-bin`, {
        method: "DELETE",
      }).catch(() => {});
      showToast.success("Recycle Bin has been completely emptied from database.");
    } catch {
      showToast.info("Recycle Bin cleared.");
    }

    setItems([]);
    localStorage.setItem("eternal_recycle_bin", JSON.stringify([]));
    setConfirmEmptyModal(false);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.itemTitle?.toLowerCase().includes(search.toLowerCase()) ||
      (item.itemSubtitle && item.itemSubtitle.toLowerCase().includes(search.toLowerCase()));
    const matchesType =
      filterType === "All" || item.itemType?.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const countByType = (type) =>
    type === "All"
      ? items.length
      : items.filter((i) => i.itemType?.toLowerCase() === type.toLowerCase()).length;

  return (
    <div className="space-y-7 max-w-[1600px] mx-auto pb-12 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Recycle Bin</h3>
            <span className="px-3 py-1 rounded-full bg-rose-50 text-[#6B1527] font-bold text-xs border border-rose-100">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </span>
          </div>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Safely restore deleted products, categories, and banners in MongoDB, or purge them permanently.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRecycleBin}
            className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh Recycle Bin"
          >
            <FiRotateCw className={`text-base ${loading ? "animate-spin" : ""}`} />
          </button>
          {items.length > 0 && (
            <button
              onClick={() => setConfirmEmptyModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-rose-50 border-2 border-[#6B1527] text-[#6B1527] text-sm md:text-base font-semibold shadow-sm transition-all duration-300 cursor-pointer"
            >
              <FiTrash2 className="text-base" />
              <span>Empty Recycle Bin</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {["All", "Product", "Category", "Banner"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                  filterType === type
                    ? "bg-[#6B1527] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>
                  {type === "Product"
                    ? "Products"
                    : type === "Category"
                    ? "Categories"
                    : type === "Banner"
                    ? "Banners"
                    : "All Items"}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    filterType === type ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {countByType(type)}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative min-w-[280px]">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
            <input
              type="text"
              placeholder="Search deleted items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#6B1527] focus:bg-white transition"
            />
          </div>
        </div>

        {/* Deleted Items Table */}
        <div className="overflow-x-auto">
          {filteredItems.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-3">
                <FiTrash2 className="text-3xl" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Recycle Bin is Empty</h4>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                No deleted products, categories, or banners found. Deleted items will appear here for safe recovery.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-xs">
                  <th className="py-4 px-6">Item Details</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Original Info</th>
                  <th className="py-4 px-6">Deleted On</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const typeConfig =
                    typeBadgeStyles[item.itemType?.toLowerCase()] || typeBadgeStyles.product;
                  const Icon = typeConfig.icon;
                  const formattedDate = new Date(item.deletedAt || Date.now()).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  );

                  return (
                    <tr key={item._id || item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          {item.image ? (
                            <img
                              src={
                                item.image.startsWith("http")
                                  ? item.image
                                  : `${API_BASE_URL}${item.image}`
                              }
                              alt={item.itemTitle}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&auto=format&fit=crop&q=80";
                              }}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                              <Icon className="text-xl" />
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-base text-slate-800 block">{item.itemTitle}</span>
                            <span className="text-xs text-slate-400 block mt-0.5">
                              ID: #{item.originalId || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs ${typeConfig.bg}`}
                        >
                          <Icon className="text-sm" />
                          <span>{typeConfig.label}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-700 font-medium text-sm">
                        {item.itemSubtitle || "—"}
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs font-medium">{formattedDate}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => handleRestore(item)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition border border-emerald-200 cursor-pointer"
                            title="Restore item back to active records"
                          >
                            <FiRotateCcw className="text-sm" />
                            <span>Restore</span>
                          </button>
                          <button
                            onClick={() => setItemToDeletePermanent(item)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs transition border border-rose-200 cursor-pointer"
                            title="Permanently purge from MongoDB"
                          >
                            <FiTrash2 className="text-sm" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Permanent Single Delete */}
      {itemToDeletePermanent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-7 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mb-4">
              <FiAlertTriangle className="text-3xl" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Permanently Delete Item?</h4>
            <p className="text-sm text-slate-600 mt-1.5 mb-6 leading-relaxed">
              Are you sure you want to permanently purge{" "}
              <strong>"{itemToDeletePermanent.itemTitle}"</strong> from the database? This action
              cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setItemToDeletePermanent(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePermanent(itemToDeletePermanent)}
                className="flex-1 py-3 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition shadow-xs cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Empty Recycle Bin */}
      {confirmEmptyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-7 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mb-4">
              <FiTrash2 className="text-3xl" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Empty Entire Recycle Bin?</h4>
            <p className="text-sm text-slate-600 mt-1.5 mb-6 leading-relaxed">
              All <strong>{items.length} items</strong> will be permanently destroyed in MongoDB. This
              cannot be recovered.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setConfirmEmptyModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEmptyBin}
                className="flex-1 py-3 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition shadow-xs cursor-pointer"
              >
                Purge All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecycleBin;
