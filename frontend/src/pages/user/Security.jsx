import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FiLock, FiKey, FiMail, FiCheckCircle, FiRefreshCw, FiEye, FiEyeOff, FiArrowLeft
} from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";
import FadeUp from "../../components/animations/FadeUp";

const Security = () => {
  const { showToast } = useToast();
  const outletCtx = useOutletContext() || {};
  const user = outletCtx.user || {};

  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Forgot Password via OTP State
  const [forgotMode, setForgotMode] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpNewPassword, setOtpNewPassword] = useState("");
  const [otpConfirmPassword, setOtpConfirmPassword] = useState("");
  const [showOtpPass, setShowOtpPass] = useState(false);
  const [showOtpConfirmPass, setShowOtpConfirmPass] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleTriggerForgotOtp = async () => {
    if (!user?.email) return;
    setSendingOtp(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-forgot-password-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMode(true);
        setCountdown(60);
        showToast.success(`Verification code sent to ${user.email}`);
      } else {
        showToast.error(data.message || "Failed to send verification code.");
      }
    } catch {
      showToast.error("Failed to connect to authentication server.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResetPasswordWithOtp = async (e) => {
    e.preventDefault();
    if (!otpValue || otpValue.length < 6) {
      showToast.error("Please enter the 6-digit OTP sent to your email.");
      return;
    }
    if (otpNewPassword !== otpConfirmPassword) {
      showToast.error("New passwords do not match.");
      return;
    }
    if (otpNewPassword.length < 6) {
      showToast.error("Password must be at least 6 characters.");
      return;
    }

    setResettingPassword(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-forgot-password-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          otp: otpValue.trim(),
          newPassword: otpNewPassword,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        showToast.success("Password reset successfully! You can now log in with your new password.");
        setForgotMode(false);
        setOtpValue("");
        setOtpNewPassword("");
        setOtpConfirmPassword("");
      } else {
        showToast.error(data.message || "Invalid or expired OTP.");
      }
    } catch {
      showToast.error("Failed to reset password. Please try again.");
    } finally {
      setResettingPassword(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast.error("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast.error("Password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    try {
      const userId = user._id || user.id;
      const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        showToast.success("Password updated successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showToast.error(data.message || "Failed to update password.");
      }
    } catch {
      showToast.error("Error updating password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FadeUp delay={0.15} className="bg-white rounded-2xl p-6 md:p-8 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] max-w-2xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-[#EEDACB] pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-[#74202D] rounded-full flex items-center justify-center text-2xl shrink-0">
            {forgotMode ? <FiKey /> : <FiLock />}
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-serif text-[#74202D] font-bold">
              {forgotMode ? "Reset Password via Email OTP" : "Security & Password"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {forgotMode
                ? `Enter the 6-digit OTP sent to ${user.email} to set a new password.`
                : "Manage your account security and update your password."}
            </p>
          </div>
        </div>

        {forgotMode && (
          <button
            type="button"
            onClick={() => setForgotMode(false)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#74202D] px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#74202D] transition cursor-pointer"
          >
            <FiArrowLeft /> <span>Back</span>
          </button>
        )}
      </div>

      {/* FORGOT PASSWORD OTP MODE */}
      {forgotMode ? (
        <form onSubmit={handleResetPasswordWithOtp} className="space-y-6">
          {/* Email Banner */}
          <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-4 flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <FiMail className="text-xl text-[#74202D] shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800">OTP Sent to Registered Email</p>
                <p className="text-xs text-[#74202D] font-medium truncate">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleTriggerForgotOtp}
              disabled={sendingOtp || countdown > 0}
              className="text-xs font-bold text-[#74202D] hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <FiRefreshCw className={`text-xs ${sendingOtp ? "animate-spin" : ""}`} />
              <span>{countdown > 0 ? `Resend (${countdown}s)` : "Resend OTP"}</span>
            </button>
          </div>

          {/* 6-digit OTP Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
              6-Digit Verification Code (OTP)
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-[#FCF8F5] border-2 border-rose-200 text-slate-900 text-center tracking-[0.5em] text-xl font-mono font-bold rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3.5 shadow-inner"
              placeholder="••••••"
            />
            <p className="text-[11px] text-slate-500 mt-1.5">
              Check your email inbox or spam folder for the one-time code.
            </p>
          </div>

          {/* New Passwords Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showOtpPass ? "text" : "password"}
                  required
                  value={otpNewPassword}
                  onChange={(e) => setOtpNewPassword(e.target.value)}
                  className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3 pr-10"
                  placeholder="Min 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowOtpPass(!showOtpPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showOtpPass ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showOtpConfirmPass ? "text" : "password"}
                  required
                  value={otpConfirmPassword}
                  onChange={(e) => setOtpConfirmPassword(e.target.value)}
                  className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3 pr-10"
                  placeholder="Retype new password"
                />
                <button
                  type="button"
                  onClick={() => setShowOtpConfirmPass(!showOtpConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showOtpConfirmPass ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#EEDACB] flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              disabled={resettingPassword}
              className="w-full sm:w-auto bg-[#74202D] text-white uppercase py-3 px-8 rounded-xl hover:bg-[#5A1622] transition-all duration-300 text-xs sm:text-sm font-bold shadow-md cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
            >
              <FiCheckCircle className="text-base" />
              <span>{resettingPassword ? "Verifying & Resetting..." : "Verify OTP & Reset Password"}</span>
            </button>
            <button
              type="button"
              onClick={() => setForgotMode(false)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* STANDARD PASSWORD UPDATE MODE */
        <form onSubmit={handleSavePassword} className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Current Password
              </label>
              <button
                type="button"
                onClick={handleTriggerForgotOtp}
                disabled={sendingOtp}
                className="text-xs font-bold text-[#74202D] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Click to receive a verification OTP on your email"
              >
                <FiKey className="text-xs" />
                <span>{sendingOtp ? "Sending OTP..." : "Forgot Password?"}</span>
              </button>
            </div>
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3"
              placeholder="Enter your current password"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                New Password
              </label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3"
                placeholder="Min 6 characters"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3"
                placeholder="Retype new password"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-[#EEDACB] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-[#74202D] text-white uppercase py-2.5 px-6 sm:px-8 rounded-xl hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer transition-all duration-300 text-xs sm:text-sm font-bold shadow-xs disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {saving ? "Updating..." : "Update Password"}
            </button>

            <div className="text-center sm:text-right">
              <span className="text-xs text-slate-500">Don't remember your password? </span>
              <button
                type="button"
                onClick={handleTriggerForgotOtp}
                disabled={sendingOtp}
                className="text-xs font-bold text-[#74202D] hover:underline cursor-pointer"
              >
                {sendingOtp ? "Sending code..." : "Reset via Email OTP"}
              </button>
            </div>
          </div>
        </form>
      )}
    </FadeUp>
  );
};

export default Security;
