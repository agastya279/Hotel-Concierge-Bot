import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Plus, MessageSquare, Trash2, X, Menu, Hotel, LogIn, LogOut, User, BookOpen, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListOpenaiConversations,
  useCreateOpenaiConversation,
  useDeleteOpenaiConversation,
  getListOpenaiConversationsQueryKey
} from "@workspace/api-client-react";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/contexts/auth-context";

type ConvItem = { id: number; title: string; createdAt: string };

function groupConversations(convs: ConvItem[]) {
  const today: ConvItem[] = [];
  const yesterday: ConvItem[] = [];
  const thisWeek: ConvItem[] = [];
  const older: ConvItem[] = [];
  for (const c of convs) {
    const d = new Date(c.createdAt);
    if (isToday(d)) today.push(c);
    else if (isYesterday(d)) yesterday.push(c);
    else if (isThisWeek(d)) thisWeek.push(c);
    else older.push(c);
  }
  const sections: { label: string; items: ConvItem[] }[] = [];
  if (today.length) sections.push({ label: "Today", items: today });
  if (yesterday.length) sections.push({ label: "Yesterday", items: yesterday });
  if (thisWeek.length) sections.push({ label: "This Week", items: thisWeek });
  if (older.length) sections.push({ label: "Older", items: older });
  return sections;
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: isAuthLoading, user, login, logout } = useAuthContext();

  const { data: conversations = [], isLoading } = useListOpenaiConversations({
    query: { enabled: isAuthenticated },
  });
  const { mutate: createConv, isPending: isCreating } = useCreateOpenaiConversation();
  const { mutate: deleteConv } = useDeleteOpenaiConversation();

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((c) => c.title.toLowerCase().includes(q));
  }, [conversations, searchQuery]);

  const groupedConversations = useMemo(() => {
    return groupConversations(filteredConversations);
  }, [filteredConversations]);

  const handleCreate = () => {
    if (!isAuthenticated) { setLocation("/chat"); setIsOpen(false); return; }
    createConv(
      { data: { title: "New Conversation" } },
      {
        onSuccess: (newConv) => {
          queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
          setLocation(`/c/${newConv.id}`);
          setIsOpen(false);
        }
      }
    );
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); e.stopPropagation();
    deleteConv({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
        if (location === `/c/${id}`) setLocation("/");
      }
    });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-border">
      <div className="p-4 flex flex-col gap-4">
        <Link href="/" onClick={() => setIsOpen(false)}>
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Hotel className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg leading-none text-foreground">Seed Hotel</h2>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Concierge</span>
            </div>
          </div>
        </Link>

        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 border border-border text-sm font-medium text-foreground transition-all disabled:opacity-60"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Start New Request
          </span>
          <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono bg-background border border-border text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2 flex flex-col gap-2">
        {isAuthLoading ? (
          <div className="px-2 py-3 text-sm text-muted-foreground animate-pulse text-center">Loading…</div>
        ) : isAuthenticated ? (
          <>
            <div className="px-2">
              <div className="text-[11px] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">Recent Requests</div>
              {conversations.length > 2 && (
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50 pointer-events-none" />
                  <input
                    type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations…"
                    className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-0.5 px-0">
              {isLoading ? (
                <div className="px-2 py-3 text-sm text-muted-foreground animate-pulse">Loading history…</div>
              ) : filteredConversations.length === 0 ? (
                <div className="px-2 py-3 text-sm text-muted-foreground text-center border border-dashed border-border rounded-lg mx-2">
                  {searchQuery ? "No matches found" : "No conversations yet"}
                </div>
              ) : (
                groupedConversations.map(({ label, items }) => (
                  <div key={label}>
                    <p className="px-3 pt-3 pb-1 text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">{label}</p>
                    {items.map((conv) => {
                      const isActive = location === `/c/${conv.id}`;
                      return (
                        <Link key={conv.id} href={`/c/${conv.id}`} onClick={() => setIsOpen(false)}>
                          <div className={cn(
                            "group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                            isActive ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          )}>
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                              <span className="text-sm truncate font-medium">{conv.title}</span>
                            </div>
                            <button
                              onClick={(e) => handleDelete(e, conv.id)}
                              className="p-1.5 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all shrink-0 opacity-0 group-hover:opacity-100"
                              title="Delete conversation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="mx-2 mt-1 rounded-xl border border-border bg-muted/40 p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary/70 shrink-0" />
              <p className="text-xs font-semibold text-foreground/80 leading-snug">Save your conversations</p>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">Sign in to save your chat history and pick up where you left off on any device.</p>
            <button
              onClick={login}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-white transition-all"
              style={{ background: "linear-gradient(135deg, #52b788 0%, #2d6a4f 100%)" }}
            >
              <LogIn className="w-3.5 h-3.5" />Sign in / Sign up
            </button>
          </div>
        )}
      </div>

      {isAuthenticated && user && (
        <div className="px-3 pb-4 pt-2 border-t border-border/40">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              {user.profileImageUrl ? (
                <img src={user.profileImageUrl} alt={user.firstName || "User"} className="w-7 h-7 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <span className="text-xs text-foreground/80 truncate font-medium">{user.firstName || user.email || "Guest"}</span>
            </div>
            <button onClick={logout} title="Sign out" className="p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-muted rounded-md transition-all shrink-0">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-xl border-b border-border/50 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Hotel className="w-5 h-5 text-primary" />
          <h1 className="font-display font-semibold text-lg text-foreground">Seed Hotel</h1>
        </div>
        <button onClick={() => setIsOpen(true)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>
      <div className="hidden md:block w-64 h-screen shrink-0 relative z-10">
        <SidebarContent />
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)} className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-50" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 w-[280px] z-50 shadow-2xl"
            >
              <SidebarContent />
              <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-foreground bg-white rounded-md">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
