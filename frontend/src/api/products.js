const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const resolveImageUrl = (imagePath) => {
  if (!imagePath || imagePath.startsWith("http")) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
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

export { API_BASE_URL };
