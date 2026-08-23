import {
  Backpack,
  BikeIcon,
  MountainSnow,
  SportShoe,
  Tent,
  WavesHorizontal,
} from "lucide-react";

export default function CategoryForm() {
  return (
    <>
      <div className="flex flex-wrap px-10 gap-3">
        <div className="btn-category">
          <Backpack />
          <p>Hiking</p>
        </div>
        <div className="btn-category btn-category:hover">
          <Backpack />
          <p>Diving</p>
        </div>
        <div className="btn-category">
          <MountainSnow />
          <p>Trekking</p>
        </div>
        <div className="btn-category">
          <WavesHorizontal />
          <p>Scuba</p>
        </div>
        <div className="btn-category">
          <SportShoe />
          <p>Running</p>
        </div>
        <div className="btn-category">
          <Tent />
          <p>Camping</p>
        </div>
        <div className="btn-category">
          <BikeIcon />
          <p>Cycling</p>
        </div>{" "}
        <div className="btn-category">
          <Backpack />
          <p>Swimming</p>
        </div>
        <div className="btn-category">
          <Backpack />
          <p>Jogging</p>
        </div>
        <div className="btn-category">
          <Backpack />
          <p>Fishing</p>
        </div>
        <div className="btn-category">
          <Backpack />
          <p>Playing board games</p>
        </div>
        <div className="btn-category">
          <Backpack />
          <p>Doing yoga</p>
        </div>
      </div>
    </>
  );
}
