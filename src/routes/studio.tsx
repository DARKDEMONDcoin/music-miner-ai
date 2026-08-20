import { createFileRoute } from "@tanstack/react-router";
import {
  AudioWaveform,
  Brain,
  DollarSign,
  Drum,
  Gem,
  Orbit,
  Piano,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useGame } from "@/hooks/useGame";
import {
  INSTRUMENTS,
  MINERS,
  formatCrypto,
  formatNumber,
  instrumentRate,
  minerRate,
  minerUpgradeCost,
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

      <section className="liquid-glass animate-fade-up rounded-2xl p-5">
        <p className="text-sm">Crypto rigs</p>
        <p className="mt-1 text-[11px] text-foreground/60">
          Convert studio power into GRAM and USDT. Premium doubles every rig.
        </p>
      </section>

      <div className="space-y-3">
        {MINERS.map((m) => {
          const level = state.minerLevels[m.id] ?? 0;
          const cost = minerUpgradeCost(m, level);
          const affordable = state.balance >= cost;
          const Icon = m.id === "gram" ? Gem : DollarSign;
          const nextLevelState = {
            ...state,
            minerLevels: { ...state.minerLevels, [m.id]: level + 1 },
          };
          return (
            <div key={m.id} className="liquid-glass animate-fade-up rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm">{m.name}</p>
                    <span className="glass-thin rounded-lg px-2 py-0.5 text-[11px]">Lv {level}</span>
                  </div>
                  <p className="text-[11px] text-foreground/60">{m.desc}</p>
                  <p className="mt-1 text-[11px] text-foreground/80">
                    {formatCrypto(minerRate(state, m))} → {formatCrypto(minerRate(nextLevelState, m))}{" "}
                    {m.symbol} / hr
                  </p>
                  <p className="mt-0.5 text-[10px] text-foreground/50">
                    Wallet {formatCrypto(m.id === "gram" ? state.gram : state.usdt)} {m.symbol} · min
                    withdraw {m.minWithdraw} {m.symbol}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const ok = upgradeMiner(m.id);
                  toast[ok ? "success" : "error"](
                    ok
                      ? `${m.name} is now level ${level + 1}`
                      : "Not enough MUSIC — mine or buy a coin bag",
                  );
                }}
                disabled={!affordable}
                className={`mt-3 w-full rounded-xl py-2.5 text-sm transition-transform duration-200 active:scale-95 ${
                  affordable ? "bg-blue-700 hover:scale-105" : "glass-thin text-foreground/50"
                }`}
              >
                {level === 0 ? "Unlock" : "Upgrade"} · {formatNumber(cost)} MUSIC
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

