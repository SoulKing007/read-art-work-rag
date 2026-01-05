import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { Trash2, Download, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Array<{ document: string; excerpt: string; url?: string }>;
}

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

const BOT_NAME = "Archie";

const ChatInterface = ({ messages, setMessages }: ChatInterfaceProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [greetingText, setGreetingText] = useState("What's on your mind today?");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate dynamic greeting on mount
  useEffect(() => {
    const greetings = [
      "What's on your mind today?",
      "Ready when you are.",
      "How can I help you today?",
      "What would you like to know?",
      "Ask me anything.",
      "What can I help you with?",
    ];
    setGreetingText(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Prepare conversation history (last 15 messages, excluding current one)
      const history = messages.slice(-15).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Call the backend RAG API with history
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: content,
          history: history,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer || data.message || "I couldn't find relevant information for your query.",
        timestamp: new Date(),
        sources: data.sources?.map((source: { name: string; excerpt: string; type: string; url?: string }) => ({
          document: source.name || source.type,
          excerpt: source.excerpt || "",
          url: source.url || "",
        })) || [],
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error while processing your request. Please make sure the backend server is running on ${import.meta.env.VITE_API_URL || "http://localhost:8000"}.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleExportChat = () => {
    const chatContent = messages
      .map((m) => `[${m.timestamp.toLocaleString()}] ${m.role}: ${m.content}`)
      .join("\n\n");

    const blob = new Blob([chatContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full flex-col bg-background relative">
      {/* Messages container or empty state */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-2xl">
            <h1 className="text-3xl font-semibold text-center mb-8">{greetingText}</h1>
            <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
          </div>
        </div>
      ) : (
        <>
          {/* Messages scroll under the input - full height */}
          <div className="h-full overflow-y-auto px-4 pt-6 scroll-smooth">
            <div className="max-w-3xl mx-auto space-y-6 pb-40">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area - absolutely positioned at bottom, overlapping content */}
          <div className="absolute bottom-0 left-0 right-0 bg-background">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
