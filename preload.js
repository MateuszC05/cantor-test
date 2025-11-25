const { contextBridge, ipcRenderer } = require('electron');

// Udostępnij bezpieczne API dla procesu renderowania
contextBridge.exposeInMainWorld('electronAPI', {
    getConfig: () => ipcRenderer.invoke('get-config'),
    getCoords: (city) => ipcRenderer.invoke('get-coords', city)
});
