"use client";

import { memo, PointerEvent, useEffect, useRef, type CSSProperties } from "react";
import "./ProfileCard.css";

type ProfileCardProps = {
  avatarUrl?: string;
  iconUrl?: string;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  statusColor?: string;
  contactText?: string;
  actionHref?: string;
  actionLabel?: string;
  documentIcon?: boolean;
  documentPreviewUrl?: string;
  phoneNumber?: string;
  emailAddress?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
  theme?: "dark" | "light";
  backdropColor?: string;
  radius?: number;
  holo?: number;
  glare?: number;
  enableTilt?: boolean;
  tiltStrength?: number;
  parallax?: number;
  intro?: boolean;
  className?: string;
};
type CSSVarStyle = CSSProperties & Record<`--${string}`, string | number>;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function ProfileCard({
  avatarUrl = "",
  iconUrl,
  miniAvatarUrl,
  name = "Piyush Kumar",
  title = "",
  handle = "",
  status = "",
  statusColor = "#22c55e",
  contactText = "Contact me",
  actionHref,
  actionLabel = "Download",
  documentIcon = false,
  documentPreviewUrl,
  phoneNumber,
  emailAddress,
  showUserInfo = true,
  onContactClick,
  theme = "dark",
  backdropColor,
  radius = 16,
  holo = 0.8,
  glare = 0.5,
  enableTilt = true,
  tiltStrength = 12,
  parallax = 8,
  intro = true,
  className = "",
}: ProfileCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !intro || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.add("profile-card--intro");
    const timer = window.setTimeout(() => root.classList.remove("profile-card--intro"), 1400);
    return () => window.clearTimeout(timer);
  }, [intro]);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root || !enableTilt || event.pointerType !== "mouse") return;
    const rect = root.getBoundingClientRect();
    const x = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
    const y = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
    root.style.setProperty("--pc-light-x", `${((x + 1) * rect.width) / 2}px`);
    root.style.setProperty("--pc-light-y", `${((y + 1) * rect.height) / 2}px`);
    root.style.setProperty("--pc-pointer-x", `${((x + 1) * 50).toFixed(2)}%`);
    root.style.setProperty("--pc-pointer-y", `${((y + 1) * 50).toFixed(2)}%`);
    root.style.setProperty("--pc-band-x", `${50 + x * 15}%`);
    root.style.setProperty("--pc-band-y", `${50 + y * 15}%`);
    root.style.setProperty("--pc-rotate-x", `${y * tiltStrength}deg`);
    root.style.setProperty("--pc-rotate-y", `${-x * tiltStrength}deg`);
    root.style.setProperty("--pc-shift-x", `${x * parallax}px`);
    root.style.setProperty("--pc-shift-y", `${y * parallax}px`);
    root.style.setProperty("--pc-reach", String(Math.min(1, Math.hypot(x, y))));
    root.style.setProperty("--pc-tilt", "1");
    root.style.setProperty("--pc-active", "1");
  };

  const onPointerLeave = () => {
    const root = rootRef.current;
    if (!root) return;
    root.style.setProperty("--pc-rotate-x", "0deg");
    root.style.setProperty("--pc-rotate-y", "0deg");
    root.style.setProperty("--pc-shift-x", "0px");
    root.style.setProperty("--pc-shift-y", "0px");
    root.style.setProperty("--pc-tilt", "0");
    root.style.setProperty("--pc-active", "0");
  };

  const palette = theme === "light" ? "light" : "dark";
  const style = {
    "--pc-radius": `${Math.max(0, radius)}px`,
    "--pc-backdrop": backdropColor ?? "var(--pc-tile)",
    "--pc-holo": String(clamp(holo, 0, 1)),
    "--pc-glare": String(clamp(glare, 0, 1)),
    "--pc-parallax": `${Math.max(0, parallax)}px`,
    "--pc-status": statusColor,
    "--pc-pattern": iconUrl ? `url("${iconUrl}")` : "linear-gradient(#000, #000)",
    "--pc-pattern-size": iconUrl ? "180% auto" : "100% 100%",
    "--pc-holo-gain": iconUrl ? 1.25 : 0.75,
    "--pc-holo-detail": iconUrl && palette === "dark" ? 1 : 0,
  } as CSSVarStyle;

  return (
    <div
      ref={rootRef}
      className={`profile-card profile-card--${palette} ${className}`.trim()}
      style={style}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="profile-card__body">
        <div className="profile-card__tile">
          <span className="profile-card__sheen" />
          <span className="profile-card__holo"><span className="profile-card__holo-glow" /><span className="profile-card__holo-shift" /></span>
          {avatarUrl && <img className="profile-card__photo" src={avatarUrl} alt={name} draggable={false} />}
          {documentIcon && <span className="profile-card__document-icon" aria-hidden="true"><svg viewBox="0 0 64 80" fill="none"><path d="M12 4h26l14 14v56H12zM38 4v16h14M21 35h22M21 45h22M21 55h15" /><path className="profile-card__document-pdf" d="M20 65h24" /></svg><span>PDF</span></span>}
          {documentPreviewUrl && <iframe className="profile-card__document-preview" src={`${documentPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0`} title="Resume preview" />}
          {(name || title) && <>
            <span className="profile-card__scrim" />
            <div className="profile-card__info">
              {name && <h3 className="profile-card__name">{name}</h3>}
              {title && <p className="profile-card__title">{title}</p>}
            </div>
          </>}
          <span className="profile-card__tile-rim" />
        </div>
        {showUserInfo && <div className="profile-card__footer">
          {miniAvatarUrl && <span className="profile-card__avatar"><img src={miniAvatarUrl} alt="" /></span>}
          {(handle || status) && <div className="profile-card__meta">
            {handle && <span className="profile-card__handle">@{handle}</span>}
            {status && <span className="profile-card__status">{status}</span>}
          </div>}
          {(phoneNumber || emailAddress) && <div className="profile-card__actions">
            {phoneNumber && <a className="profile-card__contact" href={`tel:${phoneNumber.replace(/[^+\d]/g, "")}`} aria-label={`Call ${phoneNumber}`}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M7.2 3.8 9.7 7l-1.6 2.1a14.1 14.1 0 0 0 6.8 6.8l2.1-1.6 3.2 2.5-.8 3.1c-.2.8-1 1.3-1.8 1.2C9.9 20 4 14.1 2.9 6.4c-.1-.8.4-1.6 1.2-1.8l3.1-.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Call / WhatsApp
            </a>}
            {emailAddress && <a className="profile-card__contact" href={`mailto:${emailAddress}`} aria-label={`Email ${emailAddress}`}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z" stroke="currentColor" strokeWidth="1.6"/><path d="m5 6 7 6 7-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Email
            </a>}
          </div>}
          {actionHref && <div className="profile-card__actions"><a className="profile-card__contact" href={actionHref} download aria-label={actionLabel}>{actionLabel}</a></div>}
          {!(phoneNumber || emailAddress || actionHref) && contactText && <button type="button" className="profile-card__contact" onClick={onContactClick}>
            {contactText}
          </button>}
        </div>}
        <span className="profile-card__glare" /><span className="profile-card__shade" /><span className="profile-card__rim" />
      </div>
    </div>
  );
}

export default memo(ProfileCard);
