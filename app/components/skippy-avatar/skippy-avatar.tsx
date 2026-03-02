"use client";

import "./skippy-avatar.css";

export type SkippyState = "idle" | "listening" | "thinking" | "speaking";

interface SkippyAvatarProps {
  state?: SkippyState;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: 64,
  md: 80,
  lg: 112,
  xl: 180,
};

export function SkippyAvatar({
  state = "idle",
  size = "md",
  className = ""
}: SkippyAvatarProps) {
  const pixelSize = sizeMap[size];

  return (
    <div
      className={`skippy-avatar skippy-${state} skippy-size-${size} ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      role="img"
      aria-label={`Skippy is ${state}`}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="skippy-svg"
      >
        <defs>
          {/* Nucleus gradient — metallic silver */}
          <linearGradient id="skippy-nucleus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C0C7D0" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Glow gradient */}
          <radialGradient id="skippy-glow-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(148, 163, 184, 0.35)" />
            <stop offset="70%" stopColor="rgba(148, 163, 184, 0.1)" />
            <stop offset="100%" stopColor="rgba(148, 163, 184, 0)" />
          </radialGradient>

          {/* Orbital gradient — metallic */}
          <linearGradient id="skippy-orbital-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Blur filter for glow */}
          <filter id="skippy-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* Glow layer */}
        <circle
          className="skippy-glow"
          cx="50"
          cy="50"
          r="45"
          fill="url(#skippy-glow-gradient)"
          filter="url(#skippy-blur)"
        />

        {/* Orbital 1 - top */}
        <g className="skippy-orbital skippy-orbital-1">
          <circle
            cx="50"
            cy="15"
            r="5"
            fill="url(#skippy-orbital-gradient)"
          />
        </g>

        {/* Orbital 2 - bottom left */}
        <g className="skippy-orbital skippy-orbital-2">
          <circle
            cx="50"
            cy="15"
            r="4"
            fill="url(#skippy-orbital-gradient)"
          />
        </g>

        {/* Orbital 3 - bottom right */}
        <g className="skippy-orbital skippy-orbital-3">
          <circle
            cx="50"
            cy="15"
            r="3"
            fill="url(#skippy-orbital-gradient)"
          />
        </g>

        {/* Nucleus (center) */}
        <circle
          className="skippy-nucleus"
          cx="50"
          cy="50"
          r="18"
          fill="url(#skippy-nucleus-gradient)"
        />

        {/* Nucleus highlight (inner glow) */}
        <circle
          className="skippy-nucleus-highlight"
          cx="45"
          cy="45"
          r="6"
          fill="rgba(255, 255, 255, 0.45)"
        />
      </svg>
    </div>
  );
}
