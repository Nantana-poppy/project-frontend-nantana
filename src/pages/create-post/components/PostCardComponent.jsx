import { useState } from "react";
import { Heart, MessageCircle, MapPin, Send, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { mainApi } from "@/api/mainApi";
import useUserStore from "@/stores/userStore";
import { useNavigate } from "react-router";
import EditPostModal from "./EditPostModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function PostCard({ post, onDelete, onUpdate }) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [currentPost, setCurrentPost] = useState(post);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0);

  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // Edit / Delete states
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleLike = async () => {
    if (!user) {
      toast.info("Please login to like this post");
      return;
    }

    if (liked) return;

    try {
      await mainApi.post(`/posts/${currentPost.id}/like`);
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
      await mainApi.post(`/posts/${currentPost.id}/comments`, {
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

  const handleDeletePost = async () => {
    try {
      setDeleteLoading(true);
      await mainApi.delete(`/posts/${currentPost.id}`);
      toast.success("Post deleted successfully");
      setShowDeleteModal(false);
      if (onDelete) {
        onDelete(currentPost.id);
      }
    } catch (error) {
      console.error("Delete post error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to delete post"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePostUpdated = (updatedPost) => {
    setCurrentPost(updatedPost);
    if (onUpdate) {
      onUpdate(updatedPost);
    }
  };

  const authorAvatar =
    currentPost.user?.id === user?.id && user?.profileImage
      ? user.profileImage
      : currentPost.user?.profileImage || "https://i.pravatar.cc/100?img=11";

  const isAuthorCurrentUser = user?.id && currentPost.user?.id && Number(user.id) === Number(currentPost.user.id);

  return (
    <article className="relative overflow-hidden rounded-[28px] bg-white border border-gray-100 shadow-xs hover:shadow-sm transition-shadow">
      {/* Author Header */}
      <div className="flex items-center justify-between p-4 sm:p-5">
        <div 
          onClick={() => {
            if (currentPost.user?.id) {
              navigate(isAuthorCurrentUser ? "/profile" : `/profile/${currentPost.user.id}`);
            }
          }}
          className="flex items-center gap-3 cursor-pointer group min-w-0 flex-1"
          title={`View ${currentPost.user?.firstName}'s profile`}
        >
          <img
            src={authorAvatar}
            alt={currentPost.user?.username || "User"}
            className="h-10 w-10 rounded-full object-cover border border-gray-100 shadow-2xs group-hover:ring-2 group-hover:ring-[#385526]/30 transition shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900 group-hover:text-[#385526] transition truncate">
              {currentPost.user?.firstName} {currentPost.user?.lastName}
            </p>
            <p className="text-[11px] text-gray-400 truncate">@{currentPost.user?.username}</p>
          </div>
        </div>

        {/* 3-dots Menu for Author */}
        {isAuthorCurrentUser && (
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu((prev) => !prev);
              }}
              className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              title="More options"
            >
              <MoreVertical size={16} />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowMenu(false)} 
                />
                <div 
                  className="absolute right-0 top-9 z-30 w-36 overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setShowEditModal(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 hover:bg-[#f2f6f0] hover:text-[#2d451e] transition cursor-pointer"
                  >
                    <Pencil size={13} />
                    <span>Edit Post</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setShowDeleteModal(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Delete Post</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Post Images */}
      {currentPost.images?.length > 0 && (
        <div className="space-y-1 bg-gray-50">
          {currentPost.images.map((image) => {
            const imgUrl = typeof image === "string" ? image : image.imageUrl;
            const imgId = typeof image === "string" ? imgUrl : image.id;
            return (
              <img
                key={imgId}
                src={imgUrl}
                alt="Post"
                className="max-h-[500px] w-full object-cover"
              />
            );
          })}
        </div>
      )}

      {/* Post Content */}
      <div className="p-4 sm:p-5">
        {currentPost.caption && (
          <p className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line">
            {currentPost.caption}
          </p>
        )}

        {currentPost.location && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={13} className="text-[#385526] shrink-0" />
            <span>{currentPost.location}</span>
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

        {/* Edit Post Modal */}
        <EditPostModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          post={currentPost}
          onSuccess={handlePostUpdated}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeletePost}
          loading={deleteLoading}
          title="Delete Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          confirmText="Delete Post"
          cancelText="Keep Post"
          variant="danger"
        />
      </article>
    );
  }
