export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("eternal_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  const user = getStoredUser();
  return !!(user && (user.email || user.id || user.name));
};
