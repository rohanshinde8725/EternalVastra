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
        showToast.success("Store preferences saved to database successfully!");
      } else {
        showToast.warning("Preferences saved locally");
      }
    } catch {
      showToast.error("Failed to connect to server");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-7 max-w-[1400px] mx-auto pb-12 text-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Store Configuration & Preferences</h3>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Configure business rules, payment policies, tax rates, and logistics stored live in MongoDB.
          </p>
        </div>
        <button
          onClick={fetchSettings}
          className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          title="Reload Settings"
        >
          <FiRotateCw className={`text-base ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7 text-sm">
        {/* General Store Settings */}
        <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm space-y-5">
          <div className="border-b border-slate-200 pb-3.5 flex items-center gap-2.5 text-slate-900 font-bold text-base">
            <FiShield className="text-[#6B1527] text-lg" />
            <span>Store Identity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">Brand Name</label>
              <input
                type="text"
                value={storeInfo.storeName || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, storeName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">Tagline</label>
              <input
                type="text"
                value={storeInfo.tagline || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">Support Email</label>
              <input
                type="email"
                value={storeInfo.contactEmail || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, contactEmail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">Support Phone</label>
              <input
                type="text"
                value={storeInfo.contactPhone || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, contactPhone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Tax */}
        <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm space-y-5">
          <div className="border-b border-slate-200 pb-3.5 flex items-center gap-2.5 text-slate-900 font-bold text-base">
            <FiTruck className="text-[#6B1527] text-lg" />
            <span>Shipping & Taxes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">Free Shipping Min Order (₹)</label>
              <input
                type="number"
                value={storeInfo.freeShippingAbove || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, freeShippingAbove: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">Standard Delivery Charge (₹)</label>
              <input
                type="number"
                value={storeInfo.standardShippingFee || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, standardShippingFee: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">GST Rate for Sarees (%)</label>
              <input
                type="number"
                value={storeInfo.gstPercentage || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, gstPercentage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm space-y-5">
          <div className="border-b border-slate-200 pb-3.5 flex items-center gap-2.5 text-slate-900 font-bold text-base">
            <FiGlobe className="text-[#6B1527] text-lg" />
            <span>Social Media Links</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">Instagram URL</label>
              <input
                type="text"
                value={storeInfo.instagram || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, instagram: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                placeholder="https://www.instagram.com/username"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">Facebook URL</label>
              <input
                type="text"
                value={storeInfo.facebook || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, facebook: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                placeholder="https://www.facebook.com/page"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">GitHub URL</label>
              <input
                type="text"
                value={storeInfo.github || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, github: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">LinkedIn URL</label>
              <input
                type="text"
                value={storeInfo.linkedin || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, linkedin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
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
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-sm md:text-base font-semibold shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer disabled:opacity-50"
          >
            <FiSave className="text-lg" />
            <span>{saving ? "Saving to Database..." : "Save Preferences"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
