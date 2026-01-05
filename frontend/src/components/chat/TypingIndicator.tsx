import { Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in">
      <Avatar className="h-8 w-8 flex-shrink-0 bg-muted">
        <AvatarFallback className="bg-muted text-muted-foreground">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="rounded-2xl rounded-bl-md border border-border bg-muted px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
