import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useSearch } from "wouter";
import { Send, Sparkles, Hotel, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetOpenaiConversation,
  useListOpenaiMessages,
  getListOpenaiConversationsQueryKey,
} from "@workspace/api-client-react";
import { useChatStream } from "@/hooks/use-chat-stream";
import { ChatBubble } from "@/components/chat/chat-bubble";
import { LuxuryButton } from "@/components/ui/luxury-button";

export default function ChatPage() {
  const { id } = useParams();
  const search = useSearch();
  const queryClient = useQueryClient();
  const conversationId = id ? parseInt(id, 10) : undefined;

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const autoSentRef = useRef(false);
  const titleGeneratedRef = useRef(false);

  const { data: conversation, isLoading: isConvLoading } = useGetOpenaiConversation(
    conversationId as number,
    { query: { enabled: !!conversationId } }
  );

  const { data: messages = [], isLoading: isMessagesLoading } = useListOpenaiMessages(
    conversationId as number,
    { query: { enabled: !!conversationId } }
  );

  const { sendMessage, isStreaming, streamedContent, optimisticUserMessage } =
    useChatStream(conversationId);

  // Auto-generate title after first exchange completes
  useEffect(() => {
    if (titleGeneratedRef.current) return;
    if (!conversationId || isStreaming) return;
    if (messages.length >= 2) {
      titleGeneratedRef.current = true;
      const firstUserMsg = messages.find((m) => m.role === "user");
      if (!firstUserMsg) return;
      fetch(`/api/openai/conversations/${conversationId}/generate-title`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstMessage: firstUserMsg.content }),
      })
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data?.title) {
            queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
          }
        })
        .catch(() => {});
    }
  }, [conversationId, isStreaming, messages, queryClient]);

  // Auto-send initial message from suggestion chip (?init=...)
  useEffect(() => {
    if (autoSentRef.current || !conversationId || isConvLoading || isMessagesLoading) return;
    const params = new URLSearchParams(search);
    const initMsg = params.get("init");
    if (initMsg && messages.length === 0) {
      autoSentRef.current = true;
      sendMessage(initMsg);
    }
  }, [conversationId, isConvLoading, isMessagesLoading, messages.length, search, sendMessage]);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distanceFromBottom > 120);
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < 200) scrollToBottom("smooth");
  }, [messages, streamedContent, optimisticUserMessage, scrollToBottom]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    sendMessage(text);
    setTimeout(() => scrollToBottom("smooth"), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isConvLoading || isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-7 h-7 text-primary/50" />
        </motion.div>
        <p className="text-muted-foreground text-sm tracking-wide">Preparing your concierge…</p>
      </div>
    );
  }

  const allMessages = messages;
  const charCount = input.length;
  const showCharCount = charCount > 150;

  return (
    <div className="flex flex-col h-full w-full relative bg-background">
      {/* Header */}
      <div className="shrink-0 h-14 border-b border-border/40 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
        <h2 className="font-semibold text-base text-foreground truncate">
          {conversation?.title || "Conversation"}
        </h2>
        {/* Thinking indicator */}
        <AnimatePresence>
          {isStreaming && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2 text-xs text-primary/70 font-medium"
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              Aria is thinking…
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scroll-smooth pb-36 pt-2"
      >
        {allMessages.length === 0 && !optimisticUserMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-full text-center px-4 gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Hotel className="w-6 h-6 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">Say hello to Aria, your Seed concierge.</p>
          </motion.div>
        )}

        {allMessages.map((msg, i) => (
          <ChatBubble
            key={msg.id}
            role={msg.role as "user" | "assistant"}
            content={msg.content}
            index={i}
            timestamp={new Date(msg.createdAt)}
          />
        ))}

        {optimisticUserMessage && (
          <ChatBubble
            role="user"
            content={optimisticUserMessage}
            index={allMessages.length}
            timestamp={new Date()}
          />
        )}

        {(isStreaming || streamedContent) && (
          <ChatBubble
            role="assistant"
            content={streamedContent}
            isStreaming={!streamedContent}
            index={allMessages.length + (optimisticUserMessage ? 1 : 0)}
          />
        )}

        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            key="scroll-btn"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => scrollToBottom("smooth")}
            className="absolute bottom-28 right-6 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full bg-card border border-border shadow-lg text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all text-xs font-medium backdrop-blur-md"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            Scroll down
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/98 to-transparent pt-8 pb-5 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative glass-panel rounded-2xl p-1.5 flex items-end shadow-lg border border-border focus-within:border-primary/30 transition-colors duration-200">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Aria…"
              className="w-full max-h-48 min-h-[44px] bg-transparent border-none resize-none focus:outline-none focus:ring-0 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 text-sm leading-relaxed"
              rows={1}
              disabled={isStreaming}
              onInput={(e) => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = "auto";
                t.style.height = `${Math.min(t.scrollHeight, 192)}px`;
              }}
            />
            {/* Character counter */}
            <AnimatePresence>
              {showCharCount && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute bottom-3 left-4 text-[10px] text-muted-foreground/40 tabular-nums pointer-events-none"
                >
                  {charCount}
                </motion.span>
              )}
            </AnimatePresence>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="shrink-0 mb-1 ml-2 h-9 w-9 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <p className="text-center mt-2.5 text-[10px] text-muted-foreground/40 tracking-widest uppercase">
            Seed Hotel Concierge · Powered by AI
          </p>
        </div>
      </div>
    </div>
  );
}
