import { createFileRoute } from "@tanstack/react-router";
import { Coins, Crown, Gem, Music4, Rocket, Star, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useGame } from "@/hooks/useGame";
import { isPremium } from "@/lib/game";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop | Music AI" },
      {
        name: "description",
        content: "Buy Premium, boosters and AI track packs with Telegram Stars or TON.",
      },
      { property: "og:title", content: "Shop | Music AI" },
      { property: "og:description", content: "Premium passes and boosters paid with Stars or TON." },
    ],
  }),
  component: ShopPage,
});

type Item = {
  id: string;
  title: string;
  desc: string;
  stars: number;
  ton: string;
  icon: LucideIcon;
  highlight?: boolean;
};

const ITEMS: Item[] = [
  {
    id: "premium",
    title: "Premium Pass — 30 days",
    desc: "2x mining, 24h storage, 5 AI tracks per day, no ads.",
    stars: 250,
    ton: "1.2",
    icon: Crown,
    highlight: true,
  },
  {
    id: "booster",
    title: "3x Booster — 8 hours",
    desc: "Triple your mining rate instantly.",
    stars: 75,
    ton: "0.4",
    icon: Rocket,
  },
  {
    id: "tracks10",
    title: "10 AI track pack",
    desc: "Extra generations beyond your daily limit.",
    stars: 100,
    ton: "0.5",
    icon: Music4,
  },
  {
    id: "coins",
    title: "250,000 MUSIC bag",
    desc: "Instant coins to upgrade your instruments.",
    stars: 400,
    ton: "1.9",
    icon: Coins,
  },
  {
    id: "mega",
    title: "Seasonal Mega Bundle",
    desc: "Premium + one week booster + 1,000,000 MUSIC.",
    stars: 2500,
    ton: "11.5",
    icon: Gem,
  },
];

function ShopPage() {
  const { state, buy } = useGame();

  const handle = (item: Item, method: "stars" | "ton") => {
    if (item.id === "premium") buy("premium");
    else if (item.id === "booster") buy("booster");
    else if (item.id === "coins") buy("coins", 250_000);
    else if (item.id === "mega") {
      buy("premium");
      buy("booster");
      buy("coins", 1_000_000);
    }
    toast.success("Purchase applied (demo mode)", {
      description:
        method === "stars"
          ? "Real Telegram Stars checkout activates in the payments phase."
          : "Real TON checkout activates in the payments phase.",
    });
  };

  return (
    <div className="space-y-3">
      <section className="liquid-glass animate-fade-up delay-1 rounded-2xl p-5 text-center">
        <p className="text-sm">
          {isPremium(state) ? "Premium is active" : "Level up your studio faster"}
        </p>
        <p className="mt-1 text-[11px] text-foreground/60">Pay with Telegram Stars or a TON wallet</p>
      </section>

      {ITEMS.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className={`liquid-glass animate-fade-up rounded-2xl p-4 ${i < 4 ? `delay-${i + 2}` : ""}`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  item.highlight ? "bg-white text-blue-700" : "bg-blue-700"
                }`}
              >
                <Icon size={20} strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-sm">{item.title}</p>
                <p className="text-[11px] text-foreground/60">{item.desc}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => handle(item, "stars")}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-xs text-gray-900 transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <Star size={13} strokeWidth={2} className="text-blue-700" /> {item.stars} Stars
              </button>
              <button
                onClick={() => handle(item, "ton")}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-700 py-2.5 text-xs transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <Gem size={13} strokeWidth={2} /> {item.ton} TON
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
