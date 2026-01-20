"use client";

import Link from "next/link";

type WeekStatus = "available" | "comingSoon";

export type WeekCardProps = {
  weekNumber: number;
  title: string;
  description: string;
  minutes: number;
  status: WeekStatus;
  completed?: boolean;
  href?: string;
  takeawaysHref?: string;
  statusLabel?: string;
  variant?: "default" | "orientation";
};

const statusCopy: Record<WeekStatus, string> = {
  available: "Available",
  comingSoon: "Releasing next",
};

const WeekCard = ({
  weekNumber,
  title,
  description,
  minutes,
  status,
  completed = false,
  href,
  takeawaysHref,
  statusLabel,
  variant = "default",
}: WeekCardProps) => {
  const isInteractive = status !== "comingSoon" && Boolean(href);
  const takeawaysLink = completed ? takeawaysHref : undefined;
  const statusText = completed ? "COMPLETED" : statusLabel ?? statusCopy[status];
  const cardClasses =
    "group relative flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left transition";
  const hoverClasses = "hover:-translate-y-0.5 hover:border-white/25";
  const focusClasses =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30";
  const variantClasses =
    variant === "orientation" ? "border-white/8 bg-white/[0.03]" : "";
  const comingSoonClasses = "opacity-60";
  const completedClasses = completed ? "bg-white/[0.035]" : "";
  const metaTextClass = completed ? "text-white/35" : "text-white/40";
  const titleTextClass = completed ? "text-white/85" : "text-white";
  const descriptionTextClass = completed ? "text-white/60" : "text-white/70";
  const pillTextClass = completed ? "text-white/35" : "text-white/45";
  const pillBorderClass = completed ? "border-white/10" : "border-white/15";
  const contentWrapperClass = `relative z-10 flex h-full flex-col gap-5 ${
    isInteractive ? "pointer-events-none" : ""
  }`;
  const content = (
    <div className={contentWrapperClass}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.32em] ${metaTextClass}`}
          >
            Week {weekNumber}
          </p>
          <h2 className={`text-xl font-semibold ${titleTextClass} sm:text-2xl`}>
            {title}
          </h2>
        </div>
        <div
          className={`flex flex-col items-end gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] ${pillTextClass}`}
        >
          <span className={`rounded-full border ${pillBorderClass} px-3 py-1`}>
            {minutes} min
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">
            {statusText}
          </span>
        </div>
      </div>
      <p className={`text-sm leading-relaxed ${descriptionTextClass} sm:text-base`}>
        {description}
      </p>
      {takeawaysLink ? (
        <div className="mt-auto flex justify-end">
          <Link
            aria-label={`View Week ${weekNumber} takeaways`}
            className="pointer-events-auto rounded-sm text-xs font-semibold text-white/60 underline decoration-white/25 underline-offset-4 transition hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            href={takeawaysLink}
          >
            View takeaways →
          </Link>
        </div>
      ) : null}
    </div>
  );

  if (status === "comingSoon" || !href) {
    return (
      <div
        aria-disabled="true"
        className={`${cardClasses} ${variantClasses} ${comingSoonClasses} ${completedClasses}`}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={`${cardClasses} ${variantClasses} ${hoverClasses} ${completedClasses}`}
    >
      <Link
        aria-label={`Go to Week ${weekNumber}`}
        className={`absolute inset-0 rounded-2xl ${focusClasses}`}
        href={href}
      >
        <span className="sr-only">Go to Week {weekNumber}</span>
      </Link>
      {content}
    </div>
  );
};

export { WeekCard };
