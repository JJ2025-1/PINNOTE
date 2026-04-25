"use client";

import { Info, Mail, Github, ExternalLink } from "lucide-react";

export default function About() {
  return (
    <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-black/[.05] dark:border-white/[.05] flex items-center justify-between text-[10px] opacity-50 font-medium">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Info className="w-3 h-3" />
          <span>PINNOTE v0.2.0-AI</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Mail className="w-3 h-3" />
          <a href="mailto:jeevanjanakiraman@gmail.com" className="hover:text-blue-500 transition-colors">jeevanjanakiraman@gmail.com</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span>Think faster, locally.</span>
        <div className="flex items-center gap-1.5">
          <Github className="w-3 h-3" />
          <a href="https://github.com/JJ2025-1/PINNOTE" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-500 transition-colors">
            Source <ExternalLink className="w-2 h-2" />
          </a>
        </div>
      </div>
    </div>
  );
}
