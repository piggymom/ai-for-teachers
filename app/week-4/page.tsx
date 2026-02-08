import { SkippyChat } from "../components/skippy-chat";
import { DashboardLayout } from "../components/layouts/dashboard-layout";

export default function Week4Page() {
  return (
    <DashboardLayout>
      <SkippyChat week={4} weekTitle="Feedback & Assessment" />
    </DashboardLayout>
  );
}
