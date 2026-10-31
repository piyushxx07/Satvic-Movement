"use client";

import { PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import TargetCursor from "../../components/TargetCursor";
import { Iphone } from "@/components/ui/iphone";
import LoadingLines from "@/components/ui/loading-lines";

const brandName = "Satvic Movement";
const highlightDuration = (brandName.length - 1) * 45 + 520;
const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
};

type PointerPosition = { x: number; y: number };

const videoSequence = [
  { state: "Assam", slug: "assam", language: "assamese", label: "Assamese" },
  { state: "Gujarat", slug: "gujarat", language: "gujarati", label: "Gujarati" },
  { state: "Karnataka", slug: "karnataka", language: "kannada", label: "Kannada" },
  { state: "Kerala", slug: "kerala", language: "malayalam", label: "Malayalam" },
  { state: "Maharashtra", slug: "maharashtra", language: "marathi", label: "Marathi" },
  { state: "Odisha", slug: "odisha", language: "odia", label: "Odia" },
  { state: "Punjab", slug: "punjab", language: "punjabi", label: "Punjabi" },
  { state: "Tamil Nadu", slug: "tamilnadu", language: "tamil", label: "Tamil" },
  { state: "Telangana", slug: "telangana", language: "telugu", label: "Telugu" },
  { state: "West Bengal", slug: "westbengal", language: "bengali", label: "Bengali" },
];

type VideoItem = (typeof videoSequence)[number];

function SatvicBrand() {
  const [pointer, setPointer] = useState<PointerPosition | null>(null);
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

  return (
    <a className="home-brand cursor-target" data-cursor-label="Home" href="/home" aria-label="Satvic Movement home">
      <span className="home-logo" aria-hidden="true">S</span>
      <span
        className={`variable-name${autoAnimating ? " is-auto-animating" : ""}`}
        aria-label={brandName}
        onPointerMove={event => {
          if (event.pointerType !== "touch") setPointer({ x: event.clientX, y: event.clientY });
        }}
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
  );
}

function VideoPreview({ item, onSelect, cursorLabel }: { item: VideoItem; onSelect: () => void; cursorLabel: string }) {
  return (
    <button
      className="video-preview cursor-target"
      type="button"
      aria-label={`Play ${item.label} video`}
      onClick={onSelect}
      data-cursor-label={cursorLabel}
    >
      <video src={`/api/videos/${item.slug}/${item.language}`} muted playsInline autoPlay loop preload="metadata" />
      <span className="video-preview-label">{item.label}</span>
    </button>
  );
}

export default function StudioHome() {
  const [activeIndex, setActiveIndex] = useState(4);
  const [audioLanguage, setAudioLanguage] = useState<"hindi" | "dub">("dub");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playingRef = useRef(true);
  const pendingTimeRef = useRef<number | null>(null);
  const swipeStartRef = useRef<number | null>(null);
  const dotMatrixRef = useRef<HTMLDivElement | null>(null);
  const activeVideo = videoSequence[activeIndex];

  useEffect(() => {
    playingRef.current = isPlaying;
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) void video.play().catch(() => setIsPlaying(false));
    else video.pause();
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime || 0);
    const updateDuration = () => setDuration(Number.isFinite(video.duration) ? video.duration : 0);
    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("durationchange", updateDuration);
    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("durationchange", updateDuration);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsSwitching(true);
    let revealTimer: ReturnType<typeof setTimeout> | undefined;
    let readyHandled = false;
    const onReady = () => {
      if (readyHandled) return;
      readyHandled = true;
      const pendingTime = pendingTimeRef.current;
      if (pendingTime !== null) {
        const latestAllowedTime = Number.isFinite(video.duration) ? Math.max(0, video.duration - 0.1) : pendingTime;
        video.currentTime = Math.min(pendingTime, latestAllowedTime);
        pendingTimeRef.current = null;
        setCurrentTime(video.currentTime);
      }
      setDuration(Number.isFinite(video.duration) ? video.duration : 0);
      if (playingRef.current) void video.play().catch(() => setIsPlaying(false));
      revealTimer = setTimeout(() => setIsSwitching(false), 180);
    };
    const onError = () => {
      readyHandled = true;
      setIsSwitching(false);
    };

    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("error", onError, { once: true });
    if (video.readyState >= 2) onReady();
    else video.load();

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("error", onError);
      if (revealTimer) clearTimeout(revealTimer);
    };
  }, [audioLanguage, activeIndex]);

  const onContentPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dotMatrix = dotMatrixRef.current;
    if (!dotMatrix) return;
    dotMatrix.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    dotMatrix.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    dotMatrix.classList.add("is-visible");
  };

  const hideDotMatrix = () => dotMatrixRef.current?.classList.remove("is-visible");

  const switchLanguage = (language: "hindi" | "dub") => {
    if (language === audioLanguage) return;
    pendingTimeRef.current = videoRef.current?.currentTime ?? currentTime;
    setIsSwitching(true);
    setAudioLanguage(language);
  };

  const moveCarousel = (direction: number) => {
    pendingTimeRef.current = 0;
    setCurrentTime(0);
    setAudioLanguage("dub");
    setIsPlaying(true);
    setActiveIndex(index => (index + direction + videoSequence.length) % videoSequence.length);
  };

  const selectVideo = (index: number) => {
    if (index === activeIndex) return;
    pendingTimeRef.current = 0;
    setCurrentTime(0);
    setAudioLanguage("dub");
    setIsPlaying(true);
    setActiveIndex(index);
  };

  const handleSwipeEnd = (event: PointerEvent<HTMLElement>) => {
    if (swipeStartRef.current === null) return;
    const distance = event.clientX - swipeStartRef.current;
    swipeStartRef.current = null;
    if (Math.abs(distance) > 55) moveCarousel(distance < 0 ? 1 : -1);
  };

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
      {isSwitching && <LoadingLines className="site-loading-overlay" />}
      <header className="home-nav">
        <SatvicBrand />
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
        onPointerLeave={hideDotMatrix}
        onPointerDown={event => {
          const target = event.target as HTMLElement;
          swipeStartRef.current = target.closest("button, input") ? null : event.clientX;
        }}
        onPointerUp={handleSwipeEnd}
        onPointerCancel={() => { swipeStartRef.current = null; }}
      >
        <div ref={dotMatrixRef} className="dot-matrix" aria-hidden="true" />
        <h2 className="demo-showcase-title">Some Demo Videos</h2>
        <div className="demo-showcase">
        <div className="video-carousel" aria-label="Language video carousel">
          {[-3, -2, -1, 1, 2, 3].map(offset => {
            const index = (activeIndex + offset + videoSequence.length) % videoSequence.length;
            const item = videoSequence[index];
            return (
              <div
                key={`${offset}-${item.slug}`}
                className={`video-preview-slot video-preview-${Math.abs(offset)} ${offset < 0 ? "is-left" : "is-right"}`}
              >
                <VideoPreview item={item} onSelect={() => selectVideo(index)} cursorLabel={item.label} />
              </div>
            );
          })}
          <button className="carousel-arrow carousel-arrow-left cursor-target" type="button" aria-label="Previous language video" onClick={() => moveCarousel(-1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 5-7 7 7 7" /></svg>
          </button>
          <button className="carousel-arrow carousel-arrow-right cursor-target" type="button" aria-label="Next language video" onClick={() => moveCarousel(1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 5 7 7-7 7" /></svg>
          </button>
        <div className={`phone-player${isSwitching ? " is-switching" : ""}`}>
          <Iphone
            className="iphone-mockup"
            aria-label={`${activeVideo.state} ${audioLanguage === "hindi" ? "Hindi" : activeVideo.label} video player`}
            videoSrc={`/api/videos/${activeVideo.slug}/${audioLanguage === "hindi" ? "hindi" : activeVideo.language}`}
            videoRef={videoRef}
            videoAutoPlay={isPlaying}
            videoMuted={isMuted}
          />
          <div className="phone-controls">
            <div className="phone-status-row">
              <div>
                <span className="phone-control-kicker">{activeVideo.state.toUpperCase()} · AUDIO</span>
                <strong className="phone-active-language">{audioLanguage === "hindi" ? "Hindi original" : `${activeVideo.label} dub`}</strong>
              </div>
              <span className={`phone-play-state${isPlaying ? "" : " is-paused"}`}><i />{isPlaying ? "PLAYING" : "PAUSED"}</span>
            </div>
            <div className="phone-language-switch" role="group" aria-label="Choose audio language">
              <button className={`phone-language-button cursor-target${audioLanguage === "hindi" ? " is-active" : ""}`} data-cursor-label="Hindi" type="button" aria-pressed={audioLanguage === "hindi"} onClick={() => switchLanguage("hindi")}>Hindi</button>
              <button className={`phone-language-button cursor-target${audioLanguage === "dub" ? " is-active" : ""}`} data-cursor-label={activeVideo.label} type="button" aria-pressed={audioLanguage === "dub"} onClick={() => switchLanguage("dub")}>{activeVideo.label}</button>
            </div>
            <div className="phone-progress">
              <input
                aria-label="Video position"
                type="range"
                min={0}
                max={duration || 1}
                step="0.1"
                value={Math.min(currentTime, duration || 1)}
                onChange={event => {
                  const nextTime = Number(event.target.value);
                  if (videoRef.current) videoRef.current.currentTime = nextTime;
                  setCurrentTime(nextTime);
                }}
              />
              <div><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
            </div>
            <div className="phone-actions">
              <button className="cursor-target" data-cursor-label={isPlaying ? "Pause" : "Play"} type="button" onClick={() => setIsPlaying(value => !value)} aria-label={isPlaying ? "Pause video" : "Play video"}>
                <span className="phone-action-icon"><svg viewBox="0 0 16 16" aria-hidden="true">{isPlaying ? <rect x="3" y="3" width="10" height="10" rx="1.5" /> : <path d="M5 3.5 13 8l-8 4.5z" />}</svg></span>{isPlaying ? "Pause" : "Play"}
              </button>
              <button className="cursor-target" data-cursor-label={isMuted ? "Unmute" : "Mute"} type="button" onClick={() => setIsMuted(value => !value)} aria-label={isMuted ? "Unmute video" : "Mute video"} aria-pressed={isMuted}>
                <span className="phone-action-icon"><svg viewBox="0 0 18 16" aria-hidden="true"><path d="M2 6v4h3l4 3V3L5 6H2Z" />{isMuted ? <path d="m12 6 4 4m0-4-4 4" /> : <path d="M12 6c1.5 1 1.5 3 0 4m2-6c3 2 3 6 0 8" />}</svg></span>{isMuted ? "Muted" : "Sound on"}
              </button>
            </div>
          </div>
        </div>
        </div>
        </div>
      </section>
    </main>
  );
}
