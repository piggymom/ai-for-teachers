import type { ReactNode } from "react";
import Link from "next/link";

export type SectionCardProps = {
  title: string;
  children: ReactNode;
};

type WeekLayoutProps = {
  eyebrow: string;
  title: string;
  dek: string;
  metadata: string[];
  children: ReactNode;
  nextWeek?: {
    href: string;
    label: string;
  };
};

export const SectionCard = ({ title, children }: SectionCardProps) => (
  <section className="rounded-lg border border-white/5 bg-white/[0.03] p-5 sm:p-6">
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold text-white sm:text-2xl">{title}</h2>
      <div className="text-base leading-relaxed text-white/75 sm:text-[1.05rem]">
        {children}
      </div>
    </div>
  </section>
);

export const HighlightCard = ({ title, children }: SectionCardProps) => (
  <section className="rounded-lg border border-white/8 bg-white/[0.04] p-5 sm:p-6">
    <div className="flex flex-col gap-3">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/40">
        Highlight
      </p>
      <h2 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
      <div className="text-base leading-relaxed text-white/75 sm:text-[1.05rem]">
        {children}
      </div>
    </div>
  </section>
);

const navLinkClasses =
  "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/60 transition hover:border-white/30 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30";

export const WeekLayout = ({
  eyebrow,
  title,
  dek,
  metadata,
  children,
  nextWeek,
}: WeekLayoutProps) => (
  <main className="min-h-screen bg-neutral-900 text-white">
    <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-14 sm:gap-14 sm:py-16 lg:px-12">
      <header className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">
          {eyebrow}
        </p>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
            {dek}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/45">
            {metadata.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-6 sm:gap-7">{children}</div>

      <nav className="flex flex-wrap items-center gap-3">
        <Link href="/" className={navLinkClasses}>
          ← Back to course
        </Link>
        {nextWeek ? (
          <Link href={nextWeek.href} className={navLinkClasses}>
            Next week: {nextWeek.label} →
          </Link>
        ) : null}
      </nav>
    </div>
  </main>
);
