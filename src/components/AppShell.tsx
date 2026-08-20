import { Link, useRouterState } from "@tanstack/react-router";
import { Pickaxe, Sparkles, ListChecks, Users, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { useGame } from "@/hooks/useGame";
import { formatNumber, isPremium } from "@/lib/game";

const NAV = [
  { to: "/", label: "تعدين", icon: Pickaxe },
  { to: "/studio", label: "الاستوديو", icon: Sparkles },
  { to: "/ai", label: "AI", icon: Sparkles },
  { to: "/tasks", label: "المهام", icon: ListChecks },
  { to: "/referral", label: "الإحالة", icon: Users },
  { to: "/shop", label: "المتجر", icon: ShoppingBag },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { state } = useGame();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div dir="rtl" className="mx-auto flex min-h-screen w-full max-w-md flex-col">
      <header className="sticky top-0 z-20 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="brand-gradient flex size-9 items-center justify-center rounded-xl text-lg">
              🎧
            </div>
            <div className="leading-tight">
              <p className="text-brand-gradient text-base font-extrabold">Music AI</p>
              <p className="text-[10px] text-muted-foreground">
                {isPremium(state) ? "عضوية Premium" : "استوديو التعدين"}
              </p>
            </div>
          </div>
          <div className="surface rounded-full px-3 py-1.5 text-sm font-bold">
            <span className="text-gold">◈</span> {formatNumber(state.balance)}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pb-28">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md px-3 pb-3">
        <div className="surface flex items-center justify-between rounded-2xl px-1.5 py-1.5">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-semibold transition-colors ${
                  active
                    ? "brand-gradient text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
