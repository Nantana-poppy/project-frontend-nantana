import { useState } from "react";
import { Heart, MessageCircle, MapPin, Send } from "lucide-react";
import { toast } from "react-toastify";
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
      toast.info("Please login to like this post");
      return;
    }

    if (liked) return;

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

    if (!user) {
      toast.info("Please login to comment");
      return;
    }

    if (!comment.trim()) return;

    try {
      setCommentLoading(true);
      await mainApi.post(`/posts/${post.id}/comments`, {
        comment: comment.trim(),
      });
      setComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Comment error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const authorAvatar =
    post.user?.id === user?.id && user?.profileImage
      ? user.profileImage
      : post.user?.profileImage || "https://i.pravatar.cc/100?img=11";

  return (
    <article className="overflow-hidden rounded-[28px] bg-white border border-gray-100 shadow-xs hover:shadow-sm transition-shadow">
      {/* Author Header */}
      <div className="flex items-center gap-3 p-4 sm:p-5">
        <img
          src={authorAvatar}
          alt={post.user?.username || "User"}
          className="h-10 w-10 rounded-full object-cover border border-gray-100 shadow-2xs"
        />
        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-900 truncate">
            {post.user?.firstName} {post.user?.lastName}
          </p>
          <p className="text-[11px] text-gray-400 truncate">@{post.user?.username}</p>
        </div>
      </div>

      {/* Post Images */}
      {post.images?.length > 0 && (
        <div className="space-y-1 bg-gray-50">
          {post.images.map((image) => (
            <img
              key={image.id}
              src={image.imageUrl}
              alt="Post"
              className="max-h-[500px] w-full object-cover"
            />
          ))}
        </div>
      )}

      {/* Post Content */}
      <div className="p-4 sm:p-5">
        {post.caption && (
          <p className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line">
            {post.caption}
          </p>
        )}

        {post.location && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={13} className="text-[#385526] shrink-0" />
            <span>{post.location}</span>
          </div>
        )}

        {/* Actions Bar */}
        <div className="mt-4 flex items-center gap-5 border-t border-gray-100 pt-3.5">
          {/* Like */}
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-semibold transition cursor-pointer ${
              liked
                ? "text-red-500"
                : "text-gray-500 hover:text-red-500"
            }`}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
            <span>{likeCount}</span>
          </button>

          {/* Comment Toggle */}
          <button
            type="button"
            onClick={() => setShowComment((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#385526] transition cursor-pointer"
          >
            <MessageCircle size={18} />
            <span>{post._count?.comments || 0}</span>
          </button>
        </div>

        {/* Comment Form */}
        {showComment && (
          <form onSubmit={handleComment} className="mt-3.5 flex gap-2 pt-3 border-t border-gray-50">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-full border border-gray-200 bg-[#f8faf7] px-4 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#385526] focus:ring-1 focus:ring-[#385526] transition"
            />
            <button
              type="submit"
              disabled={commentLoading}
              className="rounded-full bg-[#385526] hover:bg-[#2d451e] px-4 py-2 text-xs font-semibold text-white shadow-2xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1"
            >
              {commentLoading ? (
                "..."
              ) : (
                <>
                  <span>Send</span>
                  <Send size={12} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </article>
  );
}
