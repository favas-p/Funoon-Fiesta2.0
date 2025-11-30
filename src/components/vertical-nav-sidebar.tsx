"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Home, 
  Trophy, 
  BarChart3, 
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/results", label: "Results", icon: Trophy },
  { href: "/scoreboard", label: "Scoreboard", icon: BarChart3 },
  { href: "/participant", label: "Find Participant", icon: Search },
];

export function VerticalNavSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <nav className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100/50 p-3 flex flex-col gap-2 backdrop-blur-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group hover:rounded-2xl",
                isActive
                  ? "bg-[#8B4513] text-white shadow-md shadow-[#8B4513]/20 rounded-2xl"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#8B4513] rounded-2xl"
              )}
              title={item.label}
            >
              <Icon className={cn(
                "w-5 h-5 transition-all duration-300",
                isActive && "scale-110"
              )} />
              {/* Active indicator glow */}
              {isActive && (
                <span className="absolute inset-0 rounded-xl bg-[#8B4513]/10 blur-md -z-10" />
              )}
              {/* Tooltip on hover */}
              <span className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap shadow-xl z-50">
                {item.label}
                <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-gray-900 rotate-45 rounded-xl" />
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

