"use client";

import { useState } from "react";
import { 
  CloudRain, 
  Wind, 
  Zap, 
  Waves, 
  Bird, 
  Flame, 
  Coffee, 
  Moon,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RefreshCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

const sounds = [
  { id: "rain", name: "Soft Rain", icon: CloudRain, color: "from-blue-500/10 to-blue-600/10" },
  { id: "thunder", name: "Thunder", icon: Zap, color: "from-yellow-500/10 to-yellow-600/10" },
  { id: "wind", name: "Autumn Wind", icon: Wind, color: "from-zinc-500/10 to-zinc-600/10" },
  { id: "waves", name: "Ocean Waves", icon: Waves, color: "from-cyan-500/10 to-cyan-600/10" },
  { id: "birds", name: "Forest Birds", icon: Bird, color: "from-green-500/10 to-green-600/10" },
  { id: "fire", name: "Campfire", icon: Flame, color: "from-orange-500/10 to-orange-600/10" },
  { id: "cafe", name: "Cafe Ambience", icon: Coffee, color: "from-brown-500/10 to-brown-600/10" },
  { id: "night", name: "Summer Night", icon: Moon, color: "from-indigo-500/10 to-indigo-600/10" },
];

export default function SoundscapesPage() {
  const [isGlobalPlaying, setIsGlobalPlaying] = useState(false);

  return (
    <div className="flex flex-col px-8 pb-32 bg-black min-h-full">
      <header className="pt-8 pb-12 flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-black tracking-[0.3em] text-red-600 uppercase">Ambient Mixer</p>
          <h1 className="text-6xl font-black tracking-tighter italic">SOUNDSCAPES</h1>
          <p className="text-zinc-500 mt-4 max-w-lg font-medium leading-relaxed">Mix your favorite ambient sounds to create a personalized environment for relaxation or focus.</p>
        </div>
        
        <div className="flex gap-4">
          <button className="flex h-16 items-center gap-3 rounded-[20px] border border-white/5 bg-zinc-900/40 px-8 font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all backdrop-blur-md">
            <RefreshCcw size={18} /> Reset
          </button>
          <button 
            onClick={() => setIsGlobalPlaying(!isGlobalPlaying)}
            className="flex h-16 items-center gap-4 rounded-[20px] bg-red-600 px-10 font-black text-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.3)]"
          >
            {isGlobalPlaying ? <Pause fill="currentColor" size={20} /> : <Play fill="currentColor" size={20} />}
            <span className="tracking-widest uppercase text-xs">{isGlobalPlaying ? "STOP ALL" : "PLAY MIX"}</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sounds.map((sound) => (
          <SoundTile key={sound.id} {...sound} />
        ))}
      </div>

      {/* Preset Section */}
      <section className="mt-24">
        <div className="flex items-center gap-4 mb-10">
           <h2 className="text-3xl font-black italic tracking-tight">EXPERT PRESETS</h2>
           <div className="h-px flex-1 bg-white/5" />
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            { name: "Stormy Night", sounds: "Rain + Thunder + Wind", image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=400&auto=format&fit=crop" },
            { name: "Summer Forest", sounds: "Birds + Wind + Fire", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop" },
            { name: "Deep Ocean", sounds: "Waves + Soft Rain", image: "https://images.unsplash.com/photo-1505118380757-91f5f45d8de4?q=80&w=400&auto=format&fit=crop" },
          ].map((preset) => (
            <div key={preset.name} className="group relative h-64 overflow-hidden rounded-[32px] bg-zinc-900 border border-white/5 cursor-pointer shadow-2xl transition-all duration-500 hover:border-red-600/30">
              <img src={preset.image} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-40" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-8 flex flex-col justify-end z-10">
                <h3 className="text-2xl font-black italic tracking-tight text-white group-hover:text-red-500 transition-colors">{preset.name}</h3>
                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] mt-2">{preset.sounds}</p>
              </div>
              <button className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center translate-y-2 group-hover:translate-y-0 shadow-2xl">
                <Play fill="currentColor" size={20} className="text-white ml-1" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SoundTile({ name, icon: Icon, color }: { name: string, icon: any, color: string }) {
  const [isActive, setIsActive] = useState(false);
  const [volume, setVolume] = useState(50);

  return (
    <div 
      className={cn(
        "group relative flex flex-col gap-6 rounded-[32px] border p-8 transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-md",
        isActive 
          ? "border-red-600/40 bg-red-600/5 shadow-[0_0_30px_rgba(220,38,38,0.1)]" 
          : "border-white/5 bg-zinc-900/40 hover:border-white/10 hover:bg-zinc-900/60"
      )}
      onClick={() => setIsActive(!isActive)}
    >
      <div className="flex items-center justify-between relative z-10">
        <div className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500",
          isActive ? "bg-red-600 text-white scale-110 shadow-[0_0_20px_rgba(220,38,38,0.4)]" : "bg-zinc-800 text-zinc-500",
        )}>
          <Icon size={32} />
        </div>
        <div className={cn(
          "h-3 w-3 rounded-full transition-all duration-500 shadow-[0_0_10px_currentColor]",
          isActive ? "bg-red-500 animate-pulse" : "bg-zinc-800"
        )} />
      </div>
      
      <div className="flex flex-col gap-1 relative z-10">
        <h3 className={cn(
          "text-lg font-black italic tracking-tight transition-colors",
          isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
        )}>{name}</h3>
      </div>

      {isActive && (
        <div className="mt-2 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-4">
            <VolumeX size={16} className="text-zinc-600" />
            <div className="h-1.5 flex-1 bg-zinc-800 rounded-full overflow-hidden relative cursor-pointer group/slider">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="absolute h-full bg-red-600 transition-all shadow-[0_0_10px_#dc2626]" 
                style={{ width: `${volume}%` }} 
              />
            </div>
            <Volume2 size={16} className="text-zinc-400" />
          </div>
        </div>
      )}

      {/* Background Decor */}
      <div className={cn(
        "absolute -right-8 -bottom-8 text-white opacity-[0.02] rotate-12 transition-all duration-700 pointer-events-none",
        isActive ? "scale-150 opacity-[0.05]" : "scale-100"
      )}>
        <Icon size={160} />
      </div>
    </div>
  );
}
