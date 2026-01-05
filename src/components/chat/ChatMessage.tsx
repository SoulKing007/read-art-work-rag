import { Copy, Check, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    sources?: Array<{ document: string; excerpt: string; url?: string }>;
  };
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex gap-4 group", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex flex-col gap-2 max-w-[85%]", isUser && "items-end")}>
        {/* Bot name label */}
        {!isUser && (
          <div className="flex items-center gap-2 px-1">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">A</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground">Archie</span>
          </div>
        )}
        
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-transparent text-foreground"
              : "bg-transparent text-foreground"
          )}
        >
          {isUser ? (
            <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-base dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-foreground">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium break-words inline-flex items-center gap-1"
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p {...props} className="mb-3 last:mb-0 leading-7 text-base text-foreground" />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul {...props} className="list-disc pl-5 mb-3 space-y-2 text-base text-foreground" />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol {...props} className="list-decimal pl-5 mb-3 space-y-2 text-base text-foreground" />
                  ),
                  li: ({ node, ...props }) => (
                    <li {...props} className="leading-7 text-base text-foreground" />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1 {...props} className="text-xl font-bold mb-4 mt-6 pb-2 border-b border-border text-foreground" />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 {...props} className="text-lg font-bold mb-3 mt-5 text-foreground" />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 {...props} className="text-base font-semibold mb-2 mt-4 text-foreground" />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 {...props} className="text-sm font-semibold mb-2 mt-3 text-foreground" />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong {...props} className="font-bold text-foreground" />
                  ),
                  em: ({ node, ...props }) => (
                    <em {...props} className="italic text-foreground" />
                  ),
                  code: ({ node, inline, ...props }: any) =>
                    inline ? (
                      <code {...props} className="bg-background/80 px-1.5 py-0.5 rounded text-base font-mono border border-border text-foreground" />
                    ) : (
                      <code {...props} className="block bg-background/80 p-3 rounded text-base font-mono overflow-x-auto border border-border text-foreground" />
                    ),
                  pre: ({ node, ...props }) => (
                    <pre {...props} className="bg-background/80 rounded-lg p-4 overflow-x-auto my-3 border border-border" />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote {...props} className="border-l-4 border-primary pl-4 py-2 my-3 bg-background/30 rounded-r italic text-foreground/90" />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr {...props} className="my-6 border-border" />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-3">
                      <table {...props} className="min-w-full divide-y divide-border border border-border rounded-lg" />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead {...props} className="bg-background/50" />
                  ),
                  th: ({ node, ...props }) => (
                    <th {...props} className="px-4 py-2 text-left text-base font-semibold text-foreground" />
                  ),
                  td: ({ node, ...props }) => (
                    <td {...props} className="px-4 py-2 text-base border-t border-border text-foreground" />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Action buttons for bot messages */}
        {!isUser && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
              title="Copy"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        )}

        {/* Sources section */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSourcesExpanded(!sourcesExpanded)}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 h-7"
            >
              <FileText className="h-3 w-3" />
              {message.sources.length} source{message.sources.length > 1 ? 's' : ''}
              {sourcesExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>

            {sourcesExpanded && (
              <div className="mt-2 space-y-1.5 bg-muted/50 rounded-lg p-3 border border-border">
                {message.sources.slice(0, 4).map((source, idx) => (
                  <div
                    key={idx}
                    className="text-xs"
                  >
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-start gap-1.5"
                      >
                        <span className="text-muted-foreground">{idx + 1}.</span>
                        <span className="flex-1">{source.document}</span>
                      </a>
                    ) : (
                      <div className="flex items-start gap-1.5 text-muted-foreground">
                        <span>{idx + 1}.</span>
                        <span className="flex-1">{source.document}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
