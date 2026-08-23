import TripCard from "@/components/card/tripCard";
import CategoryForm from "@/components/CategoryForm";
import { MenuBar } from "@/components/MenuBar";

export function HomePage() {
  return (
    <div className="bg-slate-200">
      <MenuBar />
      <div className="px-10 pt-13 pb-10 gap-10">
        <p className="text-5xl font-bold">Hi,</p>
        <p className="text-2xl">Where will your next adventure take you?</p>
      </div>
      <p className="text-2xl px-10 pt-8 pb-5 font-semibold text-[#0f4c81]">
        Category Trips
      </p>
      <CategoryForm />
      <div>
        <p className="text-2xl px-10 pt-8 font-semibold text-[#0f4c81]">
          Featured Trips
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 px-10">
          <TripCard />
          <TripCard />
          <TripCard />
          <TripCard />
          <TripCard />
          <TripCard />
          <TripCard />
          <TripCard />
        </div>
      </div>
    </div>
  );
}
