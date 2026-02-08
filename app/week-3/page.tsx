import { SkippyChat } from "../components/skippy-chat";
import { DashboardLayout } from "../components/layouts/dashboard-layout";

export default function Week3Page() {
  return (
    <DashboardLayout>
      <SkippyChat week={3} weekTitle="Lesson Planning with AI" />
    </DashboardLayout>
  );
}
