const landingPage = document.getElementById('landing-page');
const roomPage = document.getElementById('room-page');
const statusEl = document.getElementById('status');
const roomCodeInput = document.getElementById('room-code-input');
const createBtn = document.getElementById('create-btn');
const joinBtn = document.getElementById('join-btn');
const leaveBtn = document.getElementById('leave-btn');
const currentRoomCodeEl = document.getElementById('current-room-code');
const clipboardHistory = document.getElementById('clipboard-history');

// UI Helpers
function showLanding() {
    landingPage.style.display = 'flex';
    roomPage.style.display = 'none';
    clipboardHistory.innerHTML = '';
}

function showRoom(code) {
    landingPage.style.display = 'none';
    roomPage.style.display = 'block';
    currentRoomCodeEl.innerText = code;
}

function addHistoryItem(text) {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerText = text;
    clipboardHistory.prepend(div);
    if (clipboardHistory.children.length > 10) {
        clipboardHistory.lastChild.remove();
    }
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
