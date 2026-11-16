import { useEffect, useRef, useState, useCallback } from "react";
import { useSearch, Link } from "wouter";
import { Send, ArrowDown, Square, ArrowLeft } from "lucide-react";
import { AnimatedLogo } from "@/components/ui/animated-logo";
import { motion, AnimatePresence } from "framer-motion";
import { useGuestStream } from "@/hooks/use-guest-stream";
import { AriaComposer } from "@/components/chat/aria-composer";
import { AriaSidebar } from "@/components/chat/aria-sidebar";
import { ChatBubble } from "@/components/chat/chat-bubble";
import { useAuthContext } from "@/contexts/auth-context";

interface GuestMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function GuestChatPage() {
  const search = useSearch();
  const { login, isAuthenticated, user } = useAuthContext();

  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [input, setInput] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoSentRef = useRef(false);
  const idCounter = useRef(0);

  const { sendMessage, stopStreaming, isStreaming, streamedContent } = useGuestStream();

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distanceFromBottom > 120);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < 200) scrollToBottom("smooth");
  }, [messages, streamedContent, scrollToBottom]);

  const doSend = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    const userMsg: GuestMessage = {
      id: ++idCounter.current,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setTimeout(() => scrollToBottom("smooth"), 50);

    const response = await sendMessage(text, history);
    if (response) {
      const assistantMsg: GuestMessage = {
        id: ++idCounter.current,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }
  }, [isStreaming, messages, sendMessage, scrollToBottom]);

  useEffect(() => {
    if (autoSentRef.current) return;
    const params = new URLSearchParams(search);
    const initMsg = params.get("init");
    if (initMsg) {
      autoSentRef.current = true;
      doSend(initMsg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    doSend(text);
  };

  const showStreamingBubble = isStreaming || !!streamedContent;

  return (
    <div className="flex flex-col h-full w-full relative bg-background">
      {/* Top bar */}
      <div className="shrink-0 h-14 border-b border-border/40 bg-white/60 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-10">
        <div className="flex items-center gap-3">
          <Link href="/">
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-white font-bold text-[10px]" style={{
                background: "linear-gradient(135deg, #2D5A3D 0%, #5A8F6E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>A</span>
            </div>
            <h2 className="font-semibold text-sm text-foreground">Aria</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
                Thinking…
              </motion.div>
            )}
          </AnimatePresence>
          <AriaSidebar />
          {!isAuthenticated && (
            <Link href="/login">
              <button className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5">
                Sign in to save
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scroll-smooth pb-36 pt-2"
      >
        {messages.length === 0 && !isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-full text-center px-4 gap-3"
          >
            <AnimatedLogo size={56} animated />
            <p className="text-muted-foreground text-sm">Say hello to Aria, your Seed concierge.</p>
            <p className="text-xs text-muted-foreground/60 max-w-xs">
              Chat as a guest.{" "}
              <Link href="/login" className="underline hover:text-primary transition-colors">Sign in</Link>{" "}
              to save history.
            </p>
          </motion.div>
        )}

        {messages.map((msg, i) => (
          <ChatBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            index={i}
            timestamp={msg.timestamp}
          />
        ))}

        {showStreamingBubble && (
          <ChatBubble
            role="assistant"
            content={streamedContent}
            isStreaming={!streamedContent}
            index={messages.length}
          />
        )}

        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Scroll button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            key="scroll-btn"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={() => scrollToBottom("smooth")}
            className="absolute bottom-28 right-6 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-border shadow-md text-muted-foreground hover:text-foreground hover:border-primary/30 hover:shadow-lg transition-all text-xs font-medium"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            Scroll down
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input */}
      <AriaComposer
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        isStreaming={isStreaming}
        stopStreaming={stopStreaming}
      />
    </div>
  );
}
