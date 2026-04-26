"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Search, 
  Compass, 
  Wind, 
  Smartphone, 
  Heart, 
  ListMusic, 
  History, 
  PlusCircle,
  Volume2
} from "lucide-react";

const navItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Discover", icon: Compass, href: "/discover" },
  { name: "Soundscapes", icon: Wind, href: "/soundscapes" },
  { name: "My Devices", icon: Smartphone, href: "/devices" },
];

const libraryItems = [
  { name: "Liked Songs", icon: Heart, href: "/liked" },
  { name: "Playlists", icon: ListMusic, href: "/playlists" },
  { name: "Recently Played", icon: History, href: "/recent" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border px-4 py-8 overflow-y-auto">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground">
          <Volume2 size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">soundcore</h1>
      </div>

      <nav className="space-y-1">
        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Browse
        </p>
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
              pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </nav>

      <nav className="mt-10 space-y-1">
        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Library
        </p>
        {libraryItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
              pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <PlusCircle size={18} />
          Create Playlist
        </button>
      </nav>

      <div className="mt-auto pt-8">
        <div className="rounded-2xl bg-gradient-to-br from-[#1c1c21] to-[#27272a] p-4 border border-border">
          <p className="text-xs font-medium text-primary mb-1">PRO FEATURES</p>
          <p className="text-sm font-bold text-foreground mb-3">Elevate your sound</p>
          <button className="w-full rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90">
            UPGRADE NOW
          </button>
        </div>
      </div>
    </div>
  );
}
