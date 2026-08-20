import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useGame } from "@/hooks/useGame";
import { formatNumber } from "@/lib/game";

export const Route = createFileRoute("/referral")({
  head: () => ({
    meta: [
      { title: "الإحالة | Music AI" },
      { name: "description", content: "ادعُ أصدقاءك واكسب 10% من تعدينهم مدى الحياة في Music AI." },
      { property: "og:title", content: "الإحالة | Music AI" },
      { property: "og:description", content: "نظام إحالة بطبقتين ومكافآت فورية لكل صديق." },
    ],
  }),
  component: ReferralPage,
});

function ReferralPage() {
  const { state } = useGame();
  const link = `https://t.me/MusicAiBot?start=${state.refCode}`;

  return (
    <div className="space-y-4 pt-1">
      <section className="surface rounded-3xl p-5 text-center">
        <p className="text-4xl">👥</p>
        <h1 className="mt-2 text-lg font-black">ادعُ أصدقاءك واكسب معهم</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          احصل على 10% من تعدين كل صديق + 2.5% من أصدقائهم، مدى الحياة.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-secondary p-3">
            <p className="text-[10px] text-muted-foreground">عدد الأصدقاء</p>
            <p className="text-xl font-black">{state.referrals}</p>
          </div>
          <div className="rounded-2xl bg-secondary p-3">
            <p className="text-[10px] text-muted-foreground">بونص التعدين</p>
            <p className="text-xl font-black text-success">+{state.referrals * 10}%</p>
          </div>
        </div>
      </section>

      <div className="surface rounded-2xl p-4">
        <p className="text-xs text-muted-foreground">رابط الدعوة الخاص بك</p>
        <p dir="ltr" className="mt-1 truncate rounded-xl bg-secondary px-3 py-2 text-xs">
          {link}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(link);
              toast.success("تم نسخ الرابط");
            }}
            className="rounded-xl bg-secondary py-2.5 text-sm font-bold"
          >
            نسخ الرابط
          </button>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(
              "انضم لي في Music AI وعدّن عملة MUSIC 🎧",
            )}`}
            target="_blank"
            rel="noreferrer"
            className="brand-gradient rounded-xl py-2.5 text-center text-sm font-bold text-primary-foreground"
          >
            شارك على تليجرام
          </a>
        </div>
      </div>

      <div className="surface rounded-2xl p-4">
        <h2 className="text-sm font-bold">مكافآت الدعوة</h2>
        <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
          <li>• صديق عادي: <span className="text-gold">+{formatNumber(1000)} MUSIC</span></li>
          <li>• صديق Telegram Premium: <span className="text-gold">+{formatNumber(5000)} MUSIC</span></li>
          <li>• كل 5 أصدقاء: صندوق مكافآت إضافي 🎁</li>
        </ul>
      </div>
    </div>
  );
}
