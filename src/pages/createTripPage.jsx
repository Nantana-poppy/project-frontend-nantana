import { mainApi } from "@/api/mainApi";
import { MenuBar } from "@/components/MenuBar";
import { useCategoryStore } from "@/stores/categoryStore";
import {
  Image as ImageIcon,
  CalendarDays,
  Users,
  Plus,
  Minus,
  CircleDollarSign,
  MapPin,
  Sparkles,
  ArrowLeft,
  Info,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import uploadCloud from "@/utils/uploadCloud";
import { toast } from "react-toastify";

const CreateTripPage = () => {
  const navigate = useNavigate();
  const category = useCategoryStore((state) => state.category);
  const fetchCategories = useCategoryStore((state) => state.fetchCategory);

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    categoryId: "",
    startDate: "",
    endDate: "",
    maxMember: 4,
    description: "",
    budget: "",
  });

  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const increaseMember = () => {
    setFormData((prev) => ({
      ...prev,
      maxMember: prev.maxMember + 1,
    }));
  };

  const decreaseMember = () => {
    setFormData((prev) => ({
      ...prev,
      maxMember: Math.max(1, prev.maxMember - 1),
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const imageUrl = await uploadCloud(file);
      setImage(imageUrl);
      toast.success("Cover photo uploaded");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.destination.trim() || !formData.categoryId) {
      toast.error("Please fill in all required fields (Title, Destination, Category)");
      return;
    }

    try {
      setLoading(true);
      const response = await mainApi.post("/trips", {
        title: formData.title,
        destination: formData.destination,
        categoryId: Number(formData.categoryId),
        startDate: formData.startDate,
        endDate: formData.endDate,
        maxMember: Number(formData.maxMember),
        description: formData.description,
        budget: Number(formData.budget) || 0,
        image: image,
      });

      toast.success("Trip created successfully!");
      navigate(`/trip-detail/${response.data?.data?.id || ""}`);
    } catch (error) {
      console.error("Create trip error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create trip"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf7] flex flex-col">
      <MenuBar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col gap-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
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
                Create a Trip
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
                Share your journey and find people to travel with.
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Form Layout */}
        <form onSubmit={handleCreateTrip} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="rounded-[28px] bg-white p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-1">
                <Sparkles size={18} className="text-[#385526]" />
                <span>Trip Information</span>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Trip Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Weekend Roadtrip to Chiang Mai"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#385526] focus:border-[#385526] transition"
                />
              </div>

              {/* Destination & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Destination <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="Province, Country"
                      className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#385526] focus:border-[#385526] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 outline-none focus:ring-1 focus:ring-[#385526] focus:border-[#385526] transition cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {category.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Description & Plan
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell potential travel buddies about the plan, activities, vibe, and what kind of people you'd love to invite..."
                  className="w-full rounded-2xl border border-gray-200 bg-white p-3.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#385526] focus:border-[#385526] transition resize-none"
                />
              </div>
            </div>

            {/* Schedule & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Dates */}
              <div className="rounded-[28px] bg-white p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 mb-3">
                  <CalendarDays size={16} className="text-[#385526]" />
                  <span>Travel Dates</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-[11px] text-gray-500 font-medium block mb-1">Start</span>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#385526]"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 font-medium block mb-1">End</span>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#385526]"
                    />
                  </div>
                </div>
              </div>

              {/* Members Stepper */}
              <div className="rounded-[28px] bg-white p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 mb-3">
                  <Users size={16} className="text-[#385526]" />
                  <span>Max Members</span>
                </div>
                <div className="flex flex-col items-center justify-center my-auto">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={decreaseMember}
                      className="h-8 w-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-xl font-bold text-gray-900 w-10 text-center">
                      {formData.maxMember}
                    </span>
                    <button
                      type="button"
                      onClick={increaseMember}
                      className="h-8 w-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-2">Including yourself</span>
                </div>
              </div>

              {/* Budget */}
              <div className="rounded-[28px] bg-white p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 mb-3">
                  <CircleDollarSign size={16} className="text-[#385526]" />
                  <span>Estimated Budget (฿)</span>
                </div>
                <div className="my-auto">
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g. 5000"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#385526] focus:border-[#385526] transition"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">Approx. cost per person</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Upload & Action (1 col) */}
          <div className="space-y-6">
            {/* Cover Photo */}
            <div className="rounded-[28px] bg-white p-6 border border-gray-100 shadow-xs">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                <ImageIcon size={18} className="text-[#385526]" />
                <span>Cover Photo</span>
              </div>

              <label className="relative flex min-h-60 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-[#f8faf7] hover:bg-[#f2f6f0] hover:border-[#385526]/40 transition group">
                {image ? (
                  <>
                    <img
                      src={image}
                      alt="Trip cover"
                      className="h-full w-full object-cover min-h-60"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                      Click to change photo
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-white shadow-2xs border border-gray-100 flex items-center justify-center text-[#385526] mb-2 group-hover:scale-110 transition-transform">
                      <ImageIcon size={22} />
                    </div>
                    <p className="text-xs font-semibold text-gray-800">
                      {uploading ? "Uploading photo..." : "Upload cover image"}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      PNG, JPG, or WEBP (Landscape)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Publishing Box */}
            <div className="rounded-[28px] bg-white p-6 border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#f2f6f0] text-xs text-[#2d451e] border border-[#385526]/10">
                <Info size={16} className="shrink-0 text-[#385526] mt-0.5" />
                <span>Your trip will be published to the Explore feed and members will be able to request to join.</span>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="w-full rounded-xl bg-[#385526] hover:bg-[#2d451e] py-3 text-xs font-semibold text-white shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Publishing Trip...</span>
                    </>
                  ) : (
                    "Publish Trip"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer text-center"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateTripPage;
