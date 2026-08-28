import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Rating from "../components/rating/Rating";
import useProducts from "../hooks/useProducts";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { CiSearch, CiHeart } from "react-icons/ci";
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaShareAlt, FaWhatsapp } from "react-icons/fa";
import { FiScissors } from "react-icons/fi";
import { useToast } from "../context/ToastContext";

const defaultDetails = {
  description:
    "This saree is crafted with careful attention to color and texture, making it an elegant choice for celebrations and special events. Enjoy refined drape and comfortable wear throughout the day.",
  material: "Premium blended silk",
  occasion: "Festive and formal wear",
  care: "Dry clean recommended.",
  highlights: [
    "Beautiful saree silhouette",
    "Classic embroidered details",
    "Soft finish with rich color depth",
    "Designed for graceful styling",
  ],
};

const SareeDetail = () => {
  const { showToast } = useToast();
  const { productId } = useParams();
  const { products: sarees, loading, error } = useProducts();
  const product = sarees.find((item) => item.id === Number(productId));
  const content = product ? product.details || defaultDetails : defaultDetails;
  const thumbnails = product ? [product.img, product.img, product.img, product.img] : [];

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartIds, setCartIds] = useState([]);
  const [selectedImage, setSelectedImage] = useState(product?.img || "");
  const [activeTab, setActiveTab] = useState("Care & Craft");

  const addToCart = (productItem) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const found = existingCart.find((item) => item.id === productItem.id);
    const updatedCart = found
      ? existingCart.map((item) =>
          item.id === productItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...existingCart, { ...productItem, quantity: 1 }];

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    showToast.success(`Added "${productItem.title}" to cart!`);
  };

  const toggleWishlist = () => {
    if (!product) return;
    setSelectedImage(product.img);
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isInWishlist = existingWishlist.some((item) => item.id === product.id);
    const updatedWishlist = isInWishlist
      ? existingWishlist.filter((item) => item.id !== product.id)
      : [...existingWishlist, product];

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setIsWishlisted(!isInWishlist);
    window.dispatchEvent(new Event("wishlistUpdated"));
    if (!isInWishlist) {
      showToast.success(`Saved "${product.title}" to wishlist!`);
    } else {
      showToast.info(`Removed "${product.title}" from wishlist.`);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
  };

  useEffect(() => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartIds(existingCart.map((item) => item.id));

    if (!product) return;
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsWishlisted(existingWishlist.some((item) => item.id === product.id));
  }, [product]);

  useEffect(() => {
    const handleCartUpdated = () => {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartIds(existingCart.map((item) => item.id));
    };

    handleCartUpdated();
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, []);

  if (loading) {
    return <div className="container min-h-screen bg-[#fffdfb] px-5 py-24 text-center">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="container bg-[#FEFAF8] min-h-screen py-24 px-5">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200 p-10 shadow-sm text-center">
          <h1 className="text-2xl font-semibold text-[#74202D] mb-4">Saree Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn’t find the saree you were looking for. Please return to the shop and choose another beautiful saree.
          </p>
          <Link
            to="/shop"
            className="inline-block rounded-full bg-[#74202D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5c1b2b] transition"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({ title: product.title, text: content.description, url: window.location.href });
    }
  };
  const whatsappMessage = encodeURIComponent(`Hi, I am interested in the ${product.title} Saree.`);

  return (
    <div className="container min-h-screen bg-[#fffdfb] px-4 pb-16 pt-2 font-sans text-[#351b15] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-semibold text-[#6C2C12] hover:text-[#9a4322]">
          <HiOutlineArrowLeft /> Back to Products
        </Link>

        <div className="mt-5 flex flex-col lg:flex-row items-start gap-6">
          <section className="w-[40%]">
            <div className="relative aspect-[4/4.15] overflow-hidden rounded-md border border-[#eaded7] bg-[#f8efe9]">
              <motion.img
                key={selectedImage || product.img}
                src={selectedImage || product.img}
                alt={product.title}
                initial={{ opacity: 0.6, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-3 top-3 rounded-full bg-[#e9829a] px-2 py-1 text-[9px] font-bold uppercase text-white">
                {product.tag || "Handcrafted"}
              </span>
              <button onClick={toggleWishlist} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"} className="absolute right-3 top-3 rounded-full bg-white p-2 text-[#6C2C12] hover:text-white cursor-pointer transition-all duration-300 shadow-sm hover:bg-[#6C2C12]">
                <CiHeart className={`text-xl ${isWishlisted ? "fill-[#6C2C12]" : ""}`} />
              </button>
              <button aria-label="View product image" className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 text-[#6C2C12] shadow-sm">
                <CiSearch className="text-xl" />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {thumbnails.map((thumb, idx) => (
                <button key={`${thumb}-${idx}`} onClick={() => setSelectedImage(thumb)} className={`overflow-hidden rounded-sm border bg-white p-1 ${selectedImage === thumb && idx === 0 ? "border-[#6C2C12]" : "border-[#eaded7] hover:border-[#6C2C12]"}`}>
                  <img src={thumb} alt={`${product.title} thumbnail ${idx + 1}`} className="h-16 w-full object-cover" />
                </button>
              ))}
            </div>
          </section>

          <section className="w-[60%] pt-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b35d54]">{product.category[0]}</p>
            <h1 className="mt-1 text-3xl font-semibold leading-tight text-[#6C2C12] sm:text-4xl">{product.title} Saree</h1>
            <div className="mt-2 flex items-center gap-2 border-b border-[#eaded7] pb-3">
              <Rating rating={product.rating} />
              <span className="text-xs text-[#6b5149]">{product.rating}.0 ({product.ratings} reviews)</span>
            </div>
            <div className="flex items-center gap-3 border-b border-[#eaded7] py-3">
              <span className="text-2xl font-bold text-[#6C2C12]">₹{product.discountPrice}</span>
              <span className="text-sm text-gray-400 line-through">₹{product.actualPrice}</span>
              <span className="rounded bg-[#d6f5e5] px-2 py-1 text-[10px] font-semibold text-[#137747]">In Stock</span>
            </div>
            <div className="my-3 flex items-center gap-2 rounded-md border border-[#eaded7] bg-[#fffaf7] px-3 py-2 text-xs"><FiScissors className="text-[#6C2C12]" /><span><strong>Material:</strong> {content.material}</span></div>
            <p className="text-sm leading-5 text-[#5d4c46]">{content.description}</p>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <button onClick={handleAddToCart} disabled={cartIds.includes(product.id)} className="bg-[#6C2C12] px-2 py-2.5 text-[12px] rounded font-bold uppercase text-white border-2 border-[#6C2C12] hover:text-[#6C2C12] transition hover:bg-transparent disabled:cursor-not-allowed disabled:bg-gray-300 cursor-pointer">{cartIds.includes(product.id) ? "In Cart" : "Add to Cart"}</button>
              <a href={`https://wa.me/?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="bg-[#20c968] border-2 border-[#20c968] px-2 py-2.5 text-center text-[12px] font-bold text-white hover:text-[#20c968] transition hover:bg-transparent"><FaWhatsapp className="mr-1 inline text-[16px]" />Buy on WhatsApp</a>
              <a href="tel:+919999999999" className="bg-[#6C2C12] border-2 border-[#6C2C12] px-2 py-2.5 text-center text-[12px] font-bold text-white hover:text-[#6C2C12] transition hover:bg-transparent"><FaPhoneAlt className="mr-1 inline" />Call</a>
            </div>

            <div className="mt-3 border-y border-[#eaded7]">
              <div className="flex gap-5 overflow-x-auto text-[16px] font-semibold text-[#806a62]">
                {["Care & Craft", "Shipping & Gifting", "Custom Orders"].map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap border-b-2 py-2 ${activeTab === tab ? "border-[#6C2C12] text-[#6C2C12]" : "border-transparent"}`}>{tab}</button>)}
              </div>
              <div className="py-2 text-[14px] leading-5 text-[#5d4c46]">
                {activeTab === "Care & Craft" && <ul className="list-disc space-y-0.5 pl-4">{[content.care, ...content.highlights].slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>}
                {activeTab === "Shipping & Gifting" && <p>Carefully packed for safe delivery. Gift wrapping is available for celebrations and special occasions.</p>}
                {activeTab === "Custom Orders" && <p>Contact us for styling guidance, blouse pairing, and custom festive orders.</p>}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[16px] font-semibold uppercase text-[#9b5c51]">
              <FaShareAlt /> Share:
              <button onClick={shareProduct} aria-label="Share product" className="rounded-full border border-[#20b86a] p-1.5 text-[#20b86a] cursor-pointer hover:bg-[#20b86a] hover:text-white transition-all duration-300"><FaWhatsapp /></button>
              <button aria-label="Share on Instagram" className="rounded-full border border-[#e9829a] p-1.5 text-[#e9829a] cursor-pointer hover:bg-[#e9829a] hover:text-white transition-all duration-300"><FaInstagram /></button>
              <button aria-label="Share on Facebook" className="rounded-full border border-[#4285d4] p-1.5 text-[#4285d4] cursor-pointer hover:bg-[#4285d4] hover:text-white transition-all duration-300"><FaFacebookF /></button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SareeDetail;
