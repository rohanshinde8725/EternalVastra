import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiMapPin, FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";
import { loginUserSession } from "../../utils/auth";
import FadeUp from "../../components/animations/FadeUp";

const AddressBook = () => {
  const { showToast } = useToast();
  const outletCtx = useOutletContext() || {};
  const user = outletCtx.user || {};
  const setUser = outletCtx.setUser || (() => {});

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    zip: "",
    phone: "",
    isDefault: false,
  });

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const newAddresses = user.addresses ? [...user.addresses] : [];
      if (addressForm.isDefault) {
        newAddresses.forEach((a) => (a.isDefault = false));
      }
      newAddresses.push(addressForm);

      const userId = user._id || user.id;
      const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: newAddresses }),
      });

      if (response.ok) {
        showToast.success("Address added successfully!");
        setShowAddressForm(false);
        const updated = { ...user, addresses: newAddresses };
        setUser(updated);
        loginUserSession(updated);
        setAddressForm({
          name: "",
          street: "",
          city: "",
          state: "",
          country: "India",
          zip: "",
          phone: "",
          isDefault: false,
        });
      } else {
        showToast.error("Failed to save address.");
      }
    } catch {
      showToast.error("Error saving address.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (index) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const newAddresses = user.addresses.filter((_, i) => i !== index);
      const userId = user._id || user.id;

      const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: newAddresses }),
      });

      if (response.ok) {
        showToast.success("Address deleted successfully!");
        const updated = { ...user, addresses: newAddresses };
        setUser(updated);
        loginUserSession(updated);
      }
    } catch {
      showToast.error("Failed to delete address.");
    }
  };

  return (
    <FadeUp delay={0.15} className="space-y-6">
      {!showAddressForm ? (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#EEDACB] pb-5">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif text-[#74202D] font-bold">Saved Addresses</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Manage your shipping and delivery addresses for seamless checkout.
              </p>
            </div>
            <button
              onClick={() => setShowAddressForm(true)}
              className="bg-[#74202D] text-white uppercase py-2.5 px-5 rounded-xl hover:bg-[#5A1622] transition-all text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <FiPlus /> Add New Address
            </button>
          </div>

          {!user.addresses || user.addresses.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-[#EEDACB] rounded-2xl bg-[#FCF8F5]">
              <FiMapPin className="text-4xl text-[#74202D]/40 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-base">No Addresses Found</h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-5 max-w-sm mx-auto">
                You haven't saved any delivery addresses yet. Add an address to speed up checkout.
              </p>
              <button
                onClick={() => setShowAddressForm(true)}
                className="bg-[#74202D] text-white uppercase py-2.5 px-6 rounded-xl hover:bg-[#5A1622] transition-all text-xs font-bold shadow-xs cursor-pointer"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {user.addresses.map((address, idx) => (
                <div
                  key={idx}
                  className="relative p-5 sm:p-6 rounded-2xl border border-[#EEDACB] bg-[#FCF8F5] hover:bg-white transition-colors group flex flex-col justify-between"
                >
                  {address.isDefault && (
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider border border-emerald-200">
                      Default
                    </span>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-800 text-base mb-1">{address.name}</h4>
                    <p className="text-xs font-semibold text-slate-600 mb-3">{address.phone}</p>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                      {address.street}
                      <br />
                      {address.city}, {address.state} {address.zip}
                      <br />
                      {address.country}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-[#EEDACB]">
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(idx)}
                      className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <FiTrash2 className="text-xs" /> Delete Address
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
          <div className="mb-6 border-b border-[#EEDACB] pb-4">
            <h3 className="text-xl sm:text-2xl font-serif text-[#74202D] font-bold">Add New Delivery Address</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Please fill in your shipping details below.
            </p>
          </div>
          <form onSubmit={handleSaveAddress} className="space-y-5 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.name}
                  onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                  className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3"
                  placeholder="e.g. Priya Sharma"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3"
                placeholder="Flat / House No., Apartment, Street"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">City *</label>
                <input
                  type="text"
                  required
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">State *</label>
                <input
                  type="text"
                  required
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3"
                  placeholder="Maharashtra"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Postal Code (PIN) *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.zip}
                  onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                  className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3"
                  placeholder="400001"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                  className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3"
                  placeholder="India"
                />
              </div>
            </div>

            <div className="flex items-center pt-2">
              <input
                id="default-address"
                type="checkbox"
                checked={addressForm.isDefault}
                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                className="w-4 h-4 text-[#74202D] bg-[#FCF8F5] border-[#EEDACB] rounded focus:ring-[#74202D] focus:ring-2 cursor-pointer"
              />
              <label htmlFor="default-address" className="ml-2 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">
                Set as default shipping address
              </label>
            </div>

            <div className="flex gap-4 pt-4 border-t border-[#EEDACB]">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#74202D] text-white uppercase py-2.5 px-6 sm:px-8 rounded-xl hover:bg-[#5A1622] transition-all text-xs sm:text-sm font-bold shadow-xs disabled:opacity-70 cursor-pointer"
              >
                {saving ? "Saving Address..." : "Save Address"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddressForm(false)}
                className="bg-white text-slate-700 uppercase py-2.5 px-6 rounded-xl border border-slate-300 hover:bg-slate-50 transition-all text-xs sm:text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </FadeUp>
  );
};

export default AddressBook;
