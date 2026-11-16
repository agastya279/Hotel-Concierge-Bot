import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useSearch, Link } from "wouter";
import { Send, Sparkles, ArrowDown, Square, Pencil, Check, X, ArrowLeft } from "lucide-react";
import { AnimatedLogo } from "@/components/ui/animated-logo";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChatStream } from "@/hooks/use-chat-stream";
import { AriaComposer } from "@/components/chat/aria-composer";
import { AriaSidebar } from "@/components/chat/aria-sidebar";
import { ChatBubble } from "@/components/chat/chat-bubble";
import { apiFetch } from "@/lib/api-url";

export default function ChatPage() {
  const { id } = useParams();
  const search = useSearch();
  const queryClient = useQueryClient();
  const conversationId = id ? parseInt(id, 10) : undefined;

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const autoSentRef = useRef(false);
  const titleGeneratedRef = useRef(false);

  const { data: conversation, isLoading: isConvLoading } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const res = await apiFetch(`/api/openai/conversations/${conversationId}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!conversationId
  });

  const { data: messages = [], isLoading: isMessagesLoading } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const res = await apiFetch(`/api/openai/conversations/${conversationId}/messages`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!conversationId
  });

  const { sendMessage, stopStreaming, isStreaming, streamedContent, optimisticUserMessage } =
    useChatStream(conversationId);

  useEffect(() => {
    if (titleGeneratedRef.current) return;
    if (!conversationId || isStreaming) return;
    if (messages.length >= 2) {
      titleGeneratedRef.current = true;
      const firstUserMsg = messages.find((m: any) => m.role === "user");
      if (!firstUserMsg) return;
      apiFetch(`/api/openai/conversations/${conversationId}/generate-title`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstMessage: firstUserMsg.content }),
      })
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data?.title) {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] });
          }
        })
        .catch(() => {});
    }
  }, [conversationId, isStreaming, messages, queryClient]);

  useEffect(() => {
    if (autoSentRef.current || !conversationId || isConvLoading || isMessagesLoading) return;
    const params = new URLSearchParams(search);
    const initMsg = params.get("init");
    if (initMsg && messages.length === 0) {
      autoSentRef.current = true;
      sendMessage(initMsg);
    }
  }, [conversationId, isConvLoading, isMessagesLoading, messages.length, search, sendMessage]);

  const startEditTitle = () => {
    setTitleInput(conversation?.title || "");
    setEditingTitle(true);
    setTimeout(() => titleInputRef.current?.select(), 30);
  };
  const saveTitle = async () => {
    const newTitle = titleInput.trim();
    if (!newTitle || !conversationId || newTitle === conversation?.title) {
      setEditingTitle(false); return;
    }
    setEditingTitle(false);
    try {
      await apiFetch(`/api/openai/conversations/${conversationId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ title: newTitle }),
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] });
    } catch {}
  };
  const cancelEditTitle = () => setEditingTitle(false);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
  }, []);
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  }, []);
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 200) scrollToBottom("smooth");
  }, [messages, streamedContent, optimisticUserMessage, scrollToBottom]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    sendMessage(text);
    setTimeout(() => scrollToBottom("smooth"), 50);
  };

  if (isConvLoading || isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
          <Sparkles className="w-7 h-7 text-primary/50" />
        </motion.div>
        <p className="text-muted-foreground text-sm tracking-wide">Preparing your concierge…</p>
      </div>
    );
  }

  const allMessages = messages;

  return (
    <div className="flex flex-col h-full w-full relative bg-background">
      {/* Top bar */}
      <div className="shrink-0 h-14 border-b border-border/40 bg-white/60 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-10 gap-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Link href="/">
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          {editingTitle ? (
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <input ref={titleInputRef} value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") cancelEditTitle(); }}
                className="flex-1 min-w-0 bg-transparent border-b border-primary/40 focus:border-primary focus:outline-none text-sm font-semibold text-foreground py-0.5 transition-colors"
              />
              <button onClick={saveTitle} className="p-1 text-primary hover:bg-primary/10 rounded transition-colors"><Check className="w-3.5 h-3.5" /></button>
              <button onClick={cancelEditTitle} className="p-1 text-muted-foreground hover:bg-muted rounded transition-colors"><X className="w-3.5 h-3.5" /></button>
            </div>
          ) : (
            <button onClick={startEditTitle} className="group flex items-center gap-2 overflow-hidden hover:text-foreground transition-colors text-left">
              <h2 className="font-semibold text-sm text-foreground truncate">{conversation?.title || "Conversation"}</h2>
              <Pencil className="w-3 h-3 text-muted-foreground/40 group-hover:text-muted-foreground/70 shrink-0 transition-colors" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 text-xs text-primary/70 font-medium shrink-0"
              >
                <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                Thinking…
              </motion.div>
            )}
          </AnimatePresence>
          <AriaSidebar conversationId={conversationId} />
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto scroll-smooth pb-36 pt-2">
        {allMessages.length === 0 && !optimisticUserMessage && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-full text-center px-4 gap-3"
          >
            <AnimatedLogo size={56} animated />
            <p className="text-muted-foreground text-sm">Say hello to Aria, your Seed concierge.</p>
          </motion.div>
        )}
        {allMessages.map((msg: any, i: number) => (
          <ChatBubble key={msg.id} role={msg.role as "user" | "assistant"} content={msg.content} index={i} timestamp={new Date(msg.createdAt)} />
        ))}
        {optimisticUserMessage && <ChatBubble role="user" content={optimisticUserMessage} index={allMessages.length} timestamp={new Date()} />}
        {(isStreaming || streamedContent) && (
          <ChatBubble role="assistant" content={streamedContent} isStreaming={!streamedContent} index={allMessages.length + (optimisticUserMessage ? 1 : 0)} />
        )}
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Scroll button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button key="scroll-btn" initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={() => scrollToBottom("smooth")}
            className="absolute bottom-28 right-6 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-border shadow-md text-muted-foreground hover:text-foreground hover:border-primary/30 hover:shadow-lg transition-all text-xs font-medium"
          >
            <ArrowDown className="w-3.5 h-3.5" />Scroll down
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
        conversationId={conversationId}
      />
    </div>
  );
}
