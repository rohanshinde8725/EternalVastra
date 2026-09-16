export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("eternal_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = (user = getStoredUser()) => {
  return !!(user && (user.email || user.id || user._id || user.name));
};

export const isAdmin = (user = getStoredUser()) => {
  if (!user) return false;
  return (
    user.role === "admin" ||
    user.email === "rohanshinde8725@gmail.com" ||
    (typeof user.email === "string" && user.email.toLowerCase().includes("admin"))
  );
};

export const loginUserSession = (user) => {
  try {
    localStorage.setItem("eternal_user", JSON.stringify(user));
    if (user && user.email) {
      const savedCart = localStorage.getItem(`cart_${user.email}`);
      const savedWishlist = localStorage.getItem(`wishlist_${user.email}`);
      if (savedCart) {
        localStorage.setItem("cart", savedCart);
      } else {
        localStorage.removeItem("cart");
      }
      if (savedWishlist) {
        localStorage.setItem("wishlist", savedWishlist);
      } else {
        localStorage.removeItem("wishlist");
      }
    }
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event("userUpdated"));
  window.dispatchEvent(new Event("cartUpdated"));
  window.dispatchEvent(new Event("wishlistUpdated"));
};

export const logout = () => {
  try {
    const user = getStoredUser();
    if (user && user.email) {
      const currentCart = localStorage.getItem("cart");
      const currentWishlist = localStorage.getItem("wishlist");
      if (currentCart) localStorage.setItem(`cart_${user.email}`, currentCart);
      if (currentWishlist) localStorage.setItem(`wishlist_${user.email}`, currentWishlist);
    }
    localStorage.removeItem("eternal_user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event("userUpdated"));
  window.dispatchEvent(new Event("cartUpdated"));
  window.dispatchEvent(new Event("wishlistUpdated"));
};
