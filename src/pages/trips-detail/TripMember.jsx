import useUserStore from "@/stores/userStore";
import { Users } from "lucide-react";

const TripMembers = ({ members }) => {
  const user = useUserStore((state) => state.user);

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900">
          <Users size={14} className="text-[#385526]" />
          <span>Members ({members.length})</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {members.length === 0 ? (
          <p className="text-xs text-gray-400">No members joined yet</p>
        ) : (
          members.map((member) => {
            const isCurrentUser = member.user?.id === user?.id;
            const avatar =
              (isCurrentUser && user?.profileImage ? user.profileImage : member.user?.profileImage) ||
              "https://i.pravatar.cc/100";

            return (
              <div key={member.id} className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#f8faf7] border border-gray-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={avatar}
                    alt={member.user?.username}
                    className="h-8 w-8 rounded-full object-cover border border-white shadow-2xs"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {member.user.firstName} {member.user.lastName}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">@{member.user.username}</p>
                  </div>
                </div>
                {isCurrentUser && (
                  <span className="text-[10px] font-semibold bg-emerald-100 text-[#2d451e] px-2 py-0.5 rounded-full">
                    You
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TripMembers;
