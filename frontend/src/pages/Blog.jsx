import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FiSearch,
  FiClock,
  FiGrid,
  FiList,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiRotateCw,
} from "react-icons/fi";
import { API_BASE_URL } from "../api/products";

const categories = [
  "All Stories",
  "Saree Guides",
  "Styling Tips",
  "Weaves & Fabrics",
  "Care & Maintenance",
  "Traditions",
  "Behind The Scenes",
];

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Stories");
  const [sortBy, setSortBy] = useState("Latest");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();

  const POSTS_PER_PAGE = 8;

  const fetchBlogPosts = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/blog`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load blog posts");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(
            data.map((p, idx) => ({
              id: p._id || p.id || String(idx + 1),
              title: p.title,
              slug: p.slug || `post-${idx + 1}`,
              category: p.category || "Saree Guides",
              author: p.author || "Eternal Vastra",
              authorRole: p.authorRole || "Textile Specialist",
              authorAvatar:
                p.authorAvatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
              date: p.date || "Aug 18, 2026",
              readTime: p.readTime || "5 min read",
              cover: p.cover?.startsWith("http")
                ? p.cover
                : p.cover
                  ? `${API_BASE_URL}${p.cover}`
                  : `/images/silk/silk-${(idx % 4) + 1}.jpg`,
              excerpt: p.excerpt || p.summary || "Traditional handloom drape and care guide.",
              views: p.views || 1200,
              likes: p.likes || 80,
            }))
          );
        }
      })
      .catch(() => {
        // use fallback if offline
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Filtering & Sorting
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    // Filter by Category
    if (selectedCategory !== "All Stories") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.excerpt?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query) ||
          p.author?.toLowerCase().includes(query)
      );
    }

    // Sorting
    if (sortBy === "Latest") {
      // Keep default recent order or sort
      result.sort((a, b) => (b.id > a.id ? 1 : -1));
    } else if (sortBy === "Oldest") {
      result.sort((a, b) => (a.id > b.id ? 1 : -1));
    } else if (sortBy === "Most Popular") {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    return result;
  }, [posts, selectedCategory, search, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredAndSortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredAndSortedPosts, currentPage]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const scrollToTopStories = () => {
    const el = document.getElementById("stories-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#FEFAF8] min-h-screen text-slate-800 pb-20">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER SECTION (MATCHING SCREENSHOT) */}
      {/* ========================================================================= */}
      <section className="bg-[url('/images/banner/banner-4.png')] bg-cover bg-center h-60 w-full 
<<<<<<< HEAD
      flex items-center px-5 relative overflow-hidden">
=======
      flex items-center px-5 md:px-16 lg:px-24 relative overflow-hidden">
>>>>>>> 64d6d1144c03d9eb5691cc2bdd6429646a9075ae
        <div className="container max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-6 spaxe-y-5 text-center lg:text-left">
              <div className="inline-flex items-center mb-3 gap-2 text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#6B1527]">
                <span>🌸</span>
                <span>SAREE STORIES</span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-slate-900 leading-[1.15] tracking-tight">
                Timeless Weaves, <br />
                <span className="text-[#6B1527] font-serif">Stories That Inspire</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SEARCH & FILTER CONTROLS (MATCHING SCREENSHOT) */}
      {/* ========================================================================= */}
      <section id="stories-section" className="container max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-10">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">

          {/* Top Row: Search Input + Sort Dropdown + Grid/List Toggle */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

            {/* Search Box */}
            <div className="relative flex-1 max-w-xl">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search articles, tips, patterns..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#6B1527] focus:bg-white transition"
              />
            </div>

            {/* Controls Right */}
            <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="text-slate-500 whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#6B1527] cursor-pointer"
                >
                  <option value="Latest">Latest</option>
                  <option value="Most Popular">Most Popular</option>
                  <option value="Oldest">Oldest</option>
                </select>
              </div>

              {/* View Switcher: Grid vs List */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${viewMode === "grid"
                      ? "bg-[#6B1527] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                  title="Grid View"
                >
                  <FiGrid className="text-sm" />
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${viewMode === "list"
                      ? "bg-[#6B1527] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                  title="List View"
                >
                  <FiList className="text-sm" />
                  <span>List</span>
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Row: Category Pills (All Stories, Saree Guides, Styling Tips, ...) */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto custom-admin-scroll pb-1">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${isSelected
                      ? "bg-[#6B1527] text-white shadow-xs font-bold"
                      : "bg-white text-slate-700 hover:bg-rose-50 hover:text-[#6B1527] border border-slate-200/90"
                    }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. STORIES LISTING (GRID OR LIST VIEW) */}
      {/* ========================================================================= */}
      <section className="container max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-8">
        {loading ? (
          <div className="py-24 text-center">
            <FiRotateCw className="animate-spin text-3xl text-[#6B1527] mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">Loading stories and guides from MongoDB...</p>
          </div>
        ) : paginatedPosts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto">
            <h3 className="text-xl font-bold text-slate-800">No Articles Found</h3>
            <p className="text-xs text-slate-500 mt-2">
              We couldn't find any stories matching "{search}". Try searching for another keyword or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All Stories");
              }}
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#6B1527] text-white text-xs font-semibold hover:bg-[#520F1E] transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* 4-Column Grid View matching screenshot */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 group"
              >
                {/* Card Top: Image + Category Pill */}
                <div>
                  <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden cursor-pointer">
                    <img
                      src={post.cover}
                      alt={post.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-3 left-3 bg-[#F6E6D8]/95 text-[#6B1527] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-xs border border-[#E9D1BE]">
                      {post.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                      <span>{post.date}</span>
                      <span className="flex items-center gap-1">
                        <FiClock className="text-xs" />
                        {post.readTime}
                      </span>
                    </div>

                    <Link to={`/blog/${post.id}`}>
                      <h3 className="font-serif font-bold text-slate-900 text-base leading-snug group-hover:text-[#6B1527] transition line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-[13px] text-slate-500 line-clamp-2 leading-relaxed mt-2.5">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Author & Read More */}
                <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
                      }}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-xs font-semibold text-slate-800 truncate max-w-[90px]">
                      {post.author}
                    </span>
                  </div>

                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#6B1527] group-hover:translate-x-1 transition"
                  >
                    <span>Read More</span>
                    <FiArrowRight className="text-xs" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* List View Mode */
          <div className="space-y-4">
            {paginatedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-all duration-300 group"
              >
                <div className="md:w-72 relative h-48 md:h-auto bg-slate-100 flex-shrink-0 overflow-hidden">
                  <img
                    src={post.cover}
                    alt={post.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-3 left-3 bg-[#F6E6D8]/95 text-[#6B1527] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-xs border border-[#E9D1BE]">
                    {post.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-2 font-medium">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FiClock className="text-xs" />
                        {post.readTime}
                      </span>
                    </div>

                    <Link to={`/blog/${post.id}`}>
                      <h3 className="font-serif font-bold text-slate-900 text-lg sm:text-xl leading-snug group-hover:text-[#6B1527] transition">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block leading-tight">{post.author}</span>
                        <span className="text-[10px] text-slate-400">{post.authorRole}</span>
                      </div>
                    </div>

                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-50 text-xs font-bold text-[#6B1527] hover:bg-[#6B1527] hover:text-white transition"
                    >
                      <span>Read Story</span>
                      <FiArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. PAGINATION CONTROLS (MATCHING SCREENSHOT) */}
        {/* ========================================================================= */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer text-sm font-semibold"
              title="Previous Page"
            >
              <FiChevronLeft />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => {
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    scrollToTopStories();
                  }}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition cursor-pointer ${isActive
                      ? "bg-[#6B1527] text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-[#6B1527]"
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer text-sm font-semibold"
              title="Next Page"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;
