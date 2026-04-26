"use client";

import { useState } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Volume2, 
  Maximize2, 
  LayoutList,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [volume, setVolume] = useState(70);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-card/80 backdrop-blur-xl border-t border-border px-6 flex items-center justify-between z-50">
      {/* Current Track */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="h-14 w-14 rounded-lg bg-zinc-800 bg-[url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop')] bg-cover bg-center border border-white/5" />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-foreground truncate max-w-[200px]">Midnight Soundscape</span>
          <span className="text-xs text-muted-foreground">Soundcore Originals</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center gap-6">
          <button className="text-muted-foreground hover:text-primary transition-colors">
            <Shuffle size={18} />
          </button>
          <button className="text-foreground hover:text-primary transition-colors">
            <SkipBack size={22} fill="currentColor" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          <button className="text-foreground hover:text-primary transition-colors">
            <SkipForward size={22} fill="currentColor" />
          </button>
          <button className="text-muted-foreground hover:text-primary transition-colors">
            <Repeat size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-3 w-full max-w-md">
          <span className="text-[10px] text-muted-foreground font-mono">1:24</span>
          <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden relative group cursor-pointer">
            <div 
              className="absolute h-full bg-primary transition-all" 
              style={{ width: `${progress}%` }} 
            />
            <div 
              className="absolute h-3 w-3 bg-white rounded-full -top-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">3:45</span>
        </div>
      </div>

      {/* Extra Controls */}
      <div className="flex items-center justify-end gap-4 w-1/3">
        <button className="text-muted-foreground hover:text-primary transition-colors">
          <Activity size={18} />
        </button>
        <button className="text-muted-foreground hover:text-primary transition-colors">
          <LayoutList size={18} />
        </button>
        <div className="flex items-center gap-2 w-32 group">
          <Volume2 size={18} className="text-muted-foreground group-hover:text-primary" />
          <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden relative cursor-pointer">
            <div className="absolute h-full bg-foreground group-hover:bg-primary" style={{ width: `${volume}%` }} />
          </div>
        </div>
        <button className="text-muted-foreground hover:text-primary transition-colors">
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
}
