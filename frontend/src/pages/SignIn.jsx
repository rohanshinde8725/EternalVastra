import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { API_BASE_URL } from "../api/products";
import { useToast } from "../context/ToastContext";
import FadeUp from "../components/animations/FadeUp";

const SignIn = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      showToast.warning("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      localStorage.setItem("eternal_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("userUpdated"));
      showToast.success(`Welcome back, ${data.user.name || "Patron"}!`);

      if (data.user.role === "admin" || data.user.email === "rohanshinde8725@gmail.com") {
        navigate("/admin");
      } else {
        const from = location.state?.from || "/shop";
        navigate(from, { replace: true });
      }
    } catch (err) {
      // Fallback demo account
      if (formData.email === "rohanshinde8725@gmail.com" && formData.password === "admin123") {
        const adminUser = { name: "Rohan Shinde", email: "rohanshinde8725@gmail.com", role: "admin" };
        localStorage.setItem("eternal_user", JSON.stringify(adminUser));
        window.dispatchEvent(new Event("userUpdated"));
        showToast.success("Signed in as Super Admin");
        navigate("/admin");
      } else {
        showToast.error(err.message || "Invalid email or password credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FBF8F5] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <FadeUp delay={0.1} className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-[#EFE5DC]">
        
        {/* ================= 1. IMAGE CARD ================= */}
        <div className="relative h-48 md:h-full min-h-[200px] md:min-h-[460px] overflow-hidden bg-[#F5ECE0]">
          <img
            src="/images/silk/silk-1.jpg"
            alt="Royal Silk Saree"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `${API_BASE_URL}/images/silk/silk-1.jpg`;
            }}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold drop-shadow">Eternal Vastra</h3>
            <p className="text-sm text-rose-100/90 mt-1">Timeless Weaves, Handcrafted Elegance</p>
          </div>
        </div>

        {/* ================= 2. FORM CARD ================= */}
        <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto space-y-5">
            
            {/* Header */}
            <div className="space-y-1.5 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#701A2B] tracking-tight">
                Welcome Back
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Sign in to continue to Eternal Vastra
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block text-sm">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-lg bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#701A2B] focus:ring-1 focus:ring-[#701A2B] transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block text-sm">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-11 pr-11 py-2.5 sm:py-3 rounded-lg bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#701A2B] focus:ring-1 focus:ring-[#701A2B] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => showToast.info("Contact support or sign up to reset credentials.")}
                  className="text-sm text-[#701A2B] font-semibold hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary SIGN IN Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-3.5 rounded-lg bg-[#701A2B] hover:bg-[#581321] text-white text-sm font-bold uppercase tracking-wider shadow-sm transition-all duration-300 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Signing in..." : "SIGN IN"}
              </button>
            </form>

            {/* Footer Sign Up Link */}
            <div className="text-center pt-3 border-t border-slate-100 text-sm text-slate-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#701A2B] font-bold hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </FadeUp>
    </div>
  );
};

export default SignIn;

