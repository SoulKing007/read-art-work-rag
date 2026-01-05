import { MessageSquare, FileText, Video, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.svg";

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
          "fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/10 bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col text-sidebar-foreground">
          {/* Logo section */}
          <div className="flex h-16 items-center justify-between border-b border-white/20 px-4">
            <img src={logo} alt="Ready Artwork" className="h-8 brightness-0 invert" />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="lg:hidden text-white hover:bg-white/15"
            >
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
                    <div className="truncate text-xs text-white/60">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-white/20 p-4">
            <div className="rounded-lg bg-white/10 p-3">
              <p className="text-xs font-medium text-white">Pro Tip</p>
              <p className="mt-1 text-xs text-white/70">
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
