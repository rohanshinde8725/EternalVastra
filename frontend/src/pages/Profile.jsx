import React, { useState, useEffect, useRef } from "react";
import { FiHome,  FiShoppingBag, FiHeart, FiMapPin, FiUser, FiLogOut, FiTruck, FiBox, FiArrowRight, FiCamera, FiEdit2,
  FiTrash2, FiPlus, FiLock, FiShield, FiMenu, FiX } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { logout, loginUserSession } from "../utils/auth";
import FadeUp from "../components/animations/FadeUp";
import { resolveImageUrl } from "../api/products";

const Profile = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const getAvatarUrl = (avatarStr) => {
    if (!avatarStr) return "http://localhost:5000/images/default-avatar.png";
    if (avatarStr.includes("testimonial-1.png")) return "http://localhost:5000/images/default-avatar.png";
    if (avatarStr.startsWith("http")) return avatarStr;
    return `http://localhost:5000${avatarStr}`;
  };

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ name: "", phone: "", dob: "", gender: "Male" });
  const [saving, setSaving] = useState(false);
  
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "", street: "", city: "", state: "", country: "", zip: "", phone: "", isDefault: false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: ""
  });

  const fetchProfileData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`);
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
      const response = await fetch(`http://localhost:5000/api/users/profile/${userId}/avatar`, {
        method: "POST",
        body: formDataUpload
      });

      if (response.ok) {
        showToast.success("Profile picture updated!");
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
      const response = await fetch(`http://localhost:5000/api/users/profile/${user._id || user.id}`, {
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
      
      const response = await fetch(`http://localhost:5000/api/users/profile/${user._id || user.id}`, {
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
      const response = await fetch(`http://localhost:5000/api/users/profile/${user._id || user.id}/password`, {
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
    if(!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const newAddresses = user.addresses.filter((_, i) => i !== index);
      const response = await fetch(`http://localhost:5000/api/users/profile/${user._id || user.id}`, {
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

  if (!user) return null;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-[#FDF9F6] font-sans">
      {/* Sidebar */}
      <div className="w-full lg:w-[280px] bg-[#74202D] text-white flex flex-col shrink-0">
        <div className="p-6 md:p-8 md:pb-6 border-b border-[#8c2a38] flex items-center justify-between lg:justify-start gap-4 min-w-0 w-full">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="relative group w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
              <img 
                src={getAvatarUrl(user.avatar)} 
                alt={user.name} 
                className="w-full h-full object-cover" 
                onError={(e) => { e.target.src = "http://localhost:5000/images/default-avatar.png"; }}
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <FiCamera className="text-xl" />
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
            {isMobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>

        <nav className={`py-4 lg:py-6 px-4 flex flex-col gap-1.5 lg:gap-1.5 transition-all duration-300 ${isMobileMenuOpen ? "flex" : "hidden lg:flex"}`}>
          <button onClick={() => { setActiveTab("Dashboard"); setIsMobileMenuOpen(false); }} className={`cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold transition-all ${activeTab === "Dashboard" ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <FiHome className="text-lg lg:text-xl shrink-0" /> <span>Dashboard</span>
          </button>
          <button onClick={() => { setActiveTab("My Orders"); setIsMobileMenuOpen(false); }} className={`cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold transition-all ${activeTab === "My Orders" ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <FiShoppingBag className="text-lg lg:text-xl shrink-0" /> <span>My Orders</span>
          </button>
          <button onClick={() => { navigate("/wishlist"); setIsMobileMenuOpen(false); }} className={`cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold transition-all ${activeTab === "Wishlist" ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <FiHeart className="text-lg lg:text-xl shrink-0" /> <span>Wishlist</span>
          </button>
          <button onClick={() => { navigate("/cart"); setIsMobileMenuOpen(false); }} className={`cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold transition-all ${activeTab === "Cart" ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <HiOutlineShoppingBag className="text-lg lg:text-xl shrink-0" /> <span>Cart</span>
          </button>
          <button onClick={() => { setActiveTab("Address Book"); setIsMobileMenuOpen(false); }} className={`cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold transition-all ${activeTab === "Address Book" ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <FiMapPin className="text-lg lg:text-xl shrink-0" /> <span>Address Book</span>
          </button>
          <button onClick={() => { setActiveTab("Account Details"); setIsMobileMenuOpen(false); }} className={`cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold transition-all ${activeTab === "Account Details" ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <FiUser className="text-lg lg:text-xl shrink-0" /> <span>Account Details</span>
          </button>
          <button onClick={() => { setActiveTab("Security"); setIsMobileMenuOpen(false); }} className={`cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold transition-all ${activeTab === "Security" ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
            <FiShield className="text-lg lg:text-xl shrink-0" /> <span>Security & Password</span>
          </button>
          <div className="hidden lg:block pt-6 pb-2">
            <div className="h-px bg-white/10"></div>
          </div>
          <button onClick={handleSignOut} className="cursor-pointer shrink-0 w-full flex items-center gap-3 lg:gap-3.5 px-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-[15px] font-semibold text-white/70 hover:bg-white/10 hover:text-rose-300 transition-all">
            <FiLogOut className="text-lg lg:text-xl shrink-0" /> <span>Logout</span>
          </button>
        </nav>

        <div className="hidden lg:flex p-8 text-center flex-col items-center justify-center opacity-40">
          <svg className="w-10 h-10 mb-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C12 2 12 8 8 12C12 16 12 22 12 22C12 22 12 16 16 12C12 8 12 2 12 2Z" />
          </svg>
          <p className="text-[10px] uppercase tracking-widest font-serif leading-relaxed">Timeless Elegance<br/>in Every Drape</p>
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
                  <h3 className="font-serif text-[#74202D] text-lg leading-tight">Timeless Sarees<br/>for Every Moment</h3>
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

                <div onClick={() => setActiveTab("Address Book")} className="bg-white rounded-2xl p-5 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group hover:border-[#d1b5ae]">
                  <div className="w-10 h-10 flex items-center justify-center text-2xl shrink-0 text-[#5A1622] group-hover:scale-110 transition-transform">
                    <FiMapPin />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] sm:text-xs xl:text-sm font-medium text-slate-500 block truncate mb-0.5">Saved Addresses</span>
                    <p className="text-sm sm:text-lg lg:text-base xl:text-2xl font-bold text-slate-900 tracking-tight whitespace-nowrap">{user.addresses?.length || 0}</p>
                  </div>
                </div>

                <div onClick={() => setActiveTab("Account Details")} className="bg-white rounded-2xl p-5 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group hover:border-[#d1b5ae]">
                  <div className="w-10 h-10 flex items-center justify-center text-2xl shrink-0 text-[#5A1622] group-hover:scale-110 transition-transform">
                    <FiUser />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] sm:text-xs xl:text-sm font-medium text-slate-500 block truncate mb-0.5">Account Details</span>
                    <p className="text-xs sm:text-sm xl:text-base font-bold text-emerald-600 tracking-tight whitespace-nowrap">Complete</p>
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
                                      src={(order.items && order.items[0]?.img) ? (order.items[0].img.startsWith('http') ? order.items[0].img : `http://localhost:5000${order.items[0].img}`) : "https://images.unsplash.com/photo-1610189044265-1ebf81393666?w=100&auto=format&fit=crop&q=80"} 
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
                                src={(order.items && order.items[0]?.img) ? (order.items[0].img.startsWith('http') ? order.items[0].img : `http://localhost:5000${order.items[0].img}`) : "https://images.unsplash.com/photo-1610189044265-1ebf81393666?w=100&auto=format&fit=crop&q=80"} 
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
                          {address.street}<br/>
                          {address.city}, {address.state} {address.zip}<br/>
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
                      <input type="text" required value={addressForm.name} onChange={(e) => setAddressForm({...addressForm, name: e.target.value})} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" placeholder="Rohan Shinde" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Phone Number</label>
                      <input type="tel" required value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Street Address</label>
                    <input type="text" required value={addressForm.street} onChange={(e) => setAddressForm({...addressForm, street: e.target.value})} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" placeholder="Flat / House No. / Building / Street" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">City</label>
                      <input type="text" required value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" placeholder="Mumbai" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">State</label>
                      <input type="text" required value={addressForm.state} onChange={(e) => setAddressForm({...addressForm, state: e.target.value})} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" placeholder="Maharashtra" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Postal Code (PIN)</label>
                      <input type="text" required value={addressForm.zip} onChange={(e) => setAddressForm({...addressForm, zip: e.target.value})} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" placeholder="400001" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Country</label>
                      <input type="text" required value={addressForm.country} onChange={(e) => setAddressForm({...addressForm, country: e.target.value})} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" placeholder="India" />
                    </div>
                  </div>
                  <div className="flex items-center pt-2">
                    <input id="default-address" type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})} className="w-4 h-4 text-[#74202D] bg-[#FCF8F5] border-[#EEDACB] rounded focus:ring-[#74202D] focus:ring-2 cursor-pointer" />
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
                    onError={(e) => { e.target.src = "http://localhost:5000/images/default-avatar.png"; }}
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
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" />
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
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" placeholder="Your Phone No." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Date of Birth</label>
                  <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" />
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
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
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
            <div className="mb-8 flex items-center gap-4 border-b border-[#EEDACB] pb-6">
              <div className="w-12 h-12 bg-rose-50 text-[#74202D] rounded-full flex items-center justify-center text-2xl">
                <FiLock />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-serif text-[#74202D] font-bold">Security & Password</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage your account security and update your password.</p>
              </div>
            </div>
            
            <form onSubmit={handleSavePassword} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Current Password</label>
                <input 
                  type="password" 
                  required 
                  value={passwordForm.currentPassword} 
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} 
                  className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" 
                  placeholder="Enter your current password" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">New Password</label>
                  <input 
                    type="password" 
                    required 
                    value={passwordForm.newPassword} 
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} 
                    className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" 
                    placeholder="Min 6 characters" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Confirm Password</label>
                  <input 
                    type="password" 
                    required 
                    value={passwordForm.confirmPassword} 
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} 
                    className="w-full bg-[#FCF8F5] border border-[#EEDACB] text-slate-800 text-sm rounded-xl focus:ring-[#74202D] focus:border-[#74202D] block p-3" 
                    placeholder="Retype new password" 
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-[#EEDACB]">
                <button type="submit" disabled={saving} className="bg-[#74202D] text-white uppercase py-2.5 px-6 sm:px-8 rounded-md hover:bg-white border-2 border-[#74202D] hover:text-[#74202D] cursor-pointer transition-all duration-300 text-xs sm:text-sm font-semibold shadow-xs disabled:opacity-70 flex items-center gap-2">
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </FadeUp>
        )}
      </div>
    </div>
  );
};

export default Profile;
