import { useState } from "react";
import { X, Image as ImageIcon, MapPin, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import { mainApi } from "@/api/mainApi";
import uploadCloud from "@/utils/uploadCloud";

export default function EditPostModal({ isOpen, onClose, post, onSuccess }) {
  if (!isOpen || !post) return null;

  return (
    <EditPostModalContent
      key={post.id}
      onClose={onClose}
      post={post}
      onSuccess={onSuccess}
    />
  );
}

function EditPostModalContent({ onClose, post, onSuccess }) {
  const [caption, setCaption] = useState(post.caption || "");
  const [location, setLocation] = useState(post.location || "");
  const [images, setImages] = useState(
    post.images?.map((img) => (typeof img === "string" ? img : img.imageUrl)) || []
  );
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const uploadedUrls = await Promise.all(
        files.map((file) => uploadCloud(file))
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
      toast.error("Caption cannot be empty");
      return;
    }

    if (uploading) {
      toast.error("Please wait for images to finish uploading");
      return;
    }

    try {
      setLoading(true);
      const response = await mainApi.patch(`/posts/${post.id}`, {
        caption: caption.trim(),
        location: location.trim() || null,
        images,
      });

      toast.success("Post updated successfully");
      if (onSuccess) {
        onSuccess(response.data.data);
      }
      onClose();
    } catch (error) {
      console.error("Update post error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update post"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-7 shadow-2xl transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#f2f6f0] flex items-center justify-center text-[#385526]">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Edit Post</h3>
              <p className="text-[11px] text-gray-400">Update your story, caption, or photos</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition cursor-pointer disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Photos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-700">Photos</label>
              <span className="text-[11px] text-gray-400">{images.length} photos</span>
            </div>

            {/* Photos Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2.5">
                {images.map((imgUrl, index) => (
                  <div
                    key={`${imgUrl}-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 border border-gray-200"
                  >
                    <img
                      src={imgUrl}
                      alt={`Photo ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-1.5 top-1.5 h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer hover:bg-red-600"
                      title="Remove photo"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add photos button / dropzone */}
            <label
              className={`flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-[#f8faf7] p-3 text-xs font-medium text-[#385526] transition ${
                uploading
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:bg-[#f2f6f0] hover:border-[#385526]/40"
              }`}
            >
              <ImageIcon size={16} />
              <span>{uploading ? "Uploading..." : "+ Add photos"}</span>
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

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Caption <span className="text-red-500">*</span>
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What made this trip memorable? Share your experience..."
              rows={4}
              maxLength={1000}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#385526] focus:border-[#385526] transition resize-none"
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
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location (e.g. Maya Bay, Krabi)"
                className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#385526] focus:border-[#385526] transition"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-full border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="rounded-full bg-[#385526] hover:bg-[#2d451e] px-6 py-2 text-xs font-semibold text-white shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

