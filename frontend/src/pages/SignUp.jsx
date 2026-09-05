import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiShield,
  FiEdit2,
} from "react-icons/fi";
import { API_BASE_URL } from "../api/products";
import { useToast } from "../context/ToastContext";
import FadeUp from "../components/animations/FadeUp";

const SignUp = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

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
      showToast.success(`Welcome to Eternal Vastra, ${data.user.name}!`);

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        const from = location.state?.from || "/shop";
        navigate(from, { replace: true });
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
    <div className="min-h-[calc(100vh-140px)] bg-[#FBF8F5] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <FadeUp delay={0.1} className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-[#EFE5DC]">
        
        {/* ================= FORM CARD ================= */}
        <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto space-y-5">
            
            {step === 1 ? (
              /* ==================== STEP 1: Registration Form ==================== */
              <>
                {/* Header */}
                <div className="space-y-1.5 text-center md:text-left">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#701A2B] tracking-tight">
                    Create Account
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    Sign up to experience handcrafted luxury
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block text-sm">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pooja Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-lg bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#701A2B] focus:ring-1 focus:ring-[#701A2B] transition"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block text-sm">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-lg bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#701A2B] focus:ring-1 focus:ring-[#701A2B] transition"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block text-sm">Create Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="At least 6 characters"
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

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      className="rounded border-slate-300 text-[#701A2B] focus:ring-[#701A2B] cursor-pointer mt-0.5"
                    />
                    <label htmlFor="agreeTerms" className="text-slate-600 cursor-pointer select-none text-xs sm:text-sm leading-tight">
                      I agree to the <span className="text-[#701A2B] font-semibold">Terms & Privacy Policy</span>.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 sm:py-3.5 rounded-lg bg-[#701A2B] hover:bg-[#581321] text-white text-sm font-bold uppercase tracking-wider shadow-sm transition-all duration-300 cursor-pointer disabled:opacity-50 mt-1"
                  >
                    {loading ? "Sending Verification OTP..." : "GET EMAIL VERIFICATION OTP"}
                  </button>
                </form>

                {/* Footer Sign In Link */}
                <div className="text-center pt-3 border-t border-slate-100 text-sm text-slate-600">
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
                  <p className="text-sm text-slate-500 font-medium pt-1">
                    We sent a 6-digit code to{" "}
                    <strong className="text-slate-800">{formData.email}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm text-[#701A2B] font-semibold hover:underline mt-1 cursor-pointer"
                  >
                    <FiEdit2 className="text-xs" />
                    <span>Change Email</span>
                  </button>
                </div>

                {devOtp && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold block text-xs text-amber-800">Test Verification Code:</span>
                      <span className="font-mono text-base font-extrabold tracking-widest text-[#701A2B]">{devOtp}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtp(devOtp);
                        showToast.info("Auto-filled verification code!");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-bold text-xs cursor-pointer"
                    >
                      Auto-Fill
                    </button>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5 text-sm">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      required
                      maxLength="6"
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="w-full text-center text-xl sm:text-2xl tracking-[0.4em] font-mono py-2.5 sm:py-3 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-[#701A2B] focus:ring-1 focus:ring-[#701A2B] transition font-bold"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm pt-1">
                    <span className="text-slate-500 text-xs sm:text-sm">
                      {countdown > 0 ? `Resend in ${countdown}s` : "Didn't receive code?"}
                    </span>
                    <button
                      type="button"
                      disabled={!canResend || loading}
                      onClick={handleResendOtp}
                      className={`text-xs sm:text-sm font-semibold ${
                        canResend ? "text-[#701A2B] hover:underline cursor-pointer" : "text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      Resend OTP
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3 sm:py-3.5 rounded-lg bg-[#701A2B] hover:bg-[#581321] text-white text-sm font-bold uppercase tracking-wider shadow-sm transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <FiShield className="text-base" />
                      {loading ? "Verifying..." : "VERIFY & CREATE ACCOUNT"}
                    </span>
                  </button>
                </form>

                {/* Footer */}
                <div className="text-center pt-3 border-t border-slate-100 text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-[#701A2B] font-bold hover:underline">
                    Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ================= IMAGE CARD ================= */}
        <div className="relative h-48 md:h-full min-h-[200px] md:min-h-[460px] overflow-hidden bg-[#F5ECE0]">
          <img
            src="/images/paithani/paithani-1.jpg"
            alt="Royal Paithani Saree"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `${API_BASE_URL}/images/paithani/paithani-1.jpg`;
            }}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold drop-shadow">Eternal Vastra</h3>
            <p className="text-sm text-rose-100/90 mt-1">Join the Royal Patron Circle</p>
          </div>
        </div>
      </FadeUp>
    </div>
  );
};

export default SignUp;
