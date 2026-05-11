/** @format */

import PostCard from "./PostCard";

export default function Feed({ posts, loading, likedIds, onLike, onDelete }) {
  if (loading) {
    return (
      <div className="feed-empty">
        <p>Loading posts…</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="feed-empty">
        <span className="feed-empty-icon">💬</span>
        <p>No posts yet. Be the first to share!</p>
      </div>
    );
  }

  return (
    <div className="feed">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          liked={likedIds.has(post.id)}
          onLike={() => onLike(post.id)}
          onDelete={() => onDelete(post.id)}
        />
      ))}
    </div>
  );
}
