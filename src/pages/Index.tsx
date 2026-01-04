import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar, { ViewType } from "@/components/layout/Sidebar";
import ChatInterface from "@/components/chat/ChatInterface";
import DocumentsView from "@/components/documents/DocumentsView";
import MeetingsView from "@/components/meetings/MeetingsView";

const pageTitles: Record<ViewType, string> = {
  chat: "Chat Interface",
  documents: "Document Management",
  meetings: "Meeting Transcripts",
};

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case "chat":
        return <ChatInterface />;
      case "documents":
        return <DocumentsView />;
      case "meetings":
        return <MeetingsView />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle={pageTitles[currentView]}
        />

        <main className="flex-1 overflow-hidden">
          <div className="h-[calc(100vh-4rem)]">{renderView()}</div>
        </main>
      </div>
    </div>
  );
};

export default Index;
