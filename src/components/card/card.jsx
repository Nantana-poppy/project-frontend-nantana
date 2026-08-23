export default function TripCard2({
  image,
  title,
  description,
  tags,
  members,
  status,
}) {
  return (
    <div className="group relative min-h-70 overflow-hidden rounded-4xl">
      {/* Image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      {/* Dark Gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />{" "}
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        {/* Tags */}
        <div className="mb-2 flex gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/20 px-3 py-1 text-[10px] backdrop-blur-md"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* Title */} <h2 className="text-xl font-semibold"> {title} </h2>
        {/* Description */}
        <p className="mt-1 line-clamp-2 max-w-xl text-xs leading-5 text-white/80">
          {description}
        </p>
        {/* Members */}
        {members && (
          <div className="mt-4 flex items-center">
            <div className="flex -space-x-2">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                className="h-7 w-7 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                className="h-7 w-7 rounded-full border-2 border-white object-cover"
              />
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-500 text-[9px]">
                {members}
              </div>
            </div>
            <span className="ml-3 text-xs text-white/80"> {status} </span>
          </div>
        )}
      </div>
    </div>
  );
}
