const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const resolveImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") return "/images/silk/silk-1.webp";

  // Strip hardcoded production URLs if present
  let cleanPath = imagePath;
  if (cleanPath.startsWith("https://eternalvastra.onrender.com")) {
    cleanPath = cleanPath.replace("https://eternalvastra.onrender.com", "");
  }

  // If path has a local dev server prefix, remap it dynamically to current API_BASE_URL
  if (cleanPath.startsWith("http://localhost:5000") || cleanPath.startsWith("http://127.0.0.1:5000")) {
    const relativePath = cleanPath.replace(/^http:\/\/(localhost|127\.0\.0\.1):5000/, "");
    return `${API_BASE_URL}${relativePath.startsWith("/") ? "" : "/"}${relativePath}`;
  }

  // Convert any legacy raster extensions (.jpg, .jpeg, .png) to .webp EXCEPT for uploaded files under /uploads/
  if (!cleanPath.startsWith("/uploads/")) {
    cleanPath = cleanPath.replace(/\.(png|jpg|jpeg)$/i, ".webp");
  }

  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    return cleanPath;
  }

  // Bundled static images under /images/ can load directly from frontend CDN for maximum speed
  if (cleanPath.startsWith("/images/")) {
    return cleanPath;
  }

  return `${API_BASE_URL}${cleanPath.startsWith("/") ? "" : "/"}${cleanPath}`;
};

const normalizeProduct = (product) => ({
  ...product,
  img: resolveImageUrl(product.img),
});

export const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/products`);
  if (!response.ok) throw new Error("Unable to load products");
  const products = await response.json();
  return products.map(normalizeProduct);
};

export const fetchProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Unable to load product");
  return normalizeProduct(await response.json());
};

export { API_BASE_URL, resolveImageUrl };
