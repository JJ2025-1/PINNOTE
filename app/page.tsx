"use client";

import { useState, useEffect, useRef } from "react";

const COLORS = {
  green: "#22c55e",
  red: "#ef4444",
  blue: "#3b82f6",
  pink: "#ec4899",
  none: "transparent",
  black: "#000000",
  gray: "#888888"
};

export default function Home() {
  const [isScribbleMode, setIsScribbleMode] = useState(false);
  const [noteHtml, setNoteHtml] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [selectedColor, setSelectedColor] = useState(COLORS.red);
  const [selectedHighlight, setSelectedHighlight] = useState(COLORS.none);
  const [selectedPen, setSelectedPen] = useState(COLORS.green);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastHtml = useRef("");

  // --- PERSISTENCE ---
  useEffect(() => {
    const savedNote = localStorage.getItem("pinnote-html") || "<div><br></div>";
    const savedScribble = localStorage.getItem("pinnote-scribble");
    
    setNoteHtml(savedNote);
    lastHtml.current = savedNote;
    if (editorRef.current) {
      editorRef.current.innerHTML = savedNote;
    }
    
    // Set initial pen color
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = selectedPen;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
    }

    if (savedScribble && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx && canvasRef.current) {
          if (img.width > canvasRef.current.width || img.height > canvasRef.current.height) {
            canvasRef.current.width = Math.max(canvasRef.current.width, img.width);
            canvasRef.current.height = Math.max(canvasRef.current.height, img.height);
          }
          ctx.drawImage(img, 0, 0);
          ctx.strokeStyle = selectedPen;
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
        }
      };
      img.src = savedScribble;
    }
    setIsLoading(false);
  }, []);

  // Sync state from editorRef WITHOUT re-rendering dangerouslySetInnerHTML
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastHtml.current = html;
      setNoteHtml(html);
    }
  };

  // Resize canvas to match content size
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current && editorRef.current) {
        const width = editorRef.current.scrollWidth;
        const height = Math.max(editorRef.current.scrollHeight, editorRef.current.offsetHeight, 1000);
        
        if (canvasRef.current.width !== width || canvasRef.current.height !== height) {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvasRef.current.width;
          tempCanvas.height = canvasRef.current.height;
          tempCanvas.getContext('2d')?.drawImage(canvasRef.current, 0, 0);
          
          canvasRef.current.width = width;
          canvasRef.current.height = height;
          
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.strokeStyle = selectedPen;
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
          }
        }
      }
    };

    const observer = new ResizeObserver(resizeCanvas);
    if (editorRef.current) observer.observe(editorRef.current);
    return () => observer.disconnect();
  }, [noteHtml, selectedPen]);

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
  }, [noteHtml, isLoading, isScribbleMode]);

  // --- TEXT FORMATTING ---
  const formatText = (command: string, value: string) => {
    // Focus the editor first to ensure command applies correctly
    if (editorRef.current) {
        editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    handleInput();
    if (command === "foreColor") setSelectedColor(value);
    if (command === "hiliteColor") setSelectedHighlight(value);
  };

  // --- SCRIBBLE LOGIC ---
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScribbleMode) return;
    isDrawing.current = true;
    const pos = getPos(e);
    lastPos.current = pos;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !canvasRef.current || !isScribbleMode) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = selectedPen;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

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
    
    const scaleX = canvasRef.current!.width / rect.width;
    const scaleY = canvasRef.current!.height / rect.height;
    
    return { 
      x: (clientX - rect.left) * scaleX, 
      y: (clientY - rect.top) * scaleY 
    };
  };

  const setPen = (color: string) => {
    setSelectedPen(color);
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
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-black/[.08] dark:border-white/[.145] bg-background/50">
        <div className="flex items-center gap-4">
          <h1 className="text-xs font-bold tracking-widest opacity-50">PINNOTE</h1>
          <div className="flex items-center gap-2 bg-black/[.05] dark:bg-white/[.05] p-1 rounded-md">
             <button 
               onMouseDown={(e) => e.preventDefault()}
               onClick={() => setIsScribbleMode(false)} 
               className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${!isScribbleMode ? "bg-white dark:bg-zinc-800 shadow-sm" : "opacity-50"}`}
             >
               TEXT
             </button>
             <button 
               onMouseDown={(e) => e.preventDefault()}
               onClick={() => setIsScribbleMode(true)} 
               className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${isScribbleMode ? "bg-white dark:bg-zinc-800 shadow-sm" : "opacity-50"}`}
             >
               SCRIBBLE
             </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono opacity-30">{saveStatus}</span>
        </div>
      </div>

      {/* Unified Toolbar */}
      <div className="flex flex-col border-b border-black/[.05] dark:border-white/[.05] bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-4 px-4 py-2 overflow-x-auto no-scrollbar">
          {!isScribbleMode ? (
            <>
              <div className="flex items-center gap-1 border-r pr-3 border-black/[.1]">
                <span className="text-[9px] font-bold opacity-30 uppercase mr-1">Color:</span>
                {Object.entries(COLORS).map(([name, code]) => name !== "none" && name !== "black" && (
                  <button 
                    key={name} 
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => formatText("foreColor", code)} 
                    className={`w-5 h-5 rounded-full border border-black/10 transition-all ${selectedColor === code ? "ring-2 ring-white ring-offset-1 ring-offset-black/40 scale-110 shadow-lg" : ""}`} 
                    style={{ background: code }} 
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[9px] font-bold opacity-30 uppercase mr-1">Highlight:</span>
                {Object.entries(COLORS).map(([name, code]) => name !== "black" && name !== "gray" && (
                  <button 
                    key={name} 
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => formatText("hiliteColor", code)} 
                    className={`w-5 h-5 rounded border border-black/10 flex items-center justify-center transition-all ${selectedHighlight === code ? "ring-2 ring-white ring-offset-1 ring-offset-black/40 scale-110 shadow-lg" : ""}`} 
                    style={{ background: code }}
                  >
                    {name === "none" && <span className="text-[8px] opacity-50">×</span>}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-bold opacity-30 uppercase mr-1">Pen:</span>
              {Object.entries(COLORS).map(([name, code]) => name !== "none" && (
                <button 
                  key={name} 
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setPen(code)} 
                  className={`w-5 h-5 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm transition-all ${selectedPen === code ? "ring-2 ring-blue-500 ring-offset-1 scale-110" : ""}`} 
                  style={{ background: code }} 
                />
              ))}
              <div className="w-[1px] h-4 bg-black/[.1] mx-2" />
              <button onMouseDown={(e) => e.preventDefault()} onClick={clearCanvas} className="text-[9px] font-bold text-red-500 uppercase px-2 py-1 bg-red-500/10 rounded hover:bg-red-500/20">Clear</button>
            </div>
          )}
        </div>
      </div>

      {/* Integrated Editor Content */}
      <div className="flex-1 relative bg-white dark:bg-zinc-950 overflow-y-auto" ref={scrollContainerRef}>
        <div className="relative min-h-full p-8" style={{ direction: 'ltr', textAlign: 'left' }}>
          <div
            ref={editorRef}
            contentEditable={!isScribbleMode}
            onInput={handleInput}
            className={`w-full min-h-full outline-none text-base leading-relaxed font-sans prose dark:prose-invert max-w-none relative z-10 ${isScribbleMode ? "cursor-default select-none" : "cursor-text"}`}
            style={{ direction: 'ltr', textAlign: 'left' }}
          />
          <canvas
            ref={canvasRef}
            className={`absolute top-0 left-0 w-full h-full z-20 ${isScribbleMode ? "cursor-crosshair pointer-events-auto" : "pointer-events-none"}`}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={() => isDrawing.current = false}
            onMouseLeave={() => isDrawing.current = false}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={() => isDrawing.current = false}
          />
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  );
}
