const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');

// Optional: Use a safe require for mammoth to prevent main process crash if it fails to load
let mammoth;
try {
  mammoth = require('mammoth');
} catch (e) {
  console.error("Failed to load mammoth:", e);
}

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
    icon: path.join(__dirname, '../app/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Handle permission requests for microphone
  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      return callback(true);
    }
    callback(false);
  });

  mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../out/index.html')}`;

  mainWindow.loadURL(startURL);

  mainWindow.on('blur', () => {
    mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);
  });
}

// IPC Handlers
ipcMain.handle('open-file', async () => {
  console.log("IPC: open-file invoked");
  try {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    
    const { response } = await dialog.showMessageBox(focusedWindow, {
      type: 'question',
      buttons: ['Yes', 'No'],
      defaultId: 1,
      title: 'Permission Required',
      message: 'Do you want to grant permission to open a file from your system?',
    });

    if (response === 0) { // User clicked 'Yes'
      console.log("IPC: User granted permission");
      const { canceled, filePaths } = await dialog.showOpenDialog(focusedWindow, {
        properties: ['openFile'],
        filters: [
          { name: 'All Files', extensions: ['*'] },
          { name: 'Documents', extensions: ['docx', 'pdf', 'txt'] },
          { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif'] },
        ]
      });

      if (!canceled && filePaths.length > 0) {
        const filePath = filePaths[0];
        const ext = path.extname(filePath).toLowerCase();
        console.log(`IPC: Opening file: ${filePath}`);

        if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) {
          const data = fs.readFileSync(filePath);
          const base64 = data.toString('base64');
          return { 
            success: true, 
            type: 'image', 
            data: `data:image/${ext.slice(1)};base64,${base64}`, 
            path: filePath 
          };
        } else if (ext === '.docx') {
          if (!mammoth) {
            return { success: false, reason: 'library_missing', message: 'Mammoth library failed to load.' };
          }
          const buffer = fs.readFileSync(filePath);
          const result = await mammoth.convertToHtml({ buffer: buffer });
          return { success: true, type: 'html', data: result.value, path: filePath };
        } else if (ext === '.txt') {
          const text = fs.readFileSync(filePath, 'utf8');
          return { success: true, type: 'text', data: text, path: filePath };
        } else {
          console.log("IPC: Unsupported internal type, falling back to system open");
          await shell.openPath(filePath);
          return { success: true, type: 'system', path: filePath };
        }
      }
      console.log("IPC: File selection canceled");
      return { success: false, reason: 'canceled' };
    }
    console.log("IPC: Permission denied by user");
    return { success: false, reason: 'permission_denied' };
  } catch (error) {
    console.error('IPC ERROR: open-file handler crashed:', error);
    return { success: false, reason: 'internal_error', message: error.message };
  }
});

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
