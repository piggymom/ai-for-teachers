import { SkippyChat } from "../components/skippy-chat";
import { DashboardLayout } from "../components/layouts/dashboard-layout";

export default function Week0Page() {
  return (
    <DashboardLayout>
      <SkippyChat week={0} weekTitle="Getting Started" />
    </DashboardLayout>
  );
}
