import { SkippyChat } from "../components/skippy-chat";
import { DashboardLayout } from "../components/layouts/dashboard-layout";

export default function Week2Page() {
  return (
    <DashboardLayout>
      <SkippyChat week={2} weekTitle="Prompting Fundamentals" />
    </DashboardLayout>
  );
}
