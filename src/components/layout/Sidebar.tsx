import { MessageSquare, FileText, Video, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ViewType = "chat" | "documents" | "meetings";

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    id: "chat" as ViewType,
    label: "Chat Interface",
    icon: MessageSquare,
    description: "Ask questions about your documents",
  },
  {
    id: "documents" as ViewType,
    label: "Documents",
    icon: FileText,
    description: "Upload and manage files",
  },
  {
    id: "meetings" as ViewType,
    label: "Meetings",
    icon: Video,
    description: "Transcript management",
  },
];

const Sidebar = ({ currentView, onViewChange, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="font-semibold">Navigation</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    onClose();
                  }}
                  className={cn(
                    "nav-item w-full text-left",
                    isActive && "active"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-border p-4">
            <div className="rounded-lg bg-primary/5 p-3">
              <p className="text-xs font-medium text-primary">Pro Tip</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Upload documents to enhance AI responses with your data.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
