import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiRotateCw, FiX } from "react-icons/fi";
import { API_BASE_URL } from "../../api/products";
import { useToast } from "../../context/ToastContext";
import ImageUploader from "../../components/admin/ImageUploader";

const Blog = () => {
  const { showToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Style Guide",
    readTime: "4 min read",
    summary: "",
    cover: `${API_BASE_URL}/images/silk/silk-1.jpg`,
  });

  const fetchBlog = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/blog`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load blog posts");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(
            data.map((p) => ({
              ...p,
              summary: p.excerpt || p.summary || "Traditional handloom drape guide.",
              cover: p.cover?.startsWith("http") ? p.cover : `${API_BASE_URL}${p.cover || "/images/silk/silk-1.jpg"}`,
              date: p.date || new Date(p.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
            }))
          );
        }
      })
      .catch(() => {
        showToast.error("Failed to load blog posts from MongoDB");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  const handleDelete = async (post) => {
    try {
      if (post._id) {
        await fetch(`${API_BASE_URL}/api/admin/blog/${post._id}`, { method: "DELETE" }).catch(() => {});
      }
      showToast.success(`Article "${post.title}" deleted.`);
    } catch {
      showToast.info(`Article deleted locally.`);
    }

    setPosts(posts.filter((p) => (p._id || p.id) !== (post._id || post.id)));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const newPost = {
      title: formData.title,
      author: "Eternal Vastra",
      excerpt: formData.summary,
      category: formData.category,
      readTime: formData.readTime,
      cover: formData.cover,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (res.ok) {
        const saved = await res.json();
        setPosts([
          {
            ...saved,
            summary: saved.excerpt || saved.summary,
            cover: saved.cover?.startsWith("http") ? saved.cover : `${API_BASE_URL}${saved.cover}`,
            date: "Today",
          },
          ...posts,
        ]);
        showToast.success(`Article "${newPost.title}" published in database!`);
      } else {
        setPosts([{ ...newPost, summary: newPost.excerpt, id: Date.now(), date: "Today" }, ...posts]);
        showToast.success(`Article "${newPost.title}" published.`);
      }
    } catch {
      setPosts([{ ...newPost, summary: newPost.excerpt, id: Date.now(), date: "Today" }, ...posts]);
      showToast.info(`Article "${newPost.title}" saved.`);
    }

    setIsModalOpen(false);
    setFormData({
      title: "",
      category: "Style Guide",
      readTime: "4 min read",
      summary: "",
      cover: `${API_BASE_URL}/images/silk/silk-1.jpg`,
    });
  };

  return (
    <div className="space-y-7 max-w-[1600px] mx-auto pb-12 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Editorial & Style Stories</h3>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Publish saree drape tutorials, bridal guides, and weaving heritage articles stored in MongoDB.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchBlog}
            className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh Articles"
          >
            <FiRotateCw className={`text-base ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-sm md:text-base font-semibold shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer"
          >
            <FiPlus className="text-lg" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id || post.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition"
          >
            <div className="relative h-52 bg-slate-100 overflow-hidden">
              <img
                src={post.cover}
                alt={post.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80";
                }}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-xs text-white text-xs font-bold">
                {post.category || "Editorial"}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
                  <span>{post.date || "24 Aug, 2026"}</span>
                  <span>{post.readTime || "4 min read"}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-base leading-snug">{post.title}</h4>
                <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => handleDelete(post)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Delete Article"
                >
                  <FiTrash2 className="text-base" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-7 border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-admin-scroll">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <h4 className="text-xl font-bold text-slate-900">New Article</h4>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 transition cursor-pointer">
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4 text-sm">
              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 Drapes for Festive Season"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">Summary</label>
                <textarea
                  rows="3"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-[#6B1527] focus:outline-none"
                />
              </div>

              <ImageUploader
                label="Article Cover Image"
                value={formData.cover}
                onChange={(url) => setFormData({ ...formData, cover: url })}
              />

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#6B1527] hover:bg-white border-2 border-[#6B1527] text-white text-sm font-semibold shadow-sm transition-all duration-300 hover:text-[#6B1527] cursor-pointer"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
