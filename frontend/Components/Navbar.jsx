/** @format */

import { formatTime } from "../src/utils/time";

export default function Navbar({ onWrite, cooldown, remainingMs }) {
  return (
    <nav className="navbar">
      <span className="nav-logo">CONTEXT</span>
      <button
        className={`nav-write-btn ${cooldown ? "locked" : ""}`}
        onClick={onWrite}
        title={
          cooldown
            ? `Locked for ${formatTime(remainingMs)}`
            : "Share your context"
        }
      >
        {cooldown ? (
          <>
            <span className="lock-icon">🔒</span>
            <span>{formatTime(remainingMs)}</span>
          </>
        ) : (
          <>✏ Write</>
        )}
      </button>
    </nav>
  );
}
