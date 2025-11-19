"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  BadgeCheck,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  Hourglass,
  LayoutDashboard,
  Layers,
  Menu,
  PenSquare,
  type LucideIcon,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface SidebarChild {
  label: string;
  href: string;
}

const ICONS = {
  dashboard: LayoutDashboard,
  programs: Layers,
  students: GraduationCap,
  jury: Users,
  teams: Users,
  assignments: ClipboardCheck,
  addResult: PenSquare,
  pending: Hourglass,
  approved: BadgeCheck,
} satisfies Record<string, LucideIcon>;

type IconName = keyof typeof ICONS;

export interface SidebarItem {
  label: string;
  href?: string;
  icon?: IconName;
  children?: SidebarChild[];
}

interface SidenavbarProps {
  items: SidebarItem[];
  heading?: string;
  children?: ReactNode;
}

export default function Sidenavbar({
  items,
  heading = "Menu",
  children,
}: SidenavbarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Mobile navbar + drawer menu */}
      <div className="flex flex-col gap-4 md:hidden">
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="text-lg font-semibold text-white">{heading}</span>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="border border-white/10 bg-white/5 hover:bg-white/10"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-none bg-slate-950 p-0">
              <ScrollArea className="h-full py-4">
                <nav className="space-y-1 px-3">
                  {items.map((item) => {
                    const IconComponent = item.icon ? ICONS[item.icon] : undefined;
                    return (
                      <Button
                        key={item.href ?? item.label}
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                        onClick={() => setMobileOpen(false)}
                      >
                        <Link
                          href={item.href ?? "#"}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm",
                            pathname?.startsWith(item.href ?? "") &&
                              "bg-white/10 text-white",
                          )}
                        >
                          {IconComponent && (
                            <IconComponent className="h-4 w-4 shrink-0" />
                          )}
                          <span>{item.label}</span>
                        </Link>
                      </Button>
                    );
                  })}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1">{children}</main>
      </div>

      {/* Desktop sidebar layout */}
      <div className="hidden h-full gap-6 md:flex">
        <aside
          className={cn(
            "flex flex-col rounded-3xl border border-white/10 bg-white/5 transition-all duration-300 ease-in-out",
            isOpen ? "w-64" : "w-20",
          )}
        >
          <div
            className={cn(
              "flex h-16 items-center border-b border-white/10",
              isOpen ? "justify-between px-4" : "justify-center px-3",
            )}
          >
            <span
              className={cn(
                "text-lg font-semibold text-white transition-opacity",
                isOpen ? "opacity-100" : "hidden",
              )}
            >
              {heading}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen((prev) => !prev)}
              className="shrink-0 border border-white/10 bg-white/5 hover:bg-white/10"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <nav className="p-4">
              {items.map((item) => {
                const IconComponent = item.icon ? ICONS[item.icon] : undefined;
                return item.children && item.children.length > 0 ? (
                  <Collapsible key={item.label} className="space-y-1">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start",
                          !isOpen && "px-0",
                        )}
                      >
                        {IconComponent && (
                          <IconComponent className="mr-2 h-4 w-4" />
                        )}
                        {isOpen && (
                          <>
                            {item.label}
                            <ChevronRight className="ml-auto h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Button
                          key={child.href}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start text-white/80",
                            pathname?.startsWith(child.href) &&
                              "bg-white/10 text-white",
                          )}
                          asChild
                        >
                          <Link href={child.href}>{child.label}</Link>
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Button
                    key={item.href ?? item.label}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      pathname?.startsWith(item.href ?? "") &&
                        "bg-white/10 text-white",
                      !isOpen && "px-0",
                    )}
                    asChild
                  >
                    <Link
                      href={item.href ?? "#"}
                      className="flex w-full items-center my-2"
                    >
                      {IconComponent && (
                        <IconComponent
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isOpen ? "mr-4" : "mr-0",
                          )}
                        />
                      )}
                      {isOpen && item.label}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

