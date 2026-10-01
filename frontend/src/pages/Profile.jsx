import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FiHome, FiShoppingBag, FiHeart, FiMapPin, FiUser, FiLogOut, FiTruck, FiBox, FiArrowRight, FiCamera, FiEdit2,
  FiTrash2, FiPlus, FiLock, FiShield, FiMenu, FiX, FiKey, FiMail, FiCheckCircle, FiRefreshCw, FiEye, FiEyeOff, FiArrowLeft, FiStar
} from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { logout, loginUserSession } from "../utils/auth";
import FadeUp from "../components/animations/FadeUp";
import { resolveImageUrl, API_BASE_URL } from "../api/products";
import Logo from "../components/common/Logo";

const Profile = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const getAvatarUrl = (avatarStr) => {
    if (!avatarStr || avatarStr === "/images/default-avatar.webp" || avatarStr.includes("testimonial-1.webp")) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Patron")}&background=74202D&color=FFFFFF&bold=true&size=128`;
    }
    return resolveImageUrl(avatarStr);
  };

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Customer Reviews state
  const [userReviews, setUserReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [savingReview, setSavingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    product: "",
    rating: 5,
    comment: "",
  });

  const [formData, setFormData] = useState({ name: "", phone: "", dob: "", gender: "Male" });
  const [saving, setSaving] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "", street: "", city: "", state: "", country: "", zip: "", phone: "", isDefault: false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: ""
  });

  // Forgot Password via OTP State
  const [forgotMode, setForgotMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
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
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
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
        setOtpSent(true);
        setCountdown(60);
        showToast.success(`Verification code sent to ${user.email}`);
      } else {
        showToast.error(data.message || "Failed to send verification code.");
      }
    } catch (err) {
      showToast.error("Failed to connect to authentication server.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResetPasswordWithOtp = async (e) => {
    e.preventDefault();
    if (!otpValue.trim()) {
      showToast.warning("Please enter the 6-digit verification code sent to your email.");
      return;
    }
    if (otpNewPassword.length < 6) {
      showToast.error("Password must be at least 6 characters.");
      return;
    }
    if (otpNewPassword !== otpConfirmPassword) {
      showToast.error("New passwords do not match.");
      return;
    }

    setResettingPassword(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password-with-otp`, {
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
        showToast.success("Password reset successfully! Your new password is now active.");
        setForgotMode(false);
        setOtpSent(false);
        setOtpValue("");
        setOtpNewPassword("");
        setOtpConfirmPassword("");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showToast.error(data.message || "Invalid or expired OTP verification code.");
      }
    } catch (err) {
      showToast.error("Error resetting password.");
    } finally {
      setResettingPassword(false);
    }
  };

  const fetchProfileData = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setOrders(data.recentOrders || []);

        setFormData({
          name: data.user.name || "",
          phone: data.user.phone || "",
          dob: data.user.dob || "",
          gender: data.user.gender || "Male"
        });

        // Load actual wishlist from local storage
        const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlistItems(storedWishlist.slice(0, 3));

        // Update local session
        const storedUser = JSON.parse(localStorage.getItem("eternal_user"));
        loginUserSession({ ...storedUser, ...data.user });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("eternal_user");
    if (!storedUser) {
      navigate("/signin", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser._id || parsedUser.id;
      if (userId) {
        fetchProfileData(userId);
      } else {
        navigate("/signin", { replace: true });
      }
    } catch {
      navigate("/signin", { replace: true });
    }
  }, [navigate]);

  const handleSignOut = () => {
    logout();
    showToast.info("Signed out of your account successfully.");
    navigate("/");
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("avatar", file);

    try {
      const userId = user._id || user.id;
      const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}/avatar`, {
        method: "POST",
        body: formDataUpload
      });

      if (response.ok) {
        const data = await response.json();
        showToast.success("Profile picture updated!");
        setUser(prev => ({ ...prev, avatar: data.avatar }));
        const storedUser = JSON.parse(localStorage.getItem("eternal_user")) || {};
        loginUserSession({ ...storedUser, avatar: data.avatar });
        fetchProfileData(userId);
      } else {
        showToast.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
      showToast.error("Error uploading image.");
    }
  };

  const handleSaveAccountDetails = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile/${user._id || user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        showToast.success("Profile updated successfully!");
        fetchProfileData(user._id || user.id);
      } else {
        showToast.error("Failed to update profile.");
      }
    } catch (err) {
      showToast.error("Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const newAddresses = user.addresses ? [...user.addresses] : [];
      if (addressForm.isDefault) {
        newAddresses.forEach(a => a.isDefault = false);
      }
      newAddresses.push(addressForm);

      const response = await fetch(`${API_BASE_URL}/api/users/profile/${user._id || user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: newAddresses })
      });

      if (response.ok) {
        showToast.success("Address added successfully!");
        setShowAddressForm(false);
        setAddressForm({ name: "", street: "", city: "", state: "", country: "", zip: "", phone: "", isDefault: false });
        fetchProfileData(user._id || user.id);
      } else {
        showToast.error("Failed to save address.");
      }
    } catch (err) {
      showToast.error("Error saving address.");
    } finally {
      setSaving(false);
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
      const response = await fetch(`${API_BASE_URL}/api/users/profile/${user._id || user.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();
      if (response.ok) {
        showToast.success("Password updated successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showToast.error(data.message || "Failed to update password.");
      }
    } catch (err) {
      showToast.error("Error updating password.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (index) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const newAddresses = user.addresses.filter((_, i) => i !== index);
      const response = await fetch(`${API_BASE_URL}/api/users/profile/${user._id || user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: newAddresses })
      });
      if (response.ok) {
        showToast.success("Address removed.");
        fetchProfileData(user._id || user.id);
      } else {
        showToast.error("Failed to delete address.");
      }
    } catch (err) {
      showToast.error("Error deleting address.");
    }
  };

  // User Review Handlers
  const fetchUserReviews = useCallback((currentUser = user) => {
    if (!currentUser) return;
    setLoadingReviews(true);
    fetch(`${API_BASE_URL}/api/admin/reviews`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          const userName = (currentUser.name || "").toLowerCase().trim();
          const userEmail = (currentUser.email || "").toLowerCase().trim();
          const filtered = data.filter((r) => {
            const revName = (r.reviewer || "").toLowerCase().trim();
            const revEmail = (r.email || "").toLowerCase().trim();
            return (
              (userName && revName === userName) ||
              (userEmail && revEmail === userEmail) ||
              (r.userId && (r.userId === currentUser._id || r.userId === currentUser.id))
            );
          });
          setUserReviews(filtered);
        }
      })
      .catch((err) => console.error("Error loading user reviews:", err))
      .finally(() => setLoadingReviews(false));
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserReviews(user);
    }
    const handleReviewsUpdate = () => {
      if (user) fetchUserReviews(user);
    };
    window.addEventListener("reviewsUpdated", handleReviewsUpdate);
    return () => window.removeEventListener("reviewsUpdated", handleReviewsUpdate);
  }, [user, fetchUserReviews]);

  const handleOpenAddReviewModal = () => {
    setEditingReview(null);
    setReviewForm({
      product: "",
      rating: 5,
      comment: "",
    });
    setIsReviewModalOpen(true);
  };

  const handleOpenEditReviewModal = (rev) => {
    setEditingReview(rev);
    setReviewForm({
      product: rev.product || "",
      rating: rev.rating || 5,
      comment: rev.comment || rev.review || "",
    });
    setIsReviewModalOpen(true);
  };

  const handleDeleteUserReview = async (rev) => {
    if (!window.confirm(`Are you sure you want to delete your review for "${rev.product}"?`)) return;

    const reviewId = rev._id || rev.id;
    try {
      if (reviewId) {
        await fetch(`${API_BASE_URL}/api/admin/reviews/${reviewId}`, {
          method: "DELETE",
        });
      }
      setUserReviews((prev) => prev.filter((r) => (r._id || r.id) !== reviewId));
      window.dispatchEvent(new Event("reviewsUpdated"));
      showToast.success("Review deleted successfully.");
    } catch {
      showToast.error("Failed to delete review.");
    }
  };

  const handleSaveUserReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.product.trim() || !reviewForm.comment.trim()) {
      showToast.warning("Please provide a saree name and your review.");
      return;
    }

    setSavingReview(true);

    const userAvatar = user?.avatar && user.avatar !== "/images/default-avatar.webp" && !user.avatar.includes("testimonial-1.webp")
      ? user.avatar
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Patron")}&background=74202D&color=FFFFFF&bold=true&size=128`;

    try {
      if (editingReview) {
        const revId = editingReview._id || editingReview.id;
        const payload = {
          product: reviewForm.product.trim(),
          rating: Number(reviewForm.rating || 5),
          comment: reviewForm.comment.trim(),
          reviewer: user.name,
          avatar: userAvatar,
        };

        const res = await fetch(`${API_BASE_URL}/api/admin/reviews/${revId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const updated = await res.json();
          setUserReviews((prev) => prev.map((r) => ((r._id || r.id) === revId ? { ...r, ...updated } : r)));
          showToast.success("Review updated successfully!");
        } else {
          showToast.success("Review updated.");
        }
      } else {
        const payload = {
          reviewer: user.name,
          email: user.email,
          userId: user._id || user.id,
          product: reviewForm.product.trim(),
          rating: Number(reviewForm.rating || 5),
          date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
          comment: reviewForm.comment.trim(),
          verified: true,
          status: "Approved",
          avatar: userAvatar,
        };

        const res = await fetch(`${API_BASE_URL}/api/admin/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const created = await res.json();
          setUserReviews((prev) => [created, ...prev]);
          showToast.success("Thank you! Your review has been published.");
        } else {
          showToast.success("Review submitted.");
        }
      }

      window.dispatchEvent(new Event("reviewsUpdated"));
      setIsReviewModalOpen(false);
      setEditingReview(null);
      setReviewForm({ product: "", rating: 5, comment: "" });
    } catch {
      showToast.error("Failed to save review");
    } finally {
      setSavingReview(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDF9F6] font-sans">
      {/* Sidebar */}
      <div className="w-full lg:w-[280px] xl:w-[300px] bg-[#74202D] text-white flex flex-col justify-between shrink-0 lg:min-h-screen lg:sticky lg:top-0 shadow-lg z-20">
        <div className="p-6 md:p-8 md:pb-6 border-b border-[#8c2a38] flex items-center justify-between lg:justify-start gap-4 min-w-0 w-full">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="relative group w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
              <img
                src={getAvatarUrl(user.avatar)}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "/images/default-avatar.webp"; }}
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <FiCamera className="text-xl text-white" />
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-white truncate">{user.name}</h3>
              <p className="text-xs text-rose-200/80 font-medium truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
          >
            {isMobileMenuOpen ? <FiX className="text-xl text-white" /> : <FiMenu className="text-xl text-white" />}
          </button>
        </div>

        <nav className={`py-4 lg:py-6 px-4 flex flex-col gap-1.5 lg:gap-1.5 transition-all duration-300 ${isMobileMenuOpen ? "flex" : "hidden lg:flex"}`}>
          <button onClick={() => { setActiveTab("Dashboard"); setIsMobileMenuOpen(false); }} className={`cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold transition-all ${activeTab === "Dashboard" ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <FiHome className="text-lg lg:text-xl shrink-0 text-white" /> <span>Dashboard</span>
          </button>
          <button onClick={() => { setActiveTab("My Orders"); setIsMobileMenuOpen(false); }} className={`cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold transition-all ${activeTab === "My Orders" ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <FiShoppingBag className="text-lg lg:text-xl shrink-0 text-white" /> <span>My Orders</span>
          </button>
          <button onClick={() => { navigate("/wishlist"); setIsMobileMenuOpen(false); }} className={`cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold transition-all ${activeTab === "Wishlist" ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <FiHeart className="text-lg lg:text-xl shrink-0 text-white" /> <span>Wishlist</span>
          </button>
          <button onClick={() => { navigate("/cart"); setIsMobileMenuOpen(false); }} className={`cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold transition-all ${activeTab === "Cart" ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <HiOutlineShoppingBag className="text-lg lg:text-xl shrink-0 text-white" /> <span>Cart</span>
          </button>
          <button onClick={() => { setActiveTab("My Reviews"); setIsMobileMenuOpen(false); }} className={`cursor-pointer shrink-0 w-full flex items-center justify-between px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold transition-all ${activeTab === "My Reviews" ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <div className="flex items-center gap-3 lg:gap-3.5">
              <FiStar className="text-lg lg:text-xl shrink-0 text-white" /> <span>My Reviews</span>
            </div>
            {userReviews.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                {userReviews.length}
              </span>
            )}
          </button>
          <button onClick={() => { setActiveTab("Address Book"); setIsMobileMenuOpen(false); }} className={`cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold transition-all ${activeTab === "Address Book" ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <FiMapPin className="text-lg lg:text-xl shrink-0 text-white" /> <span>Address Book</span>
          </button>
          <button onClick={() => { setActiveTab("Account Details"); setIsMobileMenuOpen(false); }} className={`cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold transition-all ${activeTab === "Account Details" ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <FiUser className="text-lg lg:text-xl shrink-0 text-white" /> <span>Account Details</span>
          </button>
          <button onClick={() => { setActiveTab("Security"); setIsMobileMenuOpen(false); }} className={`cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold transition-all ${activeTab === "Security" ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <FiShield className="text-lg lg:text-xl shrink-0 text-white" /> <span>Security & Password</span>
          </button>
          <div className="hidden lg:block pt-4 pb-1">
            <div className="h-px bg-white/10"></div>
          </div>
          <button onClick={handleSignOut} className="cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold text-white/70 hover:bg-white/10 hover:text-rose-300 transition-all">
            <FiLogOut className="text-lg lg:text-xl shrink-0 text-white" /> <span>Logout</span>
          </button>
        </nav>

        {/* Bottom Website Link / Logo Branding */}
        <div className="p-4 lg:p-6 border-t border-[#8c2a38] mt-auto flex flex-col items-center justify-center text-center bg-[#631824]/40">
          <Link
            to="/"
            className="group flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all duration-300 w-full shadow-xs hover:shadow-md hover:scale-[1.02] cursor-pointer"
            title="Open Website Homepage"
          >
            <div className="bg-white px-3.5 py-1.5 rounded-xl shadow-sm inline-flex items-center justify-center mb-2 group-hover:bg-amber-50/95 transition-colors">
              <Logo className="h-7 sm:h-8 w-auto" to="" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-100 group-hover:text-white transition-colors">
              <span>Back to Store Website</span>
              <FiArrowRight className="text-sm text-white group-hover:translate-x-1 transition-transform" />
            </div>
            <span className="text-[10px] text-rose-200/70 mt-0.5 tracking-wider uppercase font-medium">Click to open website</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-8 md:p-10 lg:p-12 overflow-y-auto min-w-0 w-full">
        <FadeUp delay={0.1} className="w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 xl:mb-10">
            <div>
              <p className="text-sm text-slate-500 mb-1">{activeTab === "Dashboard" ? "Welcome back," : activeTab}</p>
              <h1 className="text-3xl sm:text-4xl font-serif text-[#74202D] font-bold">{activeTab === "Dashboard" ? user.name : "Manage Your Account"}</h1>
              <div className="flex items-center gap-2 mt-3">
                <svg className="w-4 h-4 text-[#74202D]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C12 2 12 8 8 12C12 16 12 22 12 22C12 22 12 16 16 12C12 8 12 2 12 2Z" />
                </svg>
                <div className="w-10 h-px bg-[#E5D5C5]"></div>
              </div>
            </div>

            {activeTab === "Dashboard" && (
              <div className="relative rounded-2xl overflow-hidden shadow-sm h-24 w-full lg:w-[450px] shrink-0 bg-rose-50 border border-rose-100/50">
                <img src="https://images.unsplash.com/photo-1610189044265-1ebf81393666?w=800&auto=format&fit=crop&q=80" alt="Banner" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-rose-50 via-rose-50 to-transparent"></div>
                <div className="absolute inset-0 p-5 flex flex-col justify-center">
                  <h3 className="font-serif text-[#74202D] text-lg leading-tight">Timeless Sarees<br />for Every Moment</h3>
                  <p className="text-[10px] text-slate-600 font-medium tracking-wide mt-2">Elegance &bull; Tradition &bull; You</p>
                </div>
              </div>
            )}
          </div>
        </FadeUp>

        {activeTab === "Dashboard" && (
          <>
            <FadeUp delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <div onClick={() => setActiveTab("My Orders")} className="bg-white rounded-2xl p-5 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group hover:border-[#d1b5ae]">
                  <div className="w-10 h-10 flex items-center justify-center text-2xl shrink-0 text-[#5A1622] group-hover:scale-110 transition-transform">
                    <FiShoppingBag />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] sm:text-xs xl:text-sm font-medium text-slate-500 block truncate mb-0.5">Total Orders</span>
                    <p className="text-sm sm:text-lg lg:text-base xl:text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap">{orders.length}</p>
                  </div>
                </div>

                <div onClick={() => navigate("/wishlist")} className="bg-white rounded-2xl p-5 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group hover:border-[#d1b5ae]">
                  <div className="w-10 h-10 flex items-center justify-center text-2xl shrink-0 text-[#5A1622] group-hover:scale-110 transition-transform">
                    <FiHeart />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] sm:text-xs xl:text-sm font-medium text-slate-500 block truncate mb-0.5">Wishlist Items</span>
                    <p className="text-sm sm:text-lg lg:text-base xl:text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap">{wishlistItems.length}</p>
                  </div>
                </div>

                <div onClick={() => setActiveTab("My Reviews")} className="bg-white rounded-2xl p-5 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group hover:border-[#d1b5ae]">
                  <div className="w-10 h-10 flex items-center justify-center text-2xl shrink-0 text-[#5A1622] group-hover:scale-110 transition-transform">
                    <FiStar />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] sm:text-xs xl:text-sm font-medium text-slate-500 block truncate mb-0.5">My Reviews</span>
                    <p className="text-sm sm:text-lg lg:text-base xl:text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap">{userReviews.length}</p>
                  </div>
                </div>

                <div onClick={() => setActiveTab("Address Book")} className="bg-white rounded-2xl p-5 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group hover:border-[#d1b5ae]">
                  <div className="w-10 h-10 flex items-center justify-center text-2xl shrink-0 text-[#5A1622] group-hover:scale-110 transition-transform">
                    <FiMapPin />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] sm:text-xs xl:text-sm font-medium text-slate-500 block truncate mb-0.5">Saved Addresses</span>
                    <p className="text-sm sm:text-lg lg:text-base xl:text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap">{user.addresses?.length || 0}</p>
                  </div>
                </div>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
              <FadeUp delay={0.3} className="xl:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Recent Orders</h3>
                    <button onClick={() => setActiveTab("My Orders")} className="text-xs font-bold text-[#74202D] flex items-center gap-1 hover:underline">
                      View All Orders <FiArrowRight />
                    </button>
                  </div>

                  <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                    {orders.length === 0 ? (
                      <div className="text-center py-10 text-slate-500 font-medium">You have no recent orders.</div>
                    ) : (
                      <table className="w-full text-sm text-left min-w-[650px]">
                        <thead>
                          <tr className="text-slate-400 font-semibold border-b border-[#EEDACB] text-[11px] sm:text-xs uppercase tracking-wider">
                            <th className="pb-4 px-2">Order ID</th>
                            <th className="pb-4 px-2">Date</th>
                            <th className="pb-4 px-2">Items</th>
                            <th className="pb-4 px-2">Amount</th>
                            <th className="pb-4 px-2 text-center">Status</th>
                            <th className="pb-4 px-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3E6DA]">
                          {orders.slice(0, 5).map((order, i) => (
                            <tr key={order._id || i} className="hover:bg-[#FCF8F5] transition group">
                              <td className="py-4 px-2 font-bold text-slate-700 text-xs">#{order.orderId || order._id.substring(order._id.length - 8).toUpperCase()}</td>
                              <td className="py-4 px-2 text-slate-500 text-xs">
                                {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                              </td>
                              <td className="py-4 px-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded border border-[#EEDACB] overflow-hidden shrink-0">
                                    <img
                                      src={(order.items && order.items[0]?.img) ? resolveImageUrl(order.items[0].img) : "https://images.unsplash.com/photo-1610189044265-1ebf81393666?w=100&auto=format&fit=crop&q=80"}
                                      alt="Item"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0 max-w-[120px] lg:max-w-[180px]">
                                    <p className="font-semibold text-slate-700 text-xs truncate">
                                      {order.items && order.items[0]?.name ? order.items[0].name : "Saree"}
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">{order.items ? order.items.length : 1} item{order.items && order.items.length !== 1 ? 's' : ''}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-2 font-bold text-slate-700 text-xs">₹ {(order.total || order.totalAmount)?.toLocaleString()}</td>
                              <td className="py-4 px-2 text-center">
                                {(!order.status || order.status === "Delivered") ? (
                                  <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">Delivered</span>
                                ) : order.status === "Shipped" ? (
                                  <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-purple-100 text-purple-700 border border-purple-200">Shipped</span>
                                ) : order.status === "Processing" ? (
                                  <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-orange-100 text-orange-700 border border-orange-200">Processing</span>
                                ) : order.status === "Cancelled" ? (
                                  <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-red-100 text-red-700 border border-red-200">Cancelled</span>
                                ) : (
                                  <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200">{order.status || "Pending"}</span>
                                )}
                              </td>
                              <td className="py-4 px-2 text-center">
                                <button className="bg-white text-[#74202D] uppercase py-1.5 px-3 rounded-md hover:bg-[#74202D] border-2 border-[#74202D] hover:text-white cursor-pointer transition-all duration-300 text-[10px] font-semibold shadow-xs">
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                <div className="bg-orange-50/50 rounded-2xl p-4 sm:p-5 border border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-4 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 flex items-center justify-center text-[#5A1622] shrink-0 bg-white rounded-full sm:bg-transparent sm:rounded-none shadow-sm sm:shadow-none">
                      <FiTruck className="text-xl sm:text-2xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Need Help?</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-1 max-w-[200px] sm:max-w-none mx-auto">Our support team is here for you. Get in touch anytime.</p>
                    </div>
                  </div>
                  <button onClick={() => navigate("/contact")} className="w-full sm:w-auto bg-[#74202D] text-white uppercase py-2.5 px-6 sm:px-8 rounded-md hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer transition-all duration-300 text-xs sm:text-sm font-semibold shadow-xs shrink-0 flex items-center justify-center gap-2">
                    Contact Us <FiArrowRight />
                  </button>
                </div>
              </FadeUp>

              <FadeUp delay={0.4} className="space-y-6">
                <div className="bg-[#FCF8F5] rounded-2xl p-4 sm:p-6 shadow-sm border border-[#EEDACB]/50">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-4 sm:mb-5 text-center sm:text-left">Quick Links</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <button onClick={() => setActiveTab("My Orders")} className="bg-white border border-rose-100 rounded-xl p-3 sm:p-4 text-center hover:border-[#EEDACB] transition-all group flex flex-col items-center h-full shadow-xs">
                      <div className="w-8 h-8 flex items-center justify-center text-[#5A1622] mb-2 sm:mb-3 group-hover:scale-110 transition-transform bg-rose-50 rounded-full">
                        <FiBox className="text-xl" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-[13px] w-full">Track Your Order</h4>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-1 w-full">Check delivery status</p>
                    </button>

                    <button onClick={() => setActiveTab("My Reviews")} className="bg-white border border-rose-100 rounded-xl p-3 sm:p-4 text-center hover:border-[#EEDACB] transition-all group flex flex-col items-center h-full shadow-xs">
                      <div className="w-8 h-8 flex items-center justify-center text-[#5A1622] mb-2 sm:mb-3 group-hover:scale-110 transition-transform bg-rose-50 rounded-full">
                        <FiStar className="text-xl" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-[13px] w-full">Customer Reviews</h4>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-1 w-full">Manage your reviews</p>
                    </button>

                    <button onClick={() => setActiveTab("Address Book")} className="bg-white border border-rose-100 rounded-xl p-3 sm:p-4 text-center hover:border-[#EEDACB] transition-all group flex flex-col items-center h-full shadow-xs">
                      <div className="w-8 h-8 flex items-center justify-center text-[#5A1622] mb-2 sm:mb-3 group-hover:scale-110 transition-transform bg-rose-50 rounded-full">
                        <FiMapPin className="text-xl" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-[13px] w-full">Manage Addresses</h4>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-1 w-full">View / Add address</p>
                    </button>

                    <button onClick={() => navigate("/wishlist")} className="bg-white border border-rose-100 rounded-xl p-3 sm:p-4 text-center hover:border-[#EEDACB] transition-all group flex flex-col items-center h-full shadow-xs">
                      <div className="w-8 h-8 flex items-center justify-center text-[#5A1622] mb-2 sm:mb-3 group-hover:scale-110 transition-transform bg-rose-50 rounded-full">
                        <FiHeart className="text-xl" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-[13px] w-full">Wishlist</h4>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-1 w-full">Your saved items</p>
                    </button>

                    <button onClick={() => setActiveTab("Account Details")} className="bg-white border border-rose-100 rounded-xl p-3 sm:p-4 text-center hover:border-[#EEDACB] transition-all group flex flex-col items-center h-full shadow-xs">
                      <div className="w-8 h-8 flex items-center justify-center text-[#5A1622] mb-2 sm:mb-3 group-hover:scale-110 transition-transform bg-rose-50 rounded-full">
                        <FiUser className="text-xl" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-[13px] w-full">Account Details</h4>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-1 w-full">Update your profile</p>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">My Wishlist</h3>
                    <button onClick={() => navigate("/wishlist")} className="text-[10px] sm:text-xs font-bold text-[#74202D] flex items-center gap-1 hover:underline">
                      View All <FiArrowRight />
                    </button>
                  </div>

                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs font-medium">Your wishlist is empty.</div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {wishlistItems.map((item, i) => (
                        <div key={item.id || item._id || i} onClick={() => navigate(`/shop/${item.id || item._id}`)} className="group cursor-pointer">
                          <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2 border border-[#EEDACB]">
                            <img
                              src={resolveImageUrl(item.img)}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <button className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-rose-500 shadow-sm">
                              <FiHeart className="text-[10px] fill-current" />
                            </button>
                          </div>
                          <h4 className="text-[9px] sm:text-[10px] font-bold text-slate-800 truncate">{item.title}</h4>
                          <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 mt-0.5">₹ {item.discountPrice?.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FadeUp>
            </div>
          </>
        )}

        {/* --- MY ORDERS TAB --- */}
        {activeTab === "My Orders" && (
          <FadeUp delay={0.2} className="bg-white rounded-2xl p-6 md:p-8 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
            <div className="mb-6">
              <h3 className="text-xl font-serif text-[#74202D] font-bold">Order History</h3>
              <p className="text-xs text-slate-500 mt-1">View and manage all your past orders.</p>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              {orders.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-300 mx-auto mb-4">
                    <FiShoppingBag className="text-3xl" />
                  </div>
                  <h3 className="text-base font-bold text-slate-700">No orders yet</h3>
                  <p className="text-sm text-slate-500 mt-2 mb-6">Looks like you haven't made your first purchase yet.</p>
                  <button onClick={() => navigate("/shop")} className="bg-[#74202D] text-white uppercase py-2.5 px-6 sm:px-8 rounded-md hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer transition-all duration-300 text-xs sm:text-sm font-semibold shadow-xs">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <table className="w-full text-sm text-left min-w-[700px]">
                  <thead>
                    <tr className="text-slate-400 font-semibold border-b border-[#EEDACB] text-xs uppercase tracking-wider bg-[#FCF8F5]">
                      <th className="py-4 px-4 rounded-tl-lg">Order ID</th>
                      <th className="py-4 px-4">Date</th>
                      <th className="py-4 px-4">Items</th>
                      <th className="py-4 px-4">Amount</th>
                      <th className="py-4 px-4 text-center">Status</th>
                      <th className="py-4 px-4 text-center rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3E6DA]">
                    {orders.map((order, i) => (
                      <tr key={order._id || i} className="hover:bg-[#FCF8F5] transition group">
                        <td className="py-5 px-4 font-bold text-slate-700 text-sm">#{order.orderId || order._id.substring(order._id.length - 8).toUpperCase()}</td>
                        <td className="py-5 px-4 text-slate-500 text-sm">
                          {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="py-5 px-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg border border-[#EEDACB] overflow-hidden shrink-0 shadow-sm">
                              <img
                                src={(order.items && order.items[0]?.img) ? resolveImageUrl(order.items[0].img) : "https://images.unsplash.com/photo-1610189044265-1ebf81393666?w=100&auto=format&fit=crop&q=80"}
                                alt="Item"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 max-w-[200px]">
                              <p className="font-bold text-slate-800 text-sm truncate">
                                {order.items && order.items[0]?.name ? order.items[0].name : "Saree"}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">{order.items ? order.items.length : 1} item{order.items && order.items.length !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-4 font-bold text-slate-800 text-sm">₹ {(order.total || order.totalAmount)?.toLocaleString()}</td>
                        <td className="py-5 px-4 text-center">
                          {(!order.status || order.status === "Delivered") ? (
                            <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">Delivered</span>
                          ) : order.status === "Shipped" ? (
                            <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-purple-100 text-purple-700 border border-purple-200">Shipped</span>
                          ) : order.status === "Processing" ? (
                            <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-orange-100 text-orange-700 border border-orange-200">Processing</span>
                          ) : order.status === "Cancelled" ? (
                            <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-red-100 text-red-700 border border-red-200">Cancelled</span>
                          ) : (
                            <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200">{order.status || "Pending"}</span>
                          )}
                        </td>
                        <td className="py-5 px-4 text-center">
                          <button className="bg-white text-[#74202D] uppercase py-1.5 px-4 rounded-md hover:bg-[#74202D] border-2 border-[#74202D] hover:text-white cursor-pointer transition-all duration-300 text-[10px] font-semibold shadow-xs">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </FadeUp>
        )}

        {/* --- MY REVIEWS TAB --- */}
        {activeTab === "My Reviews" && (
          <FadeUp delay={0.2} className="bg-white rounded-2xl p-6 md:p-8 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-[#EEDACB] pb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-serif text-[#74202D] font-bold">My Customer Reviews</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Share your experience, edit existing feedback, or add a review for your favorite sarees.
                </p>
              </div>
              <button
                onClick={handleOpenAddReviewModal}
                className="inline-flex items-center justify-center gap-2 bg-[#74202D] text-white uppercase py-2.5 px-5 rounded-xl hover:bg-[#5A1622] transition-all duration-300 text-xs font-bold shadow-sm cursor-pointer shrink-0"
              >
                <FiPlus className="text-base" />
                <span>Write a Review</span>
              </button>
            </div>

            {loadingReviews ? (
              <div className="py-20 text-center text-slate-500">
                <FiRefreshCw className="text-2xl animate-spin mx-auto mb-3 text-[#74202D]" />
                <p className="text-sm font-medium">Loading your reviews...</p>
              </div>
            ) : userReviews.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-[#EEDACB] rounded-2xl bg-[#FCF8F5]">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-xs">
                  <FiStar className="text-2xl fill-amber-400" />
                </div>
                <h4 className="text-base font-bold text-slate-800">No Reviews Written Yet</h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6 max-w-md mx-auto">
                  Your feedback helps others discover timeless elegance. Write a review about your purchase and experience with Eternal Vastra!
                </p>
                <button
                  onClick={handleOpenAddReviewModal}
                  className="inline-flex items-center gap-2 bg-[#74202D] text-white uppercase py-2.5 px-6 rounded-xl hover:bg-[#5A1622] transition-all text-xs font-bold shadow-md cursor-pointer"
                >
                  <FiPlus /> Write Your First Review
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {userReviews.map((rev, index) => {
                  const rRating = Math.round(Number(rev.rating) || 5);
                  return (
                    <div
                      key={rev._id || rev.id || index}
                      className="bg-[#FCF8F5] border border-[#EEDACB] hover:border-[#cbb3a3] rounded-2xl p-5 sm:p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: Saree Title & Rating */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-[#74202D] uppercase tracking-wider block mb-0.5">
                              Saree / Product
                            </span>
                            <h4 className="font-serif font-bold text-slate-900 text-base sm:text-lg truncate">
                              {rev.product || "Eternal Heritage Saree"}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg shrink-0">
                            <div className="flex text-amber-500 text-xs">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className={star <= rRating ? "text-amber-500" : "text-slate-300"}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-xs font-bold text-amber-900 ml-1">
                              {rev.rating || 5}.0
                            </span>
                          </div>
                        </div>

                        {/* Review Comment */}
                        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4 italic font-normal bg-white/60 p-3.5 rounded-xl border border-[#EEDACB]/40">
                          "{rev.comment || rev.review || ""}"
                        </p>

                        {/* Meta info */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-4 pt-1">
                          <span className="flex items-center gap-1 text-emerald-700 font-medium">
                            <FiCheckCircle className="text-xs text-emerald-600 shrink-0" />
                            Verified Customer Review
                          </span>
                          <span>{rev.date || "Recent"}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EEDACB]">
                        <button
                          type="button"
                          onClick={() => handleOpenEditReviewModal(rev)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#74202D] bg-rose-50 hover:bg-[#74202D] hover:text-white transition-all cursor-pointer border border-[#74202D]/20"
                        >
                          <FiEdit2 className="text-xs" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUserReview(rev)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50/50 hover:bg-rose-600 hover:text-white transition-all cursor-pointer border border-rose-200"
                        >
                          <FiTrash2 className="text-xs" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </FadeUp>
        )}

        {/* --- ADDRESS BOOK TAB --- */}
        {activeTab === "Address Book" && (
          <FadeUp delay={0.2} className="space-y-6">
            {!showAddressForm ? (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-serif text-[#74202D] font-bold">Saved Addresses</h3>
                    <p className="text-xs text-slate-500 mt-1">Manage your delivery addresses for quick checkout.</p>
                  </div>
                  <button onClick={() => setShowAddressForm(true)} className="bg-[#74202D] text-white uppercase py-2 px-4 sm:px-5 rounded-md hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer transition-all duration-300 text-[10px] sm:text-xs font-semibold shadow-xs flex items-center gap-2">
                    <FiPlus /> Add New Address
                  </button>
                </div>

                {(!user.addresses || user.addresses.length === 0) ? (
                  <div className="text-center py-16 border-2 border-dashed border-[#EEDACB] rounded-xl bg-[#FCF8F5]">
                    <FiMapPin className="text-4xl text-slate-300 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-700">No Addresses Found</h4>
                    <p className="text-sm text-slate-500 mt-2 mb-4">You haven't saved any addresses yet.</p>
                    <button onClick={() => setShowAddressForm(true)} className="bg-[#74202D] text-white uppercase py-2.5 px-6 sm:px-8 rounded-md hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer transition-all duration-300 text-xs sm:text-sm font-semibold shadow-xs">
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {user.addresses.map((address, idx) => (
                      <div key={idx} className="relative p-5 sm:p-6 rounded-xl border border-[#EEDACB] bg-[#FCF8F5] hover:bg-white transition-colors group">
                        {address.isDefault && (
                          <span className="absolute top-4 right-4 px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider">
                            Default
                          </span>
                        )}
                        <h4 className="font-bold text-slate-800 text-base mb-1">{address.name}</h4>
                        <p className="text-sm font-semibold text-slate-600 mb-3">{address.phone}</p>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                          {address.street}<br />
                          {address.city}, {address.state} {address.zip}<br />
                          {address.country}
                        </p>
                        <div className="flex items-center gap-3 pt-4 border-t border-[#EEDACB]">
                          <button className="text-sm font-semibold text-[#74202D] hover:underline flex items-center gap-1.5">
                            <FiEdit2 className="text-xs" /> Edit
                          </button>
                          <div className="w-px h-4 bg-slate-300"></div>
                          <button onClick={() => handleDeleteAddress(idx)} className="text-sm font-semibold text-rose-500 hover:underline flex items-center gap-1.5">
                            <FiTrash2 className="text-xs" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
                <div className="mb-6">
                  <h3 className="text-xl font-serif text-[#74202D] font-bold">Add New Address</h3>
                  <p className="text-xs text-slate-500 mt-1">Please fill in the details below to add a new delivery address.</p>
                </div>
                <form onSubmit={handleSaveAddress} className="space-y-5 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Full Name</label>
                      <input type="text" required value={addressForm.name} onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" placeholder="Rohan Shinde" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Phone Number</label>
                      <input type="tel" required value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Street Address</label>
                    <input type="text" required value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" placeholder="Flat / House No. / Building / Street" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">City</label>
                      <input type="text" required value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" placeholder="Mumbai" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">State</label>
                      <input type="text" required value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" placeholder="Maharashtra" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Postal Code (PIN)</label>
                      <input type="text" required value={addressForm.zip} onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" placeholder="400001" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Country</label>
                      <input type="text" required value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" placeholder="India" />
                    </div>
                  </div>
                  <div className="flex items-center pt-2">
                    <input id="default-address" type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} className="w-4 h-4 text-[#74202D] bg-[#FCF8F5] border-[#EEDACB] rounded focus:ring-[#74202D] focus:ring-2 cursor-pointer" />
                    <label htmlFor="default-address" className="ml-2 text-sm font-medium text-slate-700 cursor-pointer">Set as default shipping address</label>
                  </div>
                  <div className="flex gap-4 pt-4 border-t border-[#EEDACB]">
                    <button type="submit" disabled={saving} className="bg-[#74202D] text-white uppercase py-2.5 px-6 sm:px-8 rounded-md hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer transition-all duration-300 text-xs sm:text-sm font-semibold shadow-xs disabled:opacity-70">
                      {saving ? "Saving..." : "Save Address"}
                    </button>
                    <button type="button" onClick={() => setShowAddressForm(false)} className="bg-white text-[#74202D] uppercase py-2.5 px-6 sm:px-8 rounded-md hover:bg-[#74202D] border-2 border-[#74202D] hover:text-white cursor-pointer transition-all duration-300 text-xs sm:text-sm font-semibold shadow-xs">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </FadeUp>
        )}

        {/* --- ACCOUNT DETAILS TAB --- */}
        {activeTab === "Account Details" && (
          <FadeUp delay={0.2} className="bg-white rounded-2xl p-4 md:p-8 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] max-w-full">
            <div className="mb-8">
              <h3 className="text-xl sm:text-2xl font-serif text-[#74202D] font-bold">Personal Information</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Update your profile details and preferences.</p>
            </div>

            <form onSubmit={handleSaveAccountDetails} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#EEDACB]">
                <div className="relative group w-24 h-24 rounded-full overflow-hidden border-3 hover:border-[#5A1622] transition-all duration-300 border-white shadow-md shrink-0">
                  <img
                    src={getAvatarUrl(user.avatar)}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "/images/default-avatar.webp"; }}
                  />
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <FiCamera className="text-2xl" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </label>
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base mb-1">Profile Picture</h4>
                  <p className="text-xs sm:text-sm text-slate-500 mb-3">Upload a new avatar to personalize your profile.</p>
                  <label className="bg-white text-[#74202D] uppercase py-2 px-5 rounded-md hover:bg-[#74202D] border-2 border-[#74202D] hover:text-white cursor-pointer transition-all duration-300 text-xs sm:text-sm font-semibold shadow-xs inline-block">
                    Change Picture
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Full Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
                  <input type="email" disabled value={user.email} className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-sm rounded-xl block p-3 cursor-not-allowed opacity-80" />
                  <p className="text-[10px] text-slate-400 mt-1.5">Email address cannot be changed.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Phone Number</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" placeholder="Your Phone No." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Date of Birth</label>
                  <input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">Gender</label>
                <div className="flex gap-4 sm:gap-6">
                  {["Male", "Female", "Other"].map((gen) => (
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
                <button type="submit" disabled={saving} className="bg-[#74202D] text-white uppercase py-2.5 px-6 sm:px-8 rounded-md hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer transition-all duration-300 text-xs sm:text-sm font-semibold shadow-xs disabled:opacity-70 flex items-center gap-2">
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </FadeUp>
        )}

        {/* --- SECURITY & PASSWORD TAB --- */}
        {activeTab === "Security" && (
          <FadeUp delay={0.2} className="bg-white rounded-2xl p-6 md:p-8 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] max-w-2xl">
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
                    className="w-full sm:w-auto bg-[#74202D] text-white uppercase py-2.5 px-6 sm:px-8 rounded-md hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer transition-all duration-300 text-xs sm:text-sm font-semibold shadow-xs disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {saving ? "Updating..." : "Update Password"}
                  </button>

                  <div className="text-center sm:text-right">
                    <span className="text-xs text-slate-500">Don't remember your current password? </span>
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
        )}
      </div>

      {/* ADD / EDIT REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#EEDACB] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#74202D] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiStar className="text-lg" />
                <h3 className="font-serif font-bold text-base sm:text-lg">
                  {editingReview ? "Edit Your Review" : "Write a Saree Review"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveUserReview} className="p-6 space-y-5">
              {/* Reviewer Profile Preview */}
              <div className="flex items-center gap-3 bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#74202D]/30"
                  onError={(e) => { e.target.src = "/images/default-avatar.webp"; }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">Posting as: {user.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                </div>
              </div>

              {/* Saree / Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Saree / Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={reviewForm.product}
                  onChange={(e) => setReviewForm({ ...reviewForm, product: e.target.value })}
                  placeholder="e.g. Pure Kanjeevaram Silk Saree, Banarasi Silk, etc."
                  className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3"
                />
              </div>

              {/* Star Rating selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Your Rating (1 to 5 Stars) *
                </label>
                <div className="flex items-center gap-3 bg-[#FCF8F5] p-3 rounded-xl border border-[#EEDACB]">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                        title={`${star} Star${star > 1 ? 's' : ''}`}
                      >
                        <span className={star <= reviewForm.rating ? "text-amber-400" : "text-slate-300"}>
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {reviewForm.rating === 5 && "5.0 - Outstanding ★★★★★"}
                    {reviewForm.rating === 4 && "4.0 - Very Good ★★★★☆"}
                    {reviewForm.rating === 3 && "3.0 - Good ★★★☆☆"}
                    {reviewForm.rating === 2 && "2.0 - Fair ★★☆☆☆"}
                    {reviewForm.rating === 1 && "1.0 - Poor ★☆☆☆☆"}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Your Review / Experience *
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Describe fabric texture, zari work, packaging, and comfort..."
                  className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EEDACB]">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingReview}
                  className="bg-[#74202D] text-white uppercase py-2.5 px-6 rounded-xl hover:bg-[#5A1622] transition-all text-xs font-bold shadow-md cursor-pointer disabled:opacity-70 flex items-center gap-2"
                >
                  <FiCheckCircle className="text-sm" />
                  <span>{savingReview ? "Saving..." : (editingReview ? "Update Review" : "Publish Review")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
