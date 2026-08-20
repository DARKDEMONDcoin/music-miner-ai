import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useGame } from "@/hooks/useGame";
import { isPremium } from "@/lib/game";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "المتجر | Music AI" },
      {
        name: "description",
        content: "اشترِ Premium والبوسترات وحزم التوليد بنجوم تليجرام أو TON داخل Music AI.",
      },
      { property: "og:title", content: "المتجر | Music AI" },
      { property: "og:description", content: "عروض وحزم مدفوعة بنجوم تليجرام و TON." },
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
  emoji: string;
  highlight?: boolean;
};

const ITEMS: Item[] = [
  {
    id: "premium",
    title: "Premium Pass — شهر",
    desc: "×2 تعدين، سعة 24 ساعة، 5 تراكات AI يوميًا، بدون إعلانات.",
    stars: 250,
    ton: "1.2",
    emoji: "⭐",
    highlight: true,
  },
  {
    id: "booster",
    title: "بوستر ×3 لمدة 8 ساعات",
    desc: "ضاعف معدل التعدين ثلاث مرات فورًا.",
    stars: 75,
    ton: "0.4",
    emoji: "🚀",
  },
  {
    id: "tracks10",
    title: "حزمة 10 تراكات AI",
    desc: "توليد إضافي يتخطى الحد اليومي.",
    stars: 100,
    ton: "0.5",
    emoji: "🎼",
  },
  {
    id: "coins",
    title: "حقيبة 250,000 MUSIC",
    desc: "دفعة عملات فورية لترقية آلاتك.",
    stars: 400,
    ton: "1.9",
    emoji: "💰",
  },
  {
    id: "mega",
    title: "Mega Bundle الموسمي",
    desc: "Premium + بوستر أسبوع + 1,000,000 MUSIC.",
    stars: 2500,
    ton: "11.5",
    emoji: "🏆",
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
    toast.success("تم تفعيل الشراء (وضع تجريبي)", {
      description:
        method === "stars"
          ? "الدفع الحقيقي بنجوم تليجرام يُفعَّل في مرحلة الدفع."
          : "الدفع الحقيقي عبر TON يُفعَّل في مرحلة الدفع.",
    });
  };

  return (
    <div className="space-y-4 pt-1">
      <section className="surface rounded-2xl p-4 text-center">
        <p className="text-sm font-bold">
          {isPremium(state) ? "عضويتك Premium فعّالة ⭐" : "طوّر استوديوك أسرع"}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          الدفع بنجوم تليجرام أو بمحفظة TON
        </p>
      </section>

      {ITEMS.map((item) => (
        <div
          key={item.id}
          className={`surface rounded-2xl p-4 ${item.highlight ? "glow border-primary/60" : ""}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-2xl">
              {item.emoji}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">{item.title}</p>
              <p className="text-[11px] text-muted-foreground">{item.desc}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => handle(item, "stars")}
              className="brand-gradient rounded-xl py-2.5 text-xs font-bold text-primary-foreground"
            >
              ⭐ {item.stars} نجمة
            </button>
            <button
              onClick={() => handle(item, "ton")}
              className="rounded-xl bg-secondary py-2.5 text-xs font-bold"
            >
              💎 {item.ton} TON
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
