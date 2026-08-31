import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiEdit2,
  FiAward,
  FiCheckCircle,
  FiTruck,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { API_BASE_URL } from "../api/products";
import { useToast } from "../context/ToastContext";

const SignUp = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: form, 2: otp verification
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    agreeTerms: true,
  });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [devOtp, setDevOtp] = useState("");

  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      showToast.warning("Please complete all required fields.");
      return;
    }
    if (!formData.agreeTerms) {
      showToast.warning("Please agree to the Terms & Conditions.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-signup-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP code");
      }

      setDevOtp(data.devOtp || "");
      setStep(2);
      setCountdown(60);
      setCanResend(false);
      showToast.success(`Verification code sent to ${formData.email}!`);
    } catch (err) {
      showToast.error(err.message || "Failed to send OTP. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Register in Database
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      showToast.warning("Please enter a valid 6-digit OTP code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-signup-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: otp.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid OTP code");
      }

      localStorage.setItem("eternal_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("userUpdated"));
      showToast.success(`Welcome to Eternal Vastra, ${data.user.name}! Saved in database.`);

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/shop");
      }
    } catch (err) {
      showToast.error(err.message || "Invalid OTP verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-signup-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not resend OTP");

      setDevOtp(data.devOtp || "");
      setCountdown(60);
      setCanResend(false);
      showToast.info(`A new OTP has been sent to ${formData.email}.`);
    } catch (err) {
      showToast.error(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF8F5] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="max-w-5xl w-full bg-[#FAF6F0] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-[#EFE5DC]">

        {/* ================= LEFT COLUMN (SIGN UP FORM CARD) ================= */}
        <div className="lg:col-span-6 bg-[#FAF6F0] p-6 sm:p-10 lg:p-12 flex items-center justify-center order-2 lg:order-1">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-lg border border-[#F0E6DD] space-y-5">

            {step === 1 ? (
              /* ==================== STEP 1: Registration Form ==================== */
              <>
                {/* Header */}
                <div className="text-center space-y-1.5">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#701A2B] tracking-tight">
                    Create Account
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-amber-800/50">
                    <span className="w-10 h-[1px] bg-[#D8C7B8]" />
                    <span className="text-xs text-amber-700">🪷</span>
                    <span className="w-10 h-[1px] bg-[#D8C7B8]" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium pt-1">
                    Join the Royal Patron Circle
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSendOtp} className="space-y-3 text-xs">

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block text-xs">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pooja Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#701A2B] focus:ring-1 focus:ring-[#701A2B] transition"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block text-xs">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#701A2B] focus:ring-1 focus:ring-[#701A2B] transition"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block text-xs">Phone Number (Optional)</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                      <input
                        type="tel"
                        placeholder="+91 98200 12345"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#701A2B] focus:ring-1 focus:ring-[#701A2B] transition"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block text-xs">Create Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="At least 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#701A2B] focus:ring-1 focus:ring-[#701A2B] transition"
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

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      className="rounded border-slate-300 text-[#701A2B] focus:ring-[#701A2B] cursor-pointer mt-0.5"
                    />
                    <label htmlFor="agreeTerms" className="text-slate-600 cursor-pointer select-none text-[11px] leading-tight">
                      I agree to the <span className="text-[#701A2B] font-semibold">Terms & Privacy Policy</span>.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-md bg-[#701A2B] hover:bg-[#581321] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all duration-300 cursor-pointer disabled:opacity-50 mt-1"
                  >
                    {loading ? "Sending Verification OTP..." : "GET EMAIL VERIFICATION OTP"}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-3 text-center">
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
                    onClick={() => showToast.info("Google OAuth initialized.")}
                    className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
                  >
                    <FcGoogle className="text-lg" />
                    <span>Sign up with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => showToast.info("Facebook OAuth initialized.")}
                    className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
                  >
                    <FaFacebook className="text-lg text-[#1877F2]" />
                    <span>Sign up with Facebook</span>
                  </button>
                </div>

                {/* Footer Sign In Link */}
                <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-[#701A2B] font-bold hover:underline">
                    Sign In
                  </Link>
                </div>
              </>
            ) : (
              /* ==================== STEP 2: OTP Verification ==================== */
              <>
                {/* Header */}
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#701A2B] mx-auto mb-2">
                    <FiShield className="text-2xl" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#701A2B] tracking-tight">
                    Verify Your Email
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-amber-800/50">
                    <span className="w-10 h-[1px] bg-[#D8C7B8]" />
                    <span className="text-xs text-amber-700">🪷</span>
                    <span className="w-10 h-[1px] bg-[#D8C7B8]" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium pt-1">
                    We sent a 6-digit code to{" "}
                    <strong className="text-slate-800">{formData.email}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#701A2B] font-semibold hover:underline mt-1 cursor-pointer"
                  >
                    <FiEdit2 className="text-[10px]" />
                    <span>Change Email</span>
                  </button>
                </div>

                {devOtp && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Test Verification Code:</span>
                      <span className="font-mono text-base font-extrabold tracking-widest text-[#701A2B]">{devOtp}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtp(devOtp);
                        showToast.info("Auto-filled verification code!");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-bold text-[10px] cursor-pointer"
                    >
                      Auto-Fill
                    </button>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5 text-xs">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      required
                      maxLength="6"
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="w-full text-center text-xl tracking-[0.5em] font-mono py-3 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-[#701A2B] focus:ring-1 focus:ring-[#701A2B] transition font-bold"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500">
                      {countdown > 0 ? `Resend code in ${countdown}s` : "Didn't receive code?"}
                    </span>
                    <button
                      type="button"
                      disabled={!canResend || loading}
                      onClick={handleResendOtp}
                      className={`font-semibold ${
                        canResend ? "text-[#701A2B] hover:underline cursor-pointer" : "text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      Resend OTP
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3 rounded-md bg-[#701A2B] hover:bg-[#581321] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <FiShield className="text-base" />
                      {loading ? "Verifying..." : "VERIFY & CREATE ACCOUNT"}
                    </span>
                  </button>
                </form>

                {/* Footer */}
                <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-[#701A2B] font-bold hover:underline">
                    Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN (HERO IMAGE + BRANDING) ================= */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-[#F8F2EA] relative order-1 lg:order-2">

          {/* Top Brand & Model Showcase */}
          <div className="relative w-full h-[460px] sm:h-[500px] overflow-hidden flex flex-col justify-between p-6 sm:p-8 bg-[#F5ECE0]">
            {/* Model in Paithani Saree Image from Backend */}
            <img
              src={`${API_BASE_URL}/images/paithani/paithani-1.jpg`}
              alt="Model in Royal Paithani Saree"
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
              <h4 className="text-[11px] font-bold tracking-tight">OTP Verified</h4>
              <p className="text-[9px] text-rose-100/80 leading-tight">Email verified registration</p>
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
            <div className="text-3xl font-serif text-[#701A2B] leading-none mb-1">\u201C</div>
            <p className="text-sm font-serif italic text-[#3A2226] max-w-sm mx-auto leading-relaxed">
              Every saree tells a story — let yours begin with Eternal Vastra.
            </p>
            <div className="flex items-center justify-center gap-3 mt-3 text-amber-800/60">
              <span className="w-8 h-[1px] bg-amber-800/40" />
              <span className="text-xs">🪷</span>
              <span className="w-8 h-[1px] bg-amber-800/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
