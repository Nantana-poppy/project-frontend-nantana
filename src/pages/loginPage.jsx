import { Link, redirect, replace, useNavigate } from "react-router";
import BgSand from "../assets/BgSand.png";
import useUserStore from "@/stores/userStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validations/Schema";
import { toast } from "react-toastify";
import { KeyRound, User } from "lucide-react";

export function LogInContent() {
  const navigation = useNavigate();
  const login = useUserStore((state) => state.login);
  const { formState, register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onsubmit",
    defaultValues: { identity: "", password: "" },
  });

  const { errors } = formState;

  const onSubmit = async (data) => {
    try {
      const resp = await login(data);
      if (resp.data.status) {
        toast.success(resp.data.message);
        navigation("/", { replace: true});
      }
    } catch (err) {
      toast.error(err.response?.data.error || err.message);
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
          <p className="text-5xl font-bold text-[#0f4c81] text-center">Welcome</p>
          <p className="text-sm text-center pb-3">
            Sign in to continue your travel journey.
          </p>
          <div className="flex flex-col gap-3">
            <div className="bg-slate-100 w-100 p-2 rounded-xl text-base flex gap-3 text-slate-500">
              <User />
              <input
                type="text"
                {...register("identity")}
                name="identity"
                className="outline-none"
                placeholder="Email or Username"
              />
            </div>
            <p className="text-red-600">{errors.identity?.message}</p>
            <div className="bg-slate-100 w-100 p-2 rounded-xl text-base flex gap-3 text-slate-500">
              <KeyRound />
              <input
                type="password"
                {...register("password")}
                name="password"
                className="outline-none"
                placeholder="Password"
              />
            </div>
            <p className="text-red-600">{errors.password?.message}</p>{" "}
            <button className="pl-65">Forgot password?</button>
            <button className="w-100 p-2 mt-3 rounded-xl text-white bg-[#0f4c81] ">
              Sign in
            </button>
            <div className="flex gap-1 text-sm pt-3 justify-center">
              <p>Don't have an account?</p>
              <Link to={"/register"}>
                <button className="font-semibold">Create account</button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
