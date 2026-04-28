"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Code2, Type, Pencil, FileUp, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AiAssistant from "@/components/AiAssistant";
import Compiler from "@/components/Compiler";
import About from "@/components/About";

// --- TYPES FOR SPEECH RECOGNITION ---
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface ElectronAPI {
  openFile: () => Promise<{ success: boolean; path?: string; reason?: string }>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

// Color palette used for text formatting and pen tools
const COLORS = {
  green: "#22c55e",
  red: "#ef4444",
  blue: "#3b82f6",
  pink: "#ec4899",
  none: "transparent",
  black: "#000000",
  gray: "#888888"
};

/**
 * The main application page for Pinnote.
 * Handles the unified canvas for text editing and digital ink (scribble mode),
 * along with AI assistant and compiler integrations.
 */
export default function Home() {
  const [isScribbleMode, setIsScribbleMode] = useState(false);
  const [noteHtml, setNoteHtml] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [selectedColor, setSelectedColor] = useState(COLORS.red);
  const [selectedHighlight, setSelectedHighlight] = useState(COLORS.none);
  const [selectedPen, setSelectedPen] = useState(COLORS.green);
  const [rightPanelMode, setRightPanelMode] = useState<"none" | "ai" | "compiler">("none");
  
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
  // This ensures the internal HTML state stays in sync with the contenteditable div
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastHtml.current = html;
      setNoteHtml(html);
    }
  };

  // Handles pasting images from clipboard directly into the editor
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              document.execCommand('insertImage', false, event.target.result as string);
              handleInput();
            }
          };
          reader.readAsDataURL(blob);
          e.preventDefault();
        }
      }
    }
  };

  // Handles image resizing logic when clicking on image corners
  const handleEditorMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const rect = target.getBoundingClientRect();
      // Check if clicking near the bottom-right corner (20px threshold)
      const isCorner = (e.clientX > rect.right - 25) && (e.clientY > rect.bottom - 25);
      
      if (isCorner) {
        e.preventDefault();
        e.stopPropagation();
        
        const startX = e.clientX;
        const startWidth = rect.width;
        const img = target as HTMLImageElement;
        
        // Use document listeners for smooth dragging outside the element
        const onMouseMove = (moveEvent: MouseEvent) => {
          const delta = moveEvent.clientX - startX;
          const newWidth = Math.max(50, startWidth + delta);
          img.style.width = `${newWidth}px`;
          img.style.height = 'auto'; // Maintain aspect ratio
        };
        
        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          handleInput(); // Save changes to localStorage
          img.style.outline = "";
        };
        
        img.style.outline = "2px solid #3b82f6";
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      }
    }
  };

  // Effect to keep the scribble canvas dimensions in sync with the editor content size
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

  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const recordingRef = useRef(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Update ref when state changes
  useEffect(() => {
    recordingRef.current = isRecording;
  }, [isRecording]);

  // --- SPEECH RECOGNITION ---
  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognitionImpl = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionImpl() as SpeechRecognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = (typeof navigator !== "undefined" ? navigator.language : "en-US");

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        let currentInterim = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            currentInterim += transcript;
          }
        }

        setInterimTranscript(currentInterim);

        if (finalTranscript && editorRef.current) {
          editorRef.current.focus();
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            
            // If the cursor is not inside the editor, we might want to append to the end
            const container = range.commonAncestorContainer;
            const isInside = editorRef.current.contains(container);

            if (isInside) {
              const textNode = document.createTextNode(finalTranscript + " ");
              range.insertNode(textNode);
              range.collapse(false);
              selection.removeAllRanges();
              selection.addRange(range);
            } else {
              editorRef.current.innerHTML += finalTranscript + " ";
            }
          } else {
            editorRef.current.innerHTML += finalTranscript + " ";
          }
          handleInput();
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // Handle common non-fatal errors silently to avoid console noise in long sessions
        if (event.error === 'no-speech' || event.error === 'network') {
          console.warn(`Speech recognition (recoverable): ${event.error}`);
          return;
        }

        console.error("Speech recognition fatal error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        if (recordingRef.current) {
          // Add a small delay before restarting to be gentler on the network/API
          // and to avoid rapid-fire restart loops.
          setTimeout(() => {
            if (recordingRef.current) {
              try {
                // Double check if already started to avoid InvalidStateError
                recognition.start();
              } catch (e) {
                // If it's already started, we're fine. Otherwise, log and reset.
                if ((e as Error).name !== 'InvalidStateError') {
                  console.error("Failed to restart recognition:", e);
                  setIsRecording(false);
                }
              }
            }
          }, 1000);
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
      setIsRecording(false);
      setInterimTranscript("");
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Error starting recognition:", e);
        // If it was already started, just sync the state
        if ((e as Error).name === 'InvalidStateError') {
          setIsRecording(true);
        } else {
          setIsRecording(false);
          alert("Could not start microphone. Please check permissions.");
        }
      }
    }
  };

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

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
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

  const handleOpenFile = async () => {
    if (typeof window !== "undefined" && window.electron) {
      try {
        const result = await window.electron.openFile();
        if (result && result.success && editorRef.current) {
          editorRef.current.focus();
          
          if (result.type === 'image') {
            document.execCommand('insertImage', false, result.data);
          } else if (result.type === 'html') {
            document.execCommand('insertHTML', false, result.data);
          } else if (result.type === 'text') {
            document.execCommand('insertText', false, result.data);
          }
          handleInput();
        } else if (result && !result.success && result.reason === 'permission_denied') {
          console.log("File open canceled: permission denied");
        }
      } catch (error) {
        console.error("Error opening file:", error);
      }
    } else {
      alert("Opening files from local system is only available in the desktop version.");
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
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 glass-dark z-50">
        <div className="flex items-center gap-6">
          <h1 className="text-sm font-black tracking-[0.2em] text-primary drop-shadow-[0_0_8px_rgba(0,209,255,0.5)]">PINNOTE</h1>
          <button 
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleOpenFile}
            className="px-3 py-1.5 text-[10px] font-bold bg-white/5 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 group"
          >
            <FileUp className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
            OPEN FILE
          </button>
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-full border border-white/5">
             <button 
               onMouseDown={(e) => e.preventDefault()}
               onClick={() => setIsScribbleMode(false)} 
               className={`px-4 py-1.5 text-[10px] font-black rounded-full transition-all flex items-center gap-2 ${!isScribbleMode ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,209,255,0.3)]" : "opacity-40 hover:opacity-100"}`}
             >
               <Type className="w-3.5 h-3.5" />
               TEXT
             </button>
             <button 
               onMouseDown={(e) => e.preventDefault()}
               onClick={() => setIsScribbleMode(true)} 
               className={`px-4 py-1.5 text-[10px] font-black rounded-full transition-all flex items-center gap-2 ${isScribbleMode ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,209,255,0.3)]" : "opacity-40 hover:opacity-100"}`}
             >
               <Pencil className="w-3.5 h-3.5" />
               SCRIBBLE
             </button>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-full border border-white/5">
             <button 
               onMouseDown={(e) => e.preventDefault()}
               onClick={() => setRightPanelMode(rightPanelMode === "ai" ? "none" : "ai")} 
               className={`px-4 py-1.5 text-[10px] font-black rounded-full transition-all flex items-center gap-2 ${rightPanelMode === "ai" ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]" : "opacity-40 hover:opacity-100"}`}
             >
               <Sparkles className="w-3.5 h-3.5" />
               AI ASSISTANT
             </button>
             <button 
               onMouseDown={(e) => e.preventDefault()}
               onClick={() => setRightPanelMode(rightPanelMode === "compiler" ? "none" : "compiler")} 
               className={`px-4 py-1.5 text-[10px] font-black rounded-full transition-all flex items-center gap-2 ${rightPanelMode === "compiler" ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]" : "opacity-40 hover:opacity-100"}`}
             >
               <Code2 className="w-3.5 h-3.5" />
               COMPILER
             </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
            <Save className={`w-3.5 h-3.5 ${saveStatus === "Saving..." ? "text-primary animate-pulse" : "opacity-20"}`} />
            <span className="text-[10px] font-black tracking-widest opacity-20 uppercase">{saveStatus}</span>
          </div>
        </div>
      </div>

      {/* Unified Toolbar */}
      <div className="flex flex-col border-b border-white/5 glass z-40">
        <div className="flex items-center gap-6 px-6 py-2 overflow-x-auto no-scrollbar">
          {!isScribbleMode ? (
            <>
              <div className="flex items-center gap-4 border-r pr-6 border-white/10">
                <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">Voice</span>
                <button 
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={toggleRecording} 
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black transition-all border ${isRecording ? "bg-red-500/20 border-red-500/50 text-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "bg-white/5 border-white/10 opacity-60 hover:opacity-100"}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${isRecording ? "bg-red-500" : "bg-white/40"}`} />
                  {isRecording ? "LISTENING" : "START NOTE"}
                </button>
                {isRecording && interimTranscript && (
                  <div className="px-3 py-1 bg-white/5 rounded-full border border-white/5 max-w-[250px] truncate shadow-inner">
                    <span className="text-[10px] font-medium italic opacity-40 whitespace-nowrap">{interimTranscript}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 border-r pr-6 border-white/10">
                <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">Text</span>
                <div className="flex items-center gap-2">
                  {Object.entries(COLORS).map(([name, code]) => name !== "none" && name !== "black" && (
                    <button 
                      key={name} 
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => formatText("foreColor", code)} 
                      className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-125 hover:shadow-lg ${selectedColor === code ? "border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.2)]" : "border-transparent opacity-60 hover:opacity-100"}`} 
                      style={{ background: code }} 
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">Mark</span>
                <div className="flex items-center gap-2">
                  {Object.entries(COLORS).map(([name, code]) => name !== "black" && name !== "gray" && (
                    <button 
                      key={name} 
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => formatText("hiliteColor", code)} 
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all hover:scale-125 hover:shadow-lg ${selectedHighlight === code ? "border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.2)]" : "border-transparent opacity-60 hover:opacity-100"}`} 
                      style={{ background: code }}
                    >
                      {name === "none" && <span className="text-[12px] opacity-40 font-bold">×</span>}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-black opacity-30 uppercase tracking-widest text-primary">Pen Tool</span>
                <div className="flex items-center gap-2">
                  {Object.entries(COLORS).map(([name, code]) => name !== "none" && (
                    <button 
                      key={name} 
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setPen(code)} 
                      className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-125 hover:shadow-lg ${selectedPen === code ? "border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.2)]" : "border-transparent opacity-60 hover:opacity-100"}`} 
                      style={{ background: code }} 
                    />
                  ))}
                </div>
              </div>
              <div className="w-[1px] h-6 bg-white/10" />
              <button 
                onMouseDown={(e) => e.preventDefault()} 
                onClick={clearCanvas} 
                className="text-[9px] font-black text-red-500 uppercase px-4 py-1.5 bg-red-500/10 rounded-full border border-red-500/20 hover:bg-red-500/20 transition-all tracking-widest"
              >
                Clear Canvas
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Integrated Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative bg-black/20 overflow-y-auto custom-scrollbar" ref={scrollContainerRef}>
          <div className="relative min-h-full p-12 max-w-5xl mx-auto" style={{ direction: 'ltr', textAlign: 'left' }}>
            <div className="absolute inset-0 bg-zinc-950/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-x border-white/5 z-0" />
            <div
              ref={editorRef}
              contentEditable={!isScribbleMode}
              onInput={handleInput}
              onPaste={handlePaste}
              onMouseDown={handleEditorMouseDown}
              className={`w-full min-h-[calc(100vh-250px)] outline-none text-lg leading-relaxed font-sans prose dark:prose-invert max-w-none relative z-10 p-8 ${isScribbleMode ? "cursor-default select-none" : "cursor-text"}`}
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

        {/* Right Panels */}
        <AnimatePresence mode="wait">
          {rightPanelMode === "ai" && (
            <motion.div
              key="ai"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <AiAssistant />
            </motion.div>
          )}
          {rightPanelMode === "compiler" && (
            <motion.div
              key="compiler"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <Compiler />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <About />

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
      <style jsx global>{`
        .prose img {
          position: relative;
          display: inline-block;
          max-width: 100%;
          cursor: default;
          transition: outline 0.1s ease;
          border-radius: 4px;
        }
        .prose img:hover {
          outline: 2px solid rgba(59, 130, 246, 0.5);
          cursor: pointer;
        }
        /* Visual indicator for the resize corner */
        .prose img::after {
          content: "";
          position: absolute;
          bottom: 0;
          right: 0;
          width: 15px;
          height: 15px;
          background: linear-gradient(135deg, transparent 50%, #3b82f6 50%);
          cursor: nwse-resize;
          pointer-events: none;
        }
        /* Make sure the mouse cursor changes when hovering the corner */
        .prose img {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>'), auto;
        }
      `}</style>
    </main>
  );
}
