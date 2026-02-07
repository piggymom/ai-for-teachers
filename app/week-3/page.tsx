import { SkippyChat } from "../components/skippy-chat";
import { CourseSidebar } from "../components/course-sidebar";
import { SupportChatPanel } from "../components/support-chat-panel";

export default function Week3Page() {
  return (
    <div className="flex min-h-screen bg-neutral-900">
      <CourseSidebar />
      <div className="flex-1">
        <SkippyChat week={3} weekTitle="Lesson Planning with AI" />
      </div>
      <SupportChatPanel />
    </div>
  );
}
