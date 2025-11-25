const landingPage = document.getElementById('landing-page');
const roomPage = document.getElementById('room-page');
const statusEl = document.getElementById('status');
const roomCodeInput = document.getElementById('room-code-input');
const createBtn = document.getElementById('create-btn');
const joinBtn = document.getElementById('join-btn');
const leaveBtn = document.getElementById('leave-btn');
const currentRoomCodeEl = document.getElementById('current-room-code');
const clipboardHistory = document.getElementById('clipboard-history');
const deviceCountEl = document.getElementById('device-count');

// UI Helpers
function showLanding() {
    landingPage.style.display = 'flex';
    roomPage.style.display = 'none';
    clipboardHistory.innerHTML = '';
    statusEl.innerText = 'Connected to Server'; // Reset status
    statusEl.style.color = '#4caf50';
}

function showRoom(code) {
    landingPage.style.display = 'none';
    roomPage.style.display = 'block';
    currentRoomCodeEl.innerText = code;
}

function addHistoryItem(text) {
    // Check if already exists at top to avoid visual dupes
    if (clipboardHistory.firstChild && clipboardHistory.firstChild.innerText === text) {
        return;
    }

    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerText = text;

    // Click to copy
    div.onclick = () => {
        navigator.clipboard.writeText(text);
        // Visual feedback could go here
    };

    clipboardHistory.prepend(div);
    if (clipboardHistory.children.length > 10) {
        clipboardHistory.lastChild.remove();
    }
}

function setHistory(items) {
    clipboardHistory.innerHTML = '';
    // Items come newest first
    items.slice().reverse().forEach(text => {
        addHistoryItem(text);
    });
}

// Event Listeners
createBtn.addEventListener('click', () => {
    window.electronAPI.createRoom();
});

joinBtn.addEventListener('click', () => {
    const code = roomCodeInput.value.trim();
    if (code) {
        window.electronAPI.joinRoom(code);
    } else {
        alert('Please enter a room code');
    }
});

leaveBtn.addEventListener('click', () => {
    window.electronAPI.leaveRoom();
});

// IPC Listeners
window.electronAPI.onStatus((msg) => {
    statusEl.innerText = msg;
    statusEl.style.color = msg.includes('Connected') ? '#4caf50' : '#f44336';
});

window.electronAPI.onRoomJoined((code) => {
    showRoom(code);
});

window.electronAPI.onRoomLeft(() => {
    showLanding();
});

window.electronAPI.onError((msg) => {
    alert(msg);
});

window.electronAPI.onClipboardUpdated((text) => {
    addHistoryItem(text);
});

// Listen for messages from main process that might be raw objects (if we passed them through)
// But currently main.js parses and sends specific events. 
// We need to update main.js to send HISTORY and COUNT events, OR we can just listen to a generic 'message' if we exposed it.
// Let's check main.js... it handles specific types. We need to update main.js to handle HISTORY and COUNT.
// Wait, I can't update main.js in this step (I am in renderer.js). 
// I will assume I will update main.js next. 
// For now, I'll add the listeners here assuming they will exist.

window.electronAPI.onHistory((items) => {
    setHistory(items);
});

window.electronAPI.onCount((count) => {
    if (deviceCountEl) {
        deviceCountEl.innerText = `${count} Device${count !== 1 ? 's' : ''} Connected`;
    }
});
