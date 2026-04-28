# PINNOTE | Hybrid AI-Powered Notepad

Pinnote is a high-performance, local-first notepad designed to bridge the gap between structured text, free-form digital ink, and AI-driven creativity. Built for speed and privacy, it provides a seamless unified canvas for your thoughts, now enhanced with intelligent assistance.

## 🚀 The Vision
Most note-taking apps force a choice: type in a rigid grid or draw on a chaotic canvas. **Pinnote removes the boundary.** Scribble directly over your typed notes, annotate your thoughts, and leverage AI to expand your cognitive flow.

## ✨ Core Features
- **Hybrid Canvas:** A unified layer where text and digital ink coexist seamlessly.
- **AI-Powered Text Editor:** Integrated AI assistance for summarizing, expanding, and refining your notes locally (v0.2.0).
- **Interactive Compiler:** Built-in code editor and execution environment (v0.2.0).
- **Animated UI:** Smooth transitions and modern interface using Framer Motion.
- **Zero-Latency Scribble:** Optimized canvas rendering for a natural drawing experience.
- **Quick Note Taking (Speech to Text):** Optimized for classroom and long-form lectures. High-accuracy transcription with continuous recording and real-time live feedback.
- **Local File Support:** Open and import `.docx` documents, images, and text files directly into your notes.
- **Privacy by Design:** No cloud sync, no data tracking. Your notes and AI processing stay local.

## 🛠️ Tech Stack
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS.
- **AI Engine:** @xenova/transformers (Local ML).
- **Speech Engine:** Web Speech API.
- **Desktop Shell:** Electron integration for a native experience.
- **Storage:** Browser LocalStorage / IndexedDB.

## 📦 Installation
To get started with Pinnote, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/user/pinnote.git
cd pinnote
npm install
```

## 💻 System Requirements
- Node.js 18.x or later
- npm or yarn
- Modern web browser with Web Speech API support

## 🔍 Troubleshooting
- **Microphone not working:** Ensure browser permissions are granted.
- **Local ML slow:** First run may take time to download models.

## 🚦 Getting Started
1. **Install Dependencies:** `npm install`
2. **Run Development:** `npm run dev`
3. **Build Desktop App:** `npm run electron-dev`

## 👨‍💻 About
Developed with a focus on local-first productivity.
For inquiries, contact: **jeevanjanakiraman@gmail.com**

---
*Pinnote: Think faster, locally.*

**Last Updated:** Saturday, April 25, 2026
