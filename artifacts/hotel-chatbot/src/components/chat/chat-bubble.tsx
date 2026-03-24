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
        "flex w-full gap-4 py-4 px-4 md:px-8 max-w-4xl mx-auto",
        !isUser && "border-l-2 border-primary bg-card/10 my-2 rounded-r-xl"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center shadow-sm mt-1",
        isUser 
          ? "bg-accent border border-border" 
          : "bg-primary/10 border border-primary/20"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Hotel className="w-4 h-4 text-primary" />
        )}
      </div>
      
      <div className="flex-1 space-y-1.5 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[13px] tracking-wide text-foreground">
            {isUser ? "You" : "Seed Concierge"}
          </span>
        </div>
        
        <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-border max-w-none text-[15px]">
          {content ? (
            <p className="whitespace-pre-wrap text-muted-foreground">{content}</p>
          ) : isStreaming ? (
            <div className="flex gap-1 items-center h-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
