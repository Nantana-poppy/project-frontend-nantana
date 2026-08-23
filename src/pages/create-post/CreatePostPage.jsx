import { MenuBar } from "@/components/MenuBar";
import { useState } from "react";
import { Image, MapPin, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { mainApi } from "@/api/mainApi";
import uploadCloud from "@/utils/uploadCloud";

export default function CreatePostPage() {
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");

  // เก็บ URL ของรูปจาก Cloudinary
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // =========================
  // Upload Image
  // =========================
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    try {
      setUploading(true);

      const uploadedUrls = await Promise.all(
        files.map((file) => uploadCloud(file)),
      );

      // เพิ่ม URL ที่ได้จาก Cloudinary
      setImages((prev) => [...prev, ...uploadedUrls]);

      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    } catch (error) {
      console.error("Image upload error:", error.response?.data || error);

      toast.error("Failed to upload image");
    } finally {
      setUploading(false);

      // reset input เพื่อให้เลือกไฟล์เดิมซ้ำได้
      e.target.value = "";
    }
  };

  // =========================
  // Remove Image
  // =========================
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================
  // Create Post
  // =========================
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

      const response = await mainApi.post("/posts", {
        caption: caption.trim(),
        location: location.trim() || null,
        images,
      });

      console.log("Create post:", response.data);

      toast.success("Post created successfully");

      navigate("/community");
    } catch (error) {
      console.error("Create post error:", error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create post",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MenuBar />

      <div className="min-h-screen bg-[#f5f5f2] px-8 py-8">
        <div className="mx-auto max-w-4xl">
          {/* =========================
              Header
          ========================= */}
          <div className="mb-6 flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-4xl font-bold text-[#17211c]">Create Post</h1>

              <p className="mt-1 text-sm text-gray-500">
                Share your travel experience with the community.
              </p>
            </div>
          </div>

          {/* =========================
              Main Form
          ========================= */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >
            {/* =========================
                Photos
            ========================= */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Photos</h2>

                  <p className="text-xs text-gray-400">
                    Add photos from your trip
                  </p>
                </div>

                <span className="text-xs text-gray-400">
                  {images.length} photos
                </span>
              </div>

              {/* =========================
                  Image Preview
              ========================= */}
              {images.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {images.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="group relative aspect-square overflow-hidden rounded-2xl"
                    >
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* =========================
                  Upload
              ========================= */}
              <label
                className={`flex min-h-45 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-[#fafafa] transition ${
                  uploading
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:border-[#0F4C81] hover:bg-[#f7f9fb]"
                }`}
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#0F4C81]/10 text-[#0F4C81]">
                  <Image size={26} />
                </div>

                <p className="text-sm font-semibold text-gray-700">
                  {uploading ? "Uploading..." : "Add photos"}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {uploading ? "Please wait..." : "Click to upload photos"}
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
            </section>

            {/* =========================
                Caption
            ========================= */}
            <section className="mt-6">
              <label className="mb-2 block text-sm font-semibold">
                Caption
              </label>

              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Tell everyone about your trip..."
                maxLength={1000}
                rows={6}
                className="w-full resize-none rounded-2xl border border-gray-300 bg-[#fafafa] px-4 py-3 text-sm outline-none transition focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/10"
              />

              <div className="mt-1 flex justify-end">
                <span className="text-xs text-gray-400">
                  {caption.length} / 1000
                </span>
              </div>
            </section>

            {/* =========================
                Location
            ========================= */}
            <section className="mt-5">
              <label className="mb-2 block text-sm font-semibold">
                Location
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F4C81]"
                />

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where was this?"
                  className="h-12 w-full rounded-full border border-gray-300 bg-[#fafafa] pl-11 pr-4 text-sm outline-none transition focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/10"
                />
              </div>
            </section>

            {/* =========================
                Buttons
            ========================= */}
            <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || uploading}
                className="rounded-full bg-[#0F4C81] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#064174] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : loading
                    ? "Posting..."
                    : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
