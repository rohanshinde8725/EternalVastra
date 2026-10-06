const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Fast client-side in-memory cache and promise deduplicator
const apiCache = new Map();
const inFlightRequests = new Map();

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

/**
 * Deduplicated cached fetch with TTL
 */
const cachedFetch = async (url, options = {}, ttlMs = 60000) => {
  const method = options.method || "GET";
  if (method !== "GET") {
    // Write request: invalidate cache and fetch fresh
    apiCache.clear();
    return fetch(url, options);
  }

  const cached = apiCache.get(url);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  if (inFlightRequests.has(url)) {
    return inFlightRequests.get(url);
  }

  const promise = fetch(url, options)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const data = await res.json();
      apiCache.set(url, { data, expiresAt: Date.now() + ttlMs });
      return data;
    })
    .finally(() => {
      inFlightRequests.delete(url);
    });

  inFlightRequests.set(url, promise);
  return promise;
};

export const fetchProducts = async (forceRefresh = false) => {
  const url = `${API_BASE_URL}/api/products`;
  if (forceRefresh) {
    apiCache.delete(url);
  }
  const products = await cachedFetch(url, {}, 60000);
  return products.map(normalizeProduct);
};

export const fetchProduct = async (id, forceRefresh = false) => {
  const url = `${API_BASE_URL}/api/products/${id}`;
  if (forceRefresh) {
    apiCache.delete(url);
  }
  try {
    const product = await cachedFetch(url, {}, 60000);
    return normalizeProduct(product);
  } catch (err) {
    if (err.message?.includes("404")) return null;
    throw err;
  }
};

export const invalidateProductCache = () => {
  apiCache.clear();
};

export { API_BASE_URL, resolveImageUrl, cachedFetch };
