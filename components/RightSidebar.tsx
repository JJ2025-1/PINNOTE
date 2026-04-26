"use client";

import { useState } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  PlusSquare,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export function RightSidebar() {
  const [isPlaying, setIsPlaying] = useState(false);

  const queue = [
    { title: "Whistle", artist: "Flo Rida" },
    { title: "Born To Die", artist: "Lana Del Rey" },
    { title: "Off To The Races", artist: "Lana Del Rey" },
    { title: "Blue Jeans (Album Version)", artist: "Lana Del Rey" },
    { title: "Video Games (Album Version)", artist: "Lana Del Rey" },
    { title: "Diet Mountain Dew", artist: "Lana Del Rey" },
  ];

  return (
    <aside className="hidden lg:flex w-80 flex-col bg-black text-white overflow-hidden border-l border-white/5">
      {/* Player Controls */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-zinc-950/50">
        <button className="text-zinc-500 hover:text-white transition-colors">
          <SkipBack size={24} fill="currentColor" />
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-14 w-14 flex items-center justify-center text-white hover:scale-110 transition-transform bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.3)]"
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        <button className="text-zinc-500 hover:text-white transition-colors">
          <SkipForward size={24} fill="currentColor" />
        </button>
      </div>

      {/* Album Art & Track Info */}
      <div className="relative group bg-black p-4 aspect-square flex items-center justify-center overflow-hidden">
        <img 
          src="/poster.png" 
          alt="Currently Playing" 
          className="w-full h-full object-contain grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
          <div className="flex flex-col truncate">
            <span className="text-xl font-black italic tracking-tight truncate">Born To Die</span>
            <span className="text-sm text-zinc-400 font-bold truncate">Lana Del Rey</span>
          </div>
          <button className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-600 transition-colors">
            <PlusSquare size={20} />
          </button>
        </div>
      </div>

      {/* Queue Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-900/20">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Up Next</span>
          <button className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
            Clear
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {queue.map((track, i) => (
            <div 
              key={i} 
              className={cn(
                "px-6 py-4 border-b border-white/5 hover:bg-zinc-900/50 cursor-pointer transition-all flex flex-col gap-0.5 relative group",
                i === 1 ? "bg-red-600/5 border-l-2 border-red-600" : ""
              )}
            >
              <span className={cn("text-xs font-bold truncate group-hover:text-red-500", i === 1 ? "text-white" : "text-zinc-400")}>
                {track.title}
              </span>
              <span className="text-[10px] text-zinc-600 truncate font-bold uppercase tracking-wider">
                {track.artist}
              </span>
              {i === 1 && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                   <div className="flex gap-0.5 items-end h-3">
                      <div className="w-0.5 h-2 bg-red-600 animate-pulse" />
                      <div className="w-0.5 h-3 bg-red-600 animate-pulse delay-75" />
                      <div className="w-0.5 h-1.5 bg-red-600 animate-pulse delay-150" />
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
