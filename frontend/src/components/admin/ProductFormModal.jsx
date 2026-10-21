import React, { useState, useEffect } from "react";
import { FiX, FiCheck, FiPlus, FiTrash2, FiTag, FiDollarSign, FiLayers, FiInfo, FiImage, FiList } from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import MultiImageUploader from "./MultiImageUploader";

const CATEGORIES = [
  "Silk Sarees",
  "Cotton Sarees",
  "Paithani Sarees",
  "Georgette Sarees",
  "Organza Sarees",
];

const DEFAULT_HIGHLIGHTS = [
  "Comfortable drape throughout the day",
  "Lightweight feel with premium finish",
  "Intricately woven traditional border",
  "Designed for contemporary and festive celebrations",
];

const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isEdit = false,
  allProducts = [],
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [highlightInput, setHighlightInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Silk Sarees",
    tag: "New",
    status: "Published",
    discountPrice: "",
    actualPrice: "",
    stock: "20",
    sku: "",
    shortDescription: "",
    description: "",
    images: [`${API_BASE_URL}/images/silk/silk-1.webp`],
    fabric: "100% Pure Silk",
    sareeLength: "5.5 Meters",
    blousePiece: "Included (0.8 Meter Unstitched)",
    color: "",
    pattern: "",
    workType: "Zari Woven Border & Pallu",
    occasion: "Festive & Wedding Celebrations",
    care: "Dry clean only. Store folded in a cool, dry place.",
    highlights: [...DEFAULT_HIGHLIGHTS],
    relatedProductIds: [],
  });

  useEffect(() => {
    if (initialData) {
      const specs = initialData.specifications || initialData.details?.specifications || {};
      const rawHighlights = initialData.details?.highlights || initialData.highlights || [];
      const imagesList = Array.isArray(initialData.images) && initialData.images.length > 0
        ? initialData.images
        : (initialData.img ? [initialData.img] : [`${API_BASE_URL}/images/silk/silk-1.webp`]);

      setFormData({
        title: initialData.title || "",
        slug: initialData.slug || "",
        category: initialData.category?.[0] || "Silk Sarees",
        tag: initialData.tag || "New",
        status: initialData.status || "Published",
        discountPrice: initialData.discountPrice || "",
        actualPrice: initialData.actualPrice || initialData.discountPrice || "",
        stock: initialData.stock || initialData.inventory || 15,
        sku: initialData.sku || `EV-${String(initialData.id || "001").padStart(3, "0")}`,
        shortDescription: initialData.shortDescription || initialData.details?.shortDescription || "",
        description: initialData.details?.description || initialData.description || "",
        images: imagesList,
        fabric: specs.fabric || initialData.details?.material || initialData.material || "100% Pure Silk",
        sareeLength: specs.sareeLength || "5.5 Meters",
        blousePiece: specs.blousePiece || "Included (0.8 Meter Unstitched)",
        color: specs.color || "",
        pattern: specs.pattern || "",
        workType: specs.workType || "Zari Woven Border & Pallu",
        occasion: specs.occasion || initialData.details?.occasion || "Festive & Wedding Celebrations",
        care: specs.care || initialData.details?.care || "Dry clean only. Store folded in a cool, dry place.",
        highlights: Array.isArray(rawHighlights) && rawHighlights.length > 0 ? rawHighlights : [...DEFAULT_HIGHLIGHTS],
        relatedProductIds: Array.isArray(initialData.relatedProductIds) ? initialData.relatedProductIds : [],
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        category: "Silk Sarees",
        tag: "New",
        status: "Published",
        discountPrice: "",
        actualPrice: "",
        stock: "20",
        sku: "",
        shortDescription: "",
        description: "",
        images: [`${API_BASE_URL}/images/silk/silk-1.webp`],
        fabric: "100% Pure Silk",
        sareeLength: "5.5 Meters",
        blousePiece: "Included (0.8 Meter Unstitched)",
        color: "",
        pattern: "",
        workType: "Zari Woven Border & Pallu",
        occasion: "Festive & Wedding Celebrations",
        care: "Dry clean only. Store folded in a cool, dry place.",
        highlights: [...DEFAULT_HIGHLIGHTS],
        relatedProductIds: [],
      });
    }
    setActiveTab("basic");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug && isEdit ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
    }));
  };

  const handleAddHighlight = (e) => {
    e.preventDefault();
    const trimmed = highlightInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, trimmed],
    }));
    setHighlightInput("");
  };

  const handleRemoveHighlight = (idx) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx),
    }));
  };

  const handleToggleRelated = (id) => {
    setFormData((prev) => {
      const exists = prev.relatedProductIds.includes(id);
      return {
        ...prev,
        relatedProductIds: exists
          ? prev.relatedProductIds.filter((item) => item !== id)
          : [...prev.relatedProductIds, id],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Calculate discount percentage
  const discountVal = Number(formData.discountPrice) || 0;
  const actualVal = Number(formData.actualPrice) || discountVal;
  const discountPercent = actualVal > discountVal ? Math.round(((actualVal - discountVal) / actualVal) * 100) : 0;

  const tabs = [
    { id: "basic", label: "1. Basic & Pricing", icon: FiDollarSign },
    { id: "gallery", label: "2. Images Gallery", icon: FiImage },
    { id: "specs", label: "3. Specifications", icon: FiLayers },
    { id: "details", label: "4. Highlights & Info", icon: FiList },
    { id: "related", label: "5. Related Sarees", icon: FiTag },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden text-slate-800">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-200 bg-slate-50/70">
          <div>
            <span className="text-[11px] font-bold text-[#6B1527] uppercase tracking-wider block">
              {isEdit ? "Catalog Management" : "New Catalog Entry"}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              {isEdit ? `Edit Saree #${initialData?.id || ""} — ${formData.title || "Listing"}` : "Add New Saree Listing"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white overflow-x-auto px-5 sm:px-7 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "border-[#6B1527] text-[#6B1527]"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                <Icon className="text-sm" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body / Tab Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 custom-admin-scroll">
          
          {/* TAB 1: BASIC INFO & PRICING */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-slate-800 block text-xs sm:text-sm mb-1">
                  Saree Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Maroon Banarasi Silk Zari Saree"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="font-semibold text-slate-800 block text-xs sm:text-sm mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block text-xs sm:text-sm mb-1">
                    Tag / Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. New, Bestseller, -15%"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block text-xs sm:text-sm mb-1">
                    Listing Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  >
                    <option value="Published">Published (Live in Shop)</option>
                    <option value="Draft">Draft (Admin Only)</option>
                  </select>
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="p-4 rounded-xl bg-[#FCF8F5] border border-[#EEDACB] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#74202D]">
                    Pricing & Inventory
                  </span>
                  {discountPercent > 0 && (
                    <span className="bg-[#6B1527] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-medium text-slate-700 block text-xs mb-1">
                      Sale Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="2899"
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-sm font-bold text-[#6B1527] focus:outline-none focus:border-[#6B1527]"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block text-xs mb-1">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="3699"
                      value={formData.actualPrice}
                      onChange={(e) => setFormData({ ...formData, actualPrice: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-sm text-slate-600 focus:outline-none focus:border-[#6B1527]"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block text-xs mb-1">
                      Stock Qty *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="20"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block text-xs mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. EV-045-SLK"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block text-xs sm:text-sm mb-1">
                  Short Highlight / Excerpt (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Handwoven Banarasi silk with pure gold zari floral border"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block text-xs sm:text-sm mb-1">
                  URL Slug (Auto-generated)
                </label>
                <input
                  type="text"
                  placeholder="royal-maroon-banarasi-silk"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 focus:outline-none focus:border-[#6B1527]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: IMAGE GALLERY */}
          {activeTab === "gallery" && (
            <div className="space-y-4">
              <MultiImageUploader
                images={formData.images}
                onChange={(imgs) => setFormData({ ...formData, images: imgs })}
                label="Product Saree Photography Gallery"
              />
            </div>
          )}

          {/* TAB 3: SPECIFICATIONS */}
          {activeTab === "specs" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-semibold text-slate-800 block text-xs sm:text-sm mb-1">
                    Fabric / Material *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100% Pure Katan Silk, Chanderi Cotton, Delicate Organza"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block text-xs sm:text-sm mb-1">
                    Saree Length
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5.5 Meters"
                    value={formData.sareeLength}
                    onChange={(e) => setFormData({ ...formData, sareeLength: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block text-xs sm:text-sm mb-1">
                    Blouse Piece
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Included (0.8 Meter Unstitched)"
                    value={formData.blousePiece}
                    onChange={(e) => setFormData({ ...formData, blousePiece: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block text-xs sm:text-sm mb-1">
                    Color / Shade
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Wine Maroon & Antique Gold"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block text-xs sm:text-sm mb-1">
                    Pattern / Weave
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Floral Jaal & Traditional Peacock Motifs"
                    value={formData.pattern}
                    onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block text-xs sm:text-sm mb-1">
                    Work / Embroidery
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Zari Woven Border & Rich Designer Pallu"
                    value={formData.workType}
                    onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block text-xs sm:text-sm mb-1">
                    Recommended Occasion
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Weddings, Receptions & Festive Ceremonies"
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block text-xs sm:text-sm mb-1">
                    Care Instructions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dry clean only. Store folded in a cool, dry place."
                    value={formData.care}
                    onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HIGHLIGHTS & FULL DESCRIPTION */}
          {activeTab === "details" && (
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-slate-800 block text-xs sm:text-sm mb-1">
                  Full Saree Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Detailed description of the saree, handloom heritage, texture, drape, and styling tips..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#6B1527] resize-none"
                />
              </div>

              {/* Dynamic Highlights List */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-800 block text-xs sm:text-sm">
                  Product Highlights (Bullet points on product page)
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Intricately woven gold zari border"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-4 py-2 bg-[#6B1527] hover:bg-[#52101e] text-white text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <FiPlus /> Add Highlight
                  </button>
                </div>

                <div className="space-y-1.5 pt-2">
                  {formData.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 gap-2"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="text-[#6B1527] font-bold">•</span>
                        <span className="truncate">{item}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer shrink-0"
                        title="Remove highlight"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RELATED PRODUCTS */}
          {activeTab === "related" && (
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-slate-800 block text-xs sm:text-sm mb-1">
                  Select Specific Related Sarees (Optional)
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  By default, related products are automatically chosen from the same category. You can explicitly select preferred sarees below:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto p-1">
                  {allProducts
                    .filter((p) => p.id !== initialData?.id)
                    .slice(0, 30)
                    .map((p) => {
                      const isSelected = formData.relatedProductIds.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleToggleRelated(p.id)}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition ${
                            isSelected
                              ? "bg-rose-50 border-[#6B1527] text-[#6B1527] font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <img
                            src={p.img}
                            alt={p.title}
                            className="w-8 h-10 object-cover rounded-md border shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold">{p.title}</p>
                            <p className="text-[10px] text-slate-500">₹{p.discountPrice}</p>
                          </div>
                          {isSelected && <FiCheck className="text-sm shrink-0" />}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition text-xs sm:text-sm cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {activeTab !== "basic" && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIdx = tabs.findIndex((t) => t.id === activeTab);
                    if (currentIdx > 0) setActiveTab(tabs[currentIdx - 1].id);
                  }}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition text-xs sm:text-sm cursor-pointer"
                >
                  Previous
                </button>
              )}

              {activeTab !== "related" ? (
                <button
                  type="button"
                  onClick={() => {
                    const currentIdx = tabs.findIndex((t) => t.id === activeTab);
                    if (currentIdx < tabs.length - 1) setActiveTab(tabs[currentIdx + 1].id);
                  }}
                  className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold transition text-xs sm:text-sm cursor-pointer"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer"
                >
                  <FiCheck className="text-base" />
                  <span>{isEdit ? "Save Changes" : "Publish Listing"}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
