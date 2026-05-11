/** @format */

function getInitials(name) {
  return (
    name
      .trim()
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

function timeAgo(isoString) {
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function PostCard({ post, liked, onLike, onDelete }) {
  return (
    <div className="post-card">
      <div className="post-header">
        <div className="avatar">{getInitials(post.name)}</div>
        <div className="post-meta">
          <span className="post-name">{post.name}</span>
          <span className="post-time">{timeAgo(post.createdAt)}</span>
        </div>
        <button
          className="btn-delete"
          onClick={onDelete}
          aria-label="Delete post"
          title="Delete"
        >
          ✕
        </button>
      </div>

      <p className="post-body">{post.text}</p>

      <div className="post-footer">
        <button
          className={`btn-like ${liked ? "liked" : ""}`}
          onClick={onLike}
          aria-label="Like"
        >
          {liked ? "❤️" : "🤍"} {post.likes}{" "}
          {post.likes === 1 ? "like" : "likes"}
        </button>
      </div>
    </div>
  );
}
