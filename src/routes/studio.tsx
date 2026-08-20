import { createFileRoute } from "@tanstack/react-router";
import {
  AudioWaveform,
  Brain,
  Drum,
  Orbit,
  Piano,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
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
      { title: "Studio | Music AI" },
      { name: "description", content: "Upgrade your instruments to raise your hourly MUSIC mining rate." },
      { property: "og:title", content: "Studio | Music AI" },
      { property: "og:description", content: "Upgrade instruments and boost mining in Music AI." },
    ],
  }),
  component: StudioPage,
});

const ICONS: Record<string, LucideIcon> = {
  AudioWaveform,
  SlidersHorizontal,
  Drum,
  Piano,
  Brain,
  Orbit,
};

function StudioPage() {
  const { state, upgrade } = useGame();

  return (
    <div className="space-y-3">
      <section className="liquid-glass animate-fade-up delay-1 rounded-2xl p-5">
        <p className="text-xs text-foreground/60">Current mining rate</p>
        <p className="text-3xl tracking-tight">{formatNumber(ratePerHour(state))} / hr</p>
      </section>

      <div className="space-y-3">
        {INSTRUMENTS.map((inst, idx) => {
          const level = state.levels[inst.id] ?? 0;
          const cost = upgradeCost(inst, level);
          const current = instrumentRate(inst, level);
          const next = instrumentRate(inst, level + 1);
          const affordable = state.balance >= cost;
          const Icon = ICONS[inst.icon] ?? AudioWaveform;

          return (
            <div
              key={inst.id}
              className={`liquid-glass animate-fade-up rounded-2xl p-4 ${idx < 4 ? `delay-${idx + 1}` : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-700">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm">{inst.name}</p>
                    <span className="glass-thin rounded-lg px-2 py-0.5 text-[11px]">Lv {level}</span>
                  </div>
                  <p className="text-[11px] text-foreground/60">{inst.desc}</p>
                  <p className="mt-1 text-[11px] text-foreground/80">
                    {formatNumber(current)} / hr → {formatNumber(next)} / hr
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const ok = upgrade(inst.id);
                  toast[ok ? "success" : "error"](
                    ok ? `${inst.name} upgraded to level ${level + 1}` : "Not enough MUSIC",
                  );
                }}
                disabled={!affordable}
                className={`mt-3 w-full rounded-xl py-2.5 text-sm transition-transform duration-200 active:scale-95 ${
                  affordable ? "bg-white text-gray-900 hover:scale-105" : "glass-thin text-foreground/50"
                }`}
              >
                Upgrade · {formatNumber(cost)} MUSIC
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
