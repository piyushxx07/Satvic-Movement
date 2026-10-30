"use client";

import { PointerEvent, CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import TargetCursor from "../../components/TargetCursor";
import { Iphone } from "@/components/ui/iphone";

const brandName = "Satvic Movement";
const highlightDuration = (brandName.length - 1) * 45 + 520;

type PointerPosition = { x: number; y: number };

export default function StudioHome() {
  const [pointer, setPointer] = useState<PointerPosition | null>(null);
  const [dotPointer, setDotPointer] = useState<PointerPosition | null>(null);
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

  const onNamePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType === "touch") return;
    setPointer({ x: event.clientX, y: event.clientY });
  };

  const onContentPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setDotPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const dotStyle = dotPointer ? ({
    "--pointer-x": `${dotPointer.x}px`,
    "--pointer-y": `${dotPointer.y}px`,
  } as CSSProperties) : undefined;

  return (
    <main className="home-page">
      <TargetCursor
        spinDuration={2}
        hoverDuration={0.2}
        size={36}
        cornerSize={12}
        thickness={3}
        padding={6}
        dotSize={4}
        cursorColor="#ffffff"
        cursorColorOnTarget="#ffffff"
        blendMode="difference"
        parallaxOn
        matchRadius
        showLabel
        clickEffect
        hideDefaultCursor
        container={undefined}
      />
      <header className="home-nav">
        <a className="home-brand cursor-target" data-cursor-label="Home" href="/home" aria-label="Satvic Movement home">
          <span className="home-logo" aria-hidden="true">S</span>
          <span
            className={`variable-name${autoAnimating ? " is-auto-animating" : ""}`}
            aria-label={brandName}
            onPointerMove={onNamePointerMove}
            onPointerLeave={() => setPointer(null)}
          >
            {Array.from(brandName).map((character, index) => {
              const element = characterRefs.current[index];
              const rect = element?.getBoundingClientRect();
              const proximity = pointer && rect
                ? Math.max(0, 1 - Math.hypot(pointer.x - (rect.left + rect.right) / 2, pointer.y - (rect.top + rect.bottom) / 2) / 100)
                : 0;
              const isSpace = character === " ";
              const isSatvic = index < "Satvic".length;
              const weight = (isSatvic ? 600 : 400) + proximity * 400;

              return (
                <span
                  key={`${character}-${index}`}
                  ref={element => { characterRefs.current[index] = element; }}
                  className={`variable-name-character${isSpace ? " is-space" : ""}${isSatvic ? " is-bold" : ""}`}
                  aria-hidden="true"
                  style={{
                    fontWeight: weight,
                    transform: `translateY(${-3 * proximity}px) scale(${1 + 0.24 * proximity})`,
                    color: proximity > 0.08 ? "#3157e8" : "#111827",
                    animationDelay: `${45 * index}ms`,
                  }}
                >
                  {isSpace ? "\u00a0" : character}
                </span>
              );
            })}
          </span>
        </a>
        <button className="chance-button cursor-target" data-cursor-label="Open" type="button" aria-label="Give me a Chance">
          <span>Give me a Chance</span>
          <span className="chance-button-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </header>
      <section
        className="home-canvas"
        aria-label="Satvic Movement home"
        onPointerMove={onContentPointerMove}
        onPointerLeave={() => setDotPointer(null)}
      >
        <div className={`dot-matrix${dotPointer ? " is-visible" : ""}`} style={dotStyle} aria-hidden="true" />
        <div className="hero-layout">
          <div className="hero-copy">
            <p className="hero-eyebrow"><span /> SATVIC VIDEO LANGUAGE STUDIO</p>
            <h1>One story.<br /><span>Every language.</span></h1>
            <p className="hero-description">A home for Satvic videos to find new voices — from the original to the final upload.</p>
            <div className="hero-language-list" aria-label="Available dubbing languages">
              <span>Tamil</span><span>Telugu</span><span>Kannada</span><span className="more-languages">+ more</span>
            </div>
          </div>
          <div className="hero-device">
            <Iphone src="/satvic-studio-screen.svg" className="iphone-mockup" aria-label="Satvic video language studio shown on a phone" />
          </div>
        </div>
      </section>
    </main>
  );
}
