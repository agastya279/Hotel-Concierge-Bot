import { motion } from "framer-motion";
import { Hotel, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function ChatBubble({ role, content, isStreaming }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full gap-4 py-6 px-4 md:px-8",
        isUser ? "bg-transparent" : "bg-card/30 backdrop-blur-sm border-y border-border/50"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm",
        isUser 
          ? "bg-accent border border-border" 
          : "bg-gradient-to-br from-primary/20 to-accent border border-primary/30"
      )}>
        {isUser ? (
          <User className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Hotel className="w-5 h-5 text-primary" />
        )}
      </div>
      
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground">
            {isUser ? "You" : "Grand Azure Concierge"}
          </span>
        </div>
        
        <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-border max-w-none">
          {content ? (
            <p className="whitespace-pre-wrap text-muted-foreground">{content}</p>
          ) : isStreaming ? (
            <div className="flex gap-1 items-center h-6">
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
