import { createFileRoute } from "@tanstack/react-router";
import { Check, Flame } from "lucide-react";
import { toast } from "sonner";
import { useGame } from "@/hooks/useGame";
import { TASKS, formatNumber } from "@/lib/game";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks | Music AI" },
      { name: "description", content: "Complete daily and social tasks to earn free MUSIC coins." },
      { property: "og:title", content: "Tasks | Music AI" },
      { property: "og:description", content: "Daily tasks and achievements with MUSIC rewards." },
    ],
  }),
  component: TasksPage,
});

const GROUPS = [
  { kind: "daily", label: "Daily" },
  { kind: "social", label: "Social" },
  { kind: "achievement", label: "Achievements" },
] as const;

function TasksPage() {
  const { state, claimTask } = useGame();

  return (
    <div className="space-y-5">
      <section className="liquid-glass animate-fade-up delay-1 rounded-2xl p-5 text-center">
        <div className="flex items-center justify-center gap-2">
          <Flame size={18} strokeWidth={2} className="text-blue-500" />
          <p className="text-3xl tracking-tight">{state.streak}</p>
        </div>
        <p className="mt-1 text-[11px] text-foreground/60">
          Day streak — every consecutive day adds 10% to your check-in reward
        </p>
      </section>

      {GROUPS.map((g, gi) => (
        <section key={g.kind} className={`animate-fade-up space-y-2 delay-${gi + 2}`}>
          <h2 className="px-1 text-sm text-foreground/70">{g.label}</h2>
          {TASKS.filter((t) => t.kind === g.kind).map((t) => {
            const done = state.claimedTasks.includes(t.id);
            return (
              <div key={t.id} className="liquid-glass flex items-center gap-3 rounded-2xl p-3.5">
                <div className="flex-1">
                  <p className="text-sm">{t.title}</p>
                  <p className="text-[11px] text-foreground/60">+{formatNumber(t.reward)} MUSIC</p>
                </div>
                <button
                  disabled={done}
                  onClick={() => {
                    if (t.url) window.open(t.url, "_blank");
                    claimTask(t.id, t.reward);
                    toast.success(`Claimed ${formatNumber(t.reward)} MUSIC`);
                  }}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs transition-transform duration-200 active:scale-95 ${
                    done ? "glass-thin text-foreground/50" : "bg-white text-gray-900 hover:scale-105"
                  }`}
                >
                  {done ? <Check size={13} strokeWidth={2} /> : null}
                  {done ? "Done" : (t.cta ?? "Claim")}
                </button>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
