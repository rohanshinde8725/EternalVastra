import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { FiCamera, FiCheckCircle } from "react-icons/fi";
import { API_BASE_URL, resolveImageUrl } from "../../api/products";
import { useToast } from "../../context/ToastContext";
import { loginUserSession } from "../../utils/auth";
import FadeUp from "../../components/animations/FadeUp";

const getUserAvatarUrl = (avatarStr, userName = "Patron") => {
  if (!avatarStr || avatarStr === "/images/default-avatar.webp" || avatarStr.includes("testimonial-1.webp")) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || "Patron")}&background=74202D&color=FFFFFF&bold=true&size=128`;
  }
  return resolveImageUrl(avatarStr);
};

const AccountDetails = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const outletCtx = useOutletContext() || {};
  const user = outletCtx.user || {};
  const setUser = outletCtx.setUser || (() => {});

  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    dob: user.dob || "",
    gender: user.gender || "Female",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        dob: user.dob || "",
        gender: user.gender || "Female",
      });
    }
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userId = user?._id || user?.id;
    if (!userId) return;

    const data = new FormData();
    data.append("avatar", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}/avatar`, {
        method: "POST",
        body: data,
      });
      const resData = await response.json();

      if (response.ok && resData.avatar) {
        const updated = { ...user, avatar: resData.avatar };
        setUser(updated);
        loginUserSession(updated);
        window.dispatchEvent(new Event("userUpdated"));
        showToast.success("Profile photo updated successfully!");
      } else {
        showToast.error(resData.message || "Failed to update profile photo.");
      }
    } catch {
      showToast.error("Failed to upload avatar.");
    }
  };

  const handleSaveAccountDetails = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const userId = user._id || user.id;
      const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast.success("Account details updated successfully!");
        const updated = { ...user, ...formData };
        setUser(updated);
        loginUserSession(updated);
        window.dispatchEvent(new Event("userUpdated"));
      } else {
        showToast.error("Failed to update profile details.");
      }
    } catch {
      showToast.error("Error updating details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FadeUp delay={0.15} className="bg-white rounded-2xl p-6 md:p-8 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] max-w-full">
      <div className="mb-8 border-b border-[#EEDACB] pb-5">
        <h3 className="text-xl sm:text-2xl font-serif text-[#74202D] font-bold">Personal Information</h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Update your profile details, contact information, and preferences.
        </p>
      </div>

      <form onSubmit={handleSaveAccountDetails} className="space-y-6">
        {/* Profile Picture Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#EEDACB]">
          <div className="relative group w-24 h-24 rounded-full overflow-hidden border-3 hover:border-[#5A1622] transition-all duration-300 border-white shadow-md shrink-0">
            <img
              src={getUserAvatarUrl(user.avatar, user.name)}
              alt={user.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/images/default-avatar.webp";
              }}
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <FiCamera className="text-2xl" />
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-slate-800 text-sm sm:text-base mb-1">Profile Picture</h4>
            <p className="text-xs sm:text-sm text-slate-500 mb-3">
              Upload a personalized photo for your account and reviews.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-[#74202D] uppercase py-2 px-5 rounded-xl hover:bg-[#74202D] border-2 border-[#74202D] hover:text-white cursor-pointer transition-all duration-300 text-xs font-bold shadow-xs inline-block"
            >
              Change Picture
            </button>
          </div>
        </div>

        {/* Name & Email Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={user.email || ""}
              className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-sm rounded-xl block p-3 cursor-not-allowed opacity-80"
            />
            <p className="text-[10px] text-slate-400 mt-1.5">Email address cannot be changed.</p>
          </div>
        </div>

        {/* Phone & DOB Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3"
            />
          </div>
        </div>

        {/* Gender Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">Gender</label>
          <div className="flex gap-6">
            {["Female", "Male", "Other"].map((gen) => (
              <label key={gen} className="flex items-center cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={gen}
                    checked={formData.gender === gen}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-[#74202D] transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center scale-0 peer-checked:scale-100 transition-transform">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#74202D]"></div>
                  </div>
                </div>
                <span className="ml-2 text-sm font-medium text-slate-700 group-hover:text-slate-900">{gen}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-[#EEDACB]">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#74202D] text-white uppercase py-2.5 px-8 rounded-xl hover:bg-[#5A1622] transition-all duration-300 text-xs sm:text-sm font-bold shadow-xs disabled:opacity-70 flex items-center gap-2 cursor-pointer"
          >
            <FiCheckCircle className="text-base" />
            <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </FadeUp>
  );
};

export default AccountDetails;
