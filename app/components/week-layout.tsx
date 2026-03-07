import type { ReactNode } from "react";
import { completeWeekAndReturn } from "../actions/progress";

export type SectionCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

type WeekLayoutProps = {
  eyebrow: string;
  title: string;
  dek: string;
  metadata: string[];
  children: ReactNode;
  weekNumber: number;
};

export const SectionCard = ({ title, children, className }: SectionCardProps) => (
  <section
    className={`rounded-xl bg-secondary p-5 sm:p-6 ${
      className ?? ""
    }`}
  >
    <div className="flex flex-col gap-2">
      <h2 className="text-[18px] font-medium text-foreground">{title}</h2>
      <div className="text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  </section>
);

export const HighlightCard = ({ title, children }: SectionCardProps) => (
  <section className="rounded-xl bg-accent/50 p-5 sm:p-6">
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-medium uppercase tracking-widest text-accent-foreground">
        Highlight
      </p>
      <h2 className="text-[24px] font-semibold text-foreground font-display">{title}</h2>
      <div className="text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  </section>
);

export const navLinkClasses =
  "inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-[12px] font-medium uppercase tracking-widest text-muted-foreground transition hover:border-ring hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export const WeekLayout = ({
  eyebrow,
  title,
  dek,
  metadata,
  children,
  weekNumber,
}: WeekLayoutProps) => {
  const completeAndReturn = completeWeekAndReturn.bind(null, weekNumber);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-16 sm:gap-14 sm:py-20 lg:px-12 animate-fade-in-up">
        <header className="space-y-5">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </p>
          <div className="space-y-4">
            <h1 className="text-[36px] font-semibold tracking-tight text-foreground font-display">
              {title}
            </h1>
            <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
              {dek}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground/60">
              {metadata.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7">{children}</div>

        <nav className="flex flex-wrap items-center gap-3">
          <form action={completeAndReturn}>
            <button type="submit" className={navLinkClasses}>
              &larr; Back to Course Index
            </button>
          </form>
        </nav>
      </div>
    </main>
  );
};
