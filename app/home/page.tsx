"use client";

import { PointerEvent, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import TargetCursor from "../../components/TargetCursor";
import { Iphone } from "@/components/ui/iphone";
import ProfileCard from "@/components/ui/profile-card";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/reui/timeline";

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

const projectJourney = [
  {
    id: 1,
    date: "2023 - 2024",
    title: "Building foundations",
    description: "Explored web development fundamentals and started turning ideas into small, working projects.",
  },
  {
    id: 2,
    date: "2024 - 2025",
    title: "Learning through projects",
    description: "Built practical experience by designing, developing, and refining responsive web experiences.",
  },
  {
    id: 3,
    date: "2025 - 2026",
    title: "Expanding my experience",
    description: "Deepening my skills through new projects, feedback, and hands-on problem solving.",
  },
  {
    id: 4,
    date: "2026 - 2027",
    title: "Growing with purpose",
    description: "Continuing to learn, take on new challenges, and create thoughtful digital experiences.",
  },
];

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
  const [contactOpen, setContactOpen] = useState(false);
  const [contactClosing, setContactClosing] = useState(false);
  const [journeyIndex, setJourneyIndex] = useState(0);
  const [contactOrigin, setContactOrigin] = useState({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const contactButtonRef = useRef<HTMLButtonElement | null>(null);
  const contactDialogRef = useRef<HTMLDivElement | null>(null);
  const contactCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingRef = useRef(true);
  const pendingTimeRef = useRef<number | null>(null);
  const swipeStartRef = useRef<number | null>(null);
  const dotMatrixRef = useRef<HTMLDivElement | null>(null);
  const hireDotMatrixRef = useRef<HTMLDivElement | null>(null);
  const activeVideo = videoSequence[activeIndex];

  const closeContact = () => {
    const button = contactButtonRef.current?.getBoundingClientRect();
    const dialog = contactDialogRef.current;
    if (button && dialog) {
      const card = dialog.getBoundingClientRect();
      const dockX = button.left + button.width / 2 - (card.left + card.width / 2);
      const dockY = button.top + button.height / 2 - (card.top + card.height / 2);
      const currentTransform = getComputedStyle(dialog).transform;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      dialog.animate(
        [
          { transform: currentTransform, opacity: 1 },
          { transform: `translate(${dockX}px, ${dockY}px) scale(.12)`, opacity: 0 },
        ],
        { duration: reduceMotion ? 1 : 480, easing: "cubic-bezier(.55, 0, .8, .35)", fill: "forwards" },
      );
    }
    setContactClosing(true);
    if (contactCloseTimer.current) clearTimeout(contactCloseTimer.current);
    contactCloseTimer.current = setTimeout(() => {
      setContactOpen(false);
      setContactClosing(false);
    }, 500);
  };

  useEffect(() => {
    if (!contactOpen) return;
    document.querySelector<HTMLButtonElement>(".profile-dialog-close")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeContact();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      contactButtonRef.current?.focus();
    };
  }, [contactOpen]);

  useEffect(() => () => {
    if (contactCloseTimer.current) clearTimeout(contactCloseTimer.current);
  }, []);

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
    video.addEventListener("loadeddata", onReady, { once: true });
    if (video.readyState >= 2) onReady();
    else video.load();

    return () => {
      video.removeEventListener("loadeddata", onReady);
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
  const onHirePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dotMatrix = hireDotMatrixRef.current;
    if (!dotMatrix) return;
    dotMatrix.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    dotMatrix.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    dotMatrix.classList.add("is-visible");
  };
  const hideHireDotMatrix = () => hireDotMatrixRef.current?.classList.remove("is-visible");

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
      {!contactOpen && <TargetCursor
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
      />}
      <header className="home-nav">
        <SatvicBrand />
        <button ref={contactButtonRef} className={`chance-button cursor-target${contactOpen ? " is-contact-open" : ""}`} data-cursor-label="Contact me" type="button" aria-label="Contact me" aria-haspopup="dialog" aria-expanded={contactOpen} onClick={() => {
          const rect = contactButtonRef.current?.getBoundingClientRect();
          if (rect) setContactOrigin({ x: rect.left + rect.width / 2 - window.innerWidth / 2, y: rect.top + rect.height / 2 - window.innerHeight / 2 });
          setContactClosing(false);
          setContactOpen(true);
        }}>
          <span>Contact me</span>
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
      <section className="journey-section" aria-labelledby="journey-heading">
        <div className="journey-heading-group">
          <span className="journey-eyebrow">Experience &amp; learning</span>
          <h2 id="journey-heading" className="journey-heading">My Journey &amp; Growth</h2>
          <p className="journey-intro">A little about what I have been learning and building along the way.</p>
        </div>
        <div className="journey-controls">
          <button className="journey-year-button" type="button" aria-label={`Previous year: ${projectJourney[(journeyIndex - 1 + projectJourney.length) % projectJourney.length].date}`} onClick={() => setJourneyIndex(index => (index - 1 + projectJourney.length) % projectJourney.length)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7 7-7-7 7-7" /></svg>
            Previous year
          </button>
          <button className="journey-year-button" type="button" aria-label={`Next year: ${projectJourney[(journeyIndex + 1) % projectJourney.length].date}`} onClick={() => setJourneyIndex(index => (index + 1) % projectJourney.length)}>
            Next year
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
          </button>
        </div>
        <div className="journey-timeline-viewport">
          <div className="journey-track-stops" aria-hidden="true">
            {projectJourney.map((item, index) => (
              <span
                key={item.id}
                className={`journey-track-stop${index === journeyIndex ? " is-current" : ""}`}
                style={{ left: `${12 + index * (76 / (projectJourney.length - 1))}%` }}
              />
            ))}
          </div>
          <img className="journey-car" src="/timeline.png" alt="" aria-hidden="true" style={{ left: `calc(${12 + journeyIndex * (76 / (projectJourney.length - 1))}% - 38px)` }} />
          <Timeline defaultValue={journeyIndex + 1} orientation="horizontal" className="journey-timeline" style={{ transform: `translateX(-${journeyIndex * 25}%)` }}>
            {projectJourney.map(item => (
              <TimelineItem key={item.id} step={item.id} className="journey-timeline-item">
                <TimelineHeader>
                  <TimelineSeparator />
                  <TimelineDate>{item.date}</TimelineDate>
                  <TimelineTitle>{item.title}</TimelineTitle>
                  <TimelineIndicator />
                </TimelineHeader>
                <TimelineContent>{item.description}</TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </section>
      <section className="hire-section" aria-labelledby="hire-heading" onPointerMove={onHirePointerMove} onPointerLeave={hideHireDotMatrix}>
        <div ref={hireDotMatrixRef} className="dot-matrix hire-dot-matrix" aria-hidden="true" />
        <h2 id="hire-heading" className="hire-heading">Why you should hire me</h2>
        <img className="hire-portrait" src="/profile_pic.jpg" alt="Piyush Kumar" />
        <h3 className="hire-name">Piyush Kumar</h3>
        <p className="hire-copy">
          I bring curiosity, care, and a hands-on approach to every project.<br className="hire-copy-break" />
          I turn thoughtful ideas into clear, useful experiences people enjoy.
        </p>
      </section>
      {contactOpen && typeof document !== "undefined" && createPortal(
        <div className={`profile-dialog-backdrop${contactClosing ? " is-closing" : ""}`} onMouseDown={event => { if (event.target === event.currentTarget) closeContact(); }}>
          <div ref={contactDialogRef} className="profile-dialog" style={{ "--launch-x": `${contactOrigin.x}px`, "--launch-y": `${contactOrigin.y}px` } as CSSProperties & Record<`--${string}`, string | number>} role="dialog" aria-modal="true" aria-label="Contact profile">
            <button className="profile-dialog-close" type="button" aria-label="Close profile" onClick={closeContact}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
            <ProfileCard
              name="Piyush Kumar"
              title=""
              handle=""
              status=""
              phoneNumber="8822550747"
              emailAddress="piyushkumaryadav2027@gmail.com"
              avatarUrl="/profile_pic.jpg"
              holo={0.8}
              glare={0.5}
              tiltStrength={12}
              parallax={8}
              radius={16}
              enableTilt
              intro
              showUserInfo
              theme="dark"
            />
          </div>
        </div>,
        document.body,
      )}
    </main>
  );
}
