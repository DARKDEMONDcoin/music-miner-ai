import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useGame } from "@/hooks/useGame";
import { TASKS, formatNumber } from "@/lib/game";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "المهام | Music AI" },
      { name: "description", content: "أنجز المهام اليومية والاجتماعية واكسب عملة MUSIC مجانًا." },
      { property: "og:title", content: "المهام | Music AI" },
      { property: "og:description", content: "مهام يومية وإنجازات بمكافآت من عملة MUSIC." },
    ],
  }),
  component: TasksPage,
});

const GROUPS = [
  { kind: "daily", label: "مهام يومية" },
  { kind: "social", label: "مهام اجتماعية" },
  { kind: "achievement", label: "إنجازات" },
] as const;

function TasksPage() {
  const { state, claimTask } = useGame();

  return (
    <div className="space-y-5 pt-1">
      <section className="surface rounded-2xl p-4 text-center">
        <p className="text-xs text-muted-foreground">سلسلة أيامك</p>
        <p className="text-3xl font-black">{state.streak} 🔥</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          كل يوم متواصل يزيد مكافأة الدخول بنسبة 10%
        </p>
      </section>

      {GROUPS.map((g) => (
        <section key={g.kind} className="space-y-2">
          <h2 className="px-1 text-sm font-bold">{g.label}</h2>
          {TASKS.filter((t) => t.kind === g.kind).map((t) => {
            const done = state.claimedTasks.includes(t.id);
            return (
              <div key={t.id} className="surface flex items-center gap-3 rounded-2xl p-3.5">
                <div className="flex-1">
                  <p className="text-sm font-semibold">{t.title}</p>
                  <p className="text-[11px] text-gold">+{formatNumber(t.reward)} MUSIC</p>
                </div>
                <button
                  disabled={done}
                  onClick={() => {
                    if (t.url) window.open(t.url, "_blank");
                    claimTask(t.id, t.reward);
                    toast.success(`تم استلام ${formatNumber(t.reward)} MUSIC`);
                  }}
                  className={`rounded-xl px-4 py-2 text-xs font-bold ${
                    done ? "bg-secondary text-muted-foreground" : "brand-gradient text-primary-foreground"
                  }`}
                >
                  {done ? "تم ✓" : (t.cta ?? "استلم")}
                </button>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
