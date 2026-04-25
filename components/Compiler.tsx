"use client";

import { useState } from "react";
import { Code2, Play, Terminal, Info, Loader2 } from "lucide-react";

export default function Compiler() {
  const [code, setCode] = useState("// Type your code here\nconsole.log('Hello, Pinnote!');");
  const [output, setOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);

  const runCode = () => {
    setIsCompiling(true);
    setOutput("");
    
    // Placeholder for actual compilation/execution logic
    setTimeout(() => {
      if (code.includes("console.log")) {
        setOutput("> Hello, Pinnote!\n> Execution complete.");
      } else {
        setOutput("> Execution finished with no output.");
      }
      setIsCompiling(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900 border-l border-black/[.05] dark:border-white/[.05] w-96 p-4 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <Code2 className="w-4 h-4 text-green-500" />
        <h2 className="text-xs font-bold tracking-widest opacity-50 uppercase">Compiler (Coming Soon)</h2>
      </div>
      
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="text-[9px] font-bold opacity-30 uppercase">Code Editor:</div>
            <span className="text-[8px] opacity-30 font-mono">index.js</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-3 font-mono text-[11px] bg-zinc-950 text-green-400 rounded border border-black/[.05] dark:border-white/[.05] outline-none focus:ring-1 ring-green-500 transition-all resize-none shadow-inner"
          />
        </div>

        <button 
          onClick={runCode}
          disabled={isCompiling}
          className="px-3 py-2 text-[10px] font-bold bg-green-600 text-white rounded hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
        >
          {isCompiling ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              RUNNING...
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" />
              RUN CODE
            </>
          )}
        </button>

        <div className="h-40 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3 opacity-30" />
            <div className="text-[9px] font-bold opacity-30 uppercase">Output:</div>
          </div>
          <div className="flex-1 p-3 font-mono text-[10px] bg-black text-zinc-300 rounded border border-black/[.05] dark:border-white/[.05] overflow-y-auto whitespace-pre shadow-inner">
            {output || "Output will appear here..."}
          </div>
        </div>
      </div>

      <div className="mt-4 p-2 bg-blue-500/10 rounded border border-blue-500/20 flex gap-2">
        <Info className="w-4 h-4 text-blue-500 shrink-0" />
        <p className="text-[9px] text-blue-500 font-medium">
          Note: Local compilation for C, C++, and Python is currently under development.
        </p>
      </div>
    </div>
  );
}
