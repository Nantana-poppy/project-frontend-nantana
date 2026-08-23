import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { MenuBar } from "@/components/MenuBar";
import { mainApi } from "@/api/mainApi";
import PostCard from "./create-post/components/PostCardComponent";

export default function CommunityPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await mainApi.get("/posts");

        console.log("POSTS:", response.data);

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
    <>

      <MenuBar />
      <main className="min-h-screen bg-[#f5f5f2] px-6 py-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold">Community</h1>

              <p className="mt-2 text-gray-500">
                Share your travel experience.
              </p>
            </div>

            <button
              onClick={() => navigate("/create-post")}
              className="flex items-center gap-2 rounded-full bg-[#0F4C81] px-5 py-3 text-white hover:bg-[#064174]"
            >
              <Plus size={18} />
              Create Post
            </button>
          </div>

          {/* Loading */}
          {loading && <div className="py-20 text-center">Loading posts...</div>}

          {/* Empty */}
          {!loading && posts.length === 0 && (
            <div className="rounded-3xl bg-white p-10 text-center">
              <p className="text-gray-400">No posts yet.</p>
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
      </main>
    </>
  );
}
