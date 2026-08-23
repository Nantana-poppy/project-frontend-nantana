const TripMembers = ({ members }) => {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <span className="text-md font-medium uppercase tracking-wider text-gray-400">
          Member Trips
        </span>

        <span className="text-sm text-gray-400">{members.length}</span>
      </div>

      <div className="mt-3 space-y-3">
        {members.length === 0 ? (
          <p className="text-sm text-gray-400">No members yet</p>
        ) : (
          members.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <img
                src={member.user.profileImage || "https://i.pravatar.cc/100"}
                alt={member.user.username}
                className="h-10 w-10 rounded-full object-cover"
              />

              <div>
                <p className="text-sm font-semibold">
                  {member.user.firstName} {member.user.lastName}
                </p>

                <p className="text-xs text-gray-400">@{member.user.username}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TripMembers;
