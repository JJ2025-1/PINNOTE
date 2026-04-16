const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    minWidth: 300,
    minHeight: 400,
    alwaysOnTop: true,
    focusable: true,
    skipTaskbar: false,
    frame: true,
    title: 'PINNOTE',
    type: 'utility', // Often prevents auto-minimization in GNOME/Fedora
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Handle permission requests for microphone
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      return callback(true);
    }
    callback(false);
  });

  // Level 'screen-saver' or 'pop-up-menu' ensures it stays above almost everything
  mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);
  
  // Make it visible on all workspaces (essential for activity switching)
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  // If we're in dev mode, load from localhost:3000
  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../out/index.html')}`;

  mainWindow.loadURL(startURL);

  // If something tries to minimize it (like focus loss in some WMs), we restore it
  mainWindow.on('blur', () => {
    // Force it to stay on top if focus is lost
    mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);
  });

  // Explicitly prevent minimization if the user didn't trigger it
  mainWindow.on('minimize', (event) => {
    // If you want to disable minimization entirely, uncomment the next line:
    // event.preventDefault();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
