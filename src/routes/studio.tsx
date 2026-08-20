import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useGame } from "@/hooks/useGame";
import {
  INSTRUMENTS,
  formatNumber,
  instrumentRate,
  ratePerHour,
  upgradeCost,
} from "@/lib/game";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "الاستوديو | Music AI" },
      { name: "description", content: "رقّي آلاتك الموسيقية لزيادة معدل تعدين عملة MUSIC بالساعة." },
      { property: "og:title", content: "الاستوديو | Music AI" },
      { property: "og:description", content: "ترقية الآلات ورفع معدل التعدين في Music AI." },
    ],
  }),
  component: StudioPage,
});

function StudioPage() {
  const { state, upgrade } = useGame();

  return (
    <div className="space-y-4 pt-1">
      <section className="surface rounded-2xl p-4">
        <p className="text-xs text-muted-foreground">معدل التعدين الحالي</p>
        <p className="text-2xl font-black text-brand-gradient">
          {formatNumber(ratePerHour(state))} / ساعة
        </p>
      </section>

      <div className="space-y-3">
        {INSTRUMENTS.map((inst) => {
          const level = state.levels[inst.id] ?? 0;
          const cost = upgradeCost(inst, level);
          const current = instrumentRate(inst, level);
          const next = instrumentRate(inst, level + 1);
          const affordable = state.balance >= cost;

          return (
            <div key={inst.id} className="surface rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-2xl">
                  {inst.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold">{inst.name}</p>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold">
                      Lv {level}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{inst.desc}</p>
                  <p className="mt-1 text-[11px]">
                    <span className="text-muted-foreground">{formatNumber(current)}</span>
                    <span className="mx-1 text-primary">→</span>
                    <span className="font-bold text-success">{formatNumber(next)} / ساعة</span>
                  </p>
                </div>
              </div>
              <button
                disabled={!affordable}
                onClick={() => {
                  if (upgrade(inst.id)) toast.success(`تمت ترقية ${inst.name} 🎉`);
                }}
                className={`mt-3 w-full rounded-xl py-2.5 text-sm font-bold transition-opacity ${
                  affordable
                    ? "brand-gradient text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {level === 0 ? "شراء" : "ترقية"} • {formatNumber(cost)} MUSIC
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
