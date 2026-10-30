"use client";

import { PointerEvent, useCallback, useEffect, useRef, useState } from "react";

const brandName = "Satvic Movement";
const highlightDuration = (brandName.length - 1) * 45 + 520;

export default function StudioHome() {
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const [autoAnimating, setAutoAnimating] = useState(false);
  const characterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playNameAnimation = useCallback(() => {
    setAutoAnimating(true);
    if (animationTimer.current) clearTimeout(animationTimer.current);
    animationTimer.current = setTimeout(() => setAutoAnimating(false), highlightDuration);
  }, []);

  useEffect(() => {
    playNameAnimation();
    const interval = window.setInterval(playNameAnimation, 5000);
    return () => {
      window.clearInterval(interval);
      if (animationTimer.current) clearTimeout(animationTimer.current);
    };
  }, [playNameAnimation]);

  const onPointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType === "touch") return;
    setPointer({ x: event.clientX, y: event.clientY });
  };

  return (
    <main className="home-page">
      <header className="home-nav">
        <a className="home-brand" href="/home" aria-label="Satvic Movement home">
          <span className="home-logo" aria-hidden="true">S</span>
          <span
            className={`variable-name${autoAnimating ? " is-auto-animating" : ""}`}
            aria-label={brandName}
            onPointerMove={onPointerMove}
            onPointerLeave={() => setPointer(null)}
          >
            {Array.from(brandName).map((character, index) => {
              const element = characterRefs.current[index];
              const rect = element?.getBoundingClientRect();
              const proximity = pointer && rect
                ? Math.max(0, 1 - Math.hypot(pointer.x - (rect.left + rect.right) / 2, pointer.y - (rect.top + rect.bottom) / 2) / 100)
                : 0;
              const weight = 400 + proximity * 450;
              const isSpace = character === " ";

              return (
                <span
                  key={`${character}-${index}`}
                  ref={element => { characterRefs.current[index] = element; }}
                  className={`variable-name-character${isSpace ? " is-space" : ""}`}
                  aria-hidden="true"
                  style={{
                    fontWeight: weight,
                    transform: `translateY(${-3 * proximity}px) scale(${1 + 0.24 * proximity})`,
                    color: proximity > 0.08 ? "#58775d" : "#202124",
                    animationDelay: `${45 * index}ms`,
                  }}
                >
                  {isSpace ? "\u00a0" : character}
                </span>
              );
            })}
          </span>
        </a>
      </header>
    </main>
  );
}
