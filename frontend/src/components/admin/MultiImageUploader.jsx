import React, { useRef, useState } from "react";
import { FiUpload, FiLink, FiTrash2, FiStar, FiArrowLeft, FiArrowRight, FiPlus, FiImage } from "react-icons/fi";
import { API_BASE_URL, resolveImageUrl } from "../../api/products";
import { useToast } from "../../context/ToastContext";

/**
 * MultiImageUploader
 * Props:
 *   images: string[]
 *   onChange: (images: string[]) => void
 *   label?: string
 */
const MultiImageUploader = ({ images = [], onChange, label = "Product Image Gallery" }) => {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const [urlInput, setUrlInput] = useState("");
  const [tab, setTab] = useState("upload"); // "upload" | "url"
  const [uploading, setUploading] = useState(false);

  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];

  const handleAddUrl = (e) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (safeImages.includes(trimmed)) {
      showToast.warning("This image is already in the gallery.");
      return;
    }
    const updated = [...safeImages, trimmed];
    onChange(updated);
    setUrlInput("");
    showToast.success("Image URL added to gallery.");
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const invalid = files.find((f) => !f.type.startsWith("image/"));
    if (invalid) {
      showToast.error("Only image files are allowed.");
      return;
    }

    const oversized = files.find((f) => f.size > 10 * 1024 * 1024);
    if (oversized) {
      showToast.error("Images must be under 10 MB each.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const res = await fetch(`${API_BASE_URL}/api/admin/upload-images`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const uploadedUrls = (data.urls || []).map((u) => (u.startsWith("http") ? u : `${API_BASE_URL}${u}`));

      const updated = [...safeImages, ...uploadedUrls];
      onChange(updated);
      showToast.success(`Uploaded ${files.length} image${files.length > 1 ? "s" : ""} successfully!`);
    } catch {
      // Fallback: local blob URLs for immediate offline feedback
      const localUrls = files.map((f) => URL.createObjectURL(f));
      const updated = [...safeImages, ...localUrls];
      onChange(updated);
      showToast.warning("Loaded images locally (could not connect to server upload).");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index) => {
    const updated = safeImages.filter((_, idx) => idx !== index);
    onChange(updated);
    showToast.info("Image removed from gallery.");
  };

  const handleSetMain = (index) => {
    if (index === 0) return;
    const selected = safeImages[index];
    const rest = safeImages.filter((_, idx) => idx !== index);
    const updated = [selected, ...rest];
    onChange(updated);
    showToast.success("Set as primary cover image!");
  };

  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= safeImages.length) return;
    const newArr = [...safeImages];
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    onChange(newArr);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-slate-800 text-xs sm:text-sm block">
          {label} ({safeImages.length} image{safeImages.length === 1 ? "" : "s"})
        </label>
        <span className="text-[11px] text-slate-500">
          First image is used as the store cover
        </span>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              tab === "upload" ? "bg-white shadow-xs text-[#6B1527]" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <FiUpload className="text-sm" />
            Upload Device Images
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              tab === "url" ? "bg-white shadow-xs text-[#6B1527]" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <FiLink className="text-sm" />
            Add Image by URL
          </button>
        </div>
      </div>

      {/* Upload Dropzone */}
      {tab === "upload" && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const dropped = Array.from(e.dataTransfer.files || []);
            if (dropped.length > 0) {
              const dt = new DataTransfer();
              dropped.forEach((f) => dt.items.add(f));
              if (fileInputRef.current) {
                fileInputRef.current.files = dt.files;
                handleFileUpload({ target: { files: dt.files } });
              }
            }
          }}
          className="border-2 border-dashed border-slate-200 hover:border-[#6B1527] transition rounded-xl p-5 text-center cursor-pointer bg-slate-50 hover:bg-rose-50/30 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          {uploading ? (
            <div className="py-2 space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#6B1527] border-t-transparent animate-spin mx-auto" />
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Uploading images to server…</p>
            </div>
          ) : (
            <div className="space-y-1">
              <FiImage className="text-2xl text-slate-400 group-hover:text-[#6B1527] mx-auto transition" />
              <p className="text-xs sm:text-sm text-slate-700">
                <span className="font-bold text-[#6B1527]">Click to select images</span> or drag & drop multiple files
              </p>
              <p className="text-[11px] text-slate-400">JPG, PNG, WEBP — up to 10 files at once</p>
            </div>
          )}
        </div>
      )}

      {/* URL Input */}
      {tab === "url" && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="e.g. /images/silk/silk-1.webp or https://..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-2 bg-[#6B1527] hover:bg-[#52101e] text-white text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer shrink-0"
          >
            <FiPlus /> Add
          </button>
        </div>
      )}

      {/* Thumbnails Gallery Grid */}
      {safeImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {safeImages.map((imgUrl, index) => {
            const isCover = index === 0;
            return (
              <div
                key={`${imgUrl}-${index}`}
                className={`relative group rounded-xl overflow-hidden border-2 bg-slate-100 transition ${
                  isCover ? "border-[#6B1527] ring-2 ring-[#6B1527]/20 shadow-xs" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-white">
                  <img
                    src={resolveImageUrl(imgUrl)}
                    alt={`Product view ${index + 1}`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/silk/silk-1.webp";
                    }}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Badge: Main Cover */}
                {isCover ? (
                  <span className="absolute top-1.5 left-1.5 bg-[#6B1527] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                    <FiStar className="text-[10px] fill-current" /> Cover
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetMain(index)}
                    title="Set as Main Cover"
                    className="absolute top-1.5 left-1.5 bg-black/60 hover:bg-[#6B1527] text-white text-[10px] font-semibold px-2 py-0.5 rounded-md transition opacity-0 group-hover:opacity-100 cursor-pointer shadow-xs"
                  >
                    Set as Cover
                  </button>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  title="Remove Image"
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 hover:bg-rose-600 hover:text-white text-slate-600 transition flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 cursor-pointer shadow-xs"
                >
                  <FiTrash2 className="text-xs" />
                </button>

                {/* Reorder Arrows */}
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition bg-black/60 rounded-lg p-1 text-white text-xs">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, -1)}
                    className="p-1 hover:text-amber-300 disabled:opacity-30 disabled:hover:text-white cursor-pointer"
                    title="Move Left"
                  >
                    <FiArrowLeft />
                  </button>
                  <span className="text-[10px] font-medium">#{index + 1}</span>
                  <button
                    type="button"
                    disabled={index === safeImages.length - 1}
                    onClick={() => handleMove(index, 1)}
                    className="p-1 hover:text-amber-300 disabled:opacity-30 disabled:hover:text-white cursor-pointer"
                    title="Move Right"
                  >
                    <FiArrowRight />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiImageUploader;
