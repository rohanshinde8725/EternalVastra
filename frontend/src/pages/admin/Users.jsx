import React, { useState, useEffect } from "react";
import {
  FiSearch, FiMail, FiPhone, FiRotateCw, FiUserX, FiTrash2, FiPlus, FiX, FiShield, FiUser, FiCheckCircle, FiAlertTriangle,
  FiLock, FiUnlock,
} from "react-icons/fi";
import { API_BASE_URL, resolveImageUrl } from "../../api/products";
import { useToast } from "../../context/ToastContext";
import { getStoredUser } from "../../utils/auth";

const Users = () => {
  const { showToast } = useToast();
  const currentUser = getStoredUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'blocked' | 'admin' | 'customer'
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
    status: "active",
  });

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/users`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load users");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(
            data.map((u) => ({
              ...u,
              id: u._id || u.id,
              isBlocked: !!u.isBlocked || u.status === "blocked",
              status: u.isBlocked || u.status === "blocked" ? "blocked" : "active",
              avatar: resolveImageUrl(u.avatar || "/images/default-avatar.webp"),
            }))
          );
        }
      })
      .catch(() => {
        showToast.error("Failed to load users from database");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle Block / Unblock
  const handleToggleBlock = async (user) => {
    if (user.email === "rohanshinde8725@gmail.com") {
      showToast.error("Master Admin account cannot be blocked.");
      return;
    }

    setActionLoadingId(user.id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${user.id}/toggle-block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update user status");
      }

      const updated = await res.json();
      const newStatus = user.isBlocked ? "active" : "blocked";
      const newIsBlocked = !user.isBlocked;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isBlocked: newIsBlocked, status: newStatus } : u
        )
      );

      if (newIsBlocked) {
        showToast.warning(`User ${user.name} (${user.email}) has been BLOCKED.`);
      } else {
        showToast.success(`User ${user.name} (${user.email}) has been ACTIVATED.`);
      }
    } catch (err) {
      showToast.error(err.message || "Error changing user block status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    if (deleteConfirmUser.email === "rohanshinde8725@gmail.com") {
      showToast.error("Master Admin account cannot be deleted.");
      setDeleteConfirmUser(null);
      return;
    }

    setActionLoadingId(deleteConfirmUser.id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${deleteConfirmUser.id}`, {
        method: "DELETE",
      });

      if (!res.ok && res.status !== 204) {
        throw new Error("Failed to delete user account");
      }

      setUsers((prev) => prev.filter((u) => u.id !== deleteConfirmUser.id));
      showToast.success(`User ${deleteConfirmUser.name} deleted. Moved to Recycle Bin.`);
    } catch (err) {
      showToast.error(err.message || "Error deleting user");
    } finally {
      setActionLoadingId(null);
      setDeleteConfirmUser(null);
    }
  };

  // Open modal for Create
  const openModal = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "customer",
      status: "active",
    });
    setIsModalOpen(true);
  };

  // Save (Create Only)
  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast.error("Name and Email are required.");
      return;
    }

    if (!formData.password) {
      showToast.error("Password is required for new user creation.");
      return;
    }

    try {
      const isBlocked = formData.status === "blocked";
      const payload = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
        status: formData.status,
        isBlocked,
        avatar: "/images/default-avatar.webp",
      };

      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to create user");
      }

      const created = await res.json();
      setUsers((prev) => [
        {
          ...created,
          id: created._id || created.id,
          avatar: resolveImageUrl("/images/default-avatar.webp"),
        },
        ...prev,
      ]);
      showToast.success(`New user ${formData.name} created successfully.`);
      setIsModalOpen(false);
    } catch (err) {
      showToast.error(err.message || "Error creating user");
    }
  };

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.phone && u.phone.includes(search));

    if (!matchesSearch) return false;

    if (statusFilter === "active") return !u.isBlocked && u.status !== "blocked";
    if (statusFilter === "blocked") return u.isBlocked || u.status === "blocked";
    if (statusFilter === "admin") return u.role === "admin";
    if (statusFilter === "customer") return u.role === "customer";
    return true;
  });

  const totalCount = users.length;
  const activeCount = users.filter((u) => !u.isBlocked && u.status !== "blocked").length;
  const blockedCount = users.filter((u) => u.isBlocked || u.status === "blocked").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="space-y-6 sm:space-y-7 max-w-[1600px] mx-auto text-slate-800">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Registered Users & Accounts
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-[#74202D]">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage authenticated accounts, assign admin privileges, block/unblock patrons, and control system access.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={fetchUsers}
            className="p-2.5 sm:p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer shrink-0"
            title="Refresh Users"
          >
            <FiRotateCw className={`text-sm sm:text-base ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => openModal()}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-[#74202D] hover:bg-[#5A1622] text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer"
          >
            <FiPlus className="text-base" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* 2. STATS METRIC PILLS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Users */}
        <div
          onClick={() => setStatusFilter("all")}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${statusFilter === "all"
              ? "bg-[#74202D] text-white border-[#74202D] shadow-md"
              : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium opacity-80">Total Users</span>
            <FiUser className={`text-base ${statusFilter === "all" ? "text-white" : "text-slate-500"}`} />
          </div>
          <div className={`text-2xl font-bold mt-2 ${statusFilter === "all" ? "text-white" : "text-slate-900"}`}>
            {totalCount}
          </div>
        </div>

        {/* Active Accounts */}
        <div
          onClick={() => setStatusFilter("active")}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${statusFilter === "active"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
              : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium opacity-80">Active Accounts</span>
            <FiCheckCircle className={`text-base ${statusFilter === "active" ? "text-white" : "text-emerald-500"}`} />
          </div>
          <div className={`text-2xl font-bold mt-2 ${statusFilter === "active" ? "text-white" : "text-emerald-600"}`}>
            {activeCount}
          </div>
        </div>

        {/* Blocked Users */}
        <div
          onClick={() => setStatusFilter("blocked")}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${statusFilter === "blocked"
              ? "bg-red-600 text-white border-red-600 shadow-md"
              : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium opacity-80">Blocked Users</span>
            <FiLock className={`text-base ${statusFilter === "blocked" ? "text-white" : "text-red-500"}`} />
          </div>
          <div className={`text-2xl font-bold mt-2 ${statusFilter === "blocked" ? "text-white" : "text-red-600"}`}>
            {blockedCount}
          </div>
        </div>

        {/* Administrators */}
        <div
          onClick={() => setStatusFilter("admin")}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${statusFilter === "admin"
              ? "bg-purple-700 text-white border-purple-700 shadow-md"
              : "bg-white text-slate-800 border-slate-200 hover:border-slate-300"
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium opacity-80">Administrators</span>
            <FiShield className={`text-base ${statusFilter === "admin" ? "text-white" : "text-purple-500"}`} />
          </div>
          <div className={`text-2xl font-bold mt-2 ${statusFilter === "admin" ? "text-white" : "text-purple-700"}`}>
            {adminCount}
          </div>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm sm:text-base" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#74202D] focus:bg-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Users" },
            { id: "active", label: "Active" },
            { id: "blocked", label: "Blocked" },
            { id: "admin", label: "Admins" },
            { id: "customer", label: "Customers" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${statusFilter === f.id
                  ? "bg-[#74202D] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. MAIN USERS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                <th className="py-3.5 sm:py-4 px-4 sm:px-6">User / Profile</th>
                <th className="py-3.5 sm:py-4 px-4 sm:px-6">Contact Info</th>
                <th className="py-3.5 sm:py-4 px-4 sm:px-6">Role</th>
                <th className="py-3.5 sm:py-4 px-4 sm:px-6">Account Status</th>
                <th className="py-3.5 sm:py-4 px-4 sm:px-6">Joined Date</th>
                <th className="py-3.5 sm:py-4 px-4 sm:px-6 text-right">Admin Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-400">
                    <FiRotateCw className="animate-spin text-2xl mx-auto mb-2 text-[#74202D]" />
                    <span>Loading user accounts from MongoDB...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-400">
                    <FiUserX className="text-3xl mx-auto mb-2 text-slate-300" />
                    <span>No user accounts found matching your filter.</span>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isBlocked = user.isBlocked || user.status === "blocked";
                  const isMasterAdmin = user.email === "rohanshinde8725@gmail.com";
                  const isCurrent = currentUser?.email === user.email;

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/70 transition-colors ${isBlocked ? "bg-red-50/30" : ""
                        }`}
                    >
                      {/* User / Avatar & Name */}
                      <td className="py-3.5 sm:py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/default-avatar.webp";
                            }}
                            className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 shrink-0 shadow-2xs"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                              <span>{user.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-1.5 py-0.2 rounded">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400">
                              ID: {user.id ? `USR-${String(user.id).slice(-4)}` : "—"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 sm:py-4 px-4 sm:px-6">
                        <div className="space-y-1">
                          <a
                            href={`mailto:${user.email}`}
                            className="flex items-center gap-1.5 text-slate-700 hover:text-[#74202D] truncate transition"
                          >
                            <FiMail className="text-slate-400 text-xs shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </a>
                          {user.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                              <FiPhone className="text-slate-400 text-xs shrink-0" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 sm:py-4 px-4 sm:px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${user.role === "admin"
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                        >
                          {user.role === "admin" ? (
                            <FiShield className="text-xs text-purple-700" />
                          ) : (
                            <FiUser className="text-xs text-slate-500" />
                          )}
                          <span className="capitalize">{user.role || "customer"}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 sm:py-4 px-4 sm:px-6">
                        {isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 shadow-2xs">
                            <FiLock className="text-xs" />
                            <span>Blocked</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-slate-500 text-xs">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                          : "Jan 2025"}
                      </td>

                      {/* Actions (Only Block/Unblock and Delete) */}
                      <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Block Button */}
                          <button
                            disabled={isMasterAdmin || actionLoadingId === user.id}
                            onClick={() => handleToggleBlock(user)}
                            className={`p-2 rounded-lg transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${isBlocked
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                              }`}
                            title={
                              isMasterAdmin
                                ? "Master admin cannot be blocked"
                                : isBlocked
                                  ? "Unblock User"
                                  : "Block User"
                            }
                          >
                            {isBlocked ? (
                              <FiUnlock className="text-sm" />
                            ) : (
                              <FiLock className="text-sm" />
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            disabled={isMasterAdmin || isCurrent || actionLoadingId === user.id}
                            onClick={() => setDeleteConfirmUser(user)}
                            className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-800 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-rose-100"
                            title={
                              isMasterAdmin || isCurrent
                                ? "Cannot delete this account"
                                : "Delete User"
                            }
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. CREATE USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
            >
              <FiX className="text-lg" />
            </button>

            <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
              Create New User Account
            </h4>
            <p className="text-xs text-slate-500 mb-5">
              Add a new registered user directly to the MongoDB database.
            </p>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Radhika Deshmukh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#74202D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#74202D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98200 12345"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#74202D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#74202D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#74202D]"
                  >
                    <option value="customer">Customer / Patron</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#74202D]"
                  >
                    <option value="active">Active (Access allowed)</option>
                    <option value="blocked">Blocked (Access suspended)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#74202D] hover:bg-[#5A1622] text-white text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. DELETE CONFIRMATION MODAL */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <FiAlertTriangle className="text-2xl" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">Delete User Account?</h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Are you sure you want to delete user{" "}
              <strong className="text-slate-800">{deleteConfirmUser.name}</strong> (
              {deleteConfirmUser.email})? A backup copy will be stored in your{" "}
              <strong>Recycle Bin</strong> where it can be restored.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
