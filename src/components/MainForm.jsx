import { NavBar } from "./NavBar";
import BgSand from "../assets/BgSand.png";
import { Link } from "react-router";

export function MainPageContent() {
  return (
    <>
      {/* BG */}
      <div className="relative min-h-screen">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat inset-0 absolute -z-50"
          style={{ backgroundImage: `url(${BgSand})` }}
        ></div>
        {/* Navbar */}
        <div className="fixed w-full z-50">
          <NavBar />
        </div>
        {/* Content */}
        <div className="flex flex-col justify-center h-screen px-15 gap-10">
          <div className="text-white text-6xl flex flex-col gap-3">
            <p>Find The Joy</p>
            <p>Find Your People</p>
            <p>Find Your Journey</p>
            <p className="text-base">
              Every journey is better when you find the joy and share it with
              the right people.
            </p>
          </div>
          <Link to={"/login"}>
            <button className="bg-slate-50 hover:bg-black hover:text-white shadow-sm hover:shadow-lg transition duration-300 p-2 w-30 text-sm rounded-xl text-center">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
