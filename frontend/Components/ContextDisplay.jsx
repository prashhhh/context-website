/** @format */

import { formatTime } from "../src/utils/time";

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

function wordCount(str) {
  return str.trim() ? str.trim().split(/\s+/).length : 0;
}

function TimerRing({ remainingMs }) {
  const total = 7 * 60 * 1000;
  const pct = Math.max(0, remainingMs / total);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const color = pct > 0.3 ? "#3b82f6" : pct > 0.1 ? "#f59e0b" : "#ef4444";

  return (
    <div
      className="timer-ring-wrap"
      title={`Expires in ${formatTime(remainingMs)}`}
    >
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="4"
        />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${circ * pct} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dasharray 1s linear, stroke 1s" }}
        />
      </svg>
      <div className="timer-ring-label">{formatTime(remainingMs)}</div>
    </div>
  );
}

// Render text as proper paragraphs
function StoryBody({ text }) {
  const paragraphs = text.split(/\n+/).filter((p) => p.trim());
  return (
    <div className="story-body">
      {paragraphs.map((para, i) => (
        <p key={i} className="story-para">
          {para}
        </p>
      ))}
    </div>
  );
}

export default function ContextDisplay({
  context,
  loading,
  remainingMs,
  liked,
  onLike,
  onWrite,
  cooldown,
}) {
  if (loading) {
    return (
      <div className="ctx-empty">
        <div className="ctx-spinner" />
      </div>
    );
  }

  if (!context) {
    return (
      <div className="ctx-empty">
        <div className="ctx-empty-icon">💭</div>
        <h2>No active context</h2>
        <p>
          The space is open. Share what's on your mind — a sentence or a story.
        </p>
        <button className="btn-primary" onClick={onWrite}>
          Be the first →
        </button>
      </div>
    );
  }

  const words = wordCount(context.text);
  const readingMins = Math.ceil(words / 200);

  return (
    <div className="ctx-card-wrap">
      <div className="ctx-card">
        {/* Header */}
        <div className="ctx-card-header">
          <div className="ctx-avatar">{getInitials(context.name)}</div>
          <div className="ctx-meta">
            <span className="ctx-name">{context.name}</span>
            <div className="ctx-meta-row">
              <span className="ctx-badge">
                <span className="ctx-badge-dot" />
                Active
              </span>
              <span className="ctx-meta-sep">·</span>
              <span className="ctx-reading">
                {words.toLocaleString()} words
                {words > 50 && ` · ~${readingMins} min read`}
              </span>
            </div>
          </div>
          <TimerRing remainingMs={remainingMs} />
        </div>

        {/* Story */}
        <div className="ctx-body">
          <StoryBody text={context.text} />
        </div>

        {/* Footer */}
        <div className="ctx-card-footer">
          <button
            className={`btn-like ${liked ? "liked" : ""}`}
            onClick={onLike}
            aria-label="Like"
          >
            {liked ? "❤️" : "🤍"} {context.likes}{" "}
            {context.likes === 1 ? "like" : "likes"}
          </button>
          <span className="ctx-expire-note">
            Expires in {formatTime(remainingMs)}
          </span>
        </div>
      </div>

      {!cooldown && (
        <div className="ctx-open-slot">
          <p>The context has expired. Share yours.</p>
          <button className="btn-primary" onClick={onWrite}>
            Write now →
          </button>
        </div>
      )}
    </div>
  );
}
