/** @format */

import { useState, useEffect, useCallback } from "react";
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import ContextDisplay from "../Components/ContextDisplay";
import WriteModal from "../Components/WriteModal";
import Footer from "../Components/Footer";
import "./styles/global.css";

const API = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL + "/api"
  : "http://localhost:5000/api";

export default function App() {
  const [context, setContext] = useState(null);
  const [remainingMs, setRemainingMs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const fetchContext = useCallback(async () => {
    try {
      const res = await fetch(`${API}/context`);
      const data = await res.json();
      setContext(data.context);
      setRemainingMs(data.remainingMs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContext();
  }, [fetchContext]);

  // Count down remainingMs every second
  useEffect(() => {
    if (remainingMs <= 0) return;
    const interval = setInterval(() => {
      setRemainingMs((prev) => {
        if (prev <= 1000) {
          setContext(null);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingMs]);

  async function handlePost(name, text) {
    const res = await fetch(`${API}/context`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, text }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    setContext(data.context);
    setRemainingMs(data.remainingMs);
    setLiked(false);
  }

  async function handleLike() {
    if (!context) return;
    const next = !liked;
    setLiked(next);
    setContext((c) => ({ ...c, likes: c.likes + (next ? 1 : -1) }));
    await fetch(`${API}/context/${context.id}/like`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ liked: next }),
    });
  }

  const cooldown = remainingMs > 0;

  return (
    <>
      <Navbar
        onWrite={() => setModalOpen(true)}
        cooldown={cooldown}
        remainingMs={remainingMs}
      />
      <Hero
        onWrite={() => setModalOpen(true)}
        cooldown={cooldown}
        remainingMs={remainingMs}
      />
      <main className="main-content">
        <ContextDisplay
          context={context}
          loading={loading}
          remainingMs={remainingMs}
          liked={liked}
          onLike={handleLike}
          onWrite={() => setModalOpen(true)}
          cooldown={cooldown}
        />
      </main>
      <Footer />
      {modalOpen && (
        <WriteModal
          onClose={() => setModalOpen(false)}
          onSubmit={handlePost}
          cooldown={cooldown}
          remainingMs={remainingMs}
        />
      )}
    </>
  );
}
