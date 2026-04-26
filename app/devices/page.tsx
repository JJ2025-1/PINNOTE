"use client";

import { useState } from "react";
import { 
  Battery, 
  Settings, 
  Bluetooth, 
  Music, 
  Check,
  Info,
  Sliders
} from "lucide-react";
import { cn } from "@/lib/utils";

const eqProfiles = [
  { id: "signature", name: "Soundcore Signature", description: "Balanced sound for most genres" },
  { id: "bassup", name: "BassUp™", description: "Deep, powerful bass boost" },
  { id: "acoustic", name: "Acoustic", description: "Clear vocals and instruments" },
  { id: "treble", name: "Treble Booster", description: "Enhanced high frequencies" },
];

export default function DevicesPage() {
  const [selectedEQ, setSelectedEQ] = useState("signature");

  return (
    <div className="flex flex-col px-8 pb-32 bg-black min-h-full">
      <header className="pt-8 pb-12">
        <h1 className="text-5xl font-black tracking-tight italic">MY DEVICES</h1>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Device Info Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-[40px] bg-zinc-900/40 border border-white/5 p-10 shadow-2xl backdrop-blur-md">
            <div className="flex justify-between items-start mb-12">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-xs font-black text-red-600 uppercase tracking-[0.2em]">
                  <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_#dc2626]" />
                  Connected
                </span>
                <h2 className="text-3xl font-black italic tracking-tight">playBOI <span className="text-red-600">Pro</span></h2>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-zinc-900/80 px-4 py-2 border border-white/10 shadow-inner">
                <Battery size={16} className="text-red-600" />
                <span className="text-xs font-black">85%</span>
              </div>
            </div>

            <div className="relative aspect-square w-full max-w-[300px] mx-auto mb-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-red-600/20 rounded-full blur-[100px] animate-pulse" />
              <div className="relative z-10 w-56 h-56 rounded-[32px] bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                 <div className="text-5xl font-black italic opacity-20 rotate-[-12deg] tracking-tighter">playBOI</div>
                 <div className="absolute inset-4 border-2 border-white/5 rounded-[24px]" />
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-zinc-900/80 py-5 font-black uppercase tracking-widest text-xs border border-white/5 hover:bg-zinc-800 transition-all hover:border-red-600/30">
                <Settings size={18} /> Settings
              </button>
              <button className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-zinc-900/80 py-5 font-black uppercase tracking-widest text-xs border border-white/5 hover:bg-zinc-800 transition-all hover:border-red-600/30">
                <Info size={18} /> Support
              </button>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/5 bg-zinc-900/30 p-8 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-600 border border-red-600/20">
                <Bluetooth size={28} />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-tight">Firmware Update</p>
                <p className="text-xs text-zinc-500 font-medium">Version 2.4.1 available</p>
              </div>
            </div>
            <button className="text-[10px] font-black tracking-widest text-white px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all shadow-lg hover:scale-105 active:scale-95">
              UPDATE
            </button>
          </div>
        </div>

        {/* EQ Controls */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="rounded-[40px] border border-white/5 bg-zinc-900/40 p-10 backdrop-blur-md">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white">
                   <Music size={20} />
                </div>
                <h2 className="text-2xl font-black italic tracking-tight">Sound Profiles</h2>
              </div>
              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                <Sliders size={16} /> Custom EQ
              </button>
            </div>

            {/* EQ Visualization */}
            <div className="h-48 flex items-end gap-1.5 mb-12 px-6">
              {[30, 45, 60, 40, 70, 85, 60, 45, 30, 40, 55, 45, 30, 50, 65].map((height, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex-1 rounded-full transition-all duration-700 ease-out",
                    selectedEQ === 'bassup' ? "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]" : "bg-zinc-800"
                  )} 
                  style={{ height: `${selectedEQ === 'bassup' ? height + (i < 5 ? 20 : -10) : height}%` }}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eqProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setSelectedEQ(profile.id)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl p-6 border transition-all text-left group",
                    selectedEQ === profile.id 
                      ? "border-red-600 bg-red-600/5 shadow-[inset_0_0_20px_rgba(220,38,38,0.05)]" 
                      : "border-white/5 bg-zinc-900/50 hover:border-white/20"
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <span className={cn("font-black text-sm uppercase tracking-tight transition-colors", selectedEQ === profile.id ? "text-red-600" : "text-zinc-400 group-hover:text-white")}>
                      {profile.name}
                    </span>
                    <span className="text-xs text-zinc-600 font-medium">{profile.description}</span>
                  </div>
                  {selectedEQ === profile.id && (
                    <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg">
                       <Check size={16} strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
