"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Save,
  X,
  Calendar,
  Sparkles,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { BlogPost } from "@/lib/blog";

interface AdminBlogManagerProps {
  initialPosts: BlogPost[];
  showToast: (message: string, type?: "success" | "error") => void;
}

const CATEGORY_OPTIONS = [
  "Discord Servers",
  "Anime",
  "Gaming",
  "Bots & Tools",
  "AI & Tech",
  "Growth",
  "Custom",
];

export default function AdminBlogManager({
  initialPosts,
  showToast,
}: AdminBlogManagerProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    slug: "",
    category: "Discord Servers",
    author: "DiscordServerLink Team",
    featuredImage: "",
    excerpt: "",
    content: "",
    published: true,
  });

  // Filter posts
  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({
      id: "",
      title: "",
      slug: "",
      category: "Discord Servers",
      author: "DiscordServerLink Team",
      featuredImage: "",
      excerpt: "",
      content: "",
      published: true,
    });
    setShowModal(true);
  };

  const openEditModal = (post: BlogPost) => {
    setIsEditing(true);
    setFormData({
      id: String(post.id),
      title: post.title,
      slug: post.slug,
      category: post.category || "Discord Servers",
      author: post.author || "DiscordServerLink Team",
      featuredImage: post.featuredImage || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      published: post.published ?? true,
    });
    setShowModal(true);
  };

  const handleTitleChange = (newTitle: string) => {
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      // Auto-generate slug if creating new
      slug: !isEditing
        ? newTitle
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
        : prev.slug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      showToast("Title and content are required.", "error");
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        // PUT update
        const res = await fetch(`/api/admin/blog/${encodeURIComponent(formData.id || formData.slug)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
          setPosts((prev) =>
            prev.map((p) =>
              String(p.id) === String(formData.id) || p.slug === formData.slug
                ? { ...p, ...data.post }
                : p
            )
          );
          showToast(`Article "${formData.title}" updated successfully!`);
          setShowModal(false);
        } else {
          showToast(data.error || "Failed to update article.", "error");
        }
      } else {
        // POST create
        const res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
          setPosts((prev) => [data.post, ...prev]);
          showToast(`Article "${formData.title}" published successfully!`);
          setShowModal(false);
        } else {
          showToast(data.error || "Failed to publish article.", "error");
        }
      }
    } catch (err: any) {
      showToast("Network error: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(post.id);
    try {
      const res = await fetch(`/api/admin/blog/${encodeURIComponent(post.id || post.slug)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) =>
          prev.filter((p) => String(p.id) !== String(post.id) && p.slug !== post.slug)
        );
        showToast(`Article "${post.title}" deleted.`);
      } else {
        showToast(data.error || "Failed to delete article.", "error");
      }
    } catch {
      showToast("Network error while deleting.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-discord-blurple/10 text-discord-blurple border border-discord-blurple/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Blog & Articles Management</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Publish new guides, edit existing articles, upload thumbnails, and manage SEO rankings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold shadow-glow-sm hover:shadow-glow transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish New Article</span>
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, slug, or tag..."
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="text-xs text-zinc-400 flex items-center gap-2">
          <span>Total Published:</span>
          <span className="font-mono font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">
            {posts.length} Guides
          </span>
        </div>
      </div>

      {/* Articles Table / List */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Article</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Published Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  const isDeleting = deletingId === post.id;
                  const dateStr = new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr
                      key={post.slug}
                      className="hover:bg-zinc-800/30 transition-colors group"
                    >
                      {/* Title & Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.featuredImage}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover bg-zinc-800 border border-zinc-700 shrink-0"
                          />
                          <div className="min-w-0 max-w-sm sm:max-w-md">
                            <h4 className="font-bold text-white group-hover:text-discord-blurple transition-colors truncate">
                              {post.title}
                            </h4>
                            <p className="text-[11px] font-mono text-zinc-500 truncate">
                              /blog/{post.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {post.category || "Discord Servers"}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="py-3 px-4 text-zinc-300 whitespace-nowrap">
                        {post.author}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                        {dateStr}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                            title="View Live Article"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => openEditModal(post)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-discord-blurple text-zinc-400 hover:text-white transition-colors"
                            title="Edit Article"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(post)}
                            disabled={isDeleting}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500 text-xs">
                    No articles found matching &ldquo;{searchQuery}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create / Edit Article */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-md px-6 py-4 border-b border-zinc-800 flex items-center justify-between z-10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-discord-blurple" />
                <span>{isEditing ? "Edit Article" : "Publish New Article"}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-zinc-400">
                  Article Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Best Discord Anime Servers 2026"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
                />
              </div>

              {/* Slug & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold uppercase tracking-wider text-zinc-400">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="e.g. best-discord-anime-servers"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
                  />
                  <p className="text-[10px] text-zinc-500">
                    Will be available at /blog/{formData.slug || "slug"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold uppercase tracking-wider text-zinc-400">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-discord-blurple"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Author & Thumbnail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold uppercase tracking-wider text-zinc-400">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="DiscordServerLink Team"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold uppercase tracking-wider text-zinc-400">
                    Featured Image URL (.webp / .png)
                  </label>
                  <input
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) =>
                      setFormData({ ...formData, featuredImage: e.target.value })
                    }
                    placeholder="https://discordserverlink.com/wp-content/uploads/..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-zinc-400">
                  Short Excerpt (SEO Meta Description)
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="A concise summary of the article for Google search results and preview cards..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
                />
              </div>

              {/* Content / Body */}
              <div className="space-y-1.5">
                <label className="block font-bold uppercase tracking-wider text-zinc-400">
                  Article Content (HTML / Markdown) <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={10}
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Paste or write HTML content with <p>, <h2>, <h3>, <ul>, <li>, <table>, etc."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-discord-blurple hover:bg-discord-hover disabled:opacity-50 text-white font-bold text-xs shadow-glow-sm transition"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{isEditing ? "Save Changes" : "Publish Article"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
