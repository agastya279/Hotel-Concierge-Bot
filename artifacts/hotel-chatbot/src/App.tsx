import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/contexts/auth-context";
import { useAuthContext } from "@/contexts/auth-context";
import { useCreateOpenaiConversation, getListOpenaiConversationsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

import { AppLayout } from "@/components/layout/app-layout";
import WelcomePage from "@/pages/welcome";
import ChatPage from "@/pages/chat";
import GuestChatPage from "@/pages/guest-chat";
import LoginPage from "@/pages/login";
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function KeyboardShortcuts() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuthContext();
  const qc = useQueryClient();
  const { mutate: createConv } = useCreateOpenaiConversation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      if (modKey && e.key === "k") {
        e.preventDefault();
        if (isAuthenticated) {
          createConv(
            { data: { title: "New Conversation" } },
            {
              onSuccess: (conv) => {
                qc.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
                setLocation(`/c/${conv.id}`);
              },
            }
          );
        } else {
          setLocation("/chat");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthenticated, createConv, qc, setLocation]);

  return null;
}

function Router() {
  return (
    <AppLayout>
      <KeyboardShortcuts />
      <Switch>
        <Route path="/" component={WelcomePage} />
        <Route path="/chat" component={GuestChatPage} />
        <Route path="/c/:id" component={ChatPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
