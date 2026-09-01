import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiClock,
  FiUser,
  FiArrowLeft,
  FiShare2,
  FiHeart,
  FiBookmark,
  FiCheckCircle,
  FiChevronRight,
  FiTag,
  FiShoppingBag,
  FiEye,
} from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaWhatsapp, FaPinterestP } from "react-icons/fa";
import { API_BASE_URL } from "../api/products";
import { useToast } from "../context/ToastContext";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    fetch(`${API_BASE_URL}/api/admin/blog`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load blog post");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllPosts(data);
          // Find article by _id, id, or slug
          const found = data.find(
            (p) => String(p._id) === String(id) || String(p.id) === String(id) || p.slug === id
          ) || data[0];
          setPost(found);
          setLikeCount(found.likes || 88);
        }
      })
      .catch(() => {
        showToast.error("Failed to load article from server");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
      showToast.success("Thanks for your appreciation!");
    } else {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Read "${post?.title}" on Eternal Vastra:`;
    if (platform === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
    } else {
      navigator.clipboard?.writeText(url);
      showToast.success("Article link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#FEFAF8] min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#6B1527] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-600">Loading saree story & drape tutorial...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-[#FEFAF8] min-h-screen flex items-center justify-center py-20">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">Article Not Found</h2>
          <p className="text-sm text-slate-500 mt-2">The saree guide or article you are looking for is no longer available.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-[#6B1527] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#520F1E] transition"
          >
            <FiArrowLeft />
            <span>Return to All Stories</span>
          </Link>
        </div>
      </div>
    );
  }

  const relatedStories = allPosts
    .filter((p) => String(p._id || p.id) !== String(post._id || post.id))
    .slice(0, 3);

  return (
    <article className="bg-[#FEFAF8] min-h-screen text-slate-800 pb-24">
      {/* ========================================================================= */}
      {/* 1. TOP BREADCRUMB & HEADER */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-b from-[#F9EFE8] to-[#FEFAF8] border-b border-rose-100/60 pt-6 pb-12">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Back link + Breadcrumb */}
          <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-500 mb-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-[#6B1527] hover:underline font-bold"
            >
              <FiArrowLeft className="text-sm" />
              <span>Back to Stories</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <Link to="/" className="hover:text-slate-900">Home</Link>
              <FiChevronRight className="text-[10px]" />
              <Link to="/blog" className="hover:text-slate-900">Blog</Link>
              <FiChevronRight className="text-[10px]" />
              <span className="text-[#6B1527] truncate max-w-[200px]">{post.category}</span>
            </div>
          </div>

          {/* Category Tag */}
          <div className="mb-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#6B1527] text-white text-xs font-bold uppercase tracking-wider shadow-xs">
              {post.category || "Saree Guides"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 leading-[1.2] tracking-tight">
            {post.title}
          </h1>

          {/* Excerpt / Lead */}
          {post.excerpt && (
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mt-4">
              {post.excerpt}
            </p>
          )}

          {/* Metadata & Author Bar */}
          <div className="mt-8 pt-6 border-t border-rose-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={
                  post.authorAvatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                }
                alt={post.author}
                className="w-11 h-11 rounded-full object-cover border-2 border-rose-200 shadow-xs"
              />
              <div>
                <span className="font-bold text-sm text-slate-900 block leading-tight">{post.author}</span>
                <span className="text-xs text-slate-500">{post.authorRole || "Textile Specialist & Saree Curator"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
              <span>{post.date || "Aug 18, 2026"}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FiClock />
                {post.readTime || "5 min read"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FiEye />
                {post.views || 1240} views
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO COVER IMAGE */}
      {/* ========================================================================= */}
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 -mt-4 mb-12">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
          <img
            src={
              post.cover?.startsWith("http")
                ? post.cover
                : post.cover
                ? `${API_BASE_URL}${post.cover}`
                : "/images/silk/silk-1.jpg"
            }
            alt={post.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=80";
            }}
            className="w-full h-80 sm:h-[450px] object-cover object-center"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN ARTICLE CONTENT */}
      {/* ========================================================================= */}
      <div className="container max-w-3xl mx-auto px-4 sm:px-6 space-y-10 text-slate-700 leading-relaxed">
        
        {/* Quote Block if available */}
        {post.quote && (
          <div className="p-6 sm:p-8 bg-gradient-to-r from-rose-50 to-[#FDF4EC] rounded-3xl border-l-4 border-[#6B1527] shadow-xs">
            <span className="text-4xl text-[#6B1527] font-serif leading-none block mb-1">“</span>
            <p className="text-lg sm:text-xl font-serif italic text-slate-800 font-medium leading-relaxed">
              {post.quote}
            </p>
            <div className="mt-3 text-xs font-bold uppercase tracking-wider text-[#6B1527]">
              — {post.quoteAuthor || post.author}
            </div>
          </div>
        )}

        {/* Dynamic Sections */}
        {post.sections && post.sections.length > 0 ? (
          post.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight">
                {section.heading}
              </h2>
              <p className="text-base sm:text-[17px] leading-relaxed text-slate-700">
                {section.paragraph}
              </p>

              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="space-y-2.5 pt-2 pl-2">
                  {section.bulletPoints.map((bp, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-3 text-sm sm:text-base">
                      <FiCheckCircle className="text-[#6B1527] text-lg flex-shrink-0 mt-0.5" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))
        ) : (
          <div className="space-y-6 text-base sm:text-lg">
            <p>
              Handcrafted Indian sarees embody a confluence of centuries-old weaving traditions, sacred ritual motifs, and unparalleled artisanal pride. From the master weavers of Varanasi threading pure silver zari to the intricate peacock motifs of Paithan, every drape celebrates the soul of Indian handlooms.
            </p>
            <p>
              When styling an authentic saree, precision in pleat uniformity, fabric weight balance, and complementary antique jewelry transforms six yards into an unforgettable personal statement.
            </p>
          </div>
        )}

        {/* Pro Tips Box */}
        {post.tips && post.tips.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200/80 shadow-md space-y-4">
            <div className="flex items-center gap-2.5 text-[#6B1527] font-bold text-base sm:text-lg">
              <span className="text-xl">✨</span>
              <h3>Curator's Pro Tips & Recommendations</h3>
            </div>
            <ul className="space-y-3">
              {post.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-[#6B1527] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags Section */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-200 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-2">
              <FiTag /> Tags:
            </span>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-rose-50 hover:text-[#6B1527] transition"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share & Like Action Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                liked
                  ? "bg-rose-50 border-[#6B1527] text-[#6B1527]"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-[#6B1527]"
              }`}
            >
              <FiHeart className={`text-base ${liked ? "fill-[#6B1527]" : ""}`} />
              <span>{liked ? "Liked!" : "Appreciate"} ({likeCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Share:</span>
            <button
              onClick={() => handleShare("whatsapp")}
              className="w-9 h-9 rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Share on WhatsApp"
            >
              <FaWhatsapp className="text-base" />
            </button>
            <button
              onClick={() => handleShare("facebook")}
              className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Share on Facebook"
            >
              <FaFacebookF className="text-sm" />
            </button>
            <button
              onClick={() => handleShare("twitter")}
              className="w-9 h-9 rounded-full bg-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Share on Twitter"
            >
              <FaTwitter className="text-sm" />
            </button>
            <button
              onClick={() => handleShare("copy")}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 hover:bg-[#6B1527] hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Copy Link"
            >
              <FiShare2 className="text-sm" />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. SHOP THE STORY / RELATED SAREES BANNER */}
      {/* ========================================================================= */}
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 mt-16">
        <div className="bg-gradient-to-r from-[#6B1527] to-[#450C16] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
              — Curated Collection —
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold leading-tight">
              Ready to Wear the Heritage?
            </h3>
            <p className="text-sm text-rose-200/90 max-w-md">
              Discover pure handloom Kanjivarams, Paithanis, and lightweight Chanderi sarees handcrafted by master artisans.
            </p>
          </div>

          <Link
            to="/shop"
            className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-amber-100 text-[#6B1527] font-bold text-sm transition shadow-lg cursor-pointer"
          >
            <FiShoppingBag className="text-base" />
            <span>Explore Handlooms</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. RELATED STORIES CAROUSEL / GRID */}
      {/* ========================================================================= */}
      {relatedStories.length > 0 && (
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 mt-20">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-8">
            <h3 className="text-2xl font-serif font-bold text-slate-900">More Inspiring Stories</h3>
            <Link to="/blog" className="text-xs font-bold uppercase tracking-wider text-[#6B1527] hover:underline">
              View All Stories →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedStories.map((rel) => (
              <article
                key={rel._id || rel.id}
                className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between transition group"
              >
                <div>
                  <Link to={`/blog/${rel._id || rel.id}`}>
                    <div className="relative h-80 bg-slate-100 overflow-hidden">
                      <img
                        src={
                          rel.cover?.startsWith("http")
                            ? rel.cover
                            : rel.cover
                            ? `${API_BASE_URL}${rel.cover}`
                            : "/images/silk/silk-2.jpg"
                        }
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      />
                      <span className="absolute bottom-3 left-3 bg-[#F6E6D8]/95 text-[#6B1527] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-xs border border-[#E9D1BE]">
                        {rel.category || "Style Guide"}
                      </span>
                    </div>
                  </Link>

                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                      <span>{rel.date || "Aug 2026"}</span>
                      <span>{rel.readTime || "5 min read"}</span>
                    </div>

                    <Link to={`/blog/${rel._id || rel.id}`}>
                      <h4 className="font-serif font-bold text-slate-900 text-base leading-snug group-hover:text-[#6B1527] transition line-clamp-2">
                        {rel.title}
                      </h4>
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-2">
                      {rel.excerpt || rel.summary}
                    </p>
                  </div>
                </div>

                <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">{rel.author}</span>
                  <Link
                    to={`/blog/${rel._id || rel.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#6B1527] group-hover:translate-x-1 transition"
                  >
                    <span>Read More</span>
                    <FiChevronRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogDetail;
