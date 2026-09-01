import React, { useRef, useState } from "react";
import { FiUpload, FiLink, FiX, FiImage } from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";

/**
 * ImageUploader — reusable admin image input
 * Props:
 *   value   : current image URL string
 *   onChange: (url: string) => void
 *   label   : optional label (default "Image")
 */
const ImageUploader = ({ value, onChange, label = "Image" }) => {
  const { showToast } = useToast();
  const fileRef = useRef(null);
  const [tab, setTab] = useState("url"); // "url" | "upload"
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");

  const handleUrlChange = (e) => {
    setPreview(e.target.value);
    onChange(e.target.value);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast.error("Only image files are allowed (JPG, PNG, WEBP, etc.)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast.error("Image must be under 10 MB");
      return;
    }

    // Show instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // Upload to backend
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_BASE_URL}/api/admin/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const serverUrl = `${API_BASE_URL}${data.url}`;
      setPreview(serverUrl);
      onChange(data.url);
      showToast.success(`"${file.name}" uploaded successfully!`);
    } catch {
      // Fallback: keep local blob URL
      onChange(localUrl);
      showToast.warning("Using local preview — could not save to server.");
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreview("");
    onChange("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-2.5">
      <label className="font-semibold text-slate-800 block text-sm">{label}</label>

      {/* Tab switcher */}
      <div className="flex rounded-xl bg-slate-100 p-1.5 gap-1.5 w-fit">
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            tab === "url" ? "bg-white shadow-xs text-[#6B1527]" : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <FiLink className="text-sm" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            tab === "upload" ? "bg-white shadow-xs text-[#6B1527]" : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <FiUpload className="text-sm" />
          Upload from Device
        </button>
      </div>

      {/* URL Input */}
      {tab === "url" && (
        <input
          type="text"
          value={value || ""}
          onChange={handleUrlChange}
          placeholder="https://... or /images/silk/silk-1.jpg"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#6B1527]"
        />
      )}

      {/* File Upload Drop Zone */}
      {tab === "upload" && (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) {
              // Synthesize event
              const dt = new DataTransfer();
              dt.items.add(file);
              if (fileRef.current) {
                fileRef.current.files = dt.files;
                handleFileSelect({ target: { files: dt.files } });
              }
            }
          }}
          className="relative w-full border-2 border-dashed border-slate-200 hover:border-[#6B1527] transition rounded-xl p-7 text-center cursor-pointer bg-slate-50 hover:bg-rose-50/40 group"
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          {uploading ? (
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-full border-2 border-[#6B1527] border-t-transparent animate-spin mx-auto" />
              <p className="text-sm text-slate-600 font-medium">Uploading to server…</p>
            </div>
          ) : (
            <>
              <FiImage className="text-3xl text-slate-400 group-hover:text-[#6B1527] mx-auto transition" />
              <p className="text-sm text-slate-600 mt-2">
                <span className="font-bold text-[#6B1527]">Click to browse</span> or drag & drop
              </p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP, GIF — max 10 MB</p>
            </>
          )}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative group w-full mt-2">
          <img
            src={preview}
            alt="Preview"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }}
            className="w-full h-36 object-cover rounded-xl border border-slate-200 bg-slate-100"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center text-slate-500 hover:text-rose-600 hover:border-rose-400 transition opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <FiX className="text-sm" />
          </button>
          <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 pointer-events-none" />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
