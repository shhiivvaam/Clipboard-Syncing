const { app, BrowserWindow, clipboard, ipcMain } = require('electron');
const path = require('path');
const WebSocket = require('ws');

let mainWindow;
let ws;
let lastText = '';
let currentRoom = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        },
        backgroundColor: '#1e1e1e',
        titleBarStyle: 'hiddenInset'
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

function connectToServer() {
    ws = new WebSocket('ws://localhost:8080');

    ws.on('open', () => {
        console.log('Connected to Sync Server');
        if (mainWindow) mainWindow.webContents.send('status', 'Connected to Server');
    });

    ws.on('message', (data) => {
        try {
            const parsed = JSON.parse(data);
            const { type, payload } = parsed;

            switch (type) {
                case 'CREATED':
                    currentRoom = payload.roomCode;
                    mainWindow.webContents.send('room-joined', currentRoom);
                    break;
                case 'JOINED':
                    currentRoom = payload.roomCode;
                    mainWindow.webContents.send('room-joined', currentRoom);
                    break;
                case 'CLIPBOARD':
                    if (payload.text !== lastText) {
                        lastText = payload.text;
                        clipboard.writeText(payload.text);
                        mainWindow.webContents.send('clipboard-updated', payload.text);
                    }
                    break;
                case 'HISTORY':
                    mainWindow.webContents.send('history', payload.history);
                    break;
                case 'COUNT':
                    mainWindow.webContents.send('count', payload.count);
                    break;
                case 'ERROR':
                    mainWindow.webContents.send('error', payload.message);
                    break;
            }
        } catch (e) {
            console.error('Failed to parse message', e);
        }
    });

    ws.on('close', () => {
        console.log('Disconnected. Reconnecting in 5s...');
        if (mainWindow) mainWindow.webContents.send('status', 'Disconnected');
        currentRoom = null;
        if (mainWindow) mainWindow.webContents.send('room-left');
        setTimeout(connectToServer, 5000);
    });

    ws.on('error', (err) => {
        console.error('Socket error:', err);
        ws.close();
    });
}

function startClipboardPolling() {
    setInterval(() => {
        if (!currentRoom) return;

        const text = clipboard.readText();
        if (text !== lastText && text.trim() !== '') {
            lastText = text;
            console.log('Clipboard changed, sending:', text);
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'CLIPBOARD', payload: { text } }));
            }
        }
    }, 1000);
}

ipcMain.handle('create-room', () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'CREATE' }));
    }
});

ipcMain.handle('join-room', (event, roomCode) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'JOIN', payload: { roomCode } }));
    }
});

ipcMain.handle('leave-room', () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'LEAVE' }));
        currentRoom = null;
        mainWindow.webContents.send('room-left');
    }
});

app.whenReady().then(() => {
    createWindow();
    connectToServer();
    startClipboardPolling();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
