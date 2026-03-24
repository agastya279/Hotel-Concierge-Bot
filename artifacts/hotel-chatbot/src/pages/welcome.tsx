import { useLocation } from "wouter";
import { Sparkles, ConciergeBell } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateOpenaiConversation, getListOpenaiConversationsQueryKey } from "@workspace/api-client-react";
import { LuxuryButton } from "@/components/ui/luxury-button";

export default function WelcomePage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { mutate: createConv, isPending } = useCreateOpenaiConversation();

  const handleStart = (suggestedTitle?: string) => {
    createConv(
      { data: { title: suggestedTitle || "New Request" } },
      {
        onSuccess: (newConv) => {
          queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
          setLocation(`/c/${newConv.id}`);
        }
      }
    );
  };

  const suggestions = [
    "Book a spa treatment",
    "What time is checkout?",
    "Order room service",
    "Local dining recommendations"
  ];

  return (
    <div className="flex-1 w-full h-full relative flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/hotel-bg.png)` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-2xl w-full px-6 flex flex-col items-center text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-card border border-primary/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
          <img 
            src={`${import.meta.env.BASE_URL}images/concierge-avatar.png`} 
            alt="Logo"
            className="w-12 h-12 object-contain"
          />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-display mb-4 text-gradient-gold">
          Welcome to Grand Azure
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-lg mx-auto font-light">
          Your personal digital concierge. How may we elevate your stay today?
        </p>

        <LuxuryButton 
          size="lg" 
          onClick={() => handleStart()} 
          isLoading={isPending}
          className="mb-12 shadow-2xl"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Start a Conversation
        </LuxuryButton>

        <div className="w-full">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Popular Requests
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl mx-auto">
            {suggestions.map((suggestion, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                onClick={() => handleStart(suggestion)}
                className="px-4 py-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/40 hover:bg-accent/30 transition-all text-sm text-left text-muted-foreground hover:text-foreground flex items-center justify-between group"
              >
                {suggestion}
                <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
