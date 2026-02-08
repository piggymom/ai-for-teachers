import { SkippyChat } from "../components/skippy-chat";
import { DashboardLayout } from "../components/layouts/dashboard-layout";

export default function Week5Page() {
  return (
    <DashboardLayout>
      <SkippyChat week={5} weekTitle="Communication & Admin" />
    </DashboardLayout>
  );
}
