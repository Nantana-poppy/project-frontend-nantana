import { MenuBar } from "@/components/MenuBar";
import { useState } from "react";
import { Image as ImageIcon, MapPin, X, ArrowLeft, Heart, MessageCircle, Send, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { mainApi } from "@/api/mainApi";
import uploadCloud from "@/utils/uploadCloud";
import useUserStore from "@/stores/userStore";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const uploadedUrls = await Promise.all(
        files.map((file) => uploadCloud(file)),
      );
      setImages((prev) => [...prev, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} photo(s) uploaded`);
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption.trim()) {
      toast.error("Please enter a caption");
      return;
    }

    if (uploading) {
      toast.error("Please wait for images to finish uploading");
      return;
    }

    try {
      setLoading(true);
      await mainApi.post("/posts", {
        caption: caption.trim(),
        location: location.trim() || null,
        images,
      });

      toast.success("Post created successfully");
      navigate("/community");
    } catch (error) {
      console.error("Create post error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create post"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf7] flex flex-col">
      <MenuBar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#385526] hover:border-[#385526]/30 transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Create a Post
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
              Share your travel story, tips, or memorable moments with the community.
            </p>
          </div>
        </div>

        {/* 2-Column Grid (Form + Live Preview) */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Form Section (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photos Upload */}
            <div className="rounded-[28px] bg-white p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-900">
                  Photos
                </label>
                <span className="text-[11px] text-gray-400">
                  {images.length} photos added
                </span>
              </div>

              {/* Preview Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((imgUrl, index) => (
                    <div
                      key={`${imgUrl}-${index}`}
                      className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 border border-gray-100 shadow-2xs"
                    >
                      <img
                        src={imgUrl}
                        alt={`Upload ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer hover:bg-black/80"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Drop Area */}
              <label
                className={`flex min-h-36 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-[#f8faf7] transition ${
                  uploading
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:border-[#385526]/40 hover:bg-[#f2f6f0]"
                }`}
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-2xs border border-gray-100 text-[#385526]">
                  <ImageIcon size={18} />
                </div>
                <p className="text-xs font-semibold text-gray-800">
                  {uploading ? "Uploading photos..." : "Add photos"}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  PNG, JPG, or WEBP (Multiple allowed)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Content & Location */}
            <div className="rounded-[28px] bg-white p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
              {/* Caption */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Caption <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What made this trip memorable? Share your experience, recommendations, or travel tips..."
                  maxLength={1000}
                  rows={5}
                  className="w-full rounded-2xl border border-gray-200 bg-white p-3.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#385526] focus:border-[#385526] transition resize-none"
                />
                <div className="flex justify-end mt-1">
                  <span className="text-[10px] text-gray-400">{caption.length} / 1000</span>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add location (e.g. Maya Bay, Krabi)"
                    className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#385526] focus:border-[#385526] transition"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="rounded-full bg-[#385526] hover:bg-[#2d451e] px-8 py-2.5 text-xs font-semibold text-white shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Publishing Post...</span>
                  </>
                ) : (
                  "Share Post"
                )}
              </button>
            </div>
          </div>

          {/* Right Preview Column (1 col) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 px-1">
              <Sparkles size={16} className="text-[#385526]" />
              <span>Live Feed Preview</span>
            </div>

            {/* Card Preview */}
            <div className="rounded-[28px] bg-white border border-gray-100 shadow-xs overflow-hidden opacity-95">
              {/* Author Header */}
              <div className="flex items-center gap-3 p-4">
                <img
                  src={
                    user?.profileImage ||
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                  }
                  alt="Me"
                  className="h-9 w-9 rounded-full object-cover border border-gray-100 shadow-2xs"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "You"}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    @{user?.username || "traveler"}
                  </p>
                </div>
              </div>

              {/* Photo Preview */}
              {images.length > 0 ? (
                <div className="bg-gray-50">
                  <img
                    src={images[0]}
                    alt="Preview"
                    className="max-h-60 w-full object-cover"
                  />
                  {images.length > 1 && (
                    <div className="p-2 text-center text-[11px] font-medium text-gray-500 bg-gray-50 border-t border-gray-100">
                      +{images.length - 1} more photos
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-40 bg-[#f8faf7] border-y border-gray-100 flex flex-col items-center justify-center text-gray-400 text-xs">
                  <ImageIcon size={24} className="mb-1 text-gray-300" />
                  <span>No photos attached yet</span>
                </div>
              )}

              {/* Content Preview */}
              <div className="p-4 space-y-2">
                <p className="text-xs text-gray-800 line-clamp-3 leading-relaxed">
                  {caption.trim() || "Your story and caption will appear here..."}
                </p>

                {location.trim() && (
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 pt-1">
                    <MapPin size={12} className="text-[#385526]" />
                    <span>{location}</span>
                  </div>
                )}

                {/* Mock Actions */}
                <div className="mt-3 flex items-center gap-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Heart size={15} />
                    <span>0</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={15} />
                    <span>0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
