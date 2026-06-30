import { useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuthContext } from "@/contexts/auth-context";
import { useCreateOpenaiConversation, getListOpenaiConversationsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, SignIn, SignUp, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";

import { AppLayout } from "@/components/layout/app-layout";
import WelcomePage from "@/pages/welcome";
import ChatPage from "@/pages/chat";
import GuestChatPage from "@/pages/guest-chat";
import LoginPage from "@/pages/login";
import GetStartedPage from "@/pages/get-started";
import YourCardPage from "@/pages/your-card";
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

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#2D5A3D",
    colorForeground: "#1A3325",
    colorMutedForeground: "#6B7B72",
    colorDanger: "#DC2626",
    colorBackground: "#FAFAF7",
    colorInput: "#FFFFFF",
    colorInputForeground: "#1A3325",
    colorNeutral: "#D4D9D5",
    fontFamily: "'Inter', system-ui, sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-lg border border-[#D4D9D5]/60",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-lg font-medium text-[#1A3325] tracking-tight",
    headerSubtitle: "text-sm text-[#6B7B72]",
    socialButtonsBlockButtonText: "text-sm font-medium text-[#1A3325]",
    formFieldLabel: "text-sm font-medium text-[#1A3325]",
    footerActionLink: "text-sm font-medium text-[#2D5A3D] hover:underline",
    footerActionText: "text-sm text-[#6B7B72]",
    dividerText: "text-xs text-[#6B7B72]",
    logoBox: "flex justify-center mb-2",
    logoImage: "w-10 h-10",
    socialButtonsBlockButton: "border border-[#D4D9D5] hover:bg-[#F5F5F2] transition-colors",
    formButtonPrimary: "bg-[#2D5A3D] hover:bg-[#234830] text-white font-medium rounded-xl transition-colors",
    formFieldInput: "bg-white border border-[#D4D9D5] rounded-lg text-[#1A3325] focus:ring-2 focus:ring-[#2D5A3D]/20 focus:border-[#2D5A3D]",
    footerAction: "text-center",
    dividerLine: "border-[#D4D9D5]/40",
    alert: "bg-red-50 text-red-700 rounded-lg",
    otpCodeFieldInput: "border border-[#D4D9D5] rounded-lg text-[#1A3325]",
    formFieldRow: "space-y-1",
    main: "w-full",
  },
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

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

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
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
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route path="/get-started" component={GetStartedPage} />
        <Route path="/your-card" component={YourCardPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function ClerkApp() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/login`}
      signUpUrl={`${basePath}/sign-up`}
      afterSignUpUrl={`${basePath}/get-started`}
      afterSignInUrl={`${basePath}/chat`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to your SEED Resort account",
          },
        },
        signUp: {
          start: {
            title: "Create your account",
            subtitle: "Join SEED Resort for a personalized experience",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={basePath}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
        <ClerkQueryClientCacheInvalidator />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkApp />
    </WouterRouter>
  );
}
