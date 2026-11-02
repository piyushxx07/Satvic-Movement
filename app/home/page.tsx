"use client";

import { PointerEvent, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import TargetCursor from "../../components/TargetCursor";
import { Iphone } from "@/components/ui/iphone";
import ProfileCard from "@/components/ui/profile-card";
import { LiquidMetalButton } from "@/components/ui/liquid-metal";

const Lanyard = dynamic(() => import("@/components/ui/Lanyard"), {
  ssr: false,
  loading: () => <div className="lanyard-loading">Preparing your card…</div>,
});

const brandName = "Satvic Movement";
const highlightDuration = (brandName.length - 1) * 45 + 520;
const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
};

function renderJourneyParagraph(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : part,
  );
}

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
    date: "2023 – 2024",
    theme: "Where it started",
    cards: [
      { title: "A New Beginning", paragraphs: ["Coming from an **Army background**, moving into civilian college life was a new experience. I started my B.Tech at Vishwakarma University, Pune, and began exploring web development."] },
      { title: "Building & Earning", paragraphs: ["I started building websites and turned my skills into freelance work. One of my first earnings went towards buying my own **scientific calculator**."] },
      { title: "Mivyapar — My First Venture", paragraphs: ["In March 2024, I **co-founded Mivyapar**, a website development venture. I led a **team of 7**, handled clients and project execution, and generated approximately **₹50,000 in revenue**."] },
    ],
  },
  {
    id: 2,
    date: "2024 – 2025",
    theme: "Learning to lead",
    cards: [
      { title: "Learning the Hard Side of Leadership", paragraphs: ["Mivyapar continued until August 2024, when internal team conflicts forced us to stop. I tried resolving them, but learned that **leading people is as challenging as building a business**."] },
      { title: "Leading My First Hackathon Team", paragraphs: ["I built and led my own hackathon team for the first time. When teammates felt exhausted, I kept them motivated, and we **secured 2 prizes**."] },
      { title: "Exploring Beyond College", paragraphs: ["I continued **freelancing and volunteering** at events and hackathons, gaining experience in coordination, teamwork, and working with different people."] },
    ],
  },
  {
    id: 3,
    date: "2025 – 2026",
    theme: "From building to solving business problems",
    cards: [
      { title: "Understanding Business", paragraphs: ["Joined a college counselling firm for an **8-month internship as a Business Developer**. Worked on requirement gathering, client handling, and understanding business needs."] },
      { title: "Building AI-Powered Solutions", paragraphs: ["Developed a college recommendation application using Django and MongoDB, based on **5,000 student records**. Also built an **AI-powered brochure generator** that reduced document creation from hours to **under 10 minutes**."] },
      { title: "Learning to Make Decisions", paragraphs: ["Managed Meta Ads campaigns with an approximately **$435 budget**, increasing engagement by **40%** and leads by **38%**. Presented campaign insights and recommendations to non-technical stakeholders."] },
    ],
  },
  {
    id: 4,
    date: "2026 – 2027",
    theme: "The next chapter",
    cards: [
      { title: "Looking Beyond the Classroom", paragraphs: ["Currently in my final year of B.Tech Computer Engineering, looking for opportunities to work on **meaningful business problems** and take greater responsibility."] },
      { title: "Ready for Bigger Challenges", paragraphs: ["I enjoy working at the intersection of **business, technology, communication, and execution**. I am comfortable learning new tools and figuring things out without waiting for detailed instructions."] },
      { title: "The Next Chapter — Satvic", paragraphs: ["I understand this is a **full-time role**, and I am ready to commit. I am also open to starting as an intern to demonstrate my capabilities.", "I want to work closely with the founders, **take ownership of projects, and turn ideas into reality**. That's the kind of work I want to do."] },
    ],
  },
];

const satvicFitPoints = [
  "I admire how Satvic is building a movement, not just a business, by helping people rethink their food and lifestyle choices.",
  "I have personally used Satvic's Enema Kit, and it was a meaningful experience for me. I also noticed a positive change in my hair fall, which made my connection with Satvic more personal.",
  "I believe food, nature, and everyday habits deserve more attention in a world that often looks for quick health solutions.",
  "I want to use my skills in technology, business, and execution to contribute to a mission that creates a positive impact on people's lives.",
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
      <img className="home-logo" src="/logo.jpg" alt="" aria-hidden="true" />
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
  const [isMuted, setIsMuted] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactClosing, setContactClosing] = useState(false);
  const [journeyIndex, setJourneyIndex] = useState(0);
  const [journeyFromIndex, setJourneyFromIndex] = useState(0);
  const [journeyMoving, setJourneyMoving] = useState(false);
  const [contactOrigin, setContactOrigin] = useState({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const contactButtonRef = useRef<HTMLButtonElement | null>(null);
  const contactDialogRef = useRef<HTMLDivElement | null>(null);
  const contactCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hireQuoteDotMatrixRef = useRef<HTMLDivElement | null>(null);
  const journeyMotionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingRef = useRef(true);
  const pendingTimeRef = useRef<number | null>(null);
  const swipeStartRef = useRef<number | null>(null);
  const dotMatrixRef = useRef<HTMLDivElement | null>(null);
  const activeVideo = videoSequence[activeIndex];

  const changeJourney = (index: number) => {
    if (journeyMotionTimer.current) clearTimeout(journeyMotionTimer.current);
    setJourneyFromIndex(journeyIndex);
    setJourneyIndex(index);
    setJourneyMoving(true);
    journeyMotionTimer.current = setTimeout(() => setJourneyMoving(false), 720);
  };

  useEffect(() => () => {
    if (journeyMotionTimer.current) clearTimeout(journeyMotionTimer.current);
  }, []);

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
    video.muted = isMuted;
    if (isPlaying) {
      void video.play().catch(() => {
        if (!video.muted) {
          video.muted = true;
          setIsMuted(true);
          void video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        } else {
          setIsPlaying(false);
        }
      });
    } else video.pause();
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
      if (playingRef.current) {
        void video.play().catch(() => {
          if (!video.muted) {
            video.muted = true;
            setIsMuted(true);
            void video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          } else {
            setIsPlaying(false);
          }
        });
      }
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
  const onHireQuotePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dotMatrix = hireQuoteDotMatrixRef.current;
    if (!dotMatrix) return;
    dotMatrix.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    dotMatrix.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    dotMatrix.classList.add("is-visible");
  };
  const hideHireQuoteDotMatrix = () => hireQuoteDotMatrixRef.current?.classList.remove("is-visible");
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
        <div className="home-nav-actions">
        <button ref={contactButtonRef} className={`chance-button contact-nav-button cursor-target${contactOpen ? " is-contact-open" : ""}`} data-cursor-label="Contact me" type="button" aria-label="Contact me" aria-haspopup="dialog" aria-expanded={contactOpen} onClick={() => {
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
            <svg className="contact-phone-icon" viewBox="0 0 24 24" fill="none"><path d="M7.2 3.8 9.7 7l-1.6 2.1a14.1 14.1 0 0 0 6.8 6.8l2.1-1.6 3.2 2.5-.8 3.1c-.2.8-1 1.3-1.8 1.2C9.9 20 4 14.1 2.9 6.4c-.1-.8.4-1.6 1.2-1.8l3.1-.8Z" /></svg>
          </span>
        </button>
        </div>
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
        <h2 id="work" className="demo-showcase-title">My First Six Months: Bringing Satvic to More Languages</h2>
        <p className="demo-showcase-subtitle">Working with the founder to dub Satvic videos for regional audiences.</p>
        <p className="demo-showcase-instruction"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z" /><path d="M17 9a5 5 0 0 1 0 6m2-9a9 9 0 0 1 0 12" /></svg><span><strong>Press play, then turn on sound</strong> to hear the regional dub.</span></p>
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
              <button className="cursor-target" data-cursor-label={isMuted ? "Unmute" : "Mute"} type="button" onClick={() => {
                const video = videoRef.current;
                if (isMuted) {
                  if (video) {
                    video.muted = false;
                    void video.play().then(() => setIsPlaying(true)).catch(() => {
                      video.muted = true;
                      setIsMuted(true);
                    });
                  }
                  setIsMuted(false);
                } else {
                  if (video) video.muted = true;
                  setIsMuted(true);
                }
              }} aria-label={isMuted ? "Unmute video" : "Mute video"} aria-pressed={isMuted}>
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
          <h2 id="journey-heading" className="journey-heading">My Journey &amp; Growth</h2>
          <p className="journey-intro">A little about what I have been learning and building along the way.</p>
        </div>
        <div className="journey-controls">
          <button className="journey-year-button" type="button" aria-label="Previous year" disabled={journeyIndex === 0} onClick={() => changeJourney(Math.max(0, journeyIndex - 1))}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7 7-7-7 7-7" /></svg>
            Previous year
          </button>
          <button className="journey-year-button" type="button" aria-label="Next year" disabled={journeyIndex === projectJourney.length - 1} onClick={() => changeJourney(Math.min(projectJourney.length - 1, journeyIndex + 1))}>
            Next year
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
          </button>
        </div>
        <p className="journey-current-year" aria-live="polite">{projectJourney[journeyIndex].date}</p>
        <div className={`journey-years${journeyMoving ? " is-moving" : ""}`} role="group" aria-label="Choose a year">
          <span className="journey-years-progress" aria-hidden="true" style={{ left: `calc(12.5% + ${Math.min(journeyFromIndex, journeyIndex) * 25}%)`, width: `calc(${Math.abs(journeyFromIndex - journeyIndex) * 25}%)` }} />
          <img className="journey-car" src="/timeline.png" alt="" aria-hidden="true" style={{ left: `calc(12.5% + ${journeyIndex * 25}%)` }} />
          {projectJourney.map((item, index) => (
            <button key={item.id} type="button" className={`journey-year${index <= journeyIndex ? " is-complete" : ""}${index === journeyIndex ? " is-current" : ""}`} aria-pressed={index === journeyIndex} onClick={() => changeJourney(index)}>
              <span className="journey-year-dot" aria-hidden="true" />
              <span>{item.date}</span>
            </button>
          ))}
        </div>
        <div className="journey-chapter-heading">
          <span className="journey-chapter-index">CHAPTER <b>{String(projectJourney[journeyIndex].id).padStart(2, "0")}</b></span>
          <div>
            <h3 className="journey-theme">{projectJourney[journeyIndex].theme}</h3>
            <p>Three moments that shaped this year</p>
          </div>
        </div>
        <div className="journey-cards" key={projectJourney[journeyIndex].id}>
          {projectJourney[journeyIndex].cards.map((card, index) => (
            <div className="journey-card-wrap" key={card.title}>
              <article className="journey-card">
                <div className="journey-card-rail" aria-hidden="true">
                  <span className="journey-card-number">0{index + 1}</span>
                  <span className="journey-card-rail-mark" />
                  <span className="journey-card-rail-label">MILESTONE</span>
                </div>
                <div className="journey-card-copy">
                  <h3>{card.title}</h3>
                  {card.paragraphs.map(paragraph => <p key={paragraph}>{renderJourneyParagraph(paragraph)}</p>)}
                </div>
              </article>
              {index < 2 && (
                <svg className={`journey-sketch-arrow journey-sketch-arrow-${index + 1}`} viewBox="0 0 100 60" aria-hidden="true">
                  <path className="journey-pencil-echo" d="M5 43 C18 37 21 16 33 17 C45 18 47 46 60 43 C72 40 77 27 90 26" />
                  <path d="M5 41 C19 36 22 15 34 16 C46 17 48 44 61 41 C73 38 78 25 91 24" />
                  <path className="journey-arrow-head" d="m80 16 11 8-10 8" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="hire-quote-section" aria-labelledby="hire-quote-heading" onPointerMove={onHireQuotePointerMove} onPointerLeave={hideHireQuoteDotMatrix}>
        <div ref={hireQuoteDotMatrixRef} className="dot-matrix hire-quote-dot-matrix" aria-hidden="true" />
        <div className="hire-fit-layout">
          <div className="hire-fit-copy">
            <span className="hire-fit-kicker">FOUNDER'S OFFICE · ROLE FIT</span>
            <h2 id="hire-quote-heading">Looking for these skills? I’m the best fit for the Founder’s Office.</h2>
            <ul className="hire-fit-points">
              <li><span className="hire-fit-number">01</span><span><strong>From Idea to Execution –</strong> Built this entire website in one day and created AI dubbing samples in under an hour. Imagine what I could accomplish with a full-time opportunity.</span></li>
              <li><span className="hire-fit-number">02</span><span><strong>Ownership &amp; Initiative –</strong> I don't wait for someone to push me. I take responsibility, figure things out and make sure the work gets done.</span></li>
              <li><span className="hire-fit-number">03</span><span><strong>Language &amp; Cultural Understanding –</strong> Coming from an Army background, I've lived in Punjab, Lucknow, Assam and Pune. I've seen how language influences the way people connect and understand each other.</span></li>
              <li><span className="hire-fit-number">04</span><span><strong>Research, Problem Solving &amp; Technology –</strong> I love exploring new ideas and finding ways to turn them into reality using research, technology and AI.</span></li>
            </ul>
          </div>
          <div className="hire-tool-groups">
            <div className="hire-tool-group" aria-label="AI and automation tools">
              <p>AI &amp; AUTOMATION</p>
              <div><img src="https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/claude.svg" alt="" /><span>Claude</span></div>
              <div><img src="/tool-logos/chatgpt.svg" alt="" /><span>ChatGPT</span></div>
              <div><img src="https://cdn.simpleicons.org/elevenlabs" alt="" /><span>ElevenLabs</span></div>
              <div><img src="https://cdn.simpleicons.org/make" alt="" /><span>Make.com</span></div>
              <div><img src="https://cdn.simpleicons.org/perplexity" alt="" /><span>Perplexity</span></div>
            </div>
            <div className="hire-tool-group" aria-label="Project and operations tools">
              <p>PROJECT &amp; OPS</p>
              <div><img src="https://cdn.simpleicons.org/notion" alt="" /><span>Notion</span></div>
              <div><img src="https://cdn.simpleicons.org/airtable" alt="" /><span>Airtable</span></div>
              <div><img src="https://cdn.simpleicons.org/trello" alt="" /><span>Trello</span></div>
              <div><img src="https://cdn.simpleicons.org/asana" alt="" /><span>Asana</span></div>
            </div>
            <div className="hire-tool-group" aria-label="Design and media tools">
              <p>DESIGN &amp; MEDIA</p>
              <div><img src="https://cdn.simpleicons.org/figma" alt="" /><span>Figma</span></div>
              <div><img src="/tool-logos/canva.svg" alt="" /><span>Canva</span></div>
              <div><img src="/tool-logos/descript.svg" alt="" /><span>Descript</span></div>
              <div><img src="/tool-logos/premiere-pro.svg" alt="" /><span>Premiere Pro</span></div>
            </div>
            <div className="hire-tool-group" aria-label="Data and finance tools">
              <p>DATA &amp; FINANCE</p>
              <div><img src="https://cdn.simpleicons.org/googlesheets" alt="" /><span>Google Sheets</span></div>
              <div><img src="/tool-logos/excel.svg" alt="" /><span>Excel</span></div>
              <div><img src="https://cdn.simpleicons.org/metabase" alt="" /><span>Metabase</span></div>
            </div>
          </div>
        </div>
      </section>
      <section className="hire-section hire-id-section" aria-labelledby="hire-heading">
        <div className="hire-id-heading">
          <span className="hire-id-kicker"><img src="/logo-icon.svg" alt="" /> FOUNDER'S OFFICE · SATVIC MOVEMENT</span>
          <h2 id="hire-heading" className="hire-heading">Why I want to build with Satvic</h2>
          <p>I want to bring my product, business, and team experience to work that makes practical wellness easier to reach.</p>
        </div>
        <div className="hire-id-layout">
          <div className="hire-lanyard" aria-label="Interactive Satvic Movement identity card. Drag to move it or click it to flip.">
            <Lanyard
              frontImage="/id-card-front.svg"
              backImage="/id-card-back.svg"
              imageFit="cover"
              cardColor="#2b4938"
              orientation="portrait"
              finish="glossy"
              cornerRadius={0.22}
              size={0.7}
              anchor="center"
              strapLength={0.48}
              strapColor="#3157e8"
              strapWidth={0.65}
              metal="silver"
              gravity={0.85}
              damping={0.62}
              elasticity={0.3}
              breeze={0.3}
              interactive
              intro
            />
            <span className="hire-lanyard-hint">DRAG TO MOVE · CLICK TO FLIP</span>
          </div>
          <div className="hire-points">
            <ol className="satvic-reasons">
              {satvicFitPoints.map(point => <li key={point}>{point}</li>)}
            </ol>
          </div>
        </div>
        <div className="hire-portfolio-action">
          <LiquidMetalButton
            className="hire-portfolio-button"
            size="md"
            borderWidth={3}
            metalConfig={{ colorBack: "#3157e8", colorTint: "#ffffff", speed: 0.35, repetition: 3, distortion: 0.12 }}
            icon={<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>}
            aria-label="View my Product Management Associate application portfolio"
            onClick={() => window.open("https://satvic-movement-pma.vercel.app", "_blank", "noopener,noreferrer")}
          >
            View my PMA portfolio
          </LiquidMetalButton>
        </div>
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
