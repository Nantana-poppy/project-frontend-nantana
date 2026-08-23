import { Link } from "react-router";

export function NavBar() {
  return (
    <>
      <div className="flex justify-between p-5 px-15 items-cente">
        <div className="text-white text-3xl font-semibold">
          <p>Journey</p>
        </div>
        <div className="flex text-lg gap-10 text-white">
          <button className="transition-all duration-300 text-base hover:text-xl hover:text-white">
            Home
          </button>
          <button className="transition-all duration-300 text-base hover:text-xl hover:text-white">
            Explore
          </button>
          <button className="transition-all duration-300 text-base hover:text-xl hover:text-white">
            Community
          </button>
          <button className="transition-all duration-300 text-base hover:text-xl hover:text-white">
            Trips
          </button>
        </div>
        <div className="bg-slate-50 p-2 w-30 text-sm rounded-xl text-center hover:bg-black hover:text-white shadow-sm hover:shadow-lg hover:shadow-white transition duration-300">
          <Link to="/auth/register">
            <button>Register</button>
          </Link>
        </div>
      </div>
    </>
  );
}
