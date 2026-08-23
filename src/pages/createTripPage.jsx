import { mainApi } from "@/api/mainApi";
import { MenuBar } from "@/components/MenuBar";
import { useCategoryStore } from "@/stores/categoryStore";
import {
  Image,
  CalendarDays,
  Users,
  Plus,
  Minus,
  FileText,
  CircleDollarSign,
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

  const handleCreateTrip = async (e) => {
    e.preventDefault();

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
        budget: Number(formData.budget),
        image: image,
      });

      console.log("Created trip:", response.data.data);

      // เมื่อกด Create เสร็จกลับไปหน้า MainPage แล้วจะเห้นทริปที่สร้างเด้งขึ้นมาอันแรกเพราะ
      // ใน dataBase เซ็ตไว้ว่า
      navigate("/");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const imageUrl = await uploadCloud(file);
      setImage(imageUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <MenuBar />
      <form onSubmit={handleCreateTrip}>
        <div>
          <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-screen">
              {/* Header */}
              <div className="mb-7">
                <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                  Create a Trip
                </h1>

                <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500">
                  Share your adventure and find people to travel with. Craft a
                  compelling journey to attract fellow explorers.
                </p>
              </div>

              {/* Cover Image */}
              <section className="rounded-3xl p-5 modern-card">
                <div className="mb-3 flex items-center gap-1.5 text-md font-semibold text-primary">
                  <Image size={20} strokeWidth={2} />
                  Cover Image
                </div>

                <label className="flex h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-gray-50 transition hover:bg-gray-100">
                  {image ? (
                    <img
                      src={image}
                      alt="Trip cover"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="mb-2 text-gray-400">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <path d="M12 16V4" />
                          <path d="M7 9l5-5 5 5" />
                          <path d="M5 20h14" />
                        </svg>
                      </div>

                      <p className="text-xs font-medium text-gray-500">
                        Drag and drop an image, or{" "}
                        <span className="text-primary">browse</span>
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        High-resolution photos are recommended
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {uploading && (
                  <p className="mt-2 text-center text-sm text-gray-400">
                    Uploading image...
                  </p>
                )}
              </section>

              {/* Basic Info */}
              <section className="mt-5 rounded-3xl p-5 modern-card">
                <div className="mb-4 flex items-center gap-1.5 text-md font-semibold text-primary">
                  <span className="text-md">ⓘ</span>
                  Basic Info
                </div>

                <div className="space-y-4">
                  {/* Trip Title */}
                  <div>
                    <label className="mb-1.5 block text-md font-medium text-gray-600">
                      Trip Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Weekend Hiking in the Alps"
                      className="h-10 w-full rounded-full input-modern px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                    />
                  </div>

                  {/* Destination + Category */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-md font-medium text-gray-600">
                        Destination
                      </label>
                      <div>
                        <input
                          type="text"
                          name="destination"
                          value={formData.destination}
                          onChange={handleChange}
                          placeholder="City, Country"
                          className="h-10 w-full rounded-full input-modern pl-9 pr-6 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-md font-medium text-gray-600">
                        Category
                      </label>
                      <div>
                        <select
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleChange}
                          className="h-10 w-full appearance-none rounded-full input-modern pl-9 pr-9 text-sm text-gray-600 outline-none"
                        >
                          <option value="" disabled>
                            Select Category
                          </option>
                          {category.map((value) => (
                            <option key={value.id} value={value.id}>
                              {value.name}
                            </option>
                          ))}
                        </select>

                        <svg
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Dates + Group Info */}
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {/* Dates */}
                <section className="rounded-3xl p-5 modern-card">
                  <div className="mb-4 flex items-center gap-1.5 text-md font-semibold text-primary">
                    <CalendarDays size={14} />
                    Dates
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-600">
                        Start
                      </label>

                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="h-9 w-full rounded-full input-modern px-3 text-sm text-gray-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-600">
                        End
                      </label>

                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="h-9 w-full rounded-full input-modern px-3 text-sm text-gray-500 outline-none"
                      />
                    </div>
                  </div>
                </section>

                {/* Group Info */}
                <section className="rounded-3xl p-5 modern-card">
                  <div className="mb-4 flex items-center gap-1.5 text-md font-semibold text-primary">
                    <Users size={14} />
                    Group Info
                  </div>

                  <label className="mb-1.5 block text-sm font-medium text-gray-600">
                    Max Members
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={decreaseMember}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:bg-gray-100"
                    >
                      <Minus size={13} />
                    </button>

                    <div className="flex h-8 min-w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 px-3 text-xs font-medium text-gray-600">
                      {formData.maxMember}
                    </div>

                    <button
                      type="button"
                      onClick={increaseMember}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:bg-gray-100"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <p className="mt-2 text-[10px] text-gray-400">
                    Including yourself
                  </p>
                </section>

                {/* Budget */}
                <div className="rounded-3xl p-5 modern-card">
                  <label className="mb-4 flex items-center gap-1.5 text-md font-semibold text-primary">
                    <CircleDollarSign size={14} />
                    Budget
                  </label>

                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g. 15000"
                    className="h-10 w-full rounded-full input-modern px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Description */}
              <section className="mt-5 rounded-3xl p-5 modern-card">
                <div className="mb-3 flex items-center gap-1.5 text-md font-semibold text-primary">
                  <FileText size={14} />
                  Description
                </div>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell potential travel buddies about the vibe of this trip. What's the main goal? What kind of people are you looking to find?"
                  className="w-full resize-none input-modern p-4 text-sm leading-relaxed text-gray-700 outline-none placeholder:text-gray-400"
                />
              </section>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-7 py-2.5 text-sm font-semibold text-white"
                >
                  {loading ? "Creating..." : "Create Trip"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default CreateTripPage;
