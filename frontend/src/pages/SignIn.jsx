import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAward,
  FiCheckCircle,
  FiTruck,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { API_BASE_URL } from "../api/products";
import { useToast } from "../context/ToastContext";

const SignIn = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

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
        navigate("/shop");
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

  const handleDemoFill = (role) => {
    if (role === "admin") {
      setFormData({
        email: "rohanshinde8725@gmail.com",
        password: "admin123",
      });
      showToast.info("Filled Admin credentials (rohanshinde8725@gmail.com).");
    } else {
      setFormData({
        email: "ritika.sharma@example.com",
        password: "patronpassword123",
      });
      showToast.info("Filled Patron credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F5] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="max-w-5xl w-full bg-[#FAF6F0] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-[#EFE5DC]">
        
        {/* ================= LEFT COLUMN (HERO IMAGE + BRANDING) ================= */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-[#F8F2EA] relative">
          
          {/* Top Brand & Model Showcase */}
          <div className="relative w-full h-[460px] sm:h-[500px] overflow-hidden flex flex-col justify-between p-6 sm:p-8 bg-[#F5ECE0]">
            {/* Model in Crimson Silk Saree Image from Backend */}
            <img
              src={`${API_BASE_URL}/images/silk/silk-1.jpg`}
              alt="Model in Royal Crimson Saree"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            {/* Subtle Gradient Overlay for Logo Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAF4EC]/85 via-transparent to-black/40 pointer-events-none" />

            {/* Logo Emblem Header */}
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-1 text-amber-700">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.8 6.6L18.5 4.8L16.7 9.5L21.4 11.3L16.7 13.1L18.5 17.8L13.8 16L12 20.6L10.2 16L5.5 17.8L7.3 13.1L2.6 11.3L7.3 9.5L5.5 4.8L10.2 6.6L12 2Z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif tracking-[0.2em] font-bold text-[#4A1521] uppercase drop-shadow-xs">
                S A R E E
              </h1>
              <p className="text-[10px] tracking-[0.3em] font-semibold text-[#8C4B59] uppercase mt-0.5">
                — ELEGANCE ETERNAL —
              </p>
            </div>

            {/* Bottom empty div for spacing */}
            <div className="relative z-10" />
          </div>

          {/* Middle Crimson Ribbon Bar */}
          <div className="bg-[#701A2B] text-white py-5 px-4 sm:px-6 grid grid-cols-3 gap-2 text-center border-y border-[#5A1221]">
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-amber-200">
                <FiAward className="text-base" />
              </div>
              <h4 className="text-[11px] font-bold tracking-tight">Premium Quality</h4>
              <p className="text-[9px] text-rose-100/80 leading-tight">Finest fabrics, crafted to perfection</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1 border-x border-white/15 px-1">
              <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-amber-200">
                <FiCheckCircle className="text-base" />
              </div>
              <h4 className="text-[11px] font-bold tracking-tight">Secure Shopping</h4>
              <p className="text-[9px] text-rose-100/80 leading-tight">100% safe & trusted</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-amber-200">
                <FiTruck className="text-base" />
              </div>
              <h4 className="text-[11px] font-bold tracking-tight">Fast Delivery</h4>
              <p className="text-[9px] text-rose-100/80 leading-tight">Quick & reliable shipping</p>
            </div>
          </div>

          {/* Bottom Champagne Editorial Quote */}
          <div className="py-6 px-6 sm:px-8 text-center bg-[#EFE8DF]">
            <div className="text-3xl font-serif text-[#701A2B] leading-none mb-1">“</div>
            <p className="text-sm font-serif italic text-[#3A2226] max-w-sm mx-auto leading-relaxed">
              Drape yourself in timeless elegance crafted for the modern you.
            </p>
            <div className="flex items-center justify-center gap-3 mt-3 text-amber-800/60">
              <span className="w-8 h-[1px] bg-amber-800/40" />
              <span className="text-xs">🪷</span>
              <span className="w-8 h-[1px] bg-amber-800/40" />
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN (SIGN IN CARD) ================= */}
        <div className="lg:col-span-6 bg-[#FAF6F0] p-6 sm:p-10 lg:p-12 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-6 sm:p-10 w-full max-w-md shadow-lg border border-[#F0E6DD] space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#701A2B] tracking-tight">
                Welcome Back
              </h2>
              <div className="flex items-center justify-center gap-2 text-amber-800/50">
                <span className="w-10 h-[1px] bg-[#D8C7B8]" />
                <span className="text-xs text-amber-700">🪷</span>
                <span className="w-10 h-[1px] bg-[#D8C7B8]" />
              </div>
              <p className="text-xs text-slate-500 font-medium pt-1">
                Sign in to continue to Saree
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block text-xs">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#701A2B] focus:ring-1 focus:ring-[#701A2B] transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block text-xs">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#701A2B] focus:ring-1 focus:ring-[#701A2B] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => showToast.info("Contact support or sign up to reset credentials.")}
                  className="text-xs text-[#701A2B] font-semibold hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary SIGN IN Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-md bg-[#701A2B] hover:bg-[#581321] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all duration-300 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? "Signing in..." : "SIGN IN"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative px-3 bg-white text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                OR
              </span>
            </div>

            {/* Social Logins */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => showToast.info("Google Authentication initialized.")}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                <FcGoogle className="text-lg" />
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => showToast.info("Facebook Login initialized.")}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                <FaFacebook className="text-lg text-[#1877F2]" />
                <span>Continue with Facebook</span>
              </button>
            </div>

            {/* Quick Demo Credentials Autofill Helper */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-slate-500">
              <span>Quick Login:</span>
              <button
                type="button"
                onClick={() => handleDemoFill("admin")}
                className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-[#701A2B] font-bold cursor-pointer"
              >
                Rohan Shinde (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill("customer")}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                Patron
              </button>
            </div>

            {/* Footer Sign Up Link */}
            <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#701A2B] font-bold hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
