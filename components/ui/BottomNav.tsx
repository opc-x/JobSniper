"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "主页", icon: "🏠" },
  { href: "/channels", label: "渠道", icon: "📡" },
  { href: "/jobs", label: "职位", icon: "📋" },
  { href: "/profile", label: "画像", icon: "👤" },
  { href: "/match", label: "匹配", icon: "🎯" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
         style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center py-2 text-xs gap-1 transition-colors",
                active ? "text-blue-600" : "text-gray-500"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
