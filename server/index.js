const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ port: 8080 });

// Map<RoomID, Set<WebSocket>>
const rooms = new Map();

console.log('Sync Server started on port 8080');

function broadcastToRoom(roomCode, senderWs, data) {
    if (rooms.has(roomCode)) {
        rooms.get(roomCode).forEach(client => {
            if (client !== senderWs && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
}

wss.on('connection', function connection(ws) {
    console.log('A new client connected');
    let currentRoom = null;

    ws.on('message', function incoming(message) {
        try {
            const parsed = JSON.parse(message);
            const { type, payload } = parsed;

            switch (type) {
                case 'CREATE':
                    const newRoomCode = uuidv4().substring(0, 6).toUpperCase();
                    rooms.set(newRoomCode, new Set([ws]));
                    currentRoom = newRoomCode;
                    ws.send(JSON.stringify({ type: 'CREATED', payload: { roomCode: newRoomCode } }));
                    console.log(`Room created: ${newRoomCode}`);
                    break;

                case 'JOIN':
                    const roomCode = payload.roomCode.toUpperCase();
                    if (rooms.has(roomCode)) {
                        rooms.get(roomCode).add(ws);
                        currentRoom = roomCode;
                        ws.send(JSON.stringify({ type: 'JOINED', payload: { roomCode } }));
                        console.log(`Client joined room: ${roomCode}`);
                    } else {
                        ws.send(JSON.stringify({ type: 'ERROR', payload: { message: 'Room not found' } }));
                    }
                    break;

                case 'CLIPBOARD':
                    if (currentRoom) {
                        console.log(`Clipboard data in room ${currentRoom}: ${payload.text.substring(0, 20)}...`);
                        broadcastToRoom(currentRoom, ws, { type: 'CLIPBOARD', payload });
                    }
                    break;

                case 'LEAVE':
                    if (currentRoom && rooms.has(currentRoom)) {
                        rooms.get(currentRoom).delete(ws);
                        if (rooms.get(currentRoom).size === 0) {
                            rooms.delete(currentRoom);
                            console.log(`Room deleted: ${currentRoom}`);
                        }
                        currentRoom = null;
                        ws.send(JSON.stringify({ type: 'LEFT' }));
                    }
                    break;

                default:
                    console.log('Unknown message type:', type);
            }
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });

    ws.on('close', () => {
        if (currentRoom && rooms.has(currentRoom)) {
            rooms.get(currentRoom).delete(ws);
            if (rooms.get(currentRoom).size === 0) {
                rooms.delete(currentRoom);
                console.log(`Room deleted: ${currentRoom}`);
            }
        }
        console.log('Client disconnected');
    });
});
