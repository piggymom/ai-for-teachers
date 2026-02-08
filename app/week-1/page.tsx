import { SkippyChat } from "../components/skippy-chat";
import { DashboardLayout } from "../components/layouts/dashboard-layout";

export default function Week1Page() {
  return (
    <DashboardLayout>
      <SkippyChat week={1} weekTitle="Understanding AI in Teaching" />
    </DashboardLayout>
  );
}
