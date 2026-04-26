"use client";

import { Search, Bell, User, ChevronLeft, ChevronRight } from "lucide-react";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between px-8 bg-background/60 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-muted-foreground hover:text-foreground">
            <ChevronLeft size={20} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-muted-foreground hover:text-foreground">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search for songs, soundscapes..." 
            className="h-10 w-80 rounded-full bg-muted/50 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all border border-transparent focus:border-primary/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-muted-foreground hover:text-foreground relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
        </button>
        <button className="flex items-center gap-2 rounded-full bg-muted/50 p-1 pr-3 hover:bg-muted transition-colors">
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary to-secondary" />
          <span className="text-xs font-bold uppercase tracking-wide">Premium</span>
        </button>
        <button className="h-9 w-9 rounded-full bg-zinc-800 border border-border flex items-center justify-center overflow-hidden">
          <User size={20} className="text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
