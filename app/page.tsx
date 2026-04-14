"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load note from localStorage on mount
  useEffect(() => {
    const savedNote = localStorage.getItem("pinnote-content");
    if (savedNote) {
      setNote(savedNote);
    }
    setIsLoading(false);
  }, []);

  // Save note to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("pinnote-content", note);
    }
  }, [note, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm font-mono animate-pulse">Loading PINNOTE...</p>
      </div>
    );
  }

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <div className="flex items-center justify-between px-4 py-2 border-b border-black/[.08] dark:border-white/[.145] bg-background/50 backdrop-blur-sm">
        <h1 className="text-xs font-bold tracking-widest uppercase opacity-50">
          PINNOTE
        </h1>
        <span className="text-[10px] font-mono opacity-30">
          Auto-saving to LocalStorage
        </span>
      </div>
      <textarea
        className="flex-1 w-full p-6 text-base leading-relaxed bg-transparent border-none outline-none resize-none font-sans text-foreground placeholder:opacity-30"
        placeholder="Type your instructions or notes here..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        spellCheck={false}
        autoFocus
      />
    </main>
  );
}
