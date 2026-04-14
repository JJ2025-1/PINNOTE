"use client";

import { useState, useEffect, useMemo, useRef } from "react";

// Local "AI-Lite" dictionary for context-aware suggestions
const CONTEXT_MAP: Record<string, string[]> = {
  "react": ["#frontend", "#hooks", "#component"],
  "nextjs": ["#ssr", "#app-router", "#vercel"],
  "electron": ["#desktop", "#main-process", "#ipc"],
  "typescript": ["#types", "#interface", "#safely-typed"],
  "fedora": ["#linux", "#gnome", "#dnf"],
  "git": ["#version-control", "#commit", "#push"],
  "todo": ["#urgent", "#backlog", "#done"],
  "fix": ["#bug", "#hotfix", "#issue"],
  "meeting": ["#notes", "#agenda", "#actions"],
};

export default function Home() {
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiStatus, setAIStatus] = useState("");
  const worker = useRef<Worker | null>(null);

  // Initialize AI Worker
  useEffect(() => {
    // We create the worker once on mount
    const aiWorker = new Worker(new URL("./ai-worker.js", import.meta.url));
    
    aiWorker.onmessage = (e) => {
      const { status, output, error } = e.data;
      if (status === "done") {
        setNote(output);
        setIsAIProcessing(false);
        setAIStatus("");
      } else if (status === "loading") {
        setAIStatus("Downloading Model (~90MB)...");
      } else if (status === "ready") {
        setAIStatus("AI Ready");
        setTimeout(() => setAIStatus(""), 2000);
      } else if (status === "error") {
        setAIStatus("AI Error: " + error);
        setIsAIProcessing(false);
      }
    };

    worker.current = aiWorker;
    setIsLoading(false);

    return () => aiWorker.terminate();
  }, []);

  // Load note from localStorage
  useEffect(() => {
    const savedNote = localStorage.getItem("pinnote-content");
    if (savedNote) setNote(savedNote);
  }, []);

  // Save note with status updates
  useEffect(() => {
    if (!isLoading) {
      setSaveStatus("Saving...");
      const timeout = setTimeout(() => {
        localStorage.setItem("pinnote-content", note);
        setSaveStatus("Saved");
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [note, isLoading]);

  const runAIAction = (action: string) => {
    if (!worker.current || !note || isAIProcessing) return;
    setIsAIProcessing(true);
    setAIStatus(`${action}...`);
    worker.current.postMessage({ action, text: note });
  };

  // Context-Aware Suggestions logic
  const suggestions = useMemo(() => {
    if (!note) return [];
    const lowerNote = note.toLowerCase();
    const foundTags = new Set<string>();
    Object.keys(CONTEXT_MAP).forEach(keyword => {
      if (lowerNote.includes(keyword)) {
        CONTEXT_MAP[keyword].forEach(tag => foundTags.add(tag));
      }
    });
    return Array.from(foundTags).slice(0, 6);
  }, [note]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm font-mono animate-pulse">Initializing PINNOTE...</p>
      </div>
    );
  }

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-black/[.08] dark:border-white/[.145] bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xs font-bold tracking-widest uppercase opacity-50">PINNOTE</h1>
          <div className="h-3 w-[1px] bg-black/[.1] dark:bg-white/[.1]" />
          <span className={`text-[10px] font-mono transition-opacity duration-300 ${saveStatus === "Saving..." ? "opacity-100" : "opacity-30"}`}>
            {saveStatus}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {aiStatus && <span className="text-[10px] font-mono text-blue-500 animate-pulse">{aiStatus}</span>}
          <span className="text-[10px] font-mono opacity-30 px-2 border-l border-black/[.05] dark:border-white/[.05]">v0.3.0-ai</span>
        </div>
      </div>

      {/* AI Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/[.03] border-b border-blue-500/[.1] overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[9px] font-bold uppercase text-blue-500 opacity-60 mr-1">AI Tools:</span>
        <button onClick={() => runAIAction('rewrite')} disabled={isAIProcessing} className="ai-btn">Rewrite</button>
        <button onClick={() => runAIAction('summarize')} disabled={isAIProcessing} className="ai-btn">Summarize</button>
        <button onClick={() => runAIAction('formal')} disabled={isAIProcessing} className="ai-btn">Formal</button>
        <button onClick={() => runAIAction('casual')} disabled={isAIProcessing} className="ai-btn">Casual</button>
      </div>

      {/* Suggestions Bar */}
      {suggestions.length > 0 && (
        <div className="flex items-center gap-2 px-6 py-2 bg-black/[.02] dark:bg-white/[.02] border-b border-black/[.05] dark:border-white/[.05] overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[9px] font-bold uppercase opacity-30 whitespace-nowrap">Context:</span>
          {suggestions.map((tag) => (
            <button
              key={tag}
              onClick={() => setNote(prev => prev.trim() + " " + tag + " ")}
              className="px-2 py-0.5 rounded-full bg-black/[.05] dark:bg-white/[.05] text-[10px] font-mono text-foreground/60 hover:bg-black/[.1] dark:hover:bg-white/[.1] transition-colors whitespace-nowrap"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Main Textarea */}
      <textarea
        className={`flex-1 w-full p-6 text-base leading-relaxed bg-transparent border-none outline-none resize-none font-sans text-foreground placeholder:opacity-30 transition-opacity ${isAIProcessing ? 'opacity-50 cursor-wait' : 'opacity-100'}`}
        placeholder="Type instructions, tech stack, or #tags..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        spellCheck={false}
        autoFocus
        disabled={isAIProcessing}
      />

      <style jsx>{`
        .ai-btn {
          @apply px-2 py-0.5 rounded bg-blue-500/[.1] text-blue-500 text-[10px] font-bold uppercase hover:bg-blue-500/[.2] transition-colors disabled:opacity-30 disabled:cursor-not-allowed;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  );
}
