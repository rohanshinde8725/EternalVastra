import React, { useState } from "react";
import { FiPlus, FiTag, FiTrash2, FiCopy, FiCheck, FiX } from "react-icons/fi";

const initialCoupons = [
  {
    id: 1,
    code: "FESTIVE20",
    discount: "20% OFF",
    minSpend: "₹3,999",
    expiry: "30 Sep, 2026",
    usageCount: 142,
    active: true,
  },
  {
    id: 2,
    code: "SILKROYAL",
    discount: "₹500 Flat",
    minSpend: "₹4,999",
    expiry: "15 Oct, 2026",
    usageCount: 88,
    active: true,
  },
  {
    id: 3,
    code: "FIRSTORDER",
    discount: "10% OFF",
    minSpend: "₹1,999",
    expiry: "31 Dec, 2026",
    usageCount: 310,
    active: true,
  },
  {
    id: 4,
    code: "BRIDAL1000",
    discount: "₹1,000 Flat",
    minSpend: "₹9,999",
    expiry: "10 Nov, 2026",
    usageCount: 34,
    active: false,
  },
];

const Coupons = () => {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [copiedCode, setCopiedCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    minSpend: "",
    expiry: "31 Oct, 2026",
  });

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const toggleActive = (id) => {
    setCoupons(
      coupons.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!formData.code) return;
    const newCoupon = {
      id: Date.now(),
      code: formData.code.toUpperCase(),
      discount: formData.discount,
      minSpend: formData.minSpend,
      expiry: formData.expiry,
      usageCount: 0,
      active: true,
    };
    setCoupons([newCoupon, ...coupons]);
    setIsModalOpen(false);
    setFormData({ code: "", discount: "", minSpend: "", expiry: "31 Oct, 2026" });
  };

  return (
    <div className="space-y-7 max-w-[1600px] mx-auto pb-12 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Promotions & Coupons</h3>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Create festive discount codes, flash sale coupons, and minimum order vouchers.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6B1527] hover:bg-[#7E1A2E] text-white text-sm md:text-base font-semibold shadow-xs transition cursor-pointer"
        >
          <FiPlus className="text-lg" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupon Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`bg-white rounded-2xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between ${
              coupon.active ? "border-rose-100 shadow-sm" : "border-slate-200 opacity-60"
            }`}
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#8B1C2C] bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                {coupon.discount}
              </span>
              <button
                onClick={() => toggleActive(coupon.id)}
                className={`text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer ${
                  coupon.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                }`}
              >
                {coupon.active ? "Active" : "Inactive"}
              </button>
            </div>

            {/* Code Box */}
            <div className="my-5 p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-between">
              <span className="font-mono font-bold text-base text-slate-900 tracking-wider">
                {coupon.code}
              </span>
              <button
                onClick={() => handleCopy(coupon.code)}
                className="p-1.5 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                title="Copy Code"
              >
                {copiedCode === coupon.code ? (
                  <FiCheck className="text-emerald-600 text-base" />
                ) : (
                  <FiCopy className="text-base" />
                )}
              </button>
            </div>

            {/* Details */}
            <div className="space-y-1.5 text-sm text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span>Min. Spend:</span>
                <span className="font-bold text-slate-800">{coupon.minSpend}</span>
              </div>
              <div className="flex justify-between">
                <span>Used Count:</span>
                <span className="font-bold text-slate-800">{coupon.usageCount} times</span>
              </div>
              <div className="flex justify-between">
                <span>Expires:</span>
                <span className="font-semibold text-slate-700">{coupon.expiry}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-7 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <h4 className="text-xl font-bold text-slate-900">New Promo Code</h4>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 transition cursor-pointer">
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-4 text-sm">
              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI25"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 uppercase font-mono text-sm tracking-wider text-slate-900 focus:border-[#6B1527] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">Discount Value</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 25% OFF or ₹750 Flat"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">Min Spend</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹2,999"
                    value={formData.minSpend}
                    onChange={(e) => setFormData({ ...formData, minSpend: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">Expiry Date</label>
                <input
                  type="text"
                  value={formData.expiry}
                  onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#6B1527] text-white font-semibold hover:bg-[#7E1A2E] text-sm cursor-pointer"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
