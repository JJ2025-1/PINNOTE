"use client";

import { useState } from "react";
import { Code2, Play, Terminal, Info, Loader2, Trash2 } from "lucide-react";

/**
 * Compiler component provides a playground for writing and executing code
 * snippets directly within the application.
 */
export default function Compiler() {
  const [code, setCode] = useState("// Type your code here\nconsole.log('Hello, Pinnote!');");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);

  // Simulates code execution and captures terminal output
  const runCode = () => {
    setIsCompiling(true);
    setTerminalOutput("");
    
    // Placeholder for actual compilation/execution logic
    setTimeout(() => {
      if (code.includes("console.log")) {
        setTerminalOutput("> Hello, Pinnote!\n> Execution complete.");
      } else {
        setOutput("> Execution finished with no output.");
      }
      setIsCompiling(false);
    }, 1000);
  };

  // Clears both the source code editor and the console output
  const clearAll = () => {
    setCode("");
    setOutput("");
  };

  return (
    <div className="flex flex-col h-full glass border-l border-white/10 w-96 p-6 shadow-2xl relative z-50">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-green-500/20 rounded-lg">
            <Code2 className="w-4 h-4 text-green-400" />
          </div>
          <h2 className="text-[10px] font-black tracking-[0.2em] text-green-400 uppercase">COMPILER</h2>
        </div>
        <button 
          onClick={clearAll}
          className="p-2 hover:bg-white/5 rounded-full transition-all opacity-30 hover:opacity-100 group text-red-400"
          title="Clear All"
        >
          <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between ml-1">
            <div className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em]">Source Code</div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-full border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
              <span className="text-[8px] opacity-40 font-black tracking-widest uppercase">javascript</span>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-5 font-mono text-[12px] bg-black/40 text-green-400/80 rounded-2xl border border-white/5 outline-none focus:border-green-500/50 focus:ring-4 ring-green-500/10 transition-all resize-none shadow-inner custom-scrollbar"
          />
        </div>

        <button 
          onClick={runCode}
          disabled={isCompiling}
          className="px-4 py-4 text-[10px] font-black tracking-[0.2em] bg-green-500 text-white rounded-2xl hover:bg-green-400 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95"
        >
          {isCompiling ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              EXECUTING...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              RUN CODE
            </>
          )}
        </button>

        <div className="h-48 flex flex-col gap-3">
          <div className="flex items-center gap-2 ml-1">
            <Terminal className="w-3.5 h-3.5 opacity-30" />
            <div className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em]">Console Output</div>
          </div>
          <div className="flex-1 p-5 font-mono text-[11px] bg-black/60 text-zinc-400 rounded-2xl border border-white/5 overflow-y-auto whitespace-pre shadow-inner custom-scrollbar backdrop-blur-md">
            {terminalOutput || "Output will appear here..."}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex gap-3 items-start backdrop-blur-sm">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-blue-400/80 font-bold leading-relaxed tracking-wide uppercase">
          Local compilation for C, C++, and Python is currently under development.
        </p>
      </div>
    </div>
  );
}
