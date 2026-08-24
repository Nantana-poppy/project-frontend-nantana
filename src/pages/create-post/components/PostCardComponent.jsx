import { useState } from "react";
import { Heart, MessageCircle, MapPin } from "lucide-react";

import { mainApi } from "@/api/mainApi";
import useUserStore from "@/stores/userStore";

export default function PostCard({ post }) {
  const user = useUserStore((state) => state.user);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0);

  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const handleLike = async () => {
    if (!user) {
      return;
    }

    // กันกดซ้ำ เพราะ backend ตอนนี้ไม่มี unlike ต้องไปทำเพิ่ม
    // TODO: ต้องไปเพิ่ม DB สำหรับ Unlike
    if (liked) {
      return;
    }
    try {
      await mainApi.post(`/posts/${post.id}/like`);
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    } catch (error) {
      console.error("Like post error:", error.response?.data || error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      return;
    }

    try {
      setCommentLoading(true);

      await mainApi.post(`/posts/${post.id}/comments`, {
        comment: comment.trim(),
      });

      setComment("");

      alert("Comment added successfully");
    } catch (error) {
      console.error("Comment error:", error.response?.data || error);
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-sm">
      {/* User */}
      <div className="flex items-center gap-3 p-5">
        <img
          src={post.user?.profileImage || "https://i.pravatar.cc/100?img=11"}
          alt={post.user?.username || "User"}
          className="h-11 w-11 rounded-full object-cover"
        />

        <div>
          <p className="font-semibold">
            {post.user?.firstName} {post.user?.lastName}
          </p>

          <p className="text-sm text-gray-400">@{post.user?.username}</p>
        </div>
      </div>

      {/* Images */}
      {post.images?.length > 0 && (
        <div className="space-y-1">
          {post.images.map((image) => (
            <img
              key={image.id}
              src={image.imageUrl}
              alt="Post"
              className="max-h-150 w-full object-cover"
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {post.caption && <p className="text-gray-700">{post.caption}</p>}

        {post.location && (
          <div className="mt-3 flex items-center gap-1 text-sm text-gray-400">
            <MapPin size={15} />
            <span>{post.location}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex items-center gap-6 border-t pt-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 ${
              liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <Heart size={21} fill={liked ? "currentColor" : "none"} />

            <span>{likeCount}</span>
          </button>

          <button
            onClick={() => setShowComment((prev) => !prev)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#0F4C81]"
          >
            <MessageCircle size={21} />

            <span>{post._count?.comments || 0}</span>
          </button>
        </div>

        {/* Comment input */}
        {showComment && (
          <form onSubmit={handleComment} className="mt-4 flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-[#0F4C81]"
            />

            <button
              type="submit"
              disabled={commentLoading}
              className="rounded-full bg-[#0F4C81] px-5 py-2 text-sm text-white disabled:opacity-50"
            >
              {commentLoading ? "..." : "Comment"}
            </button>
          </form>
        )}
      </div>
    </article>
  );
}
