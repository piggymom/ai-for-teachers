import { SkippyChat } from "../components/skippy-chat";
import { CourseSidebar } from "../components/course-sidebar";
import { SupportChatPanel } from "../components/support-chat-panel";

export default function Week4Page() {
  return (
    <div className="flex min-h-screen bg-neutral-900">
      <CourseSidebar />
      <div className="flex-1">
        <SkippyChat week={4} weekTitle="Feedback & Assessment" />
      </div>
      <SupportChatPanel />
    </div>
  );
}
