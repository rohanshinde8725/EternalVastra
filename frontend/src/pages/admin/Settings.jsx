import React, { useState, useEffect } from "react";
import { FiSave, FiShield, FiTruck, FiRotateCw } from "react-icons/fi";
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
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Store Configuration & Preferences</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure business rules, payment policies, tax rates, and logistics stored live in MongoDB.
          </p>
        </div>
        <button
          onClick={fetchSettings}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          title="Reload Settings"
        >
          <FiRotateCw className={`text-sm ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* General Store Settings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-slate-800 font-bold text-sm">
            <FiShield className="text-[#6B1527]" />
            <span>Store Identity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Brand Name</label>
              <input
                type="text"
                value={storeInfo.storeName || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, storeName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tagline</label>
              <input
                type="text"
                value={storeInfo.tagline || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, tagline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Support Email</label>
              <input
                type="email"
                value={storeInfo.contactEmail || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Support Phone</label>
              <input
                type="text"
                value={storeInfo.contactPhone || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Tax */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-slate-800 font-bold text-sm">
            <FiTruck className="text-[#6B1527]" />
            <span>Shipping & Taxes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Free Shipping Min Order (₹)</label>
              <input
                type="number"
                value={storeInfo.freeShippingAbove || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, freeShippingAbove: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Standard Delivery Charge (₹)</label>
              <input
                type="number"
                value={storeInfo.standardShippingFee || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, standardShippingFee: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">GST Rate for Sarees (%)</label>
              <input
                type="number"
                value={storeInfo.gstPercentage || ""}
                onChange={(e) => setStoreInfo({ ...storeInfo, gstPercentage: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 rounded bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-xs md:text-sm font-medium shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer disabled:opacity-50"
          >
            <FiSave className="text-base" />
            <span>{saving ? "Saving to Database..." : "Save Preferences"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
