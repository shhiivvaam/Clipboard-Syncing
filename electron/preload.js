const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    createRoom: () => ipcRenderer.invoke('create-room'),
    joinRoom: (code) => ipcRenderer.invoke('join-room', code),
    leaveRoom: () => ipcRenderer.invoke('leave-room'),
    onStatus: (callback) => ipcRenderer.on('status', (event, value) => callback(value)),
    onRoomJoined: (callback) => ipcRenderer.on('room-joined', (event, code) => callback(code)),
    onRoomLeft: (callback) => ipcRenderer.on('room-left', () => callback()),
    onError: (callback) => ipcRenderer.on('error', (event, msg) => callback(msg)),
    onClipboardUpdated: (callback) => ipcRenderer.on('clipboard-updated', (event, text) => callback(text)),
    onHistory: (callback) => ipcRenderer.on('history', (event, items) => callback(items)),
    onCount: (callback) => ipcRenderer.on('count', (event, count) => callback(count))
});
