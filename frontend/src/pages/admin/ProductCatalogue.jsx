import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiStar,
  FiX,
  FiRotateCw,
} from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";
import ImageUploader from "../../components/admin/ImageUploader";

const ProductCatalogue = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // New product form state
  const [formData, setFormData] = useState({
    title: "",
    category: "Silk Sarees",
    discountPrice: "",
    actualPrice: "",
    tag: "New",
    stock: "20",
    img: `${API_BASE_URL}/images/silk/silk-1.jpg`,
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "Silk Sarees",
    discountPrice: "",
    actualPrice: "",
    tag: "",
    stock: "",
    rating: 5,
    img: "",
  });

  const loadProducts = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error("API not available");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((p) => ({
            ...p,
            img: p.img?.startsWith("http") ? p.img : `${API_BASE_URL}${p.img}`,
            stock: p.inventory || 15,
          }));
          setProducts(formatted);
        }
      })
      .catch(() => {
        showToast.error("Failed to connect to backend product catalogue");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.tag && item.tag.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      categoryFilter === "All" ||
      (item.category && item.category.includes(categoryFilter));
    return matchesSearch && matchesCategory;
  });

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setEditFormData({
      title: product.title || "",
      category: product.category?.[0] || "Silk Sarees",
      discountPrice: product.discountPrice || "",
      actualPrice: product.actualPrice || product.discountPrice || "",
      tag: product.tag || "New",
      stock: product.stock || 15,
      rating: product.rating || 5,
      img: product.img || `${API_BASE_URL}/images/silk/silk-1.jpg`,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = {
      ...editingProduct,
      title: editFormData.title,
      category: [editFormData.category],
      discountPrice: Number(editFormData.discountPrice),
      actualPrice: Number(editFormData.actualPrice || editFormData.discountPrice),
      tag: editFormData.tag,
      stock: Number(editFormData.stock),
      inventory: Number(editFormData.stock),
      rating: Number(editFormData.rating),
      img: editFormData.img,
    };

    try {
      const targetId = editingProduct._id || editingProduct.id;
      const res = await fetch(`${API_BASE_URL}/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Could not update product in MongoDB");
      showToast.success(`Updated "${updated.title}" successfully in database!`);
    } catch {
      showToast.warning(`Updated "${updated.title}" locally.`);
    }

    setProducts(products.map((p) => (p.id === editingProduct.id ? updated : p)));
    setEditingProduct(null);
  };

  const handleDeleteToRecycleBin = async (product) => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/recycle-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "product",
          originalId: String(product.id || product._id),
          itemTitle: product.title,
          itemSubtitle: `${product.category?.[0] || "Saree"} • ₹${product.discountPrice}`,
          image: product.img,
          data: product,
        }),
      });

      // Also remove from active products on backend
      await fetch(`${API_BASE_URL}/api/products/${product.id}`, { method: "DELETE" }).catch(() => {});
      showToast.success(`Moved "${product.title}" to Recycle Bin.`);
    } catch {
      showToast.info(`Moved "${product.title}" to Recycle Bin.`);
    }

    const currentRecycle = JSON.parse(localStorage.getItem("eternal_recycle_bin") || "[]");
    const recycleEntry = {
      _id: `rb-${Date.now()}`,
      itemType: "product",
      originalId: String(product.id),
      itemTitle: product.title,
      itemSubtitle: `${product.category?.[0] || "Saree"} • ₹${product.discountPrice}`,
      image: product.img,
      deletedAt: new Date().toISOString(),
      data: product,
    };
    localStorage.setItem("eternal_recycle_bin", JSON.stringify([recycleEntry, ...currentRecycle]));

    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      title: formData.title,
      category: [formData.category],
      discountPrice: Number(formData.discountPrice),
      actualPrice: Number(formData.actualPrice || formData.discountPrice),
      tag: formData.tag,
      rating: 5.0,
      stock: Number(formData.stock),
      inventory: Number(formData.stock),
      img: formData.img,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        const saved = await res.json();
        setProducts([saved, ...products]);
        showToast.success(`"${newProduct.title}" added to MongoDB database!`);
      } else {
        setProducts([newProduct, ...products]);
        showToast.success(`"${newProduct.title}" added to catalogue.`);
      }
    } catch {
      setProducts([newProduct, ...products]);
      showToast.info(`"${newProduct.title}" added locally.`);
    }

    setIsAddModalOpen(false);
    setFormData({
      title: "",
      category: "Silk Sarees",
      discountPrice: "",
      actualPrice: "",
      tag: "New",
      stock: "20",
      img: `${API_BASE_URL}/images/silk/silk-1.jpg`,
    });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Saree Catalogue</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your store's inventory, edit prices, tags, and live database stock.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadProducts}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Reload from database"
          >
            <FiRotateCw className={`text-sm ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            to="/admin/recycle-bin"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <FiTrash2 className="text-sm text-slate-500" />
            <span>Recycle Bin</span>
          </Link>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-xs md:text-sm font-medium shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer"
          >
            <FiPlus className="text-base" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              "All",
              "Silk Sarees",
              "Cotton Sarees",
              "Paithani Sarees",
              "Georgette Sarees",
              "Organza Sarees",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  categoryFilter === cat
                    ? "bg-[#6B1527] text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search sarees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#6B1527] focus:bg-white transition"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">Product</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Sale Price</th>
                <th className="py-3.5 px-5">Tag</th>
                <th className="py-3.5 px-5">Stock</th>
                <th className="py-3.5 px-5">Rating</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No sarees found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id || product._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.img}
                          alt={product.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&auto=format&fit=crop&q=80";
                          }}
                          className="w-11 h-11 rounded-lg object-cover bg-slate-100 border border-slate-100 flex-shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block">{product.title}</span>
                          <span className="text-[11px] text-slate-400 block">ID: #{product.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {product.category?.[0] || "General"}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-800">
                        ₹{Number(product.discountPrice || 0).toLocaleString("en-IN")}
                      </div>
                      {product.actualPrice && product.actualPrice > product.discountPrice && (
                        <div className="text-[10px] text-slate-400 line-through">
                          ₹{Number(product.actualPrice).toLocaleString("en-IN")}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#6B1527] font-semibold text-[10px]">
                        {product.tag || "Regular"}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`font-semibold ${
                          product.stock < 10 ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        {product.stock || 15} units
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1 text-amber-500 font-semibold">
                        <FiStar className="fill-amber-400 text-amber-400 text-xs" />
                        <span>{product.rating || "4.8"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition"
                          title="Edit Saree Details"
                        >
                          <FiEdit3 className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteToRecycleBin(product)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Move to Recycle Bin"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-admin-scroll">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-[11px] text-amber-700 font-bold">Edit Saree Listing</span>
                <h3 className="text-lg font-bold text-slate-800">#{editingProduct.id} — {editingProduct.title}</h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Saree Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6B1527]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  >
                    <option value="Silk Sarees">Silk Sarees</option>
                    <option value="Cotton Sarees">Cotton Sarees</option>
                    <option value="Paithani Sarees">Paithani Sarees</option>
                    <option value="Georgette Sarees">Georgette Sarees</option>
                    <option value="Organza Sarees">Organza Sarees</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tag / Badge</label>
                  <input
                    type="text"
                    value={editFormData.tag}
                    onChange={(e) => setEditFormData({ ...editFormData, tag: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editFormData.discountPrice}
                    onChange={(e) => setEditFormData({ ...editFormData, discountPrice: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Actual Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.actualPrice}
                    onChange={(e) => setEditFormData({ ...editFormData, actualPrice: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stock Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
              </div>

              <ImageUploader
                label="Product Image"
                value={editFormData.img}
                onChange={(url) => setEditFormData({ ...editFormData, img: url })}
              />

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-xs md:text-sm font-medium shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-admin-scroll">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-xs text-slate-400">Inventory</span>
                <h3 className="text-lg font-bold text-slate-800">Add New Saree Listing</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Saree Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Mysore Silk Zari Saree"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6B1527]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  >
                    <option value="Silk Sarees">Silk Sarees</option>
                    <option value="Cotton Sarees">Cotton Sarees</option>
                    <option value="Paithani Sarees">Paithani Sarees</option>
                    <option value="Georgette Sarees">Georgette Sarees</option>
                    <option value="Organza Sarees">Organza Sarees</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tag / Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. New, Bestseller, -20%"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="2899"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Actual Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="3699"
                    value={formData.actualPrice}
                    onChange={(e) => setFormData({ ...formData, actualPrice: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stock Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
              </div>

              <ImageUploader
                label="Product Image"
                value={formData.img}
                onChange={(url) => setFormData({ ...formData, img: url })}
              />

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-xs md:text-sm font-medium shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCatalogue;
