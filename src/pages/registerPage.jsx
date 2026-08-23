import { Link } from "react-router";
import BgSand from "../assets/BgSand.png";
import { Flip, toast } from "react-toastify";
import { registerSchema } from "@/validations/Schema";
import { mainApi } from "@/api/mainApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function RegisterContent() {
  const { formState, register, handleSubmit } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      identity: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { errors } = formState;

  const onSubmit = async (data) => {
    try {
      const resp = await mainApi.post("/auth/register", data);
      toast(resp.data.message, { type: "true" });
    } catch (err) {
      console.error(err.response?.data?.error);
      toast(err.response?.data?.error, {
        position: "top-center",
        type: "false",
        autoClose: 2000,
        transition: Flip,
      });
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center">
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat brightness-80 absolute -z-50"
        style={{ backgroundImage: `url(${BgSand})` }}
      ></div>
      <div className="flex justify-center items-center w-fit p-8 shadow-2xl shadow-black rounded-2xl bg-slate-300">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <p className="text-5xl font-bold text-[#0f4c81]">Create your account</p>
          <p className="text-sm text-center pb-3">
            Join Fun Friend Find and start discovering your next adventure.
          </p>
          <div className="flex flex-col gap-1 items-center">
            <div>
              <p className="pb-1">First Name</p>
              <input
                type="text"
                {...register("firstName")}
                className="bg-slate-100 w-100 p-2 rounded-xl text-[14px]"
                placeholder="First Name"
              />
              <p className="text-red-600">{errors.firstName?.message}</p>
            </div>
            <div>
              <p className="pb-1">Last Name</p>
              <input
                type="text"
                {...register("lastName")}
                className="bg-slate-100 w-100 p-2 rounded-xl text-[14px]"
                placeholder="Last Name"
              />
              <p className="text-red-600">{errors.lastName?.message}</p>
            </div>
            <div>
              <p className="pb-1">Email</p>
              <input
                type="text"
                {...register("email")}
                className="bg-slate-100 w-100 p-2 rounded-xl text-[14px]"
                placeholder="Email"
              />
              <p className="text-red-600">{errors.email?.message}</p>
            </div>
            <div>
              <p className="pb-1">Username</p>
              <input
                type="text"
                {...register("username")}
                className="bg-slate-100 w-100 p-2 rounded-xl text-[14px]"
                placeholder="Username"
              />
              <p className="text-red-600">{errors.username?.message}</p>
            </div>
            <div>
              <p className="pb-1">Password</p>
              <input
                type="password"
                {...register("password")}
                className="bg-slate-100 w-100 p-2 rounded-xl text-[14px]"
                placeholder="Password"
              />
              <p className="text-red-600">{errors.password?.message}</p>
            </div>
            <div>
              <p className="pb-1">Confirm Password</p>
              <input
                type="password"
                {...register("confirmPassword")}
                className="bg-slate-100 w-100 p-2 rounded-xl text-[14px]"
                placeholder="Confirm Password"
              />
              <p className="text-red-600">{errors.confirmPassword?.message}</p>
            </div>
            <button className="w-100 p-2 mt-3 rounded-xl text-white bg-[#0f4c81]">
              Create Account
            </button>
            <div className="flex gap-1 text-sm pt-3">
              <p>Already have an account?</p>
              <Link to={"/auth/login"}>
                <button className="font-semibold">Sign in</button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
