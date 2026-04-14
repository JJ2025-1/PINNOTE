"use client";

import { useState, useEffect, useMemo, useRef } from "react";

const COLORS = {
  green: "#22c55e",
  red: "#ef4444",
  blue: "#3b82f6",
  pink: "#ec4899",
  none: "transparent"
};

export default function Home() {
  const [tab, setTab] = useState<"notes" | "scribble">("notes");
  const [noteHtml, setNoteHtml] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiStatus, setAIStatus] = useState("");
  
  const editorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const worker = useRef<Worker | null>(null);

  // --- PERSISTENCE ---
  useEffect(() => {
    const savedNote = localStorage.getItem("pinnote-html");
    const savedScribble = localStorage.getItem("pinnote-scribble");
    if (savedNote) setNoteHtml(savedNote);
    if (savedScribble && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current?.getContext("2d");
        ctx?.drawImage(img, 0, 0);
      };
      img.src = savedScribble;
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setSaveStatus("Saving...");
      const timeout = setTimeout(() => {
        localStorage.setItem("pinnote-html", noteHtml);
        if (canvasRef.current) {
          localStorage.setItem("pinnote-scribble", canvasRef.current.toDataURL());
        }
        setSaveStatus("Saved");
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [noteHtml, isLoading, tab]);

  // --- AI WORKER (v0.3.0 logic) ---
  useEffect(() => {
    const aiWorker = new Worker(new URL("./ai-worker.js", import.meta.url));
    aiWorker.onmessage = (e) => {
      const { status, output, error } = e.data;
      if (status === "done") {
        setNoteHtml(output);
        if (editorRef.current) editorRef.current.innerHTML = output;
        setIsAIProcessing(false);
        setAIStatus("");
      } else if (status === "loading") setAIStatus("AI Loading...");
      else if (status === "error") { setAIStatus("AI Error"); setIsAIProcessing(false); }
    };
    worker.current = aiWorker;
    return () => aiWorker.terminate();
  }, []);

  const runAIAction = (action: string) => {
    if (!worker.current || !noteHtml || isAIProcessing) return;
    setIsAIProcessing(true);
    setAIStatus(`${action}...`);
    // Strip HTML for AI processing
    const textOnly = editorRef.current?.innerText || "";
    worker.current.postMessage({ action, text: textOnly });
  };

  // --- TEXT FORMATTING ---
  const formatText = (command: string, value: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) setNoteHtml(editorRef.current.innerHTML);
  };

  // --- SCRIBBLE LOGIC ---
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    const pos = getPos(e);
    lastPos.current = pos;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const getPos = (e: any) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const setPen = (color: string) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
    }
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      localStorage.removeItem("pinnote-scribble");
    }
  };

  if (isLoading) return <div className="h-screen w-screen flex items-center justify-center font-mono">Loading...</div>;

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-black/[.08] dark:border-white/[.145] bg-background/50">
        <div className="flex items-center gap-4">
          <h1 className="text-xs font-bold tracking-widest opacity-50">PINNOTE</h1>
          <nav className="flex gap-2 bg-black/[.05] dark:bg-white/[.05] p-1 rounded-md">
            <button onClick={() => setTab("notes")} className={`px-3 py-1 text-[10px] font-bold rounded ${tab === "notes" ? "bg-white dark:bg-zinc-800 shadow-sm" : "opacity-50"}`}>NOTES</button>
            <button onClick={() => setTab("scribble")} className={`px-3 py-1 text-[10px] font-bold rounded ${tab === "scribble" ? "bg-white dark:bg-zinc-800 shadow-sm" : "opacity-50"}`}>SCRIBBLE</button>
          </nav>
        </div>
        <span className="text-[10px] font-mono opacity-30">{saveStatus}</span>
      </div>

      {/* Toolbars */}
      <div className="flex flex-col border-b border-black/[.05] dark:border-white/[.05]">
        {tab === "notes" ? (
          <div className="flex items-center gap-4 px-4 py-2 bg-zinc-50 dark:bg-zinc-900/50 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 border-r pr-3 border-black/[.1]">
              <span className="text-[9px] font-bold opacity-30 uppercase mr-1">Color:</span>
              {Object.entries(COLORS).map(([name, code]) => name !== "none" && (
                <button key={name} onClick={() => formatText("foreColor", code)} className="w-4 h-4 rounded-full border border-black/10" style={{ background: code }} />
              ))}
            </div>
            <div className="flex items-center gap-1 border-r pr-3 border-black/[.1]">
              <span className="text-[9px] font-bold opacity-30 uppercase mr-1">Highlight:</span>
              {Object.entries(COLORS).map(([name, code]) => (
                <button key={name} onClick={() => formatText("hiliteColor", code)} className="w-4 h-4 rounded border border-black/10 flex items-center justify-center" style={{ background: code }}>
                  {name === "none" && <span className="text-[8px] opacity-50">×</span>}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => runAIAction('rewrite')} className="ai-btn">AI Rewrite</button>
              <button onClick={() => runAIAction('summarize')} className="ai-btn">Summarize</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 px-4 py-2 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold opacity-30 uppercase mr-1">Pen:</span>
              {Object.entries(COLORS).map(([name, code]) => name !== "none" && (
                <button key={name} onClick={() => setPen(code)} className="w-5 h-5 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm" style={{ background: code }} />
              ))}
              <button onClick={() => setPen("#888888")} className="w-5 h-5 rounded-full bg-zinc-400" />
            </div>
            <button onClick={clearCanvas} className="text-[10px] font-bold text-red-500 uppercase px-2 py-1 bg-red-500/10 rounded">Clear Canvas</button>
          </div>
        )}
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative overflow-hidden bg-white dark:bg-zinc-950">
        <div className={`absolute inset-0 p-6 overflow-y-auto ${tab === "notes" ? "block" : "hidden"}`}>
          <div
            ref={editorRef}
            contentEditable
            onInput={(e) => setNoteHtml(e.currentTarget.innerHTML)}
            className="w-full min-h-full outline-none text-base leading-relaxed font-sans prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: noteHtml }}
          />
        </div>
        
        <canvas
          ref={canvasRef}
          width={800}
          height={1200}
          className={`absolute inset-0 w-full h-full cursor-crosshair ${tab === "scribble" ? "block" : "hidden"}`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={() => isDrawing.current = false}
          onMouseLeave={() => isDrawing.current = false}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={() => isDrawing.current = false}
        />
      </div>

      <style jsx>{`
        .ai-btn { @apply px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[9px] font-bold uppercase hover:bg-blue-500/20 transition-colors; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  );
}
