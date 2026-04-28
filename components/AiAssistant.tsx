"use client";

import { useState } from "react";
import { Sparkles, FileText, Zap, CheckCircle, Send, Loader2, RefreshCw } from "lucide-react";

/**
 * AiAssistant component provides a sidebar interface for interacting with
 * local or remote AI models for note processing.
 */
export default function AiAssistant() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Triggers an AI task such as summarization or grammar correction
  const handleAiAction = (aiAction: string) => {
    setIsProcessing(true);
    // Placeholder for AI logic: This will be replaced with actual Local ML calls
    setTimeout(() => {
      setResponse(`AI response for ${aiAction}: This is a placeholder for the actual AI output. Implementation coming soon!`);
      setIsProcessing(false);
    }, 1500);
  };

  // Resets the AI response and input prompt state
  const clearResponse = () => {
    setResponse("");
    setPrompt("");
  };

  return (
    <div className="flex flex-col h-full glass border-l border-white/10 w-80 p-6 shadow-2xl relative z-50">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-500/20 rounded-lg">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <h2 className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase">AI ASSISTANT</h2>
        </div>
        <button 
          onClick={clearResponse}
          className="p-2 hover:bg-white/5 rounded-full transition-all opacity-30 hover:opacity-100 group"
          title="Clear"
        >
          <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>
      
      <div className="flex flex-col gap-3 mb-8">
        <button 
          onClick={() => handleAiAction("Summarize")}
          disabled={isProcessing}
          className="px-4 py-2.5 text-[10px] font-black tracking-wider bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50 flex items-center gap-3 group"
        >
          <FileText className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
          SUMMARIZE NOTE
        </button>
        <button 
          onClick={() => handleAiAction("Expand")}
          disabled={isProcessing}
          className="px-4 py-2.5 text-[10px] font-black tracking-wider bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50 flex items-center gap-3 group"
        >
          <Zap className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
          EXPAND THOUGHTS
        </button>
        <button 
          onClick={() => handleAiAction("Fix Grammar")}
          disabled={isProcessing}
          className="px-4 py-2.5 text-[10px] font-black tracking-wider bg-green-500/10 text-green-400 rounded-xl border border-green-500/20 hover:bg-green-500 hover:text-white transition-all disabled:opacity-50 flex items-center gap-3 group"
        >
          <CheckCircle className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
          FIX GRAMMAR
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
        <div className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em] ml-1">Response</div>
        <div className="flex-1 p-4 bg-black/40 rounded-2xl border border-white/5 overflow-y-auto custom-scrollbar shadow-inner backdrop-blur-md">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-[10px] font-black italic text-blue-400/50">
              <Loader2 className="w-6 h-6 animate-spin" />
              THINKING...
            </div>
          ) : (
            <p className="text-[12px] leading-relaxed text-foreground/70">
              {response || "Select an action above or highlight text to start."}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AI anything..."
          className="w-full h-24 p-4 text-[12px] bg-black/40 rounded-2xl border border-white/5 outline-none focus:border-blue-500/50 focus:ring-4 ring-blue-500/10 transition-all shadow-inner placeholder:opacity-20"
        />
        <button 
          onClick={() => handleAiAction("Custom Prompt")}
          disabled={!prompt || isProcessing}
          className="px-4 py-3 text-[10px] font-black tracking-[0.2em] bg-white text-black rounded-2xl hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-10 flex items-center justify-center gap-3 shadow-xl active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          SEND
        </button>
      </div>
    </div>
  );
}
