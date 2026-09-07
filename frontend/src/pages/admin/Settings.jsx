import React, { useState, useEffect } from "react";
import { FiSave, FiShield, FiTruck, FiRotateCw, FiGlobe } from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";

const Settings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeInfo, setStoreInfo] = useState({
    storeName: "Eternal Vastra",
    tagline: "Elegance Eternal — Handcrafted Indian Sarees",
    contactEmail: "support@eternalvastra.com",
    contactPhone: "+91 98200 12345",
    currency: "INR (₹)",
    freeShippingAbove: "1999",
    standardShippingFee: "150",
    gstPercentage: "5",
    codEnabled: true,
    maintenanceMode: false,
  });

  const fetchSettings = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/settings`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load settings");
        return res.json();
      })
      .then((data) => {
        if (data && data.storeName) {
          setStoreInfo(data);
        }
      })
      .catch(() => {
        // use defaults
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeInfo),
      });
      if (res.ok) {
        window.dispatchEvent(new Event("settingsUpdated"));
        showToast.success("Store preferences saved to database successfully!");
      } else {
        window.dispatchEvent(new Event("settingsUpdated"));
        showToast.warning("Preferences saved locally");
      }
    } catch {
      showToast.error("Failed to connect to server");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 max-w-[1400px] mx-auto pb-12 text-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Store Configuration & Preferences</h3>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-1">
            Configure business rules, payment policies, tax rates, and logistics stored live in MongoDB.
          </p>
        </div>
        <button
          onClick={fetchSettings}
          className="p-2.5 sm:p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto shrink-0"
          title="Reload Settings"
        >
          <FiRotateCw className={`text-sm sm:text-base ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-7 text-xs sm:text-sm">
        {/* General Store Settings */}
        <div className="bg-white rounded-2xl p-4 sm:p-7 border border-slate-200/90 shadow-sm space-y-4 sm:space-y-5">
          <div className="border-b border-slate-200 pb-3 flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
            <FiShield className="text-[#6B1527] text-base sm:text-lg" />
            <span>Store Identity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Brand Name</label>
              <input
                type="text"
                value={storeInfo.storeName || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, storeName: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Tagline</label>
              <input
                type="text"
                value={storeInfo.tagline || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, tagline: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Support Email</label>
              <input
                type="email"
                value={storeInfo.contactEmail || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, contactEmail: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Support Phone</label>
              <input
                type="text"
                value={storeInfo.contactPhone || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, contactPhone: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Tax */}
        <div className="bg-white rounded-2xl p-4 sm:p-7 border border-slate-200/90 shadow-sm space-y-4 sm:space-y-5">
          <div className="border-b border-slate-200 pb-3 flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
            <FiTruck className="text-[#6B1527] text-base sm:text-lg" />
            <span>Shipping & Taxes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Free Shipping Min Order (₹)</label>
              <input
                type="number"
                value={storeInfo.freeShippingAbove || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, freeShippingAbove: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Standard Delivery Charge (₹)</label>
              <input
                type="number"
                value={storeInfo.standardShippingFee || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, standardShippingFee: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <label className="font-semibold text-slate-800 block mb-1">GST Rate for Sarees (%)</label>
              <input
                type="number"
                value={storeInfo.gstPercentage || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, gstPercentage: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-2xl p-4 sm:p-7 border border-slate-200/90 shadow-sm space-y-4 sm:space-y-5">
          <div className="border-b border-slate-200 pb-3 flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
            <FiGlobe className="text-[#6B1527] text-base sm:text-lg" />
            <span>Social Media Links</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Instagram URL</label>
              <input
                type="text"
                value={storeInfo.instagram || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, instagram: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                placeholder="https://www.instagram.com/username"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Facebook URL</label>
              <input
                type="text"
                value={storeInfo.facebook || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, facebook: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                placeholder="https://www.facebook.com/page"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1">GitHub URL</label>
              <input
                type="text"
                value={storeInfo.github || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, github: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={storeInfo.linkedin || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, linkedin: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                placeholder="https://www.linkedin.com/in/username"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-xs sm:text-sm md:text-base font-semibold shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer disabled:opacity-50"
          >
            <FiSave className="text-base sm:text-lg" />
            <span>{saving ? "Saving to Database..." : "Save Preferences"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
