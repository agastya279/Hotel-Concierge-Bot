import { useEffect, useRef, useState } from "react";
import { useParams } from "wouter";
import { Send, Sparkles, Hotel } from "lucide-react";
import { useGetOpenaiConversation, useListOpenaiMessages } from "@workspace/api-client-react";
import { useChatStream } from "@/hooks/use-chat-stream";
import { ChatBubble } from "@/components/chat/chat-bubble";
import { LuxuryButton } from "@/components/ui/luxury-button";

export default function ChatPage() {
  const { id } = useParams();
  const conversationId = id ? parseInt(id, 10) : undefined;
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { data: conversation, isLoading: isConvLoading } = useGetOpenaiConversation(conversationId as number, {
    query: { enabled: !!conversationId }
  });
  
  const { data: messages = [], isLoading: isMessagesLoading } = useListOpenaiMessages(conversationId as number, {
    query: { enabled: !!conversationId }
  });

  const { sendMessage, isStreaming, streamedContent, optimisticUserMessage } = useChatStream(conversationId);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedContent, optimisticUserMessage]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    
    setInput("");
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isConvLoading || isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <Sparkles className="w-8 h-8 text-primary/50 animate-pulse mb-4" />
        <p className="text-muted-foreground font-display text-lg">Preparing your concierge...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full relative bg-background">
      {/* Header */}
      <div className="shrink-0 h-14 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center px-6 sticky top-0 z-10 hidden md:flex">
        <h2 className="font-display font-medium text-lg text-foreground">
          {conversation?.title || "Conversation"}
        </h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scroll-smooth pb-32 pt-4">
        {messages.length === 0 && !optimisticUserMessage && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 opacity-50">
            <Hotel className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-xl font-display text-muted-foreground">Start a conversation</p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatBubble key={msg.id} role={msg.role as any} content={msg.content} />
        ))}

        {optimisticUserMessage && (
          <ChatBubble role="user" content={optimisticUserMessage} />
        )}

        {(isStreaming || streamedContent) && (
          <ChatBubble role="assistant" content={streamedContent} isStreaming={!streamedContent} />
        )}

        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-10 pb-6 px-4 md:px-8">
        <div className="max-w-4xl mx-auto relative glass-panel rounded-xl p-1.5 flex items-end shadow-lg border border-border">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Aria..."
            className="w-full max-h-48 min-h-[44px] bg-transparent border-none resize-none focus:outline-none focus:ring-0 px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm"
            rows={1}
            disabled={isStreaming}
            style={{
               height: "auto",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
            }}
          />
          <LuxuryButton 
            size="icon" 
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="shrink-0 mb-1 ml-2 h-10 w-10 rounded-lg"
          >
            <Send className="w-4 h-4" />
          </LuxuryButton>
        </div>
        <div className="text-center mt-3">
          <p className="text-[10px] text-muted-foreground/60 tracking-wider uppercase font-medium">
            Seed Hotel Concierge • Powered by AI
          </p>
        </div>
      </div>
    </div>
  );
}
