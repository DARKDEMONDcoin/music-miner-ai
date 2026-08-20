import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useGame } from "@/hooks/useGame";
import { TrackPlayer, type Composition } from "@/lib/synth";
import { formatNumber, isPremium, type Track } from "@/lib/game";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "استوديو الذكاء الاصطناعي | Music AI" },
      {
        name: "description",
        content: "ولّد موسيقى وغلاف ألبوم بالذكاء الاصطناعي واحصل على بونص تعدين مؤقت.",
      },
      { property: "og:title", content: "استوديو الذكاء الاصطناعي | Music AI" },
      { property: "og:description", content: "توليد تراك موسيقي وغلاف بالذكاء الاصطناعي داخل تليجرام." },
    ],
  }),
  component: AiPage,
});

const IDEAS = [
  "لو-فاي هادي لليالي المطر",
  "تراب عربي بإيقاع قوي",
  "سينث ويف ثمانينات",
  "بيانو حزين مع وتريات",
  "إيقاع شعبي مصري حديث",
  "أمبيانت فضائي للتركيز",
];

function AiPage() {
  const { state, addTrack, grant } = useGame();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [comp, setComp] = useState<Composition | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<TrackPlayer | null>(null);

  const premium = isPremium(state);
  const todayCount = state.tracks.filter(
    (t) => new Date(t.createdAt).toDateString() === new Date().toDateString(),
  ).length;
  const dailyLimit = premium ? 5 : 1;
  const remaining = Math.max(0, dailyLimit - todayCount);

  async function generate() {
    if (!prompt.trim()) {
      toast.error("اكتب وصف التراك أولًا");
      return;
    }
    if (remaining <= 0) {
      toast.error("خلص رصيدك اليومي من التوليد", {
        description: "فعّل Premium للحصول على 5 تراكات يوميًا.",
      });
      return;
    }

    setLoading(true);
    setComp(null);
    setCover(null);
    try {
      setStep("جاري تلحين المقطوعة...");
      const res = await fetch("/api/ai/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? `فشل التوليد (${res.status})`);
      }
      const composition = (await res.json()) as Composition;
      setComp(composition);

      setStep("جاري رسم الغلاف...");
      let coverUrl: string | null = null;
      try {
        const coverRes = await fetch("/api/ai/cover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: `${composition.genre}, ${composition.mood}, ${prompt}` }),
        });
        if (coverRes.ok) {
          coverUrl = ((await coverRes.json()) as { url?: string }).url ?? null;
        } else {
          toast.message("تم إنشاء الموسيقى بدون غلاف", { description: "خدمة الصور غير متاحة حاليًا." });
        }
      } catch {
        /* الغلاف اختياري */
      }
      setCover(coverUrl);

      const bonusPct = 10 + Math.floor(Math.random() * 26);
      const track: Track = {
        id: String(Date.now()),
        title: composition.title,
        genre: composition.genre,
        mood: composition.mood,
        coverUrl,
        audioUrl: null,
        bonusPct,
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 3_600_000,
      };
      addTrack(track);
      grant(500);
      toast.success(`تم إنشاء "${composition.title}" • بونص +${bonusPct}% لمدة 24 ساعة`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
      setStep("");
    }
  }

  async function togglePlay() {
    if (!comp) return;
    if (playing) {
      playerRef.current?.stop();
      setPlaying(false);
      return;
    }
    playerRef.current = new TrackPlayer();
    setPlaying(true);
    await playerRef.current.play(comp, () => setPlaying(false));
  }

  return (
    <div className="space-y-4 pt-1">
      <section className="surface rounded-3xl p-5">
        <h1 className="text-lg font-black">
          استوديو <span className="text-brand-gradient">الذكاء الاصطناعي</span>
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          اوصف المزاج والنوع، والذكاء الاصطناعي يلحّن التراك ويرسم الغلاف. كل تراك يمنحك بونص تعدين 24 ساعة.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={200}
          rows={3}
          placeholder="مثال: لو-فاي هادي مع بيانو وإيقاع خفيف..."
          className="mt-3 w-full resize-none rounded-2xl bg-secondary p-3 text-sm outline-none ring-primary/50 focus:ring-2"
        />

        <div className="mt-2 flex flex-wrap gap-1.5">
          {IDEAS.map((i) => (
            <button
              key={i}
              onClick={() => setPrompt(i)}
              className="rounded-full bg-secondary px-3 py-1 text-[11px] text-muted-foreground"
            >
              {i}
            </button>
          ))}
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="brand-gradient mt-4 w-full rounded-2xl py-3 text-sm font-black text-primary-foreground disabled:opacity-60"
        >
          {loading ? step || "جاري التوليد..." : "🎵 ولّد التراك"}
        </button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          متبقٍ لك اليوم: {remaining} من {dailyLimit}
          {!premium && " • Premium يمنحك 5 يوميًا"}
        </p>
      </section>

      {comp && (
        <section className="surface overflow-hidden rounded-3xl">
          <div
            className="brand-gradient aspect-square w-full bg-cover bg-center"
            style={cover ? { backgroundImage: `url(${cover})` } : undefined}
          />
          <div className="p-4">
            <p className="text-base font-black">{comp.title}</p>
            <p className="text-[11px] text-muted-foreground">
              {comp.genre} • {comp.mood} • {comp.bpm} BPM • {comp.key}
            </p>
            {comp.description && <p className="mt-2 text-xs">{comp.description}</p>}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {comp.chords.map((c, i) => (
                <span key={`${c}-${i}`} className="rounded-lg bg-secondary px-2 py-1 text-[11px] font-bold">
                  {c}
                </span>
              ))}
            </div>
            <button
              onClick={togglePlay}
              className="mt-3 w-full rounded-xl bg-secondary py-2.5 text-sm font-bold"
            >
              {playing ? "⏹ إيقاف" : "▶️ تشغيل التراك"}
            </button>
          </div>
        </section>
      )}

      {state.tracks.length > 0 && (
        <section className="space-y-2">
          <h2 className="px-1 text-sm font-bold">مكتبة تراكاتك</h2>
          {state.tracks.map((t) => (
            <div key={t.id} className="surface flex items-center gap-3 rounded-2xl p-3">
              <div
                className="brand-gradient size-12 shrink-0 rounded-xl bg-cover bg-center"
                style={t.coverUrl ? { backgroundImage: `url(${t.coverUrl})` } : undefined}
              />
              <div className="flex-1">
                <p className="text-sm font-bold">{t.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t.genre} • بونص +{t.bonusPct}%
                </p>
              </div>
              <span className="text-[11px] text-gold">
                {t.expiresAt > Date.now() ? "نشط" : "منتهي"}
              </span>
            </div>
          ))}
        </section>
      )}

      <p className="pb-2 text-center text-[11px] text-muted-foreground">
        رصيدك: {formatNumber(state.balance)} MUSIC
      </p>
    </div>
  );
}
