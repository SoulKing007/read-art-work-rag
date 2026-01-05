import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput = ({ onSendMessage, disabled = false, placeholder }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div>
      {/* Input form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-3 rounded-3xl bg-background px-4 py-3 transition-all shadow-md border border-border/30">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Ask me anything..."}
            rows={1}
            className={cn(
              "min-h-[24px] max-h-[120px] flex-1 resize-none bg-transparent text-base placeholder:text-muted-foreground focus:outline-none",
              "scrollbar-thin"
            )}
          />

          {/* Send button */}
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || disabled}
            className="h-9 w-9 flex-shrink-0 rounded-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  );
};

export default ChatInput;
