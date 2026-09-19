import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/validations/Schema";
import { mainApi } from "@/api/mainApi";
import { toast } from "react-toastify";
import loginPlantCrop from "@/assets/loginPlant_crop.png";
import { Eye, EyeOff } from "lucide-react";

export function RegisterContent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const resp = await mainApi.post("auth/register", data);
      toast.success(resp.data?.message || "Account created successfully! Please sign in.");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = (provider) => {
    toast.info(`Sign up with ${provider} will be available soon`);
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row items-stretch">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 sm:px-12 md:px-16 lg:px-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-gray-500 font-normal">
              Enter your details to register for Fun Friend Find
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  {...register("firstName")}
                  placeholder="First name"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#385526] focus:ring-1 focus:ring-[#385526] outline-none transition-all"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register("lastName")}
                  placeholder="Last name"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#385526] focus:ring-1 focus:ring-[#385526] outline-none transition-all"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Email address
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#385526] focus:ring-1 focus:ring-[#385526] outline-none transition-all"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Username
              </label>
              <input
                type="text"
                {...register("username")}
                placeholder="Choose a username"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#385526] focus:ring-1 focus:ring-[#385526] outline-none transition-all"
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#385526] focus:ring-1 focus:ring-[#385526] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#385526] focus:ring-1 focus:ring-[#385526] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-[#385526] hover:bg-[#2d451e] py-2.5 text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="w-full border-t border-gray-200"></div>
            <span className="absolute bg-white px-3 text-xs text-gray-400">
              or
            </span>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialClick("Google")}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={() => handleSocialClick("Apple")}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              <svg
                className="h-4 w-4 shrink-0 fill-current text-black"
                viewBox="0 0 170 170"
              >
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.59-7.79-11.71-14.25-6.53-10.23-11.45-21.43-14.76-33.61-3.3-12.18-4.96-23.77-4.96-34.77 0-14.26 3.64-26.04 10.92-35.34 7.28-9.3 16.33-14.07 27.16-14.31 4.69 0 9.87 1.16 15.54 3.48 5.66 2.32 9.53 3.54 11.61 3.66 1.86-.24 5.92-1.57 12.18-3.99 6.26-2.42 11.62-3.52 16.08-3.3 11.97.73 21.6 5.09 28.89 13.08-10.45 6.36-15.57 15.22-15.34 26.59.23 8.94 3.68 16.48 10.34 22.62 6.67 6.14 14.65 9.68 23.94 10.63-2.18 6.75-4.78 13.43-7.8 20.04zM119.22 31.84c0-7.39 2.66-14.36 7.98-20.91 5.32-6.55 11.96-10.63 19.92-12.24.12 1.09.18 2.06.18 2.91 0 7.28-2.73 14.27-8.19 20.96-5.46 6.69-12.18 10.74-20.16 12.15-.49-.96-.73-1.92-.73-2.87z" />
              </svg>
              <span>Sign up with Apple</span>
            </button>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: Plant Card Image */}
      <div className="hidden lg:flex lg:w-1/2 p-4 sm:p-6 lg:p-8 items-stretch">
        <div className="relative w-full h-full min-h-150 overflow-hidden rounded-[40px] bg-[#f2f5f1] shadow-xs">
          <img
            src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=1400&auto=format&fit=crop"
            onError={(e) => {
              e.currentTarget.src = loginPlantCrop;
            }}
            alt="Monstera plant"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default RegisterContent;
