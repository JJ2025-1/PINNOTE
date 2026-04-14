# PINNOTE - Pinned Desktop Notepad

A minimalist, high-productivity notepad designed for developers. PINNOTE stays pinned to your Fedora desktop, ensuring your instructions and notes are always visible while you code, without being minimized or hidden when switching tasks.

## 🚀 Core Features
- **Always on Top:** Uses `screen-saver` level priority to stay above all other windows.
- **Persistent Notes:** Auto-saves your progress to local storage instantly.
- **Smart Window Behavior:** 
  - Configured as a `utility` window to prevent auto-minimization in GNOME/Fedora.
  - Visible across all workspaces and activities.
  - Re-asserts focus/priority on blur to ensure it stays pinned while you code.
- **Minimalist UI:** Distraction-free interface built with Next.js and Tailwind CSS.

## 🛠️ Development Roadmap

### Phase 1: Core Notepad UI (Completed ✅)
- [x] Implement a clean, full-screen text area in Next.js.
- [x] Add `localStorage` integration for instant persistence.
- [x] Style with Geist and Tailwind for a modern look.

### Phase 2: Desktop Integration (Completed ✅)
- [x] Integrate Electron to wrap the Next.js application.
- [x] Configure BrowserWindow with `alwaysOnTop: true` and `type: 'utility'`.
- [x] Implement `setVisibleOnAllWorkspaces` for Fedora activity switching.
- [x] Add blur-event listeners to prevent focus-loss minimization.

### Phase 3: Linux/Fedora Optimization (In Progress 🏗️)
- [ ] Create a `.desktop` entry for easy launching on Fedora.
- [ ] Add keyboard shortcuts (e.g., `Ctrl + S` to force save, `Ctrl + Q` to quit).
- [ ] Optimize window positioning for dual-monitor setups.

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
```bash
# Start Next.js and Electron together
npm run electron-dev

# (Optional) Start only the Next.js dev server
# npm run dev
```

### 3. Build for Production
```bash
npm run build
```

## 📜 Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Electron Documentation](https://www.electronjs.org/docs)
