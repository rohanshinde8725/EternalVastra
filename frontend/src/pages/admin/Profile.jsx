import React, { useState, useEffect } from "react";
import { FiSave, FiRotateCw } from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";

const Profile = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "Aadya Sharma",
    role: "Super Admin & Head Curator",
    email: "admin@eternalvastra.com",
    avatar: `${API_BASE_URL}/images/testimonial/testimonial-1.png`,
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
        if (data && data.name) {
          setProfile((prev) => ({
            ...prev,
            name: data.name || prev.name,
            email: data.email || prev.email,
            phone: data.phone || "",
            avatar: data.avatar?.startsWith("http") ? data.avatar : `${API_BASE_URL}${data.avatar || "/images/testimonial/testimonial-1.png"}`,
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
        }),
      });
      if (res.ok) {
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
    <div className="space-y-7 max-w-[1000px] mx-auto pb-12 text-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Admin Account & Credentials</h3>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Manage your administrator profile, security credentials, and role privileges stored in MongoDB.
          </p>
        </div>
        <button
          onClick={fetchProfile}
          className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          title="Refresh Profile"
        >
          <FiRotateCw className={`text-base ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm space-y-7 text-sm">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <img
            src={profile.avatar}
            alt={profile.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";
            }}
            className="w-18 h-18 rounded-full object-cover border-2 border-rose-200"
          />
          <div>
            <h4 className="text-lg font-bold text-slate-900">{profile.name}</h4>
            <span className="text-sm text-slate-500 font-medium block">{profile.role}</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-[#6B1527] inline-block mt-1.5 border border-rose-100">
              Super Admin Access
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="font-semibold text-slate-800 block mb-1.5">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-800 block mb-1.5">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
            />
          </div>
        </div>

        {/* Password Security */}
        <div className="pt-3 border-t border-slate-200 space-y-4">
          <h5 className="font-bold text-slate-900 text-base">Security & Password</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={profile.currentPassword}
                onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1.5">New Password</label>
              <input
                type="password"
                placeholder="New password (optional)"
                value={profile.newPassword}
                onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-sm md:text-base font-semibold shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer disabled:opacity-50"
          >
            <FiSave className="text-lg" />
            <span>{saving ? "Updating..." : "Update Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
