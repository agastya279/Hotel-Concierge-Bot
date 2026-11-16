import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings2, Globe, Heart, Clock, Utensils, Star, Wine, CheckCircle2, Circle, AlertCircle, Plus, X, Loader2 } from "lucide-react";
import { 
  useAriaContext, 
  useUpdateAriaContext, 
  useAriaActions, 
  useAriaRecommendations,
  useCreateAriaAction,
  useCancelAriaAction,
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

const LANGUAGES = [
  { value: "auto", label: "Detect automatically" },
  { value: "english", label: "English" },
  { value: "arabic", label: "Arabic" },
  { value: "chinese", label: "Chinese" },
  { value: "dutch", label: "Dutch" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "hindi", label: "Hindi" },
  { value: "italian", label: "Italian" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "mandarin", label: "Mandarin Chinese" },
  { value: "portuguese", label: "Portuguese" },
  { value: "russian", label: "Russian" },
  { value: "spanish", label: "Spanish" },
  { value: "turkish", label: "Turkish" },
];

export function AriaSidebar({ conversationId }: { conversationId?: number }) {
  const [open, setOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestType, setRequestType] = useState("human-concierge");
  const [requestDetails, setRequestDetails] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const { data: context, isLoading: isContextLoading } = useAriaContext(conversationId);
  const { data: actions, isLoading: isActionsLoading } = useAriaActions(conversationId);
  const updateContext = useUpdateAriaContext();
  const getRecommendations = useAriaRecommendations();
  const createAction = useCreateAriaAction();
  const cancelAction = useCancelAriaAction();
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
        request: "Suggest a resort itinerary based on my preferences. Do not assume live availability or opening hours.",
        preferences: context?.preferences
      });
      const items = Array.isArray(res.items) ? res.items : res.recommendations;
      if (Array.isArray(items)) {
        setRecommendations(items);
        toast({ title: "Recommendations loaded" });
      } else {
        toast({ title: "No recommendations were returned" });
      }
    } catch (err) {
      toast({ title: "Failed to get recommendations", variant: "destructive" });
    }
  };

  const handleCreateRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!requestDetails.trim()) return;
    try {
      const action = await createAction.mutateAsync({
        type: requestType,
        title: requestDetails.trim().split("\n")[0].slice(0, 120) || "Concierge request",
        details: requestDetails.trim(),
        preferredTime: preferredTime || null,
      });
      setRequestDetails("");
      setPreferredTime("");
      setShowRequestForm(false);
      toast({
        title: "Request sent to the concierge",
        description: `${action.title} is awaiting staff confirmation.`,
      });
    } catch {
      toast({ title: "Could not send the request", variant: "destructive" });
    }
  };

  const handleCancelRequest = async (id: number) => {
    try {
      await cancelAction.mutateAsync(id);
      toast({ title: "Request cancelled" });
    } catch {
      toast({ title: "This request can no longer be cancelled", variant: "destructive" });
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
                <Select value={context?.language || "auto"} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full bg-white/50">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((language) => (
                      <SelectItem key={language.value} value={language.value}>{language.label}</SelectItem>
                    ))}
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
                        {(rec.category || rec.type) && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary uppercase font-bold tracking-wider">
                            {rec.category || rec.type}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                      {rec.timing && <p className="text-[11px] text-muted-foreground/80">{rec.timing}</p>}
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
                disabled={getRecommendations.isPending}
                className="w-full justify-start text-left font-normal bg-white/50 hover:bg-white border-border/50"
              >
                {getRecommendations.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Utensils className="w-4 h-4 mr-2 text-muted-foreground" />}
                Curate a resort itinerary
              </Button>
            </section>

            {/* Concierge requests */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground uppercase tracking-wider">
                <Plus className="w-4 h-4 text-muted-foreground" />
                <h3>Send a request</h3>
              </div>
              {!showRequestForm ? (
                <Button
                  type="button"
                  onClick={() => setShowRequestForm(true)}
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-white/50 hover:bg-white border-border/50"
                >
                  <Plus className="w-4 h-4 mr-2 text-muted-foreground" />
                  Ask the concierge to arrange something
                </Button>
              ) : (
                <form onSubmit={handleCreateRequest} className="space-y-3 rounded-xl border border-border/50 bg-white/60 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">What do you need?</p>
                    <button type="button" onClick={() => setShowRequestForm(false)} aria-label="Close request form" className="p-1 rounded hover:bg-muted">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <Select value={requestType} onValueChange={setRequestType}>
                    <SelectTrigger aria-label="Request type" className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="human-concierge">General concierge request</SelectItem>
                      <SelectItem value="reservation">Room reservation</SelectItem>
                      <SelectItem value="dining">Dining reservation</SelectItem>
                      <SelectItem value="spa">Spa appointment</SelectItem>
                      <SelectItem value="room-service">Room service</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="activity">Activity booking</SelectItem>
                    </SelectContent>
                  </Select>
                  <textarea
                    required
                    value={requestDetails}
                    onChange={(event) => setRequestDetails(event.target.value)}
                    maxLength={2000}
                    rows={3}
                    placeholder="Add the details Aria should pass to the team."
                    className="w-full resize-y rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    type="datetime-local"
                    value={preferredTime}
                    onChange={(event) => setPreferredTime(event.target.value)}
                    aria-label="Preferred date and time"
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-muted-foreground"
                  />
                  <p className="text-[11px] text-muted-foreground">Requests are not confirmed until resort staff respond.</p>
                  <Button type="submit" disabled={!requestDetails.trim() || createAction.isPending} className="w-full">
                    {createAction.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Send request
                  </Button>
                </form>
              )}
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
                        {action.status === 'confirmed' || action.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : action.status === 'cancelled' ? (
                          <AlertCircle className="w-4 h-4 text-destructive" />
                        ) : (
                          <Circle className="w-4 h-4 text-blue-500 animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground tracking-wide">{action.title}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {action.details}
                        </p>
                        <span className="text-[10px] text-muted-foreground/60 mt-1.5 block">
                          {action.status === "requested" ? "Awaiting staff confirmation" : action.status.replace(/-/g, " ")}
                          {" · "}{new Date(action.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {action.status === "requested" && (
                        <button
                          type="button"
                          onClick={() => handleCancelRequest(action.id)}
                          disabled={cancelAction.isPending}
                          className="text-[11px] text-muted-foreground hover:text-destructive disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      )}
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
