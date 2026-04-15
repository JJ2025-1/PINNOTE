# PINNOTE | AI-Assisted Hybrid Notepad

Pinnote is a high-performance, local-first notepad designed to bridge the gap between structured text and free-form digital ink. Built for speed and privacy, it leverages on-device AI to help you refine your thoughts without compromising your data.

## 🚀 The Vision
Most note-taking apps force a choice: type in a rigid grid or draw on a chaotic canvas. **Pinnote removes the boundary.** Scribble directly over your typed notes, annotate your thoughts, and use local AI to summarize or rewrite your content instantly.

## ✨ Core Features
- **Hybrid Canvas:** A unified layer where text and digital ink coexist seamlessly.
- **Local-First AI:** Powered by `Qwen2.5-0.5B-Instruct` (quantized for web), providing summarizing and rewriting capabilities entirely in your browser.
- **Zero-Latency Scribble:** Optimized canvas rendering for a natural drawing experience.
- **Privacy by Design:** No cloud sync, no data tracking. Your notes stay in your browser's local storage.
- **Contextual Tools:** Dynamic toolbars that switch between Text formatting and Scribble controls based on your current mode.

## 🛠️ Tech Stack
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS.
- **AI Engine:** Transformers.js (Running Qwen2.5-0.5B).
- **Desktop Shell:** Electron integration for a native experience.
- **Storage:** Browser LocalStorage / IndexedDB.

## 🚦 Getting Started
1. **Install Dependencies:** `npm install`
2. **Run Development:** `npm run dev`
3. **Build Desktop App:** `npm run electron-dev`

---
*Pinnote: Think faster, locally.*
