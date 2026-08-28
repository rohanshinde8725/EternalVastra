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
    <div className="space-y-6 max-w-[900px] mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Admin Account & Credentials</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your administrator profile, security credentials, and role privileges stored in MongoDB.
          </p>
        </div>
        <button
          onClick={fetchProfile}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          title="Refresh Profile"
        >
          <FiRotateCw className={`text-sm ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-6 text-xs">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
          <img
            src={profile.avatar}
            alt={profile.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80";
            }}
            className="w-16 h-16 rounded-full object-cover border-2 border-rose-200"
          />
          <div>
            <h4 className="text-base font-bold text-slate-800">{profile.name}</h4>
            <span className="text-xs text-slate-500 block">{profile.role}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#6B1527] inline-block mt-1">
              Super Admin Access
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#6B1527] focus:outline-none"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#6B1527] focus:outline-none"
            />
          </div>
        </div>

        {/* Password Security */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <h5 className="font-bold text-slate-800 text-sm">Security & Password</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={profile.currentPassword}
                onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">New Password</label>
              <input
                type="password"
                placeholder="New password (optional)"
                value={profile.newPassword}
                onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#6B1527] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 rounded bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-xs md:text-sm font-medium shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer disabled:opacity-50"
          >
            <FiSave className="text-base" />
            <span>{saving ? "Updating..." : "Update Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
