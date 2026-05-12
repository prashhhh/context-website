/** @format */

import { useState, useEffect, useRef } from "react";
import { formatTime } from "../src/utils/time";

const MAX = 50000;

function wordCount(str) {
  return str.trim() ? str.trim().split(/\s+/).length : 0;
}

export default function WriteModal({
  onClose,
  onSubmit,
  cooldown,
  remainingMs,
}) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const textRef = useRef(null);

  useEffect(() => {
    if (!cooldown) textRef.current?.focus();
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, cooldown]);

  // Auto-grow textarea
  function handleTextChange(e) {
    setText(e.target.value);
    setError("");
    const el = textRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }

  async function handleSubmit() {
    if (!text.trim() || submitting || cooldown) return;
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(name.trim() || "Anonymous", text.trim());
      setDone(true);
      setTimeout(onClose, 1400);
    } catch (err) {
      setError(
        err?.error === "cooldown"
          ? `Someone just shared. Try again in ${formatTime(err.remainingMs)}.`
          : "Something went wrong. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const charsLeft = MAX - text.length;
  const words = wordCount(text);
  const isOver = charsLeft < 0;
  const readingMins = Math.ceil(words / 200); // avg 200 wpm

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal modal-large" role="dialog" aria-modal="true">
        {done ? (
          <div className="modal-success">
            <div className="modal-success-icon">✓</div>
            <p>Your context is live!</p>
          </div>
        ) : cooldown ? (
          <div className="modal-locked">
            <div className="modal-lock-icon">🔒</div>
            <h2>Context is active</h2>
            <p>Someone's context is currently live :</p>
            <div className="modal-countdown">{formatTime(remainingMs)}</div>
            {/* <p className="modal-locked-sub">Only one context at a time.</p> */}
            <button className="btn-ghost" onClick={onClose}>
              Got it
            </button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2>Share your context</h2>
              <button
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="field">
                <label htmlFor="name-input">Your name</label>
                <input
                  id="name-input"
                  type="text"
                  placeholder="Anonymous"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                />
              </div>

              <div className="field">
                <label htmlFor="text-input">
                  What's your context?
                  <span className="label-hint">
                    Stories, thoughts, anything — write freely.
                  </span>
                </label>
                <textarea
                  id="text-input"
                  ref={textRef}
                  className="textarea-story"
                  placeholder={
                    "Start writing here...\n\nYou can write a short thought or a long story — there's no limit on how much you share. This space is yours for the next 17 minutes."
                  }
                  value={text}
                  onChange={handleTextChange}
                />
                <div className="textarea-stats">
                  <span
                    className={`char-count ${charsLeft < 500 ? (isOver ? "over" : "warn") : ""}`}
                  >
                    {isOver
                      ? `${Math.abs(charsLeft)} over limit`
                      : `${charsLeft.toLocaleString()} chars left`}
                  </span>
                  <span className="word-count">
                    {words.toLocaleString()} {words === 1 ? "word" : "words"}
                    {words > 50 && <> · ~{readingMins} min read</>}
                  </span>
                </div>
              </div>

              {error && <div className="modal-error">{error}</div>}

              <div className="modal-note">
                ⏱ Your context will disappear after <strong>17 minutes</strong>.
                Write as much as you want.
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={!text.trim() || isOver || submitting}
              >
                {submitting ? "Posting…" : "Share context"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
