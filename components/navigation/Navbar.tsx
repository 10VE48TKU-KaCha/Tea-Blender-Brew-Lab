"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Beaker, BookOpen, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/lab", label: "Lab", icon: Beaker },
    { href: "/recipes", label: "Recipes", icon: BookOpen },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-amber/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-wood text-cream rounded-xl">
              <Coffee className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-[family-name:var(--font-display)] text-xl font-bold text-wood-dark leading-none">
                Kissa Lab
              </span>
              <span className="text-[10px] uppercase tracking-wider text-wood/60 font-medium hidden sm:block">
                Specialty Tea Profiler
              </span>
            </div>
          </Link>

          <div className="flex gap-1 sm:gap-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-amber-light text-wood-dark"
                      : "text-wood hover:bg-wood/5 hover:text-wood-dark"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
