const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Data operations
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  loadData: (key) => ipcRenderer.invoke('load-data', key),
  syncData: () => ipcRenderer.invoke('sync-data'),
  
  // Menu actions
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-action', (event, action) => callback(action));
  },
  
  // Remove listener
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});