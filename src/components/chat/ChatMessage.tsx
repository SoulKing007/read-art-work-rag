import { Bot, User, Copy, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    sources?: Array<{ document: string; excerpt: string }>;
  };
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={cn(
        "group flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <Avatar className={cn("h-8 w-8 flex-shrink-0", isUser ? "bg-primary" : "bg-muted")}>
        <AvatarFallback className={isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message content */}
      <div className={cn("flex max-w-[70%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "chat-message-user"
              : "chat-message-bot border border-border"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          
          {/* Sources (for bot messages) */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-3 border-t border-border/50 pt-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Sources:</p>
              <div className="space-y-1">
                {message.sources.map((source, idx) => (
                  <div
                    key={idx}
                    className="rounded bg-background/50 px-2 py-1 text-xs text-muted-foreground"
                  >
                    📄 {source.document}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Metadata and actions */}
        <div
          className={cn(
            "flex items-center gap-2 px-1 opacity-0 transition-opacity group-hover:opacity-100",
            isUser ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>

          {!isUser && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-6 w-6", feedback === "up" && "text-green-500")}
                onClick={() => setFeedback(feedback === "up" ? null : "up")}
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-6 w-6", feedback === "down" && "text-destructive")}
                onClick={() => setFeedback(feedback === "down" ? null : "down")}
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
