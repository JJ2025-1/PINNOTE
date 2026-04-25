"use client";

import { useState } from "react";

export default function AiAssistant() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAiAction = (action: string) => {
    setIsProcessing(true);
    // Placeholder for AI logic
    setTimeout(() => {
      setResponse(`AI response for ${action}: This is a placeholder for the actual AI output. Implementation coming soon!`);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900 border-l border-black/[.05] dark:border-white/[.05] w-80 p-4">
      <h2 className="text-xs font-bold tracking-widest opacity-50 mb-4 uppercase">AI Assistant</h2>
      
      <div className="flex flex-col gap-2 mb-4">
        <button 
          onClick={() => handleAiAction("Summarize")}
          disabled={isProcessing}
          className="px-3 py-2 text-[10px] font-bold bg-blue-500 text-white rounded hover:bg-blue-600 transition-all disabled:opacity-50"
        >
          SUMMARIZE NOTE
        </button>
        <button 
          onClick={() => handleAiAction("Expand")}
          disabled={isProcessing}
          className="px-3 py-2 text-[10px] font-bold bg-purple-500 text-white rounded hover:bg-purple-600 transition-all disabled:opacity-50"
        >
          EXPAND THOUGHTS
        </button>
        <button 
          onClick={() => handleAiAction("Fix Grammar")}
          disabled={isProcessing}
          className="px-3 py-2 text-[10px] font-bold bg-green-500 text-white rounded hover:bg-green-600 transition-all disabled:opacity-50"
        >
          FIX GRAMMAR
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        <div className="text-[9px] font-bold opacity-30 uppercase">Response:</div>
        <div className="flex-1 p-3 bg-white dark:bg-zinc-800 rounded border border-black/[.05] dark:border-white/[.05] overflow-y-auto">
          {isProcessing ? (
            <div className="flex items-center gap-2 text-[10px] italic opacity-50">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              AI is thinking...
            </div>
          ) : (
            <p className="text-[11px] leading-relaxed opacity-70">
              {response || "Select an action above or highlight text to start."}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AI anything..."
          className="w-full h-20 p-2 text-[11px] bg-white dark:bg-zinc-800 rounded border border-black/[.05] dark:border-white/[.05] outline-none focus:ring-1 ring-blue-500 transition-all"
        />
        <button 
          onClick={() => handleAiAction("Custom Prompt")}
          disabled={!prompt || isProcessing}
          className="px-3 py-2 text-[10px] font-bold bg-black dark:bg-white dark:text-black text-white rounded hover:opacity-80 transition-all disabled:opacity-30"
        >
          SEND
        </button>
      </div>
    </div>
  );
}
