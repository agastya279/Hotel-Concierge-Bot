import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Plus, MessageSquare, Trash2, X, Menu, Hotel, LogIn, LogOut, User, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useListOpenaiConversations, 
  useCreateOpenaiConversation, 
  useDeleteOpenaiConversation,
  getListOpenaiConversationsQueryKey
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/contexts/auth-context";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: isAuthLoading, user, login, logout } = useAuthContext();

  const { data: conversations = [], isLoading } = useListOpenaiConversations({
    query: { enabled: isAuthenticated },
  });
  const { mutate: createConv, isPending: isCreating } = useCreateOpenaiConversation();
  const { mutate: deleteConv } = useDeleteOpenaiConversation();

  const handleCreate = () => {
    if (!isAuthenticated) {
      setLocation("/chat");
      setIsOpen(false);
      return;
    }
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
    e.preventDefault();
    e.stopPropagation();
    deleteConv(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
          if (location === `/c/${id}`) {
            setLocation("/");
          }
        }
      }
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Logo */}
      <div className="p-4 flex flex-col gap-4">
        <Link href="/" onClick={() => setIsOpen(false)}>
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
              <Hotel className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg leading-none text-gradient-brand">Seed Hotel</h2>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Concierge</span>
            </div>
          </div>
        </Link>

        <LuxuryButton
          className="w-full justify-start gap-2"
          onClick={handleCreate}
          isLoading={isCreating}
          variant="secondary"
        >
          <Plus className="w-4 h-4" />
          Start New Request
        </LuxuryButton>
      </div>

      {/* Conversation List or Guest Prompt */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {isAuthLoading ? (
          <div className="px-2 py-3 text-sm text-muted-foreground animate-pulse text-center">Loading…</div>
        ) : isAuthenticated ? (
          <>
            <div className="text-[11px] font-semibold text-muted-foreground mb-2 px-2 uppercase tracking-widest">
              Recent Requests
            </div>
            <div className="space-y-0.5">
              {isLoading ? (
                <div className="px-2 py-3 text-sm text-muted-foreground animate-pulse">Loading history…</div>
              ) : conversations.length === 0 ? (
                <div className="px-2 py-3 text-sm text-muted-foreground text-center border border-dashed border-border rounded-lg">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => {
                  const isActive = location === `/c/${conv.id}`;
                  return (
                    <Link key={conv.id} href={`/c/${conv.id}`} onClick={() => setIsOpen(false)}>
                      <div className={cn(
                        "group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                      )}>
                        <div className="flex items-center gap-3 overflow-hidden">
                          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                          <div className="flex flex-col truncate">
                            <span className="text-sm truncate font-medium">{conv.title}</span>
                            <span className="text-[10px] opacity-60 mt-0.5">
                              {format(new Date(conv.createdAt), "MMM d, h:mm a")}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDelete(e, conv.id)}
                          className="p-1.5 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all shrink-0"
                          title="Delete conversation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </>
        ) : (
          /* Guest panel */
          <div className="mx-2 mt-1 rounded-xl border border-border/60 bg-background/40 p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary/70 shrink-0" />
              <p className="text-xs font-semibold text-foreground/80 leading-snug">
                Save your conversations
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Sign in to save your chat history and pick up where you left off on any device.
            </p>
            <button
              onClick={login}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-white transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #52b788 0%, #2d6a4f 100%)" }}
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign in / Sign up
            </button>
          </div>
        )}
      </div>

      {/* User footer */}
      {isAuthenticated && user && (
        <div className="px-3 pb-4 pt-2 border-t border-border/40">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.firstName || "User"}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <span className="text-xs text-foreground/80 truncate font-medium">
                {user.firstName || user.email || "Guest"}
              </span>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-accent/50 rounded-md transition-all shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Header & Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 glass-panel border-b border-border/50 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Hotel className="w-5 h-5 text-primary" />
          <h1 className="font-display font-semibold text-lg text-gradient-brand">Seed Hotel</h1>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 h-screen shrink-0 relative z-10">
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 w-[280px] z-50 shadow-2xl"
            >
              <SidebarContent />
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-primary bg-background/50 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
