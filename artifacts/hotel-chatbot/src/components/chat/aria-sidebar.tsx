import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings2, Globe, Heart, Clock, Utensils, Star, Wine, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { 
  useAriaContext, 
  useUpdateAriaContext, 
  useAriaActions, 
  useAriaRecommendations 
} from "@/hooks/use-aria";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const PREFERENCE_OPTIONS = [
  { id: "quiet", label: "Quiet Room", icon: Clock },
  { id: "vegetarian", label: "Vegetarian", icon: Utensils },
  { id: "spa_lover", label: "Spa Lover", icon: Heart },
  { id: "late_checkout", label: "Late Checkout", icon: Clock },
  { id: "high_floor", label: "High Floor", icon: Star },
  { id: "wine_enthusiast", label: "Wine Enthusiast", icon: Wine },
];

export function AriaSidebar({ conversationId }: { conversationId?: number }) {
  const [open, setOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { data: context, isLoading: isContextLoading } = useAriaContext(conversationId);
  const { data: actions, isLoading: isActionsLoading } = useAriaActions(conversationId);
  const updateContext = useUpdateAriaContext();
  const getRecommendations = useAriaRecommendations();
  const { toast } = useToast();

  const handleTogglePreference = async (prefId: string) => {
    if (!context) return;
    const current = context.preferences || [];
    const updated = current.includes(prefId)
      ? current.filter(p => p !== prefId)
      : [...current, prefId];
    
    try {
      await updateContext.mutateAsync({ 
        conversationId, 
        data: { preferences: updated } 
      });
    } catch (err) {
      toast({ title: "Failed to update preferences", variant: "destructive" });
    }
  };

  const handleLanguageChange = async (val: string) => {
    try {
      await updateContext.mutateAsync({ 
        conversationId, 
        data: { language: val } 
      });
    } catch (err) {
      toast({ title: "Failed to update language", variant: "destructive" });
    }
  };

  const handleQuickRecommendation = async () => {
    try {
      const res = await getRecommendations.mutateAsync({ 
        conversationId, 
        query: "Suggest an itinerary for today based on my preferences",
        preferences: context?.preferences
      });
      if (res.recommendations) {
        setRecommendations(res.recommendations);
        toast({ title: "Recommendations loaded" });
      } else {
        toast({ title: "Aria is preparing your recommendations..." });
      }
    } catch (err) {
      toast({ title: "Failed to get recommendations", variant: "destructive" });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-muted text-muted-foreground hover:text-foreground">
          <Settings2 className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0 flex flex-col bg-background/95 backdrop-blur-xl border-l border-border/40">
        <SheetHeader className="px-6 py-5 border-b border-border/40">
          <SheetTitle className="text-xl font-display font-medium tracking-tight text-foreground flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-[10px] font-bold">A</span>
            </span>
            Aria Settings & Context
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-8 pb-12">
            
            {/* Language */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <h3>Language</h3>
              </div>
              {isContextLoading ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <Select value={context?.language || "english"} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full bg-white/50">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="mandarin">Mandarin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </section>

            {/* Preferences */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <h3>Personalized Context</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Select your preferences so Aria can tailor recommendations to your taste.
              </p>
              
              {isContextLoading ? (
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-32 rounded-full" />
                  <Skeleton className="h-8 w-28 rounded-full" />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {PREFERENCE_OPTIONS.map((pref) => {
                    const isActive = context?.preferences?.includes(pref.id);
                    const Icon = pref.icon;
                    return (
                      <button
                        key={pref.id}
                        onClick={() => handleTogglePreference(pref.id)}
                        className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border
                          ${isActive 
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105' 
                            : 'bg-white border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground'}
                        `}
                      >
                        <Icon className="w-3 h-3" />
                        {pref.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <h3>Recommendations</h3>
                </div>
                <div className="grid gap-3">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="flex flex-col gap-2 p-3 rounded-xl border border-border/40 bg-white/60 shadow-sm">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-semibold text-sm text-foreground">{rec.title}</h4>
                        {rec.type && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary uppercase font-bold tracking-wider">
                            {rec.type}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Quick Actions */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
                <Settings2 className="w-4 h-4 text-muted-foreground" />
                <h3>Quick Actions</h3>
              </div>
              <Button 
                onClick={handleQuickRecommendation} 
                variant="outline" 
                className="w-full justify-start text-left font-normal bg-white/50 hover:bg-white border-border/50"
              >
                <Utensils className="w-4 h-4 mr-2 text-muted-foreground" />
                Curate a daily itinerary
              </Button>
            </section>

            {/* Active Requests */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <h3>Active Requests</h3>
              </div>
              
              {isActionsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              ) : actions && actions.length > 0 ? (
                <div className="space-y-2">
                  {actions.map((action) => (
                    <div key={action.id} className="flex items-start gap-3 p-3 rounded-xl border border-border/40 bg-white/40 shadow-sm">
                      <div className="mt-0.5">
                        {action.status === 'confirmed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : action.status === 'failed' ? (
                          <AlertCircle className="w-4 h-4 text-destructive" />
                        ) : (
                          <Circle className="w-4 h-4 text-blue-500 animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground capitalize tracking-wide">{action.type.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {JSON.stringify(action.payload)}
                        </p>
                        <span className="text-[10px] text-muted-foreground/60 mt-1.5 block">
                          {new Date(action.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 border border-dashed border-border/60 rounded-xl bg-white/20">
                  <p className="text-xs text-muted-foreground">No active requests.</p>
                </div>
              )}
            </section>

          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
