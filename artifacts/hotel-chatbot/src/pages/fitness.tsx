import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Activity, ArrowLeft, Bike, Bot, Check, ChevronRight, Clock3, Dumbbell, Flame, Heart, MessageCircle, Send, Sparkles, Waves, Wind, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api-url";

type ActivityEntry = { id: string; key: string; title: string; points: number; minutes: number; at: string };
type CoachMessage = { role: "user" | "assistant"; content: string };

const ACTIVITIES = [
  { key: "walk", title: "Brisk walk", subtitle: "20 min · easy pace", points: 40, minutes: 20, icon: Wind, tint: "bg-emerald-50 text-emerald-700", goal: "A relaxed walk is a great way to build consistency." },
  { key: "run", title: "Outdoor run", subtitle: "20 min · steady effort", points: 60, minutes: 20, icon: Activity, tint: "bg-orange-50 text-orange-700", goal: "Keep a conversational pace and take recovery as needed." },
  { key: "cycle", title: "Cycling", subtitle: "30 min · your rhythm", points: 70, minutes: 30, icon: Bike, tint: "bg-sky-50 text-sky-700", goal: "Enjoy a smooth ride and stay comfortable." },
  { key: "strength", title: "Strength session", subtitle: "25 min · full body", points: 65, minutes: 25, icon: Dumbbell, tint: "bg-violet-50 text-violet-700", goal: "Choose a level that feels right and focus on good form." },
  { key: "yoga", title: "Yoga & mobility", subtitle: "20 min · unwind", points: 45, minutes: 20, icon: Sparkles, tint: "bg-rose-50 text-rose-700", goal: "Breathe naturally and move within a comfortable range." },
  { key: "swim", title: "Swimming", subtitle: "30 min · gentle laps", points: 75, minutes: 30, icon: Waves, tint: "bg-cyan-50 text-cyan-700", goal: "Take breaks whenever you need them and enjoy the water." },
];
const STORAGE_KEY = "seed-wellness-activity-log-v1";

function readEntries(): ActivityEntry[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.filter((item): item is ActivityEntry =>
      item && typeof item.id === "string" && typeof item.key === "string" &&
      typeof item.title === "string" && typeof item.points === "number" &&
      typeof item.minutes === "number" && typeof item.at === "string"
    ) : [];
  } catch { return []; }
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function FitnessPage() {
  const [entries, setEntries] = useState<ActivityEntry[]>(readEntries);
  const [messages, setMessages] = useState<CoachMessage[]>([
    { role: "assistant", content: "Hey! I’m your SEED wellness coach. Tell me what you’re working toward, or ask me to help shape a routine that fits your day. 🌿" },
  ]);
  const [question, setQuestion] = useState("");
  const [coachBusy, setCoachBusy] = useState(false);
  const [coachError, setCoachError] = useState("");
  const [notice, setNotice] = useState("");

  const todayKey = dateKey(new Date());
  const todayEntries = useMemo(() => entries.filter((entry) => dateKey(new Date(entry.at)) === todayKey), [entries, todayKey]);
  const todayPoints = todayEntries.reduce((sum, entry) => sum + entry.points, 0);
  const todayMinutes = todayEntries.reduce((sum, entry) => sum + entry.minutes, 0);
  const weeklyActivity = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const day = new Date(); day.setDate(day.getDate() - (6 - index));
    const key = dateKey(day);
    return { label: day.toLocaleDateString(undefined, { weekday: "short" }), count: entries.filter((entry) => dateKey(new Date(entry.at)) === key).length, today: key === todayKey };
  }), [entries, todayKey]);

  const logActivity = (activity: typeof ACTIVITIES[number]) => {
    const entry: ActivityEntry = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, key: activity.key, title: activity.title, points: activity.points, minutes: activity.minutes, at: new Date().toISOString() };
    setEntries((current) => {
      const next = [entry, ...current];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { setNotice("Couldn’t save your activity on this device."); }
      return next;
    });
    setNotice(`Nice work — ${activity.points} points added for ${activity.title.toLowerCase()}!`);
    window.setTimeout(() => setNotice(""), 3500);
  };

  const askCoach = async (text = question) => {
    const prompt = text.trim();
    if (!prompt || coachBusy) return;
    const nextMessages = [...messages, { role: "user" as const, content: prompt }];
    setMessages(nextMessages);
    setQuestion("");
    setCoachBusy(true);
    setCoachError("");
    try {
      const response = await apiFetch("/api/aria/fitness-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: prompt,
          recentActivities: entries.slice(0, 8).map(({ title, minutes, at }) => ({ title, minutes, at })),
          todayMinutes,
        }),
      });
      if (!response.ok) throw new Error("The coach is taking a breather. Please try again.");
      const data = await response.json();
      if (typeof data.answer !== "string" || !data.answer.trim()) throw new Error("I didn’t get a reply. Please try again.");
      setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setCoachError(error instanceof Error ? error.message : "Couldn’t reach your coach. Please try again.");
    } finally { setCoachBusy(false); }
  };

  return (
    <div className="min-h-full overflow-y-auto bg-[#f5f7f5] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        <header className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-slate-900" aria-label="Back home"><ArrowLeft className="h-4 w-4" /></Link>
            <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">SEED WELLNESS</p><h1 className="mt-0.5 text-xl font-bold tracking-tight sm:text-2xl">Your activity</h1></div>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm sm:flex"><Heart className="h-4 w-4 fill-rose-100 text-rose-500" /> Move at your own pace</div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.45fr_0.85fr]">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#123a2c] p-6 text-white shadow-xl shadow-emerald-950/10 sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/10" /><div className="pointer-events-none absolute -right-7 -top-20 h-56 w-56 rounded-full border border-white/10" />
            <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
              <div className="max-w-md"><p className="text-sm font-medium text-emerald-200">A little movement adds up</p><h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Make today<br />feel a little better.</h2><p className="mt-3 max-w-sm text-sm leading-6 text-emerald-50/75">Choose an activity, log it when you’re done, and collect points for showing up.</p><a href="#activities" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50">Explore activities <ChevronRight className="h-4 w-4" /></a></div>
              <div className="flex h-40 w-40 shrink-0 items-center justify-center self-center rounded-full border border-white/15 bg-white/5 sm:h-48 sm:w-48">
                <div className="text-center"><div className="flex items-center justify-center gap-2 text-amber-300"><Zap className="h-5 w-5 fill-current" /><span className="text-4xl font-bold tabular-nums">{todayPoints}</span></div><p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-white/65">points today</p><p className="mt-1 text-xs text-emerald-100/70">{todayMinutes} active min</p></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={Clock3} label="Active time" value={`${todayMinutes}`} unit="min" detail="logged today" tone="blue" />
            <StatCard icon={Flame} label="Activities" value={`${todayEntries.length}`} unit="" detail="completed today" tone="orange" />
            <StatCard icon={Zap} label="Points earned" value={`${todayPoints}`} unit="pts" detail="keep your momentum" tone="green" />
            <StatCard icon={Heart} label="Next milestone" value={`${Math.max(0, 500 - (entries.reduce((sum, entry) => sum + entry.points, 0) % 500))}`} unit="pts" detail="to your next 500" tone="purple" />
          </div>
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.6rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Consistency</p><h2 className="mt-1 text-lg font-bold">Your movement this week</h2></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Last 7 days</span></div>
            <div className="flex h-36 items-end justify-around gap-3 border-b border-slate-100 pb-2">
              {weeklyActivity.map((day) => <div key={day.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="flex h-24 w-full items-end justify-center"><motion.div initial={{ height: 0 }} animate={{ height: day.count ? `${Math.min(100, 26 + day.count * 22)}%` : "8%" }} transition={{ duration: 0.45 }} className={`w-7 max-w-full rounded-t-lg ${day.today ? "bg-emerald-600" : day.count ? "bg-emerald-300" : "bg-slate-100"}`} title={`${day.count} activities`} /></div><span className={`text-[11px] ${day.today ? "font-bold text-emerald-700" : "text-slate-400"}`}>{day.label}</span></div>)}
            </div>
            <p className="mt-4 text-xs text-slate-400">Every completed activity counts. Rest days are part of a healthy routine, too.</p>
          </div>
          <div className="rounded-[1.6rem] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Recent activity</p><h2 className="mt-1 text-lg font-bold">Your check-ins</h2></div><Activity className="h-5 w-5 text-emerald-600" /></div>
            {entries.length ? <div className="max-h-48 space-y-3 overflow-y-auto">{entries.slice(0, 5).map((entry) => <div key={entry.id} className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Check className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{entry.title}</p><p className="text-xs text-slate-400">{new Date(entry.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {entry.minutes} min</p></div><span className="text-sm font-bold text-emerald-700">+{entry.points}</span></div>)}</div> : <div className="rounded-xl bg-slate-50 p-5 text-center"><p className="text-sm font-medium text-slate-600">Your first check-in is waiting</p><p className="mt-1 text-xs text-slate-400">Log an activity below to start earning points.</p></div>}
          </div>
        </section>

        <section id="activities" className="mt-9 scroll-mt-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Move your way</p><h2 className="mt-1 text-xl font-bold">Activities & rewards</h2><p className="mt-1 text-sm text-slate-500">Log each activity after you finish to add points to your total.</p></div><span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500">Points are saved on this device</span></div>
          {notice && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} role="status" className="mb-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{notice}</motion.p>}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{ACTIVITIES.map((activity, index) => <motion.article key={activity.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start gap-3"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${activity.tint}`}><activity.icon className="h-5 w-5" /></div><div className="min-w-0 flex-1"><h3 className="text-sm font-bold">{activity.title}</h3><p className="mt-0.5 text-xs text-slate-400">{activity.subtitle}</p></div><div className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">+{activity.points} pts</div></div><p className="mt-3 text-xs leading-5 text-slate-500">{activity.goal}</p><button onClick={() => logActivity(activity)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"><Check className="h-4 w-4" /> Log activity</button></motion.article>)}</div>
        </section>

        <section className="mt-9 overflow-hidden rounded-[1.7rem] border border-emerald-100 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 p-6 text-white sm:p-8"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15"><Bot className="h-6 w-6" /></div><p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Your AI wellness companion</p><h2 className="mt-2 text-2xl font-bold">Meet your coach</h2><p className="mt-3 text-sm leading-6 text-emerald-50/75">Get friendly ideas for moving more, building a balanced routine, or making your next activity feel achievable.</p><div className="mt-6 flex items-center gap-2 text-xs text-emerald-100/75"><span className="h-2 w-2 rounded-full bg-lime-300" /> Ready when you are</div></div>
            <div className="flex min-h-[390px] flex-col p-4 sm:p-6">
              <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800"><Sparkles className="h-4 w-4" /></div><div><p className="text-sm font-bold">SEED Coach</p><p className="text-[11px] text-slate-400">Personalized, supportive suggestions</p></div></div>
              <div className="flex-1 space-y-3 overflow-y-auto py-1" aria-live="polite">{messages.map((message, index) => <div key={`${index}-${message.role}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><p className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${message.role === "user" ? "rounded-br-md bg-emerald-700 text-white" : "rounded-bl-md bg-slate-100 text-slate-700"}`}>{message.content}</p></div>)}{coachBusy && <p className="text-xs text-slate-400">Coach is thinking…</p>}{coachError && <p role="alert" className="text-xs text-rose-600">{coachError}</p>}</div>
              <div className="mt-3 flex flex-wrap gap-2">{["Suggest a gentle routine", "How can I stay consistent?"].map((suggestion) => <button key={suggestion} onClick={() => askCoach(suggestion)} disabled={coachBusy} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-500 transition hover:border-emerald-300 hover:text-emerald-800 disabled:opacity-50">{suggestion}</button>)}</div>
              <form className="mt-3 flex gap-2" onSubmit={(event) => { event.preventDefault(); void askCoach(); }}><input value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={1000} placeholder="Ask your wellness coach…" aria-label="Message your wellness coach" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"/><button type="submit" disabled={!question.trim() || coachBusy} aria-label="Send to coach" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white transition hover:bg-emerald-800 disabled:opacity-40"><Send className="h-4 w-4" /></button></form>
              <p className="mt-2 text-[10px] leading-4 text-slate-400">Wellness guidance is general information, not medical advice. Stop if you feel unwell and seek professional care when needed.</p>
            </div>
          </div>
        </section>
        <p className="mt-5 text-center text-[11px] text-slate-400">Activity points are a motivational demo and are stored locally in this browser.</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, unit, detail, tone }: { icon: typeof Clock3; label: string; value: string; unit: string; detail: string; tone: "blue" | "orange" | "green" | "purple" }) {
  const tones = { blue: "bg-sky-50 text-sky-700", orange: "bg-orange-50 text-orange-700", green: "bg-emerald-50 text-emerald-700", purple: "bg-violet-50 text-violet-700" };
  return <div className="rounded-[1.4rem] border border-slate-100 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><p className="text-xs font-medium text-slate-500">{label}</p><span className={`flex h-8 w-8 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-2xl font-bold tabular-nums">{value}<span className="ml-1 text-xs font-semibold text-slate-400">{unit}</span></p><p className="mt-1 text-[11px] text-slate-400">{detail}</p></div>;
}
