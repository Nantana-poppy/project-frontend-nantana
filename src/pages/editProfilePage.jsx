import { MenuBar } from "@/components/MenuBar";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { mainApi } from "@/api/mainApi";
import useUserStore from "@/stores/userStore";
import { toast } from "react-toastify";
import uploadCloud from "@/utils/uploadCloud";

export default function EditProfilePage() {
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

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

  // ดึงข้อมูล User ปัจจุบัน
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

  // เปลี่ยนค่าใน input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save Profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    try {
      setSaving(true);

      const response = await mainApi.patch(`/users/${user.id}`, formData);

      // เอาข้อมูลใหม่เก็บใน Zustand
      updateUser(response.data.data);

      toast.success("Profile updated successfully");

      // กลับไป Profile
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

    // Upload รูปขึ้น Cloudinary
    const imageUrl = await uploadCloud(file);

    console.log("Cloudinary URL:", imageUrl);

    // เก็บ URL Cloudinary ไว้ใน formData
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


  // Cancel
  const handleCancel = () => {
    navigate("/profile");
  };

  if (loading) {
    return (
      <>
        <MenuBar />
        <div className="flex min-h-screen items-center justify-center bg-[#f8f9f7]">
          Loading...
        </div>
      </>
    );
  }
  return (
    <>
      <MenuBar />

      <div className="min-h-screen px-8 py-8 text-[#171b19]">
        <div className="mx-auto max-w-7xl p-10 bg-slate-50/90 rounded-4xl shadow-lg">
          {/* Header */}
          <header className="mb-6">
            <h1 className="text-5xl font-extrabold tracking-[-0.5px]">
              Edit Profile
            </h1>

            <p className="mt-1 text-[11px] text-[#626965]">
              Update your personal details and travel preferences.
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <section className="rounded-[26px] bg-white px-5 py-5 shadow-[0_8px_30px_rgba(25,40,32,0.04)]">
              <div className="flex items-center gap-5">
                <div className="h-50 w-50 shrink-0 rounded-full border-4 border-[#edf0ed] p-0.5">
                  <img
                    src={
                      formData.profileImage ||
                      "https://i.pravatar.cc/150?img=47"
                    }
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-4xl font-semibold pb-3">
                    Profile Picture
                  </h2>

                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full bg-[#0F4C81] px-6 py-2 text-sm font-medium text-white hover:bg-[#0b3d69]"
                    >
                      Change Photo
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          profileImage: "",
                        }))
                      }
                      className="rounded-full border border-[#9ca39f] bg-white px-6 py-2 text-sm font-medium text-[#252a27] transition hover:bg-[#f5f6f5]"
                    >
                      Remove Photo
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Personal Information */}
            <section className="mt-6 rounded-[26px] bg-white px-5 py-5 shadow-[0_8px_30px_rgba(25,40,32,0.04)]">
              <h2 className="text-3xl font-semibold">
                Personal Information
              </h2>

              <div className="mt-2 h-px bg-[#e5e8e5]" />

              <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label className="mb-1 block text-md font-medium">
                    First Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="h-10 w-full rounded-full border border-[#aeb5b1] bg-[#fbfcfb] px-3 text-mdoutline-none transition focus:border-[#164d3a] focus:ring-1 focus:ring-[#164d3a]/20"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="mb-1 block text-md font-medium">
                    Last Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="h-10 w-full rounded-full border border-[#aeb5b1] bg-[#fbfcfb] px-3 text-mdoutline-none transition focus:border-[#164d3a] focus:ring-1 focus:ring-[#164d3a]/20"
                  />
                </div>

                {/* Username */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-md font-medium">
                    Username <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#777d79]">
                      @
                    </span>

                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                    className="h-10 w-full rounded-full border border-[#aeb5b1] bg-[#fbfcfb] px-3 text-mdoutline-none transition focus:border-[#164d3a] focus:ring-1 focus:ring-[#164d3a]/20"
                    />
                  </div>

                  <p className="mt-1 text-xs text-[#777d79]">
                    This will be your public handle.
                  </p>
                </div>

                {/* Bio */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-md font-medium">
                    Bio
                  </label>

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    maxLength={500}
                    rows={4}
                    className="w-full resize-none rounded-[17px] border border-[#aeb5b1] bg-[#fbfcfb] px-3 py-2 text-md leading-[1.45] outline-none transition focus:border-[#164d3a] focus:ring-1 focus:ring-[#164d3a]/20"
                  />

                  <div className="flex justify-end">
                    <span className="mt-1 text-[8px] text-[#777d79]">
                      {formData.bio.length} / 500 characters
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pb-2 pt-10">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-full border border-[#9da49f] bg-white px-5 py-1.75 text-[10px] font-medium text-[#202522] transition hover:bg-[#f2f4f2]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#164d3a] px-5 py-1.75 text-[10px] font-medium text-white transition hover:bg-[#103d2e] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
