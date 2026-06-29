import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  index?: number;
  timestamp?: Date;
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 10) return "just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatBubble({ role, content, isStreaming, index = 0, timestamp }: ChatBubbleProps) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({ title: "Copied", description: "Response copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Copy failed", description: "Please try again" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.2), ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group flex w-full gap-3 py-4 px-4 md:px-8 max-w-4xl mx-auto",
        !isUser && "border-l-2 border-primary/20 rounded-r-2xl my-0.5"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm mt-0.5 border",
        isUser ? "bg-muted border-border" : "border-primary/20"
      )}
        style={!isUser ? { background: "linear-gradient(135deg, #2D5A3D 0%, #5A8F6E 100%)" } : undefined}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <span className="text-white font-bold text-xs tracking-tight">A</span>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="block text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/60">
            {isUser ? "You" : "Aria"}
          </span>
          <div className="flex items-center gap-2">
            {timestamp && (
              <span className="text-[10px] text-muted-foreground/35 tabular-nums">{formatTime(timestamp)}</span>
            )}
            {!isUser && content && !isStreaming && (
              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                title="Copy response"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-md hover:bg-muted text-muted-foreground/40 hover:text-foreground"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </motion.span>
                  ) : (
                    <motion.span key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Copy className="w-3.5 h-3.5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        </div>

        <div className="text-[15px] leading-relaxed text-foreground/90">
          {content ? (
            isUser ? (
              <p className="whitespace-pre-wrap">{content}</p>
            ) : (
              <div className="prose prose-sm max-w-none prose-p:my-1 prose-p:leading-relaxed prose-ul:my-2 prose-ul:pl-4 prose-ol:my-2 prose-ol:pl-4 prose-li:my-0.5 prose-strong:text-foreground prose-strong:font-semibold prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-headings:text-foreground prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )
          ) : isStreaming ? (
            <div className="flex gap-1 items-center h-5 mt-1">
              <motion.span className="w-1.5 h-1.5 rounded-full bg-primary/70" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: 0, ease: "easeInOut" }} />
              <motion.span className="w-1.5 h-1.5 rounded-full bg-primary/70" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: 0.15, ease: "easeInOut" }} />
              <motion.span className="w-1.5 h-1.5 rounded-full bg-primary/70" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: 0.3, ease: "easeInOut" }} />
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
