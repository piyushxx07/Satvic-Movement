import type { CSSProperties } from "react";

type LoadingLinesProps = {
  label?: string;
  className?: string;
};

export default function LoadingLines({
  label = "Loading video",
  className = "",
}: LoadingLinesProps) {
  return (
    <div className={`loading-lines ${className}`} role="status" aria-label={label}>
      <span className="loading-lines-letters" aria-hidden="true">
        {Array.from("Loading").map((letter, index) => (
          <span key={`${letter}-${index}`} style={{ "--letter-index": index } as CSSProperties}>
            {letter}
          </span>
        ))}
      </span>
      <span className="loading-lines-glow" aria-hidden="true" />
    </div>
  );
}
