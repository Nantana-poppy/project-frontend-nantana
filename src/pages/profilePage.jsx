import { MenuBar } from "@/components/MenuBar";
import { Map, Plus, Compass, UserPlus, UserCheck, UserMinus, MessageSquare } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { mainApi } from "@/api/mainApi";
import useUserStore from "@/stores/userStore";
import TripCard from "@/components/card/tripCard";
import PostCard from "./create-post/components/PostCardComponent";
import moment from "moment";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const currentUser = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Follow states
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);

  const currentUserId = currentUser?.id;
  const isOwnProfile = !userId || (currentUserId && Number(userId) === Number(currentUserId));

  useEffect(() => {
    let isMounted = true;

    const fetchProfileData = async () => {
      if (!currentUserId && !userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        if (isOwnProfile) {
          // Fetch own profile
          const meResp = await mainApi.get("/auth/me");
          const userData = meResp.data?.user;
          if (userData && isMounted) {
            updateUser(userData);
            setProfile(userData);
            setFollowersCount(userData._count?.followers ?? 0);
            setFollowingCount(userData._count?.following ?? 0);
          }

          // Fetch own trips
          const tripsResp = await mainApi.get("/users/me/trips");
          if (isMounted) {
            setTrips(tripsResp.data.data || []);
          }

          // Fetch own posts
          try {
            const postsResp = await mainApi.get("/users/me/posts");
            if (isMounted) {
              setPosts(postsResp.data.data || []);
            }
          } catch {
            if (isMounted) {
              setPosts([]);
            }
          }
        } else {
          // Fetch target user's profile
          const userResp = await mainApi.get(`/users/${userId}`);
          const targetUser = userResp.data.data;
          if (isMounted) {
            setProfile(targetUser);
            setIsFollowing(!!targetUser.isFollowing);
            setFollowersCount(targetUser._count?.followers ?? 0);
            setFollowingCount(targetUser._count?.following ?? 0);
          }

          // Fetch target user's trips
          try {
            const tripsResp = await mainApi.get(`/users/${userId}/trips`);
            if (isMounted) {
              setTrips(tripsResp.data.data || []);
            }
          } catch {
            if (isMounted) {
              setTrips([]);
            }
          }

          // Fetch target user's posts
          try {
            const postsResp = await mainApi.get(`/users/${userId}/posts`);
            if (isMounted) {
              setPosts(postsResp.data.data || []);
            }
          } catch {
            if (isMounted) {
              setPosts([]);
            }
          }
        }
      } catch (error) {
        console.error("Get profile error:", error.response?.data || error);
        toast.error(error.response?.data?.message || "Failed to load profile");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfileData();

    return () => {
      isMounted = false;
    };
  }, [userId, currentUserId, isOwnProfile, updateUser]);

  // Handle Follow / Unfollow Toggle
  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Please login first to follow users");
      navigate("/login");
      return;
    }

    const targetUserId = userId || profile?.id;
    if (!targetUserId) return;

    try {
      setFollowLoading(true);
      const response = await mainApi.post(`/users/${targetUserId}/follow`);
      const { isFollowing: nextFollowing, followersCount: newCount, message } = response.data;

      setIsFollowing(nextFollowing);
      setFollowersCount(newCount ?? (nextFollowing ? followersCount + 1 : Math.max(0, followersCount - 1)));

      if (nextFollowing) {
        toast.success(message || `Followed @${profile?.username}`);
      } else {
        toast.info(message || `Unfollowed @${profile?.username}`);
      }
    } catch (error) {
      console.error("Follow error:", error);
      toast.error(error.response?.data?.message || error.response?.data?.error || "Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf7] flex flex-col">
        <MenuBar />
        <div className="flex flex-1 items-center justify-center gap-2">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#385526] border-t-transparent" />
          <p className="text-xs text-gray-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile && !currentUser) {
    return (
      <div className="min-h-screen bg-[#f8faf7] flex flex-col">
        <MenuBar />
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <p className="text-base font-semibold text-gray-800">Please log in to view your profile</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 rounded-full bg-[#385526] hover:bg-[#2d451e] px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  const displayedUser = profile || currentUser;

  return (
    <div className="min-h-screen bg-[#f8faf7] flex flex-col">
      <MenuBar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col gap-6">
        {/* Profile Header Card */}
        <div className="rounded-4xl sm:rounded-[40px] bg-white p-6 sm:p-10 border border-gray-100 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={
                  displayedUser?.profileImage ||
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                }
                alt="Profile"
                className="h-28 w-28 sm:h-36 sm:w-36 rounded-full object-cover border-4 border-[#f2f6f0] shadow-sm"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                    {displayedUser?.firstName} {displayedUser?.lastName}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                    @{displayedUser?.username}
                  </p>
                </div>

                {/* Actions: Edit Profile or Follow / Unfollow */}
                {isOwnProfile ? (
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="rounded-full bg-[#385526] hover:bg-[#2d451e] px-5 py-2 text-xs font-semibold text-white shadow-xs transition cursor-pointer self-center sm:self-auto"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`rounded-full px-6 py-2 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 self-center sm:self-auto disabled:opacity-50 ${
                      isFollowing
                        ? "border border-gray-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-gray-700 shadow-2xs group"
                        : "bg-[#385526] hover:bg-[#2d451e] text-white shadow-xs"
                    }`}
                  >
                    {followLoading ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : isFollowing ? (
                      <>
                        <UserCheck size={14} className="text-[#385526] group-hover:hidden" />
                        <UserMinus size={14} className="text-rose-600 hidden group-hover:inline" />
                        <span className="group-hover:hidden">Following</span>
                        <span className="hidden group-hover:inline">Unfollow</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Bio */}
              <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl">
                {displayedUser?.bio || (isOwnProfile ? "No bio added yet. Tell other travelers about your travel style!" : "No bio provided.")}
              </p>

              <div className="my-5 h-px bg-gray-100" />

              {/* Stats */}
              <div className="flex items-center justify-center sm:justify-start gap-8 sm:gap-12 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">{trips.length}</p>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    {isOwnProfile ? "My Trips" : "Trips"}
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {followersCount}
                  </p>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    Followers
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {followingCount}
                  </p>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    Following
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Main Posts Feed + Sidebar Trips */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Feed: Community Posts (8 cols on xl, 7 cols on lg) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-[#f2f6f0] flex items-center justify-center text-[#385526]">
                  <MessageSquare size={17} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    {isOwnProfile ? "My Community Posts" : "Community Posts"}
                  </h2>
                  <p className="text-[11px] text-gray-400 font-normal">
                    {posts.length} {posts.length === 1 ? "story shared" : "stories shared"}
                  </p>
                </div>
              </div>

              {isOwnProfile && (
                <button
                  onClick={() => navigate("/create-post")}
                  className="rounded-full bg-[#385526] hover:bg-[#2d451e] px-4 py-2 text-xs font-semibold text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Create Post</span>
                </button>
              )}
            </div>

            {/* Posts List */}
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-[28px] bg-white border border-gray-100 shadow-xs">
                <div className="h-14 w-14 rounded-full bg-[#f2f6f0] flex items-center justify-center text-[#385526] mb-3">
                  <MessageSquare size={26} />
                </div>
                <p className="text-base font-semibold text-gray-800">
                  {isOwnProfile ? "You haven't shared any posts yet" : "No community posts shared yet"}
                </p>
                {isOwnProfile && (
                  <>
                    <p className="text-xs text-gray-500 max-w-sm mt-1 mb-5">
                      Share your travel stories, photos, and tips with fellow travelers in the community!
                    </p>
                    <button
                      onClick={() => navigate("/create-post")}
                      className="rounded-full bg-[#385526] hover:bg-[#2d451e] text-white px-6 py-2.5 text-xs font-semibold shadow-xs transition flex items-center gap-2 cursor-pointer"
                    >
                      <Plus size={16} />
                      <span>Create Your First Post</span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={(deletedId) =>
                      setPosts((prev) => prev.filter((p) => p.id !== deletedId))
                    }
                    onUpdate={(updatedPost) =>
                      setPosts((prev) =>
                        prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Created Trips (4 cols on xl, 5 cols on lg) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-[#f2f6f0] flex items-center justify-center text-[#385526]">
                  <Map size={17} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    {isOwnProfile ? "My Trips" : "Created Trips"}
                  </h2>
                  <p className="text-[11px] text-gray-400 font-normal">
                    {trips.length} {trips.length === 1 ? "trip" : "trips"}
                  </p>
                </div>
              </div>

              {isOwnProfile && (
                <button
                  onClick={() => navigate("/create-trip")}
                  className="rounded-full border border-gray-200 hover:border-[#385526]/30 bg-white hover:bg-[#f2f6f0] text-[#2d451e] px-3.5 py-1.5 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>New Trip</span>
                </button>
              )}
            </div>

            {/* Trips List */}
            {trips.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-[28px] bg-white border border-gray-100 shadow-xs">
                <div className="h-12 w-12 rounded-full bg-[#f2f6f0] flex items-center justify-center text-[#385526] mb-3">
                  <Compass size={22} />
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  {isOwnProfile ? "No trips created yet" : "No trips created yet"}
                </p>
                {isOwnProfile && (
                  <>
                    <p className="text-xs text-gray-500 max-w-xs mt-1 mb-4">
                      Create a trip and find travel companions!
                    </p>
                    <button
                      onClick={() => navigate("/create-trip")}
                      className="rounded-full bg-[#385526] hover:bg-[#2d451e] text-white px-4 py-2 text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Create Trip</span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    tripId={trip.id}
                    hostId={trip.owner?.id || displayedUser?.id}
                    category={trip.category?.name}
                    image={trip.image}
                    title={trip.title}
                    location={trip.destination}
                    dateRange={
                      moment(trip.startDate).format("L") +
                      " - " +
                      moment(trip.endDate).format("L")
                    }
                    price={Number(trip.budget).toLocaleString("th-TH")}
                    hostName={`${displayedUser.firstName} ${displayedUser.lastName}`}
                    hostAvatar={displayedUser.profileImage}
                    currentMembers={trip.members?.length ?? trip._count?.members ?? 1}
                    maxMembers={trip.maxMember}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
