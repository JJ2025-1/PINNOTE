"use client";

import { Info, Mail, Github, ExternalLink, Share2 } from "lucide-react";

/**
 * About component displays information about the Pinnote project,
 * including versioning and developer credits.
 */
export default function About() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Pinnote AI',
        text: 'Check out Pinnote - The Hybrid AI-Powered Notepad!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Sharing is not supported in this environment.");
    }
  };

  return (
    <div className="px-8 py-3 glass border-t border-white/10 flex items-center justify-between text-[10px] font-black tracking-widest relative z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-primary opacity-60 hover:opacity-100 transition-opacity">
          <Info className="w-3.5 h-3.5" />
          <span>PINNOTE v0.2.0-AI</span>
        </div>
        <div className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity">
          <Mail className="w-3.5 h-3.5 text-blue-400" />
          <a href="mailto:jeevanjanakiraman@gmail.com" className="hover:text-blue-400 transition-colors uppercase">Support</a>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button onClick={handleShare} className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-all hover:scale-105 active:scale-95 group">
          <Share2 className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
          <span className="group-hover:text-primary transition-colors">SHARE</span>
        </button>
        <div className="w-[1px] h-3 bg-white/10" />
        <span className="opacity-20 italic lowercase font-serif tracking-normal text-[11px]">Think faster, locally.</span>
        <div className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-all group">
          <Github className="w-3.5 h-3.5 group-hover:text-white" />
          <a href="https://github.com/JJ2025-1/PINNOTE" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
            CODEBASE <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
