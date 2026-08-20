import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useGame } from "@/hooks/useGame";
import {
  activeTrack,
  fillPct,
  formatNumber,
  isPremium,
  multiplier,
  pending,
  ratePerHour,
  storageHours,
} from "@/lib/game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "التعدين | Music AI" },
      {
        name: "description",
        content: "اجمع أرباح استوديوك من عملة MUSIC كل بضع ساعات وارفع معدل التعدين.",
      },
      { property: "og:title", content: "التعدين | Music AI" },
      { property: "og:description", content: "استوديو تعدين عملة MUSIC داخل تليجرام." },
    ],
  }),
  component: MinePage,
});

function Equalizer() {
  return (
    <div className="flex items-end gap-1">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <span
          key={i}
          className="animate-eq brand-gradient w-1.5 origin-bottom rounded-full"
          style={{ height: 26, animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

function MinePage() {
  const { state, now, collect } = useGame();
  const [pops, setPops] = useState<{ id: number; amount: number }[]>([]);

  const ready = pending(state, now);
  const fill = fillPct(state, now);
  const rate = ratePerHour(state);
  const track = activeTrack(state);

  const onCollect = () => {
    const gained = collect();
    if (gained <= 0) {
      toast("لسه مفيش أرباح مجمّعة", { description: "ارجع بعد شوية أو رقّي آلاتك." });
      return;
    }
    const id = Date.now();
    setPops((p) => [...p, { id, amount: gained }]);
    setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 900);
    toast.success(`+${formatNumber(gained)} MUSIC`);
  };

  return (
    <div className="space-y-4 pt-1">
      <section className="surface relative overflow-hidden rounded-3xl p-5 text-center">
        <div className="absolute inset-x-0 -top-16 h-32 opacity-30 blur-3xl brand-gradient" />
        <p className="relative text-xs text-muted-foreground">رصيدك من العملة</p>
        <p className="relative mt-1 text-4xl font-black tracking-tight">
          <span className="text-brand-gradient">{formatNumber(state.balance)}</span>
          <span className="ms-2 text-sm text-muted-foreground">MUSIC</span>
        </p>

        <div className="relative mt-4 flex items-center justify-center gap-3 text-xs">
          <span className="surface rounded-full px-3 py-1">
            ⚡ {formatNumber(rate)} / ساعة
          </span>
          <span className="surface rounded-full px-3 py-1">
            ✖️ {multiplier(state).toFixed(2)} مضاعف
          </span>
        </div>

        <div className="relative mx-auto mt-6 flex size-40 items-center justify-center">
          <span className="animate-pulse-ring absolute inset-0 rounded-full border border-primary/60" />
          <button
            onClick={onCollect}
            className="brand-gradient glow flex size-36 flex-col items-center justify-center rounded-full font-black text-primary-foreground transition-transform active:scale-95"
          >
            <Equalizer />
            <span className="mt-2 text-lg">اجمع</span>
            <span className="text-xs opacity-80">{formatNumber(ready)}</span>
          </button>
          {pops.map((p) => (
            <span
              key={p.id}
              className="animate-float-up pointer-events-none absolute text-sm font-bold text-success"
            >
              +{formatNumber(p.amount)}
            </span>
          ))}
        </div>

        <div className="relative mt-5">
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>سعة التخزين {storageHours(state)} ساعة</span>
            <span>{fill.toFixed(0)}%</span>
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
            <div className="brand-gradient h-full rounded-full transition-all" style={{ width: `${fill}%` }} />
          </div>
          {fill >= 100 && (
            <p className="mt-2 text-[11px] font-semibold text-gold">
              التخزين امتلأ! اجمع الآن حتى لا تخسر أرباحًا.
            </p>
          )}
        </div>
      </section>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="سلسلة الأيام" value={`${state.streak} 🔥`} />
        <Stat label="الأصدقاء" value={`${state.referrals} 👥`} />
        <Stat label="الحالة" value={isPremium(state) ? "Premium ⭐" : "مجاني"} />
      </div>

      <Link to="/ai" className="surface block rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div
            className="size-14 shrink-0 overflow-hidden rounded-xl brand-gradient bg-cover bg-center"
            style={track?.coverUrl ? { backgroundImage: `url(${track.coverUrl})` } : undefined}
          />
          <div className="flex-1">
            <p className="text-sm font-bold">
              {track ? track.title : "ولّد تراك اليوم بالذكاء الاصطناعي"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {track
                ? `بونص +${track.bonusPct}% • ينتهي بعد ${Math.max(
                    0,
                    Math.round((track.expiresAt - now) / 3_600_000),
                  )} ساعة`
                : "تراك واحد مجاني يوميًا يمنحك بونص تعدين مؤقت"}
            </p>
          </div>
          <span className="text-primary">›</span>
        </div>
      </Link>

      <Link to="/studio" className="brand-gradient block rounded-2xl p-4 text-center font-bold text-primary-foreground">
        رقّي آلاتك وزوّد التعدين 🎛️
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface rounded-2xl p-3 text-center">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}
