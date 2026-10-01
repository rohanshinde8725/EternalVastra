import React, { useState, useEffect, useRef } from "react";
import { FiSave, FiRotateCw, FiCamera, FiUploadCloud, FiShield, FiUser, FiMail, FiPhone } from "react-icons/fi";
import { API_BASE_URL, resolveImageUrl } from "../../api/products";
import { useToast } from "../../context/ToastContext";
import { getStoredUser, loginUserSession } from "../../utils/auth";

const Profile = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  const storedUser = getStoredUser() || {};

  const [profile, setProfile] = useState({
    name: storedUser.name || "Rohan Shinde",
    role: "Super Admin",
    email: storedUser.email || "rohanshinde8725@gmail.com",
    phone: storedUser.phone || "",
    avatar: storedUser.avatar || "/uploads/admin/upload-1790850492288-440658.webp",
    currentPassword: "",
    newPassword: "",
  });

  const fetchProfile = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/profile`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load profile");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setProfile((prev) => ({
            ...prev,
            name: data.name || prev.name,
            email: data.email || prev.email,
            phone: data.phone || prev.phone || "",
            avatar: data.avatar || prev.avatar,
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setUploadingAvatar(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/profile/avatar`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const newAvatar = data.avatar;
        setProfile((prev) => ({ ...prev, avatar: newAvatar }));

        // Update stored user in localStorage and broadcast update
        const stored = getStoredUser();
        if (stored) {
          loginUserSession({ ...stored, avatar: newAvatar });
          window.dispatchEvent(new Event("userUpdated"));
        }

        showToast.success("Admin profile picture updated successfully!");
      } else {
        showToast.error("Failed to upload admin profile picture.");
      }
    } catch (error) {
      console.error("Admin avatar upload error:", error);
      showToast.error("Error connecting to server for avatar upload.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          avatar: profile.avatar,
        }),
      });
      if (res.ok) {
        const stored = getStoredUser();
        if (stored) {
          loginUserSession({ ...stored, name: profile.name, email: profile.email });
          window.dispatchEvent(new Event("userUpdated"));
        }
        showToast.success("Admin profile updated in MongoDB database!");
      } else {
        showToast.warning("Profile saved locally");
      }
    } catch {
      showToast.error("Failed to connect to backend");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-7 max-w-[1000px] mx-auto pb-12 text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Admin Account & Credentials</h3>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-1">
            Manage your administrator profile picture, security credentials, and role privileges stored in MongoDB.
          </p>
        </div>
        <button
          onClick={fetchProfile}
          className="p-2.5 sm:p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto flex items-center gap-1.5 text-xs sm:text-sm font-medium"
          title="Refresh Profile"
        >
          <FiRotateCw className={`text-sm sm:text-base ${loading ? "animate-spin" : ""}`} />
          <span className="sm:hidden">Refresh</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-slate-200/90 shadow-sm space-y-6 sm:space-y-8 text-xs sm:text-sm">
        {/* Profile Card Header with Live Photo Upload */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 border-b border-slate-200 pb-6">
          <div className="relative group w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-[#6B1527] shadow-md shrink-0 bg-slate-100">
            <img
              src={resolveImageUrl(profile.avatar)}
              alt={profile.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/default-avatar.webp";
              }}
              className="w-full h-full object-cover"
            />
            <label 
              onClick={() => avatarInputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-semibold"
            >
              <FiCamera className="text-xl sm:text-2xl mb-1" />
              <span>{uploadingAvatar ? "Uploading..." : "Change"}</span>
            </label>
            <input
              type="file"
              ref={avatarInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{profile.name}</h4>
              <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-[#6B1527] border border-rose-200">
                Super Admin
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mb-3">{profile.email}</p>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#6B1527] text-white hover:bg-[#540F1D] text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <FiUploadCloud className="text-sm" />
                <span>{uploadingAvatar ? "Uploading..." : "Upload Profile Picture"}</span>
              </button>
              <span className="text-[11px] text-slate-400">JPG, PNG, WEBP up to 10MB</span>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <h5 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <FiUser className="text-[#6B1527]" />
            <span>Admin Details</span>
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="font-semibold text-slate-800 block mb-1 text-xs sm:text-sm">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1 text-xs sm:text-sm">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1 text-xs sm:text-sm">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1 text-xs sm:text-sm">Role Privilege</label>
              <input
                type="text"
                disabled
                value="Super Administrator"
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-500 cursor-not-allowed opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Password Security */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <h5 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <FiShield className="text-[#6B1527]" />
            <span>Security & Password</span>
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="font-semibold text-slate-800 block mb-1 text-xs sm:text-sm">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={profile.currentPassword}
                onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1 text-xs sm:text-sm">New Password</label>
              <input
                type="password"
                placeholder="New password (optional)"
                value={profile.newPassword}
                onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 sm:pt-3">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto justify-center flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-[#6B1527] hover:bg-[#540F1D] text-white text-xs sm:text-sm md:text-base font-semibold shadow-sm transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            <FiSave className="text-base sm:text-lg" />
            <span>{saving ? "Updating..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
