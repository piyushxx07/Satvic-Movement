"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const INTRO_DURATION = 6000;
const FADE_DURATION = 850;

export default function Welcome() {
  const router = useRouter();
  const [remaining, setRemaining] = useState(6);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const startedAt = Date.now();
    const ticker = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setRemaining(Math.max(0, Math.ceil((INTRO_DURATION - elapsed) / 1000)));
    }, 150);
    const fadeTimer = window.setTimeout(() => setLeaving(true), INTRO_DURATION);
    const routeTimer = window.setTimeout(() => router.replace("/home"), INTRO_DURATION + FADE_DURATION);

    return () => {
      window.clearInterval(ticker);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(routeTimer);
    };
  }, [router]);

  return (
    <main className={`intro-splash${leaving ? " is-leaving" : ""}`}>
      <div className="intro-emblem" aria-hidden="true">
        <span className="intro-orbit intro-orbit-one" />
        <span className="intro-orbit intro-orbit-two" />
        <span className="intro-orbit intro-orbit-three" />
        <span className="intro-logo">S</span>
      </div>
      <p className="intro-caption">SATVIC MOVEMENT</p>
      <p className="intro-countdown" role="status" aria-live="off">
        <span>Opening your space</span><b>{remaining}s</b>
      </p>
    </main>
  );
}
