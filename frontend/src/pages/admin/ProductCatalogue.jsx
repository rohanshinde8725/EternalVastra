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
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";
import ImageUploader from "../../components/admin/ImageUploader";

const ITEMS_PER_PAGE = 20;

const ProductCatalogue = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
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
    material: "",
    description: "",
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
    material: "",
    description: "",
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

  // Reset to first page when search or category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter]);

  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      (item.tag && item.tag.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      categoryFilter === "All" ||
      (item.category && item.category.includes(categoryFilter));
    return matchesSearch && matchesCategory;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, validCurrentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return { pages, start, end };
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setEditFormData({
      title: product.title || "",
      category: product.category?.[0] || "Silk Sarees",
      discountPrice: product.discountPrice || "",
      actualPrice: product.actualPrice || product.discountPrice || "",
      tag: product.tag || "New",
      stock: product.stock || product.inventory || 15,
      rating: product.rating || 5,
      material: product.details?.material || product.material || "",
      description: product.details?.description || product.description || "",
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
      material: editFormData.material?.trim() || "",
      description: editFormData.description?.trim() || "",
      details: {
        ...(editingProduct.details || {}),
        material: editFormData.material?.trim() || "",
        description: editFormData.description?.trim() || "",
      },
    };

    try {
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
    if (!formData.title?.trim() || !formData.discountPrice) {
      showToast.error("Please enter a saree title and sale price.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      category: [formData.category],
      discountPrice: Number(formData.discountPrice),
      actualPrice: Number(formData.actualPrice || formData.discountPrice),
      tag: formData.tag?.trim() || "New",
      rating: 5.0,
      ratings: "24",
      stock: Number(formData.stock || 20),
      inventory: Number(formData.stock || 20),
      material: formData.material?.trim() || "",
      description: formData.description?.trim() || "",
      details: {
        material: formData.material?.trim() || "",
        description: formData.description?.trim() || "",
      },
      img: formData.img || `${API_BASE_URL}/images/silk/silk-1.jpg`,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with ${res.status}`);
      }

      const saved = await res.json();
      const formatted = {
        ...saved,
        img: saved.img?.startsWith("http") ? saved.img : `${API_BASE_URL}${saved.img}`,
        stock: saved.inventory || payload.inventory,
      };

      setProducts((prev) => [formatted, ...prev]);
      showToast.success(`"${payload.title}" saved permanently to MongoDB!`);
      setIsAddModalOpen(false);
      setFormData({
        title: "",
        category: "Silk Sarees",
        discountPrice: "",
        actualPrice: "",
        tag: "New",
        stock: "20",
        material: "",
        description: "",
        img: `${API_BASE_URL}/images/silk/silk-1.jpg`,
      });
    } catch (err) {
      console.error("Failed to add product:", err);
      showToast.error(`Could not save product to database: ${err.message}`);
    }
  };

  const { pages, start, end } = getPageNumbers();

  return (
    <div className="space-y-7 max-w-[1600px] mx-auto pb-12 text-slate-800">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Saree Catalogue</h3>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Manage your store's inventory, edit prices, tags, and live database stock. (20 products per page)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadProducts}
            className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition shadow-xs"
            title="Reload from database"
          >
            <FiRotateCw className={`text-base ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            to="/admin/recycle-bin"
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition shadow-xs"
          >
            <FiTrash2 className="text-base text-slate-500" />
            <span>Recycle Bin</span>
          </Link>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-sm md:text-base font-semibold shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer"
          >
            <FiPlus className="text-lg" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
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
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-[#6B1527] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[280px]">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
            <input
              type="text"
              placeholder="Search sarees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#6B1527] focus:bg-white transition"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-xs">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Sale Price</th>
                <th className="py-4 px-6">Tag</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6">Rating</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-500 text-base">
                    No sarees found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id || product._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={product.img}
                          alt={product.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&auto=format&fit=crop&q=80";
                          }}
                          className="w-13 h-13 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <span className="font-bold text-base text-slate-800 block">{product.title}</span>
                          <span className="text-xs text-slate-500 block mt-0.5">ID: #{product.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold text-xs inline-block">
                        {product.category?.[0] || "General"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-base text-slate-900">
                        ₹{Number(product.discountPrice || 0).toLocaleString("en-IN")}
                      </div>
                      {product.actualPrice && product.actualPrice > product.discountPrice && (
                        <div className="text-xs text-slate-400 line-through">
                          ₹{Number(product.actualPrice).toLocaleString("en-IN")}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full bg-rose-50 text-[#6B1527] font-bold text-xs inline-block border border-rose-100">
                        {product.tag || "Regular"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-bold text-sm ${
                          product.stock < 10 ? "text-rose-600" : "text-emerald-700"
                        }`}
                      >
                        {product.stock || 15} units
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-amber-600 font-bold text-sm">
                        <FiStar className="fill-amber-400 text-amber-500 text-sm" />
                        <span>{product.rating || "4.8"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 rounded-lg text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition cursor-pointer"
                          title="Edit Saree Details"
                        >
                          <FiEdit3 className="text-base" />
                        </button>
                        <button
                          onClick={() => handleDeleteToRecycleBin(product)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Move to Recycle Bin"
                        >
                          <FiTrash2 className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredProducts.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-medium text-slate-600">
              Showing <span className="font-bold text-slate-800">{filteredProducts.length === 0 ? 0 : startIndex + 1}</span> to{" "}
              <span className="font-bold text-slate-800">{endIndex}</span> of{" "}
              <span className="font-bold text-slate-800">{filteredProducts.length}</span> sarees (20 per page)
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 select-none">
                {/* First Page */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={validCurrentPage === 1}
                  className={`p-2 rounded-lg border text-sm font-medium transition ${
                    validCurrentPage === 1
                      ? "border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50"
                      : "border-slate-300 text-slate-700 hover:bg-white hover:border-[#6B1527] cursor-pointer"
                  }`}
                  title="First Page"
                >
                  <FiChevronsLeft className="text-base" />
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => handlePageChange(validCurrentPage - 1)}
                  disabled={validCurrentPage === 1}
                  className={`px-3 py-2 rounded-lg border text-sm font-semibold flex items-center gap-1 transition ${
                    validCurrentPage === 1
                      ? "border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50"
                      : "border-slate-300 text-slate-700 hover:bg-white hover:border-[#6B1527] cursor-pointer"
                  }`}
                >
                  <FiChevronLeft className="text-base" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Page Numbers */}
                {start > 1 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="w-9 h-9 rounded-lg border border-slate-300 text-slate-700 hover:bg-white text-sm font-bold transition cursor-pointer"
                    >
                      1
                    </button>
                    {start > 2 && <span className="px-1 text-slate-400 font-bold">...</span>}
                  </>
                )}

                {pages.map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition cursor-pointer ${
                      validCurrentPage === p
                        ? "bg-[#6B1527] text-white shadow-xs border border-[#6B1527]"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                {end < totalPages && (
                  <>
                    {end < totalPages - 1 && <span className="px-1 text-slate-400 font-bold">...</span>}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="w-9 h-9 rounded-lg border border-slate-300 text-slate-700 hover:bg-white text-sm font-bold transition cursor-pointer"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                {/* Next Page */}
                <button
                  onClick={() => handlePageChange(validCurrentPage + 1)}
                  disabled={validCurrentPage === totalPages}
                  className={`px-3 py-2 rounded-lg border text-sm font-semibold flex items-center gap-1 transition ${
                    validCurrentPage === totalPages
                      ? "border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50"
                      : "border-slate-300 text-slate-700 hover:bg-white hover:border-[#6B1527] cursor-pointer"
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <FiChevronRight className="text-base" />
                </button>

                {/* Last Page */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={validCurrentPage === totalPages}
                  className={`p-2 rounded-lg border text-sm font-medium transition ${
                    validCurrentPage === totalPages
                      ? "border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50"
                      : "border-slate-300 text-slate-700 hover:bg-white hover:border-[#6B1527] cursor-pointer"
                  }`}
                  title="Last Page"
                >
                  <FiChevronsRight className="text-base" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-7 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-admin-scroll">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <div>
                <span className="text-xs text-amber-800 font-bold uppercase tracking-wider">Edit Saree Listing</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">#{editingProduct.id} — {editingProduct.title}</h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-sm">
              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">Saree Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6B1527]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6B1527]"
                  >
                    <option value="Silk Sarees">Silk Sarees</option>
                    <option value="Cotton Sarees">Cotton Sarees</option>
                    <option value="Paithani Sarees">Paithani Sarees</option>
                    <option value="Georgette Sarees">Georgette Sarees</option>
                    <option value="Organza Sarees">Organza Sarees</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">Tag / Badge</label>
                  <input
                    type="text"
                    value={editFormData.tag}
                    onChange={(e) => setEditFormData({ ...editFormData, tag: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">Sale Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editFormData.discountPrice}
                    onChange={(e) => setEditFormData({ ...editFormData, discountPrice: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">Actual Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.actualPrice}
                    onChange={(e) => setEditFormData({ ...editFormData, actualPrice: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">Stock Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">Material (Fabric)</label>
                  <input
                    type="text"
                    placeholder="e.g. Delicate Organza, Pure Mulberry Silk"
                    value={editFormData.material}
                    onChange={(e) => setEditFormData({ ...editFormData, material: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="Custom saree summary or leave blank"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
              </div>

              <ImageUploader
                label="Product Image"
                value={editFormData.img}
                onChange={(url) => setEditFormData({ ...editFormData, img: url })}
              />

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-sm font-semibold shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer"
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-7 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-admin-scroll">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Inventory</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">Add New Saree Listing</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-sm">
              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">Saree Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Mysore Silk Zari Saree"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6B1527]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6B1527]"
                  >
                    <option value="Silk Sarees">Silk Sarees</option>
                    <option value="Cotton Sarees">Cotton Sarees</option>
                    <option value="Paithani Sarees">Paithani Sarees</option>
                    <option value="Georgette Sarees">Georgette Sarees</option>
                    <option value="Organza Sarees">Organza Sarees</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">Tag / Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. New, Bestseller, -20%"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">Sale Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="2899"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">Actual Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="3699"
                    value={formData.actualPrice}
                    onChange={(e) => setFormData({ ...formData, actualPrice: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">Stock Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">Material (Fabric)</label>
                  <input
                    type="text"
                    placeholder="e.g. Delicate Organza, Pure Paithani Silk"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="Custom saree description or leave blank"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
              </div>

              <ImageUploader
                label="Product Image"
                value={formData.img}
                onChange={(url) => setFormData({ ...formData, img: url })}
              />

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-sm font-semibold shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer"
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
