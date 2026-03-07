"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/app/components/layouts/dashboard-layout";
import { DashboardHeader } from "@/app/components/dashboard-header";
import { WeekCardsGrid } from "@/app/components/week-cards-grid";
import { ArtifactGallery } from "@/app/components/artifact-gallery";
import { WelcomeVideo } from "@/app/components/welcome-video";
import { AuthButton } from "../components/auth-button";

interface UserProfile {
  name: string;
  primaryGoal: string;
  biggestTimeDrains: string[];
}

interface Progress {
  currentWeek: number;
  completedWeeks: number[];
  isFirstVisit: boolean;
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="p-10 lg:p-16">
            <div className="max-w-3xl mx-auto">
              <div className="animate-pulse space-y-10">
                <div className="h-8 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="flex flex-col gap-4">
                  {[1, 2, 3, 4, 5, 6, 7].map(i => (
                    <div key={i} className="h-24 bg-secondary rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DashboardLayout>
      }
    >
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  const completedParam = searchParams.get("completed");
  const scrollToWeek = completedParam ? parseInt(completedParam, 10) : undefined;

  useEffect(() => {
    Promise.all([
      fetch("/api/progress").then(res => res.json()),
      fetch("/api/auth/session").then(res => res.json())
    ])
      .then(([progressData, sessionData]) => {
        const progressArr = progressData.progress || [];
        const completedWeeks = progressArr
          .filter((p: { status: string }) => p.status === "completed")
          .map((p: { weekNumber: number }) => p.weekNumber);

        let currentWeek = 0;
        for (let i = 0; i <= 6; i++) {
          if (!completedWeeks.includes(i)) {
            currentWeek = i;
            break;
          }
        }
        if (completedWeeks.length === 7) currentWeek = 6;

        setProgress({
          currentWeek,
          completedWeeks,
          isFirstVisit: progressArr.length === 0
        });

        if (sessionData?.user) {
          setProfile({
            name: sessionData.user.name || "",
            primaryGoal: "save_time",
            biggestTimeDrains: []
          });
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10 lg:p-16">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-10">
              <div className="h-8 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="flex flex-col gap-4">
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <div key={i} className="h-24 bg-secondary rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Auth Button */}
      <div className="fixed right-6 top-6 z-10">
        <AuthButton />
      </div>

      <div className="p-8 lg:p-12">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Welcome Video */}
          <WelcomeVideo />

          {/* Personalized Header */}
          <DashboardHeader profile={profile} progress={progress} />

          {/* Week Cards */}
          <section>
            <WeekCardsGrid
              completedWeeks={progress?.completedWeeks || []}
              currentWeek={progress?.currentWeek || 0}
              scrollToWeek={scrollToWeek}
            />
          </section>

          {/* Artifact Gallery */}
          <section className="pt-10 border-t border-border">
            <ArtifactGallery />
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
