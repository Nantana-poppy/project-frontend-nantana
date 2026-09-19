import { MenuBar } from "@/components/MenuBar";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { mainApi } from "@/api/mainApi";
import useUserStore from "@/stores/userStore";
import useTripStore from "@/stores/tripStroe";
import { toast } from "react-toastify";
import uploadCloud from "@/utils/uploadCloud";
import { Camera, ArrowLeft, Trash2, User, ShieldCheck } from "lucide-react";

export default function EditProfilePage() {
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const updateUserAvatarInTrips = useTripStore((state) => state.updateUserAvatarInTrips);

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load Profile
  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await mainApi.get("/auth/me");
        const profile = response.data.user;

        setFormData({
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          username: profile.username || "",
          bio: profile.bio || "",
          profileImage: profile.profileImage || "",
        });
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.error || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    try {
      setSaving(true);
      const response = await mainApi.patch(`/users/${user.id}`, formData);
      const updatedData = response.data.data;
      updateUser(updatedData);
      if (updatedData?.id) {
        updateUserAvatarInTrips(updatedData.id, updatedData.profileImage);
      }
      toast.success("Profile updated successfully");
      navigate("/profile", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      const imageUrl = await uploadCloud(file);
      setFormData((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));
      toast.success("Photo uploaded successfully");
    } catch (error) {
      console.error("Upload image error:", error);
      toast.error("Failed to upload photo");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf7] flex flex-col">
        <MenuBar />
        <div className="flex flex-1 items-center justify-center gap-2">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#385526] border-t-transparent" />
          <p className="text-xs text-gray-500 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf7] flex flex-col">
      <MenuBar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="h-9 w-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#385526] hover:border-[#385526]/30 transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Edit Profile
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
              Update your photo, bio, and personal details.
            </p>
          </div>
        </div>

        {/* 2-Column Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Account Summary (1 col) */}
          <div className="space-y-6">
            <div className="rounded-[28px] bg-white p-6 border border-gray-100 shadow-xs flex flex-col items-center text-center">
              <span className="text-xs font-bold text-gray-900 mb-4 block self-start">
                Profile Photo
              </span>

              <div className="relative group mb-4">
                <img
                  src={
                    formData.profileImage ||
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                  }
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover border-4 border-[#f2f6f0] shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-[11px] font-semibold"
                >
                  <Camera size={22} className="mb-1" />
                  <span>Change Photo</span>
                </button>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl bg-[#385526] hover:bg-[#2d451e] py-2 text-xs font-semibold text-white shadow-2xs transition cursor-pointer"
                >
                  Upload New Photo
                </button>

                {formData.profileImage && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        profileImage: "",
                      }))
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white hover:bg-red-50 hover:text-red-600 py-2 text-xs font-semibold text-gray-600 transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Trash2 size={13} />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>

              <p className="text-[11px] text-gray-400 mt-3">
                JPG, PNG or WEBP (Max 5MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Account Info Badge Card */}
            <div className="rounded-[28px] bg-white p-5 border border-gray-100 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                <ShieldCheck size={16} className="text-[#385526]" />
                <span>Account Status</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Your profile is public. Other travelers can view your username, bio, and organized trips.
              </p>
            </div>
          </div>

          {/* Right Column: Personal Information (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-[28px] bg-white p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-1">
                <User size={18} className="text-[#385526]" />
                <span>Personal Information</span>
              </div>

              {/* First & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#385526] focus:border-[#385526] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#385526] focus:border-[#385526] transition"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    @
                  </span>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#385526] focus:border-[#385526] transition"
                  />
                </div>
                <span className="text-[11px] text-gray-400 mt-1 block">Your unique handle on Fun Friend Find</span>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  maxLength={500}
                  rows={5}
                  placeholder="Share your travel experiences, hobbies, or where you'd love to go next..."
                  className="w-full rounded-2xl border border-gray-200 bg-white p-3.5 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#385526] focus:border-[#385526] transition resize-none placeholder:text-gray-400"
                />
                <div className="flex justify-end mt-1">
                  <span className="text-[10px] text-gray-400">{formData.bio.length} / 500</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#385526] hover:bg-[#2d451e] px-8 py-2.5 text-xs font-semibold text-white shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
