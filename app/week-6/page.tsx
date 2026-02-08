import { SkippyChat } from "../components/skippy-chat";
import { DashboardLayout } from "../components/layouts/dashboard-layout";

export default function Week6Page() {
  return (
    <DashboardLayout>
      <SkippyChat week={6} weekTitle="Building Your Practice" />
    </DashboardLayout>
  );
}
