import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Plus, MessageSquare, Sparkles, Compass, Users } from "lucide-react";
import { MenuBar } from "@/components/MenuBar";
import { mainApi } from "@/api/mainApi";
import PostCard from "./create-post/components/PostCardComponent";
import useUserStore from "@/stores/userStore";

export default function CommunityPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await mainApi.get("/posts");
        setPosts(response.data.data || []);
      } catch (error) {
        console.error("Get posts error:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faf7] flex flex-col">
      <MenuBar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Community Feed
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
              Discover stories, photos, and tips from fellow travelers.
            </p>
          </div>

          <button
            onClick={() => navigate("/create-post")}
            className="rounded-full bg-[#385526] hover:bg-[#2d451e] px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Post</span>
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Share Card */}
            <div
              onClick={() => navigate("/create-post")}
              className="rounded-[28px] bg-white p-4 sm:p-5 border border-gray-100 shadow-xs flex items-center gap-3 cursor-pointer hover:border-[#385526]/30 transition"
            >
              <img
                src={
                  user?.profileImage ||
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                }
                alt="Me"
                className="h-10 w-10 rounded-full object-cover border border-gray-100 shadow-2xs"
              />
              <div className="flex-1 bg-[#f8faf7] hover:bg-[#f2f6f0] px-4 py-2.5 rounded-full text-xs text-gray-400 transition">
                Share your travel story or photo...
              </div>
              <button className="h-9 w-9 rounded-full bg-[#f2f6f0] text-[#385526] flex items-center justify-center shrink-0">
                <Plus size={18} />
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex min-h-60 flex-col items-center justify-center gap-2">
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#385526] border-t-transparent" />
                <p className="text-xs text-gray-500 font-medium">Loading feed...</p>
              </div>
            )}

            {/* Empty */}
            {!loading && posts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl bg-white border border-gray-100 shadow-xs">
                <div className="h-14 w-14 rounded-full bg-[#f2f6f0] flex items-center justify-center text-[#385526] mb-3">
                  <MessageSquare size={26} />
                </div>
                <p className="text-base font-semibold text-gray-800">
                  No posts shared yet
                </p>
                <p className="text-xs text-gray-500 max-w-sm mt-1 mb-5">
                  Be the first to share your travel memories and photos with the community!
                </p>
                <button
                  onClick={() => navigate("/create-post")}
                  className="rounded-full bg-[#385526] hover:bg-[#2d451e] text-white px-6 py-2.5 text-xs font-semibold shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Create the First Post</span>
                </button>
              </div>
            )}

            {/* Posts */}
            {!loading && posts.length > 0 && (
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar (1 col) */}
          <div className="space-y-6">
            {/* Community Welcome Card */}
            <div className="rounded-[28px] bg-gradient-to-br from-[#233d1b] to-[#162911] text-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold mb-2">
                <Sparkles size={16} />
                <span>Traveler Community</span>
              </div>
              <h3 className="text-lg font-bold">Connect & Share</h3>
              <p className="text-xs text-gray-200 leading-relaxed mt-2 font-normal">
                Inspire fellow travelers with your travel moments, tips, and hidden gems you found on your trips.
              </p>
              <button
                onClick={() => navigate("/explore")}
                className="mt-4 w-full rounded-xl bg-white text-[#2d451e] hover:bg-emerald-50 py-2.5 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Compass size={14} />
                <span>Find Trips</span>
              </button>
            </div>

            {/* Guidelines Card */}
            <div className="rounded-[28px] bg-white p-6 border border-gray-100 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-3">
                <Users size={16} className="text-[#385526]" />
                <span>Community Guidelines</span>
              </div>
              <ul className="space-y-2 text-xs text-gray-500 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#385526] font-bold">•</span>
                  <span>Be respectful and welcoming to other members.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#385526] font-bold">•</span>
                  <span>Share authentic photos and helpful travel advice.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#385526] font-bold">•</span>
                  <span>Keep interactions positive and constructive.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
