const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    show: false
  });

  const startUrl = isDev 
    ? 'http://localhost:5173' 
    : `file://${path.join(__dirname, '../frontend/dist/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Application menu
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Invoice',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          mainWindow.webContents.send('menu-action', 'new-invoice');
        }
      },
      {
        label: 'Settings',
        accelerator: 'CmdOrCtrl+,',
        click: () => {
          mainWindow.webContents.send('menu-action', 'settings');
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Business',
    submenu: [
      {
        label: 'Dashboard',
        accelerator: 'CmdOrCtrl+D',
        click: () => {
          mainWindow.webContents.send('menu-action', 'dashboard');
        }
      },
      {
        label: 'Invoices',
        accelerator: 'CmdOrCtrl+I',
        click: () => {
          mainWindow.webContents.send('menu-action', 'invoices');
        }
      },
      {
        label: 'Inventory',
        accelerator: 'CmdOrCtrl+Shift+I',
        click: () => {
          mainWindow.webContents.send('menu-action', 'inventory');
        }
      },
      {
        label: 'Customers',
        accelerator: 'CmdOrCtrl+U',
        click: () => {
          mainWindow.webContents.send('menu-action', 'customers');
        }
      },
      {
        label: 'Reports',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          mainWindow.webContents.send('menu-action', 'reports');
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

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

// IPC handlers for database operations
ipcMain.handle('save-data', async (event, data) => {
  // Implement local storage/database save
  console.log('Saving data:', data);
  return { success: true };
});

ipcMain.handle('load-data', async (event, key) => {
  // Implement local storage/database load
  console.log('Loading data for key:', key);
  return { success: true, data: null };
});

ipcMain.handle('sync-data', async (event) => {
  // Implement sync with remote server
  console.log('Syncing data with server...');
  return { success: true, synced: true };
});