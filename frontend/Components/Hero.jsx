/** @format */

import { formatTime } from "../src/utils/time";

export default function Hero({ onWrite, cooldown, remainingMs }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to Context</h1>
        <p>One thought at a time. Share yours — it lives for 17 minutes.</p>
        <button
          className={`hero-btn ${cooldown ? "hero-btn-locked" : ""}`}
          onClick={onWrite}
        >
          {cooldown
            ? `Next context in ${formatTime(remainingMs)}`
            : "Share your context →"}
        </button>
      </div>
    </section>
  );
}
